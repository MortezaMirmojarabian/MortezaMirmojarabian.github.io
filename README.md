# Morteza Mirmojarabian — personal website

A simple, responsive Jekyll website for **https://mortezamirmojarabian.github.io**. It has two pages: Home and Blog. About, Projects, Contact, and Latest Posts are sections of the Home page.

## Before publishing

Open `_config.yml` and add the destinations that were not included in the original brief:

```yml
email: "your-address@example.com"
telegram_url: "https://t.me/your_username"
x_username: "your_x_username" # without @ is fine
html_editor_url: "https://your-html-editor-url"
ili_library_url: "https://your-ili-library-url"
```

Leave any value blank to keep its link hidden. The Home page contains only Telegram and Email as contact methods. Social follow and sharing use X only.

## Run locally

You need Ruby and Bundler. From the site folder:

```bash
bundle install
bundle exec jekyll serve
```

Then open `http://127.0.0.1:4000`.

The Blog pagination is handled by `_plugins/blog_pagination.rb`, a small local Jekyll generator. For this reason, publish with the included **GitHub Actions** workflow rather than GitHub Pages' default legacy build. The workflow builds the site with Jekyll and deploys the generated `_site` folder.

## Publish to GitHub Pages

1. Create or open the repository named `mortezamirmojarabian.github.io`.
2. Upload the contents of this folder to the repository root (including the hidden `.github` directory).
3. In GitHub, open **Settings → Pages** and set the build/deployment source to **GitHub Actions**.
4. Commit and push to the `main` branch. The included workflow will build and deploy the site.
5. Add your contact and project URLs to `_config.yml`, then commit the changes.

## Add a blog post

Create a Markdown file in `_posts/` using this filename pattern:

`YYYY-MM-DD-your-post-title.md`

Example front matter:

```yml
---
title: "A useful English pattern"
date: 2026-11-04 09:00:00 +0100
category: Useful patterns
description: "A short summary for the blog listing and search engines."
reading_time: "3 min read"
---

Write your article here using Markdown.
```

The Blog page automatically sorts posts by date and paginates them three at a time. Change `blog.posts_per_page` in `_config.yml` to adjust this.

## Interactive exercises

Use the markup pattern in either of the two sample exercise posts. Each question is a `fieldset` with a `data-correct` value (`a`, `b`, or `c`) and an optional `data-explanation`. The shared script in `assets/js/exercises.js` checks answers, displays feedback, and supports retrying.

## Supplied brand assets

The supplied gold M monogram is used for the favicon, Apple touch icon, and site identity. All provided sizes are preserved in `assets/images/`.
