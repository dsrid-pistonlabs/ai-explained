import test from 'node:test';
import assert from 'node:assert/strict';
import {parsePost} from '../build.mjs';
const valid={title:'An AI development',date:'2026-11-01',event:'September 2026',category:'New developments',summary:'What this means in plain language.',icon:'agent',order:1};
const raw=meta=>'---\n'+JSON.stringify(meta)+'\n---\n## What happened?\nA sourced example. [Source](https://example.org)';
test('valid entries are publishable',()=>{const p=parsePost(raw(valid),'new-development');assert.equal(p.title,valid.title);assert.ok(p.words<400);});
test('bad metadata cannot silently publish',()=>{assert.throws(()=>parsePost(raw({...valid,date:'2026-02-30'}),'example'));assert.throws(()=>parsePost(raw({...valid,title:''}),'example'));assert.throws(()=>parsePost(raw({...valid,icon:'rocket'}),'example'));assert.throws(()=>parsePost(raw(valid),'../escape'));assert.throws(()=>parsePost('No metadata','example'));});
test('entries above the 400-word limit are rejected',()=>{assert.throws(()=>parsePost(raw(valid)+'\n'+('word '.repeat(400)),'long-entry'),/400 words or fewer/);});
test('published explainers stay together on one accordion page',async()=>{const fs=await import('node:fs/promises');const html=await fs.readFile(new URL('../dist/index.html',import.meta.url),'utf8');const files=await fs.readdir(new URL('../dist/',import.meta.url));assert.ok((html.match(/<details class="story">/g)||[]).length>=3);assert.match(html,/What can you do\?/);assert.match(html,/Happened 18 June 2026/);assert.match(html,/Happened 9–13 July 2026/);assert.deepEqual(files.filter(file=>file.endsWith('.html')),['index.html']);});
