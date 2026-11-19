"""Build timing.ts (and anchors.json for sfx2.py) from voiceover word timestamps.

Original Remotion project layout (defaults):
    python3 build_timing.py
In this repo's flat source folder, rebuild from the words already inside timing.ts:
    python3 build_timing.py --words timing.ts --out timing.ts --anchors anchors.json
"""
import argparse,json,re
norm=lambda s: re.sub(r'[^a-z]','',s.lower())
def load_words(path):
    try:
        text=open(path).read()
    except FileNotFoundError:
        raise SystemExit(f"build_timing: words file not found: {path} "
                         "(in the repo's source folder, use --words timing.ts)")
    if not path.endswith('.ts'): return json.loads(text)
    key='export const WORDS = '; at=text.find(key)
    if at<0: raise SystemExit(f"build_timing: no 'export const WORDS = ' in {path}")
    return json.JSONDecoder().raw_decode(text,at+len(key))[0]
def finder(W,label):
    cur=[0]
    def f(orig,k):
        start=cur[0]
        skip = orig.endswith('+'); word = orig.rstrip('+')
        for i in range(cur[0],len(W)):
            if norm(W[i]['w'])==word:
                if skip: skip=False; continue
                cur[0]=i+1; return i
        raise SystemExit(f"build_timing: {label} entry {k}: word {orig!r} not found from word index {start}")
    return f
# old_time -> new word (sequential)
A=[(0,None),(1.2,'claude'),(1.94,'not'),(2.88,'made'),(3.58,'i'),(3.98,'three'),(4.66,'liked'),(5.22,'one'),(5.46,'line'),(6.12,'make'),(7.32,'good'),
(7.94,'it'),(8.2,'watched'),(9.06,'more'),(9.76,'frames'),(10.58,'every'),(11.48,'every'),(11.72,'cut'),(12.4,'it'),(12.96,'pattern'),(13.9,'picture'),(14.56,'second'),
(14.94,'and'),(16.4,'right'),(16.78,'time'),(17.62,'then'),(18.3,'script'),(19.1,'first'),(19.68,'last'),(20.74,'it'),(21.16,'voice'),(21.38,'and'),(21.68,'matched'),
(22.36,'every'),(23.06,'word'),(23.84,'and'),(24.96,'no'),(25.7,'app'),(26.22,'no'),(26.36,'timeline'),(26.68,'every'),(28.46,'code'),(29.46,'claude'),(30.1,'icon'),
(30.78,'every'),(31.54,'every'),(32.48,'then'),(33.32,'video'),(33.9,'fixed'),(34.52,'wrong'),(35.22,'the'),(35.5,'studio'),(36.26,'six'),(37.2,'github'),
(38.3,'comment'),(38.44,'studio'),(38.74,'and'),(39.26,'send'),(39.64,'setup')]
# styles
S={'claude':'c','edited':'s','three':'k','reels':'e','simple':'k','line':'k','another':'k','good':'e','slowly':'e','hundred':'e','frames':'k','word':'k','cut':'k',
'pattern':'e','picture':'k','second':'e','words':'k','time':'e','script':'k','first':'e','last':'e','voice':'k','matched':'k','lovely':'e','part':'k','editing':'k',
'app':'k','timeline':'k','scene':'k','code':'m','icon':'k','card':'k','move':'e','video':'k','fixed':'e','wrong':'k','six':'k','folders':'e','github':'k','comment':'k','setup':'e'}
# pages
starts=['this','not','i','and','make','it','more','every','it','a','and','then','from','it','and','and','no','no','every','claude','every+','then','and','the','comment']
def main(argv=None):
    ap=argparse.ArgumentParser(description=__doc__,formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--words',default='public/words3.json',help='word timestamps: a JSON list, or a timing.ts to read WORDS from')
    ap.add_argument('--out',default='src/timing.ts',help='timing.ts to write')
    ap.add_argument('--anchors',default='anchors.json',help='anchors.json to write (read by sfx2.py)')
    args=ap.parse_args(argv)
    W=load_words(args.words)
    f=finder(W,'anchors'); anchors=[]
    for k,(old,w) in enumerate(A):
        new=0.0 if w is None else W[f(w,k)]['s']
        anchors.append([new,old])
    end_new=round(W[-1]['e']+1.15,2); anchors.append([end_new,41.2])
    style={}; seen={}
    for i,w in enumerate(W):
        n=norm(w['w']); seen[n]=seen.get(n,0)+1
        if n=='made': style[i]='k' if seen[n]==1 else 'e'
        elif n=='watched' and seen[n]==1: style[i]='k'
        elif n=='studio': style[i]='k' if seen[n]==1 else 'p'
        elif n in S: style[i]=S[n]
    f=finder(W,'page starts'); idx=[f(s,k) for k,s in enumerate(starts)]
    pages=[[a,(idx[k+1]-1 if k+1<len(idx) else len(W)-1)] for k,a in enumerate(idx)]
    ts=f"""export const WORDS = {json.dumps(W)};
export const STYLE: Record<number, string> = {json.dumps({str(k):v for k,v in style.items()})};
export const PAGES: [number, number][] = {json.dumps(pages)};
export const ANCHORS: [number, number][] = {json.dumps(anchors)};
export const END = {end_new};
"""
    open(args.out,'w').write(ts)
    for p in pages: print(' '.join(W[i]['w'] for i in range(p[0],p[1]+1)))
    print('END',end_new, 'anchors',len(anchors))
    json.dump(anchors,open(args.anchors,'w'))
if __name__=='__main__':
    main()
