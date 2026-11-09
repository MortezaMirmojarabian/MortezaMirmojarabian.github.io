# Morteza Mirmojarabian — personal website

A plain, fast, two-page website (**Home** and **Blog**) built with [Jekyll](https://jekyllrb.com) for GitHub Pages.
Articles and interactive exercises for English learners, a search box with topic buttons so that visitors can find every post
on a subject (for example, the present perfect), a light/dark theme, and no trackers or third-party requests.
Follow and Share go to X only.

---

## 1. Put it online

1. **Check your details** in `_config.yml` (see section 2).
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

## 2. Your details (`_config.yml`)

| Key | Put here | Used for |
| --- | --- | --- |
| `telegram` | your Telegram username, without `@` | the Telegram cards in **Contact** and in the footer |
| `email` | your public e-mail address | the Email cards in **Contact** and in the footer |
| `x_username` | your X (Twitter) username, without `@` | **Follow on X** buttons, **Share on X** (adds `via`), and the X link-preview tags |

If you change a username, change it here only: every link on the site follows.

## 3. Everyday editing

| I want to… | Edit |
| --- | --- |
| change the About text | `index.html` (the `About` section) |
| change the Telegram channel or group on the Home page | `index.html` (the `Community` section: the two links and names) |
| add, remove or reorder projects | `_data/projects.yml` |
| change my name, tagline or site description | `_config.yml` |
| change how many posts show per page | `paginate:` in `_config.yml` (default 5) |
| change how many search results or topic buttons show before "Show more" | `PAGE` (10) and `SHOW_TOPICS` (8) at the top of `assets/js/blog-search.js` |
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
tags: [vocabulary, confusing words]   # become topic buttons on the Blog page (see section 5)
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

## 5. Topics and search (how a visitor finds every post on one subject)

Nobody has to page through the whole blog. At the top of the **Blog** page visitors get:

- a **search box**. It looks at each post's title, description, topics and first 400 or so words, plus the questions and
  explanations of exercises. It ignores capital letters and accents, matches the beginnings of words (`pres` finds *present*),
  treats *tense* and *tenses* alike, and wants every word typed to be found. Posts that are *about* the words (in the title
  or the topics) come before posts that only mention them.
- **Show** buttons: All, Articles, Exercises.
- **Topic** buttons: one for every tag you have used, the most used first, each with its number of posts. Once there are more
  than ten topics, the eight most used are shown and the rest open with **More topics**. A click lists every post with that topic;
  a second click clears it.
  Topics, Show buttons and the search box can be combined.

The topics under each post are links to the same lists, so a reader who finishes one present-perfect post can go straight to the others.

The address in the browser follows what the visitor does, so any result can be linked to or shared (on X, for example):

| Link | Shows |
| --- | --- |
| `/blog/?topic=present-perfect` | every post tagged `present perfect` |
| `/blog/?q=present+perfect` | the search results for "present perfect" |
| `/blog/?type=exercise` | exercises only (`type=article` for articles only) |
| `/blog/?topic=present-perfect&type=exercise` | both together |

In a link the topic is the tag in lowercase with dashes for spaces: `present perfect` becomes `present-perfect`.

**How to tag, so that this works well**

- Give each post two to four tags: a broad one (`grammar`, `vocabulary`, `pronunciation`, `writing`) and one or two specific ones (`present perfect`, `phrasal verbs`).
- Use one spelling per topic, always. Write `present perfect` every time, not `present perfect tense` in one post and `perfect tenses` in another:
  different words become different buttons. Capital letters make no difference, but lowercase looks tidier.
- Think of tags as the chapters of a book. A topic with a single post is usually too narrow.
- Tag a post with every topic it really teaches. It is then listed under that topic and comes first in a search for it.
  A post that only mentions the present perfect in passing is still found by the search box, but after the ones about it.

**Good to know**

- You do nothing to make the search work. `search.json` (the list of posts it reads) is built with the site, and the Blog page
  downloads it only when a visitor first uses the search box or a topic button, so the page itself stays light.
- Only the first 400 or so words of a post are searched, so put the important words in the title, the description and the tags.
- Everything runs in the visitor's browser, with no outside service. Tested with 300 posts: the list was about 280 KB
  compressed, and a search took a few milliseconds.
- Without JavaScript the search box and buttons are hidden, and the ordinary list with its page numbers still works.
- The page numbers at the bottom of the list stay short however many pages there are: the first, the last and the ones around the current page.

## 6. Interactive exercises

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

## 7. Preview it on your computer (optional)

Install Ruby (3.x) and Bundler, then in this folder:

```bash
bundle install
bundle exec jekyll serve
```

and open <http://localhost:4000>. Add `--future` to also see posts dated in the future.
Restart the command after editing `_config.yml`.

## 8. What's where

```text
_config.yml               settings: name, description, Telegram, email, X username
index.html                Home (hero, About, Community, Projects, Latest posts, Contact)
blog/index.html           Blog list with pagination, search box and topic buttons
search.json               the list of posts the search reads (built automatically, don't edit)
404.html                  "page not found"
_data/projects.yml        the Projects on the Home page
_posts/                   articles and exercises (the seven here are samples)
_layouts/ _includes/      page templates and small building blocks
assets/css/main.css       all styling, light and dark theme
assets/js/site.js         theme toggle (and keyboard scrolling for wide tables)
assets/js/blog-search.js  search box, topic buttons and results on the Blog page
assets/js/exercise.js     the exercise engine
assets/fonts/             Inter, self-hosted
assets/img/               favicons, header logo, link-preview picture
Gemfile                   for previewing on your own computer
```

Only plugins that GitHub Pages supports are used: `jekyll-paginate`, `jekyll-seo-tag`, `jekyll-sitemap`, `jekyll-feed`.
A feed (`/feed.xml`) and a sitemap (`/sitemap.xml`) are generated for you.

## 9. The sample content

The seven posts in `_posts/` are **starter content** so that the blog, pagination and each exercise type work from day one.
Read them, keep what you like, and delete the rest. The About text on the Home page is a first draft, so please edit it until it sounds like you.

## 10. If something looks wrong

- **404 on the live site:** the repository must be named exactly `mortezamirmojarabian.github.io` and be public, and Pages must be set as in step 4.
- **A change doesn't show up:** open the repository's **Actions** tab to see whether the build finished (a red cross shows the error), then refresh with Ctrl+F5.
- **A post is missing:** check the file name pattern (`2026-11-10-title.md`), that the front matter starts and ends with `---`, and that the date isn't in the future.
- **Two topic buttons for the same subject:** the tags are spelled differently in different posts (`present perfect` and `present perfect tense`). Pick one spelling and use it in every post.
- **A new post doesn't turn up in the search:** wait until the build has finished (Actions tab), then refresh with Ctrl+F5. Search reads only the first 400 or so words, so check that the title, description and tags contain the words people would type.

## 11. Credits and licences

- **This site's code** (templates, styles and scripts) is under the MIT licence: see `LICENSE`. The articles and exercises in `_posts/` are © 2026 Morteza Mirmojarabian, all rights reserved, unless a post says otherwise. If you would rather share them, say so in `LICENSE` or in this section (for example under CC BY 4.0).
- **Inter** typeface, SIL Open Font License 1.1: the licence text is in `assets/fonts/Inter-LICENSE.txt`.
- **UI icons** (arrows, sun, moon, check, close, mail, code, library, search, users) come from [Lucide](https://lucide.dev), ISC licence:
  *Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.*
  Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
- **X and Telegram marks** are from [Simple Icons](https://simpleicons.org) (CC0 1.0). The names and logos belong to their owners and are used only to link to those services.
- Built with Jekyll and its plugins (MIT).
