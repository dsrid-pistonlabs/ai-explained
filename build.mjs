import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {marked} from 'marked';
const root=path.dirname(fileURLToPath(import.meta.url));
const config=JSON.parse(await fs.readFile(path.join(root,'config.json'),'utf8'));
config.learningUrl=process.env.LEARNING_URL || config.learningUrl;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=s=>new Intl.DateTimeFormat('en-AU',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(s+'T00:00:00Z'));
export function parsePost(raw,id){
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))throw Error('Use lowercase hyphenated filenames: '+id);
 const match=raw.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]+)$/);
 if(!match)throw Error('Missing metadata or body: '+id);
 const meta=JSON.parse(match[1]);
 for(const key of ['title','date','event','category','summary'])if(typeof meta[key]!=='string'||!meta[key].trim())throw Error('Missing '+key+': '+id);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)||new Date(meta.date).toISOString().slice(0,10)!==meta.date)throw Error('Invalid date: '+id);
 if(meta.related&&!/^[a-z0-9-]+$/.test(meta.related))throw Error('Invalid related lesson: '+id);
 if(!match[2].includes('## ')||!match[2].includes('](https://'))throw Error('Include sections and a linked source: '+id);
 return {...meta,id,body:match[2],minutes:Math.max(1,Math.ceil(match[2].split(/\s+/).length/200))};
}
const posts=[];
for(const name of await fs.readdir(path.join(root,'posts')))if(name.endsWith('.md'))posts.push(parsePost(await fs.readFile(path.join(root,'posts',name),'utf8'),name.slice(0,-3)));
posts.sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
const css=`*{box-sizing:border-box}body{margin:0;background:#f5f6f8;color:#20354b;font:17px/1.75 system-ui,sans-serif}a{color:inherit;text-underline-offset:4px}a:focus-visible{outline:3px solid #a37132;outline-offset:5px}header,main,footer{max-width:840px;margin:auto;padding:24px 30px}header{display:flex;align-items:center;justify-content:space-between;gap:20px;border-bottom:1px solid #d9dfd0;font-size:.85rem}.brand{font-weight:750;text-decoration:none;font-size:1.05rem;border-left:4px solid #bd8542;padding-left:12px}header{border-bottom:2px solid #243e59}main>.eyebrow{color:#785322;font-weight:700}h1{color:#20354b}main{padding-top:52px;min-height:70vh}h1,h2{font-family:Georgia,serif;font-weight:400;line-height:1.2}h1{font-size:clamp(2.2rem,6vw,3.5rem);letter-spacing:-1px}h2{font-size:1.65rem;margin-top:36px}p{color:#475569}small,.meta{font-size:.8rem;color:#526277}.eyebrow{font-size:.75rem;letter-spacing:1.5px;text-transform:uppercase}.intro{font-size:1.15rem;max-width:640px}.post-card{border-top:1px solid #d9dfd0;padding:28px 0}.post-card h2{margin:8px 0 12px}.post-card h2 a{text-decoration:none}.post-card h2 a:hover{text-decoration:underline}.post-card p{margin:10px 0}.article p{max-width:70ch}.article a{overflow-wrap:anywhere}.article h2{margin-top:38px}.takeaway{padding:22px;background:#e5edf5;border-radius:10px;margin:36px 0}.takeaway p{margin-top:0}footer{border-top:1px solid #d9dfd0;margin-top:40px;font-size:.8rem}.skip{position:absolute;top:-100px;left:20px;background:white;padding:10px}.skip:focus{top:10px}main:focus{outline:none}@media(max-width:480px){header,main,footer{padding-left:22px;padding-right:22px}header{align-items:flex-start;flex-direction:column;gap:8px}main{padding-top:30px}h1{font-size:2.3rem}body{font-size:16px}}`;
function page(title,content){return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${escape(config.description)}"><title>${escape(title)} · Little AI Labs</title><link rel="icon" type="image/svg+xml" href="./favicon.svg"><link rel="stylesheet" href="./style.css"></head><body><a class="skip" href="#main">Skip to content</a><header><a class="brand" href="./index.html">${escape(config.title)}</a><a href="${escape(config.learningUrl)}">Learn with Little AI Labs ↗</a></header><main id="main" tabindex="-1">${content}</main><footer>AI in Context · A Little AI Labs publication.<br>Sources, explanations and clearly labelled uncertainty.<br>AI-assisted drafts; sources are linked in each article. No independent expert review is claimed.<br>Original content: CC BY 4.0. No accounts, analytics or notifications.</footer></body></html>`;}
const index=page(config.title,`<span class="eyebrow">FACTS &amp; ANALYSIS</span><h1>${escape(config.title)}.</h1><p class="intro">${escape(config.description)}</p><p class="meta">Incidents, new developments and discoveries, explained with sources. We distinguish what is known, what is claimed and what remains uncertain.</p>${posts.map(p=>`<article class="post-card"><span class="eyebrow">${escape(p.category)} · ${p.minutes} min read</span><h2><a href="./${p.id}.html">${escape(p.title)}</a></h2><p>${escape(p.summary)}</p><p class="meta">Event: ${escape(p.event)} · Updated <time datetime="${p.date}">${date(p.date)}</time></p></article>`).join('')||'<p>The first explainer is on its way.</p>'}`);
await fs.mkdir(path.join(root,'dist'),{recursive:true});
// Only remove files generated by this builder, so a removed post does not linger.
for(const file of await fs.readdir(path.join(root,'dist')))if(file.endsWith('.html'))await fs.unlink(path.join(root,'dist',file));
await fs.writeFile(path.join(root,'dist/index.html'),index);
await fs.writeFile(path.join(root,'dist/style.css'),css);
await fs.writeFile(path.join(root,'dist/.nojekyll'),'');
for(const p of posts){const body=await marked.parse(p.body);const related=p.related?`<section class="takeaway"><p>Want to put this idea into practice?</p><a href="${escape(config.learningUrl)}#/episode/${p.related}">${escape(p.relatedLabel||'Try a related Little AI Labs story')} ↗</a></section>`:'';await fs.writeFile(path.join(root,'dist',p.id+'.html'),page(p.title,`<article class="article"><a href="./index.html">← All explainers</a><h1>${escape(p.title)}</h1><p class="meta">${escape(p.category)} · ${p.minutes} min read<br>Event: ${escape(p.event)} · Updated <time datetime="${p.date}">${date(p.date)}</time></p>${body}${related}<a href="./index.html">Back to all explainers</a></article>`));}
console.log(`Built ${posts.length} explainers and the index.`);

await fs.copyFile(path.join(root,'favicon.svg'),path.join(root,'dist/favicon.svg'));
