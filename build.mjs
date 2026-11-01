import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {marked} from 'marked';

const root=path.dirname(fileURLToPath(import.meta.url));
const config=JSON.parse(await fs.readFile(path.join(root,'config.json'),'utf8'));
config.learningUrl=process.env.LEARNING_URL || config.learningUrl;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function parsePost(raw,id){
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))throw Error('Use lowercase hyphenated filenames: '+id);
 const match=raw.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]+)$/);
 if(!match)throw Error('Missing metadata or body: '+id);
 const meta=JSON.parse(match[1]);
 for(const key of ['title','date','event','category','summary','icon'])if(typeof meta[key]!=='string'||!meta[key].trim())throw Error('Missing '+key+': '+id);
 if(!Number.isInteger(meta.order)||meta.order<1)throw Error('Add a positive order number: '+id);
 if(!['government','agent','deepfake'].includes(meta.icon))throw Error('Use a supported icon: '+id);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)||new Date(meta.date).toISOString().slice(0,10)!==meta.date)throw Error('Invalid review date: '+id);
 const words=match[2].trim().split(/\s+/).length;
 if(!match[2].includes('## ')||!match[2].includes('](https://'))throw Error('Include sections and a linked source: '+id);
 if(words>400)throw Error(`Keep each explainer to 400 words or fewer (${words}): ${id}`);
 return {...meta,id,body:match[2],words};
}

const posts=[];
for(const name of await fs.readdir(path.join(root,'posts'))){
 if(name.endsWith('.md'))posts.push(parsePost(await fs.readFile(path.join(root,'posts',name),'utf8'),name.slice(0,-3)));
}
posts.sort((a,b)=>a.order-b.order||a.id.localeCompare(b.id));

const icons={
 government:'<path d="M4 21h16M6 18h12M5 10h14M3 7l9-4 9 4M6 10v8m4-8v8m4-8v8m4-8v8"/>',
 agent:'<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 4v4m-3 5h.01M15 13h.01M8 17h8"/><circle cx="12" cy="3" r="1"/>',
 deepfake:'<rect x="3" y="6" width="14" height="12" rx="2"/><path d="m17 10 4-2v8l-4-2M8 11h4m-4 3h2"/>'
};

function page(title,content){
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${escape(config.description)}"><title>${escape(title)} · Little AI Labs</title><link rel="icon" type="image/svg+xml" href="./favicon.svg"><link rel="stylesheet" href="./style.css?v=2"></head><body><a class="skip" href="#main">Skip to content</a><header><a class="brand" href="./index.html">${escape(config.title)}</a><a href="${escape(config.learningUrl)}">Learn with Little AI Labs ↗</a></header><main id="main" tabindex="-1">${content}</main><footer><strong>AI in Context · A Little AI Labs publication.</strong><br>Plain-language explanations, practical lessons and sources you can check.<br>AI-assisted drafts; sources are linked in each entry. No independent expert review is claimed.<br>Original content: CC BY 4.0. No accounts, analytics or notifications.</footer></body></html>`;
}

const entries=(await Promise.all(posts.map(async p=>`<details class="story"><summary><span class="story-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${icons[p.icon]}</svg></span><span><span class="story-title">${escape(p.title)}</span><span class="story-date">${escape(p.category)} · Happened ${escape(p.event)}</span><span class="story-summary">${escape(p.summary)}</span></span><svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary><div class="story-content">${await marked.parse(p.body)}</div></details>`))).join('');
const index=page(config.title,`<span class="eyebrow">REAL STORIES · PLAIN LANGUAGE</span><h1>${escape(config.title)}</h1><p class="intro">${escape(config.description)}</p><p class="guide">Open a story for what happened, why it matters, practical steps you can take, and sources to read further.</p><section class="story-list" aria-label="AI stories">${entries||'<p>New explainers are on their way.</p>'}</section>`);

const dist=path.join(root,'dist');
await fs.mkdir(dist,{recursive:true});
// Publish a single index page; remove old generated article pages to keep this a one-page experience.
for(const file of await fs.readdir(dist))if(file.endsWith('.html'))await fs.unlink(path.join(dist,file));
await fs.writeFile(path.join(dist,'index.html'),index);
await fs.copyFile(path.join(root,'style.css'),path.join(dist,'style.css'));
await fs.copyFile(path.join(root,'favicon.svg'),path.join(dist,'favicon.svg'));
await fs.writeFile(path.join(dist,'.nojekyll'),'');
console.log(`Built ${posts.length} explainers on one page.`);
