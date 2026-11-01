# AI in Context

A separate, independently published GitHub Pages site for short explainers about real-world AI incidents, developments and discoveries. Little AI Labs is the interactive learning site; this is the editorial companion. Every entry appears in an expandable accordion on one page. Updating this site does not require rebuilding Little AI Labs.

The site is published at [context.littleailabs.com.au](https://context.littleailabs.com.au/). Changes committed to `main` are published by GitHub Actions. The companion learning site is [littleailabs.com.au](https://www.littleailabs.com.au/).

## Add an entry whenever you want

You can do this entirely on GitHub:

1. Open `POST-TEMPLATE.md` and copy its contents.
2. Inside `posts`, choose **Add file → Create new file**. Name it something descriptive, such as `a-new-ai-capability.md`.
3. Paste the template. Fill in the title, review date, event date, category, short summary, icon and a unique display order. Keep the quotation marks and commas. Write the entry underneath in ordinary Markdown.
4. Explain **what happened**, **so what**, and **what the reader can do**. Use plain language, link factual claims to reliable sources, and keep the whole entry under 400 words. Commit the file to main. The workflow checks it and adds it as an accordion on the single page.

To update an entry, open its file, choose Edit, make your changes and update `date` after a genuine review. Explain significant corrections in the entry. To unpublish, move it out of `posts` and commit; the workflow rebuilds the one-page index without it. Git history preserves the old version. Older reference material is kept in `archive/` and is not published.

Keep each entry to 400 words or fewer. Use short sections, plain language and practical steps readers can take. This is an occasional collection, not a breaking-news feed.

The supported icons are `government`, `agent`, and `deepfake`. `order` controls the reading sequence. `event` appears next to the title; `date` records when the entry was last checked. All entries stay on the same page; no article subpages are created.

## Preview and checks

With Node.js 22 or later installed: `npm ci`, `npm test`, then `npm run build`. Serve `dist` using a static web server. The accordion uses native HTML and works without JavaScript. Metadata must be valid JSON. Entries are trusted editorial source: do not paste unreviewed HTML or scripts into them.

Keep credentials, private information and leaked breach records out of articles. Distinguish allegations from findings, new capabilities from marketing claims, and AI from ordinary software or cybersecurity. No invented expertise, endorsement or legal conclusions. Dates reflect actual editorial review; nothing updates automatically each week.

Code: MIT. Original educational content: CC BY 4.0. The build uses Marked (MIT); its dependency licence is included in the installed package.
