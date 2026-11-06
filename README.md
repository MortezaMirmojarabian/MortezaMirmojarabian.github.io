# Morteza Mirmojarabian: Personal Website

A personal Jekyll website with a **Home** page (About, Contact, Projects, Latest posts) and a **Blog** with articles on the English language and interactive exercises for learners.

- **Live URL:** <https://mortezamirmojarabian.github.io>
- **Theme:** monochrome (white / black / gray) with blue accents; automatic dark mode via `prefers-color-scheme`
- **No external dependencies:** no fonts, CSS frameworks, or JavaScript libraries loaded from CDNs

## Project structure

```
mortezamirmojarabian.github.io/
├── _config.yml          # Site settings (edit the TODO placeholders!)
├── _layouts/
│   ├── default.html     # HTML skeleton used by every page
│   ├── post.html        # Blog post layout (badge, meta, share, back link)
│   └── page.html        # Simple page layout
├── _includes/
│   ├── head.html        # <head>: meta, Open Graph, favicon, stylesheet
│   ├── header.html      # Sticky nav (Home / Blog)
│   ├── footer.html      # Copyright + Telegram / Email / X links
│   ├── share.html       # "Share on X" button for posts
│   └── post-card.html   # Card used on Home and Blog listings
├── _posts/              # Blog posts: YYYY-MM-DD-title.md
├── blog/index.html      # Blog listing with pagination (4 posts per page)
├── index.html           # Home page
├── 404.html             # Not-found page
├── assets/css/main.css  # All styling
├── assets/js/main.js    # Nav highlighting + quiz engine
└── favicon.svg          # Browser tab icon
```

## Before you publish: replace the placeholders

Open `_config.yml` and fill in these values:

| Placeholder | Meaning | Example |
|---|---|---|
| `email` | Your contact email, shown in Contact and footer | `hello@example.com` |
| `telegram_username` | Your Telegram handle, without @ | `mortezam` |
| `twitter_username` | Your X handle, without @ (footer "Follow on X") | `mortezam` |
| `html_editor_url` | Link to your HTML Editor project | `https://...` |
| `ili_library_url` | Link to the ILI Teachers' Library | `https://...` |

Until the project URLs are set, the project cards link nowhere (`#`).

## Preview locally

Requires Ruby and Bundler.

```bash
bundle install        # once
bundle exec jekyll serve
# open http://localhost:4000
```

## Publish on GitHub Pages

1. Create a **public** repository named exactly `mortezamirmojarabian.github.io`.
2. Push these files to the repository root (the `main` branch).
3. In the repo's **Settings → Pages**, confirm the source is *Deploy from a branch*, branch `main`, folder `/ (root)`.
4. Wait a minute, then open <https://mortezamirmojarabian.github.io>. Every future push to `main` redeploys automatically.

GitHub Pages runs Jekyll in safe mode, but `jekyll-paginate` is supported there, which is why the blog pagination works without extra setup.

## Writing posts

Create a file in `_posts` named `YYYY-MM-DD-your-title.md` with this front matter:

```yaml
---
layout: post
title: "Your Title"
date: 2026-11-10
category: articles        # or: exercises
tags: [grammar, vocabulary]
excerpt: "One-sentence summary shown on the Home and Blog cards."
---
```

Markdown goes below the front matter. `category: exercises` shows a blue "Interactive exercise" badge instead of "Article".

### Adding an interactive quiz

Add a `data-quiz` block anywhere in a post. Each `.quiz-item` needs a `data-answer` value matching one of the radio `value`s, plus an optional `.quiz-explanation` shown after grading:

```html
<div class="quiz" data-quiz>
  <div class="quiz-item" data-answer="b">
    <p class="quiz-question">1. She ______ to school yesterday.</p>
    <ul class="quiz-options">
      <li class="quiz-option"><label><input type="radio" name="q1" value="a"> go</label></li>
      <li class="quiz-option"><label><input type="radio" name="q1" value="b"> went</label></li>
      <li class="quiz-option"><label><input type="radio" name="q1" value="c"> gone</label></li>
    </ul>
    <p class="quiz-explanation">Go, went, gone.</p>
  </div>
</div>
```

The quiz engine in `assets/js/main.js` adds the Check answers / Try again buttons, scoring, and correct/wrong highlighting automatically. No extra setup per quiz.

## Using the original favicon

The site uses `favicon.svg` (a gold "M" on a dark rounded square, drawn in SVG). To use your original `favicon.png` instead:

1. Copy your `favicon.png` into the repository root.
2. In `_includes/head.html`, replace the line

   ```html
   <link rel="icon" type="image/svg+xml" href="{{ '/favicon.svg' | relative_url }}">
   ```

   with

   ```html
   <link rel="icon" type="image/png" href="{{ '/favicon.png' | relative_url }}">
   ```
