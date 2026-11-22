#!/usr/bin/env bash
# Rebuild graphs/craft-anything/graphify-out from the public storytold/craft-anything repo.
# Code-only (structural AST, no LLM, no API key). Skips vendor/ (third-party code).
# Usage: scripts/build_craft_anything_graph.sh [path-to-existing-clone]
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$REPO_ROOT/graphs/craft-anything"
SRC="${1:-${TMPDIR:-/tmp}/craft-anything-src}"

command -v graphify >/dev/null || { echo "graphify not found: uv tool install graphifyy (or pip install graphifyy)"; exit 1; }
PY=$(head -1 "$(command -v graphify)" | tr -d '#!')

if [ ! -d "$SRC/.git" ]; then
  GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 https://github.com/storytold/craft-anything "$SRC"
else
  git -C "$SRC" pull --ff-only --depth 1 || true
fi

cd "$OUT_DIR"
mkdir -p graphify-out
"$PY" - "$SRC" <<'EOF'
import json, sys
from collections import Counter
from pathlib import Path
from graphify.detect import detect, save_manifest
from graphify.extract import collect_files, extract
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from graphify.export import to_json
from graphify.cli import _stamped_manifest_files

root = str(Path(sys.argv[1]).resolve())
Path('graphify-out/.graphify_root').write_text(root)
Path('graphify-out/.graphify_python').write_text(sys.executable)
det = detect(Path(root))
code = [f for f in det['files'].get('code', []) if not f.startswith(root + '/vendor/')]
det['files'] = {'code': code}
det['total_files'] = len(code)
files = []
for f in code:
    files.extend(collect_files(Path(f)) if Path(f).is_dir() else [Path(f)])
ext = extract(files, cache_root=Path(root), root=Path(root))
ext = {'nodes': ext['nodes'], 'edges': ext['edges'], 'hyperedges': [], 'input_tokens': 0, 'output_tokens': 0}
G = build_from_json(ext, root=root, directed=False)
if G.number_of_nodes() == 0:
    sys.exit('ERROR: empty graph')
comms = cluster(G)
coh = score_all(G, comms)
labels, used = {}, Counter()
for cid, members in comms.items():
    fc = Counter(G.nodes[m].get('source_file') for m in members if G.nodes[m].get('source_file'))
    if not fc:
        labels[cid] = f'Community {cid}'
        continue
    f = fc.most_common(1)[0][0]
    parts = f.split('/')
    crate = parts[1] if parts[0] in ('crates', 'apps') and len(parts) > 1 else parts[0]
    stem = Path(f).stem
    if stem in ('mod', 'lib', 'main') and len(parts) > 2:
        stem = parts[-2] + '/' + stem
    lab = f'{crate}: {stem}'
    used[lab] += 1
    labels[cid] = lab if used[lab] == 1 else f'{lab} ({used[lab]})'
gods = god_nodes(G)
sur = surprising_connections(G, comms)
qs = suggest_questions(G, comms, labels)
to_json(G, comms, 'graphify-out/graph.json', force=True, community_labels=labels)
Path('graphify-out/GRAPH_REPORT.md').write_text(generate(G, comms, coh, labels, gods, sur, det, {'input': 0, 'output': 0}, root, suggested_questions=qs))
Path('graphify-out/.graphify_labels.json').write_text(json.dumps({str(k): v for k, v in labels.items()}))
save_manifest(_stamped_manifest_files(det['files'], ext, Path(root), partial_source_files=set()), root=root, scan_corpus=set(code))
print(f'{G.number_of_nodes()} nodes, {G.number_of_edges()} edges, {len(comms)} communities')
EOF
graphify export html
