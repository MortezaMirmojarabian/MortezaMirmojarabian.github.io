# mortezamirmojarabian.github.io

Personal website built with [Jekyll](https://jekyllrb.com/) — a home page (About, Projects, Latest Posts, Contact) and a paginated blog with articles and interactive exercises.

## Structure

```
.
├── _config.yml             # Site configuration
├── index.html              # Home page (one page, sections)
├── blog.html               # Blog with pagination (3 posts per page)
├── 404.html                # Not found page
├── _layouts/               # default.html, post.html
├── _includes/              # header.html, footer.html
├── _posts/                 # Articles + interactive exercises
├── assets/css/style.css    # Theme (white / black / gray + blue accents)
└── favicon.png
```

## Before publishing — edit these in `_config.yml`

- `author.email` — your email address
- `author.telegram` — your Telegram link (`https://t.me/yourusername`)
- `author.twitter` — your X (Twitter) profile URL (used in "Follow me on X")
- `timezone` — your timezone

The share button on every post links to X (Twitter) intent with the post title and URL.

## Running locally

```bash
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000

## Adding a post

Create `_posts/YYYY-MM-DD-title.md` (or `.html` for interactive exercises):

```yaml
---
layout: post
title: "Your Title"
categories: [articles]        # or [exercises]
tags: [grammar]
description: "Short summary."
---

Your content here...
```

The `<!--more-->` comment marks where the excerpt on listing pages ends.

## Deploying to GitHub Pages

1. Push this folder to a repository named `mortezamirmojarabian.github.io`
2. In the repo: **Settings → Pages → Source: Deploy from a branch**, choose `main` / (root)
3. GitHub builds the site automatically (Jekyll and `jekyll-paginate` are supported natively)

## Notes

- Theme: shades of white, black and gray, with blue accents.
- Pagination: 3 posts per page at `/blog/page/2/`, `/blog/page/3/`, ...
- Sample posts included — edit or delete them freely.
