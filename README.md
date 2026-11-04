# Morteza Mir Mojarabian — Personal Website

The Jekyll source for **https://mortezamirmojarabian.github.io**

A simple, professional two-page personal site:

- **Home** — hero, About, Contact (Telegram + email only), Projects, Latest posts
- **Blog** — paginated list of articles and interactive exercises

Design: shades of white, black and gray with blue accents. No CSS framework,
no JavaScript dependencies — one stylesheet, two small scripts. Favicon included.

## Before you publish — 3 small edits

Open `_config.yml` and replace these placeholder values with your real ones:

```yaml
twitter_username: "YourTwitterHandle"      # without the @
telegram_username: "YourTelegramUsername"  # without the @
email: "your.email@example.com"
```

Every contact link, Follow-on-X button and Share-on-X button on the site
reads from these three values — change them once and you are done.

## Run it locally

Requires Ruby (2.7+) and Bundler:

```bash
bundle install
bundle exec jekyll serve
# then open http://localhost:4000
```

Or without Bundler:

```bash
gem install jekyll jekyll-paginate webrick
jekyll serve
```

## Deploy to GitHub Pages

1. Make sure your repository is named `mortezamirmojarabian.github.io` (it already is).
2. Copy **everything in this folder** (but not `_site/`) to the repository root.
3. Commit and push:

   ```bash
   git add .
   git commit -m "Personal website with Jekyll"
   git push origin main
   ```

4. In the repo: **Settings → Pages → Build and deployment** → Source:
   *Deploy from a branch* → `main` / `(root)`. (For a `username.github.io`
   repo this is usually already enabled.)

GitHub builds the site with Jekyll automatically. The only plugin used,
`jekyll-paginate`, is on the GitHub Pages whitelist — nothing else to configure.

## Writing posts

Create a file in `_posts/` named `YYYY-MM-DD-title.md`.

**Article:**

```yaml
---
title: "Your title"
category: article            # article | exercise
tags: [grammar, vocabulary]
excerpt: "One-line teaser shown in post lists."
description: "Used for the meta description."
---
```

Then write Markdown. A few helpers exist for prose:

- `>` blockquotes render as blue "tip" boxes
- `<span class="x">wrong example</span>` / `<span class="ok">right example</span>`
  render as red/green corrected pairs
- Link to another post with `{% post_url 2026-10-12-exercise-present-simple-or-continuous %}`

**Interactive exercise** — same as above plus `category: exercise` and a `quiz` block:

```yaml
quiz_instructions: "Choose the best answer, then press Check answers."
quiz:
  # Multiple choice (default type). answer = zero-based index of the option.
  - prompt: "She usually ____ to school by bus."
    options: ["go", "goes", "going", "is going"]
    answer: 1
    explanation: "'Usually' signals a routine, so we use the present simple."

  # Gap-fill (typed answer). Use "___" where the blank goes.
  # Separate alternative answers with "|".
  - type: gap
    prompt: "It took me two weeks to ___ the flu. (recover)"
    answer: "get over|recover from"
    explanation: "get over an illness = recover from it."
```

The exercise renders automatically at the end of the post with instant
scoring, per-question feedback and explanations — no extra markup needed.

## Project structure

```
.
├── _config.yml            # site settings + the 3 values to edit
├── index.html             # Home page
├── blog/index.html        # Blog page (paginated)
├── 404.html               # not-found page
├── favicon.png            # your golden M favicon
├── Gemfile
├── _layouts/
│   ├── default.html       # HTML shell (head, header, footer)
│   └── post.html          # article + exercise + share + prev/next
├── _includes/
│   ├── head.html          # meta tags, fonts, CSS
│   ├── header.html        # sticky nav + Follow on X
│   ├── footer.html        # dark footer
│   ├── post-card.html     # card used in post lists
│   ├── share-x.html       # Share on X button
│   └── quiz.html          # interactive exercise renderer
├── _posts/                # 7 sample posts (4 articles, 3 exercises)
└── assets/
    ├── css/style.css      # the whole design system (tokens at the top)
    └── js/
        ├── main.js        # header behavior
        └── quiz.js        # exercise engine
```

## Customizing the look

All colors, fonts and spacing live in the `:root` block at the top of
`assets/css/style.css`. Change `--blue` and the whole accent system follows.
