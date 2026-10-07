import test from 'node:test';
import assert from 'node:assert/strict';
import {parsePost} from '../build.mjs';
const valid={title:'An AI development',date:'2026-10-01',event:'September 2026',category:'New developments',summary:'What this means in plain language.'};
const raw=meta=>'---\n'+JSON.stringify(meta)+'\n---\n## What happened?\nA sourced example. [Source](https://example.org)';
test('valid single-file articles are publishable',()=>{const p=parsePost(raw(valid),'new-development');assert.equal(p.title,valid.title);assert.equal(p.minutes,1);});
test('bad metadata cannot silently publish',()=>{assert.throws(()=>parsePost(raw({...valid,date:'2026-02-30'}),'example'));assert.throws(()=>parsePost(raw({...valid,title:''}),'example'));assert.throws(()=>parsePost(raw(valid),'../escape'));assert.throws(()=>parsePost('No metadata','example'));});
