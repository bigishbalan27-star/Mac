"""Lay out the repo's real graphify graph for the Graphify scene.

Reads graphify-out/graph.json, runs a spring layout, and writes
proj/src/skills_graph.json:
  nodes: [[x, y, communityIndex], ...]   x, y in 0..1
  edges: [[a, b], ...]                    node indices
  path:  [nodeIndex, ...]                 the graphify path Viral Swipe File -> Remotion
  pathLabels: [str, ...]
usage: python3 graph_layout.py /home/user/mac/graphify-out/graph.json
"""
import json, sys
import networkx as nx

g = json.load(open(sys.argv[1]))
ids = [n["id"] for n in g["nodes"]]
idx = {k: i for i, k in enumerate(ids)}
comms = sorted({n.get("community", 0) for n in g["nodes"]})
cidx = {c: i for i, c in enumerate(comms)}
G = nx.Graph()
G.add_nodes_from(range(len(ids)))
edges = []
for e in g["links"]:
    a, b = idx.get(e["source"]), idx.get(e["target"])
    if a is not None and b is not None and a != b:
        G.add_edge(a, b); edges.append([a, b])
pos = nx.spring_layout(G, seed=7, k=0.06, iterations=120)
xs = [p[0] for p in pos.values()]; ys = [p[1] for p in pos.values()]
import numpy as np
x0, x1 = np.percentile(xs, 3), np.percentile(xs, 97)
y0, y1 = np.percentile(ys, 3), np.percentile(ys, 97)
clip = lambda v: min(1.0, max(0.0, v))
nodes = [[round(clip((pos[i][0] - x0) / (x1 - x0)), 4), round(clip((pos[i][1] - y0) / (y1 - y0)), 4), cidx[g["nodes"][i].get("community", 0)]] for i in range(len(ids))]

# the path graphify printed for: Viral Swipe File -> Remotion 4 (made-by-claude_source), undirected
want = ["Viral Swipe File", "Reel 6: Kerala rules", "kerala-rules_animated_v1", "Whisper Transcribe-Back", "Transcribe-Back Line Match", "made-by-claude Reel Notes", "Remotion 4 (made-by-claude"]
labels = [n.get("label", "") for n in g["nodes"]]
path = []
for w in want:
    hit = next((i for i, l in enumerate(labels) if l.startswith(w)), None)
    if hit is None:
        sys.exit(f"path node not found: {w}")
    path.append(hit)
short = ["Viral swipe file", "Reel 6", "Animated reel", "Whisper word check", "Line match check", "made-by-claude notes", "Remotion"]
json.dump({"nodes": nodes, "edges": edges, "path": path, "pathLabels": short, "nodeCount": len(ids), "edgeCount": len(edges)},
          open("proj/src/skills_graph.json", "w"))
print(len(ids), "nodes", len(edges), "edges; path", [labels[i] for i in path])
