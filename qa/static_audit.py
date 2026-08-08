from pathlib import Path
from bs4 import BeautifulSoup
import re, json, subprocess
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
soup=BeautifulSoup(html,'html.parser')
ids=[x.get('id') for x in soup.find_all(id=True)]
missing_assets=[]
for tag,attr in [('link','href'),('script','src')]:
    for el in soup.find_all(tag):
        v=el.get(attr)
        if not v or v.startswith(('http:','https:','#','mailto:','tel:')): continue
        p=(ROOT/v.lstrip('./'))
        if not p.exists(): missing_assets.append(v)
unsafe=[]
for a in soup.find_all('a',target='_blank'):
    rel=' '.join(a.get('rel',[]))
    if 'noopener' not in rel or 'noreferrer' not in rel: unsafe.append(a.get('href'))
inline_style=[str(x)[:120] for x in soup.find_all(style=True)]
cred=re.findall(r'(?i)(type=["\']password|name=["\'][^"\']*(otp|pin|cvv|password))',html)
js_errors=[]
for p in (ROOT/'assets/js').rglob('*.js'):
    r=subprocess.run(['node','--check',str(p)],capture_output=True,text=True)
    if r.returncode: js_errors.append({'file':str(p.relative_to(ROOT)),'error':r.stderr.strip()})
report={
  'duplicate_ids':sorted({x for x in ids if ids.count(x)>1}),
  'missing_local_assets':missing_assets,
  'unsafe_blank_links':unsafe,
  'inline_style_attributes':inline_style,
  'credential_like_fields':len(cred),
  'js_syntax_errors':js_errors,
  'forms':len(soup.find_all('form')),
  'password_inputs':len(soup.select('input[type=password]')),
}
report['static_pass']=not any([report['duplicate_ids'],missing_assets,unsafe,inline_style,cred,js_errors,report['password_inputs']])
(ROOT/'qa/static-report.json').write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps(report,indent=2,ensure_ascii=False))
