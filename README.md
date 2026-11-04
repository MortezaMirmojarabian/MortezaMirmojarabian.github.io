# Morteza Mirmojarabian — personal website

A plain, fast, two-page website (**Home** and **Blog**) built with [Jekyll](https://jekyllrb.com) for GitHub Pages.
Articles and interactive exercises for English learners, a light/dark theme, and no trackers or third-party requests.
Follow and Share go to X only.

---

## 1. Put it online

1. **Fill in the three placeholders** in `_config.yml` (see section 2).
2. On GitHub, create a **public** repository named exactly `mortezamirmojarabian.github.io`.
3. Upload everything in this folder to it (keep the folder structure, and include the hidden `.gitignore`):

   ```bash
   git init
   git add .
   git commit -m "First version of my site"
   git branch -M main
   git remote add origin https://github.com/mortezamirmojarabian/mortezamirmojarabian.github.io.git
   git push -u origin main
   ```

   (No command line? On the repository page choose **Add file → Upload files** and drag the contents of this folder in.)
4. In the repository go to **Settings → Pages → Build and deployment**. Set **Source: Deploy from a branch**, **Branch: `main`**, **Folder: `/ (root)`**, and save.
5. Wait a minute or two. The site is then live at <https://mortezamirmojarabian.github.io>.
   From now on, every commit you make rebuilds it automatically.

## 2. The three placeholders (`_config.yml`)

| Key | Put here | Used for |
| --- | --- | --- |
| `telegram` | your Telegram username, without `@` | the Telegram card in **Contact** |
| `email` | your public e-mail address | the Email card in **Contact** |
| `x_username` | your X (Twitter) username, without `@` | **Follow on X** buttons, **Share on X** (adds `via`), and the X link-preview tags |

Until you replace them, the Contact cards show the placeholder text, and "Follow on X" points to a profile that doesn't exist.

## 3. Everyday editing

| I want to… | Edit |
| --- | --- |
| change the About text | `index.html` (the `About` section) |
| add, remove or reorder projects | `_data/projects.yml` |
| change my name, tagline or site description | `_config.yml` |
| change how many posts show per page | `paginate:` in `_config.yml` (default 5) |
| change colours | the tokens at the top of `assets/css/main.css` (`--blue`, `--bg`, …; the dark theme has its own block) |
| change the picture shown when a link is shared | `assets/img/og-default.png` (1200 × 630), or `image:` in one post |
| change the favicon | the files in `assets/img/` and `favicon.ico` |

## 4. Writing a post

Create a file in `_posts/` named `YYYY-MM-DD-words-with-dashes.md`. The address becomes `/blog/words-with-dashes/`.
On GitHub you can do this in the browser: **Add file → Create new file**.

```markdown
---
title: "Affect vs. Effect"
date: 2026-11-10
description: "One or two sentences. Shown in the blog list and in link previews."
tags: [vocabulary, confusing words]
level: B1                         # optional, shown as "Level B1"
# label: "Story"                  # optional, replaces the "Article" badge
# image: /assets/img/my-pic.png   # optional, link-preview picture for this post
---
Write in Markdown here. Tables, lists, **bold**, *italic*, headings (start at `##`) and images all work.
```

Handy extras inside a post:

- A highlighted tip: put `{: .note}` on the line right after a paragraph.
- Example sentences: `{: .ok}` (green, correct) and `{: .no}` (red, incorrect) after a paragraph.
- A "show the answers" box: `<details markdown="1"><summary>Show the answers</summary> … </details>`.
- A post dated in the future is not published until that date.

A post with no `exercise:` block is labelled **Article**. A post with one is labelled **Exercise**.
Both show **Share on X** and **Follow on X** at the bottom.

## 5. Interactive exercises

Add an `exercise:` block to the front matter. The page then shows a "Practice" box with **Check answers** and **Start over**,
explains every answer, and offers **Share my score on X**. Everything runs in the reader's browser.

**Multiple choice** (`___` marks the blank, which fills itself in when an option is picked):

```yaml
exercise:
  kind: choice
  instructions: "Choose the best option for each sentence."
  questions:
    - q: "She is ___ honest person."
      options: ["a", "an", "the", "no article"]
      answer: "an"                      # the text of the right option (or its position, starting from 0)
      explain: "*Honest* begins with a vowel **sound**, so we use *an*."
```

**Fill in the blank** (case, extra spaces, curly quotes and a final full stop are ignored; list every accepted answer):

```yaml
exercise:
  kind: fill
  questions:
    - q: "I ___ (live) in Tehran since 2015."
      answer: ["have lived", "'ve lived"]
      explain: "*Since 2015* needs the present perfect."
```

**Word order** (the words of `answer` are shuffled; the reader taps them into place. Punctuation stays attached to its word):

```yaml
exercise:
  kind: order
  questions:
    - q: "Build a polite question."
      answer: "Could you tell me where the library is?"
      explain: "In an indirect question the word order is like a statement."
```

Notes:

- `explain` is optional and understands `*italic*`, `**bold**` and `` `code` ``. Plain text is safe: HTML is never interpreted.
- You can mix types: leave out `kind:` at the top and give each question its own `kind: choice | fill | order`.
- In YAML, wrap any text that contains a colon (`:`) in double quotes, and indent with spaces (never tabs).
- If a question list doesn't appear, check the indentation first. The three sample exercises in `_posts/` are good templates.

## 6. Preview it on your computer (optional)

Install Ruby (3.x) and Bundler, then in this folder:

```bash
bundle install
bundle exec jekyll serve
```

and open <http://localhost:4000>. Add `--future` to also see posts dated in the future.
Restart the command after editing `_config.yml`.

## 7. What's where

```text
_config.yml            settings and the three placeholders
index.html             Home (hero, About, Contact, Projects, Latest posts)
blog/index.html        Blog list with pagination
404.html               "page not found"
_data/projects.yml     the Projects on the Home page
_posts/                articles and exercises (the seven here are samples)
_layouts/ _includes/   page templates and small building blocks
assets/css/main.css    all styling, light and dark theme
assets/js/site.js      theme toggle (and keyboard scrolling for wide tables)
assets/js/exercise.js  the exercise engine
assets/fonts/          Inter, self-hosted
assets/img/            favicons, header logo, link-preview picture
Gemfile                for previewing on your own computer
```

Only plugins that GitHub Pages supports are used: `jekyll-paginate`, `jekyll-seo-tag`, `jekyll-sitemap`, `jekyll-feed`.
A feed (`/feed.xml`) and a sitemap (`/sitemap.xml`) are generated for you.

## 8. The sample content

The seven posts in `_posts/` are **starter content** so that the blog, pagination and each exercise type work from day one.
Read them, keep what you like, and delete the rest. The About text on the Home page is a first draft, so please edit it until it sounds like you.

## 9. If something looks wrong

- **404 on the live site:** the repository must be named exactly `mortezamirmojarabian.github.io` and be public, and Pages must be set as in step 4.
- **A change doesn't show up:** open the repository's **Actions** tab to see whether the build finished (a red cross shows the error), then refresh with Ctrl+F5.
- **A post is missing:** check the file name pattern (`2026-11-10-title.md`), that the front matter starts and ends with `---`, and that the date isn't in the future.

## 10. Credits and licences

- **Inter** typeface, SIL Open Font License 1.1: the licence text is in `assets/fonts/Inter-LICENSE.txt`.
- **UI icons** (arrows, sun, moon, check, close, mail, code, library) come from [Lucide](https://lucide.dev), ISC licence:
  *Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.*
  Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
- **X and Telegram marks** are from [Simple Icons](https://simpleicons.org) (CC0 1.0). The names and logos belong to their owners and are used only to link to those services.
- Built with Jekyll and its plugins (MIT).
