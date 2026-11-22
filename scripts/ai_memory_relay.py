#!/usr/bin/env python3
"""Local relay for ai-memory in a proxied cloud session.

ai-memory's MCP bridge and capture hooks deliberately ignore HTTP(S)_PROXY and
connect directly, but a Claude Code cloud container can only reach the
internet through its HTTPS proxy. This relay listens on 127.0.0.1:49374 (the
address ai-memory uses by default) and forwards every request, streaming,
through the proxy to the remote ai-memory server, rewriting Host for it.

The Authorization header is not set here: the environment's network secret for
the server host is added by the proxy, so the token never touches this script.

Usage: AI_MEMORY_REMOTE=https://<tunnel-host> python3 scripts/ai_memory_relay.py
"""
import http.client
import http.server
import os
import ssl
import sys
import urllib.parse

LISTEN = ("127.0.0.1", int(os.environ.get("AI_MEMORY_RELAY_PORT", "49374")))
REMOTE = urllib.parse.urlsplit(os.environ.get("AI_MEMORY_REMOTE", ""))
PROXY = urllib.parse.urlsplit(os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy") or "")
CTX = ssl.create_default_context(cafile=os.environ.get("SSL_CERT_FILE"))
HOP = {"connection", "keep-alive", "proxy-connection", "transfer-encoding", "upgrade", "te", "trailer", "host"}


class Relay(http.server.BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.0"  # close-delimited bodies keep streaming simple

    def _forward(self):
        length = int(self.headers.get("Content-Length") or 0)
        body = self.rfile.read(length) if length else None
        if PROXY.hostname:
            conn = http.client.HTTPSConnection(PROXY.hostname, PROXY.port or 80, context=CTX, timeout=600)
            conn.set_tunnel(REMOTE.hostname, REMOTE.port or 443)
        else:
            conn = http.client.HTTPSConnection(REMOTE.hostname, REMOTE.port or 443, context=CTX, timeout=600)
        headers = {k: v for k, v in self.headers.items() if k.lower() not in HOP}
        headers["Host"] = REMOTE.hostname
        try:
            conn.request(self.command, self.path, body=body, headers=headers)
            resp = conn.getresponse()
        except OSError as exc:
            self.send_error(502, f"relay could not reach {REMOTE.hostname}: {exc}")
            return
        self.send_response(resp.status, resp.reason)
        for k, v in resp.getheaders():
            if k.lower() not in HOP and k.lower() != "content-length":
                self.send_header(k, v)
        self.send_header("Connection", "close")
        self.end_headers()
        while chunk := resp.read1(65536):
            self.wfile.write(chunk)
            self.wfile.flush()
        conn.close()

    do_GET = do_POST = do_DELETE = do_PUT = do_PATCH = do_HEAD = _forward

    def log_message(self, fmt, *args):
        if os.environ.get("AI_MEMORY_RELAY_VERBOSE"):
            sys.stderr.write("relay: " + fmt % args + "\n")


if __name__ == "__main__":
    if not REMOTE.hostname:
        sys.exit("set AI_MEMORY_REMOTE=https://<your ai-memory host>")
    http.server.ThreadingHTTPServer(LISTEN, Relay).serve_forever()
