# AI in Context

A separate, independently published GitHub Pages site for short explainers about incidents, new AI developments and discoveries. Little AI Labs is the interactive learning site; this is the editorial companion. Updating this site does not require rebuilding Little AI Labs.

## One-time setup

1. Create a repository named **ai-explained** on the same GitHub account as **ai4u**.
2. Upload this folder's contents to its main branch, including the hidden `.github` folder. Exclude `node_modules`.
3. In Settings → Pages, choose **GitHub Actions** as the source.
4. The included workflow publishes the site after each commit. Its deployment result supplies the live URL.

The default links connect sibling repositories: `/ai4u/` and `/ai-explained/`. For different names or domains, set `learningUrl` in `config.json` to the full Little AI Labs URL (ending in `/`) and set the Little AI Labs repository's Actions variable `EXPLAINERS_URL` to this site's full URL. Neither site has been published to a user repository yet.

## Add an article whenever you want

You can do this entirely on GitHub:

1. Open `POST-TEMPLATE.md` and copy its contents.
2. Inside `posts`, choose **Add file → Create new file**. Name it something descriptive, such as `a-new-ai-capability.md`.
3. Paste the template. Replace the title, date, event, category and summary at the top. Keep the quotation marks and commas. Write your article underneath in ordinary Markdown.
4. Link factual claims to sources. Commit the file to main. The workflow checks and publishes it, and the index adds it automatically, newest update first.

To update an article, open its file, choose Edit, make your changes and update `date` after a genuine review. Explain significant corrections in the article. To unpublish, remove that article file and commit; the site is rebuilt without it. Git history preserves the old version.

Aim for 400–600 words. Use short sections, plain language and one practical takeaway. This is an occasional collection, not a breaking-news feed. The Medibank sample is historical and explicitly attributes allegations; it does not claim to describe a current court outcome.

Optional metadata: `related` is an Little AI Labs episode ID such as `privacy`, and `relatedLabel` describes the linked exercise. Omit both for articles that do not need a learning link.

## Preview and checks

With Node.js 22 or later installed: `npm ci`, `npm test`, then `npm run build`. Serve `dist` using a static web server. Published pages use normal HTML links, work without JavaScript, and support GitHub repository subdirectories. The build estimates reading time automatically. Metadata must be valid JSON. Articles are trusted editorial source: do not paste unreviewed HTML or scripts into them.

Keep credentials, private information and leaked breach records out of articles. Distinguish allegations from findings, new capabilities from marketing claims, and AI from ordinary software or cybersecurity. No invented expertise, endorsement or legal conclusions. Dates reflect actual editorial review; nothing updates automatically each week.

Code: MIT. Original educational content: CC BY 4.0. The build uses Marked (MIT); its dependency licence is included in the installed package.
