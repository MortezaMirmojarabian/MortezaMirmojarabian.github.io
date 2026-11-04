# Morteza Mirmojarabian — English learning

A responsive Jekyll website for English-language articles, learner exercises, teaching resources, and project information. It is configured for `https://mortezamirmojarabian.github.io` and keeps the primary navigation to **Home** and **Blog**.

## Run locally

Install Ruby and Bundler, then from this folder run:

```sh
bundle config set --local path vendor/bundle
bundle install
bundle exec jekyll serve --host 0.0.0.0 --port 3000
```

Open `http://localhost:3000`. To build static output without starting a server:

```sh
bundle exec jekyll build
```

The generated website is in `_site/`. The custom plugin in `_plugins/blog_pagination.rb` creates the Blog's static pagination pages. Use the included GitHub Actions workflow to build and publish on GitHub Pages; GitHub's default Jekyll builder does not run arbitrary plugins on its own.

## Personalize before publishing

Edit `_data/profile.yml` and replace `YOUR_TELEGRAM_USERNAME`, `YOUR_EMAIL_ADDRESS`, and `YOUR_X_USERNAME` with the correct account identifiers. The project URLs are optional and blank by default; set `html_editor_url` and `teachers_library_url` there if you want the project cards to link to their destinations. Those contact and project URLs were not included with the source brief, so the project intentionally does not invent them.

## Add content

Create a Markdown file under `_posts/` named `YYYY-MM-DD-your-title.md`. Add front matter such as:

```yaml
---
title: "A clear article title"
date: 2026-11-05 09:00:00 +0330
kind: Article
topic: Grammar
reading_time: 4
excerpt: "A short summary for the Blog list."
---
Your Markdown article...
```

To add an interactive multiple-choice exercise, include this front matter:

```yaml
exercise:
  title: "Choose the best answer"
  question: "Which sentence is natural?"
  choices:
    - "First choice"
    - "Second choice"
  answer: 1
```

`answer` is a zero-based index into the `choices` list. The shared article layout renders the accessible exercise UI and checks the selection in the browser. Posts are paginated four at a time; change `posts_per_page` in `_config.yml` if desired.

## Project structure

- `_layouts/` — shared shell, Home/page, Blog, and article layouts.
- `_includes/` — reusable interactive exercise component.
- `_plugins/` — static Blog pagination generator.
- `_posts/` — sample English articles and exercises.
- `_data/profile.yml` — contact, X, and optional project links.
- `assets/css/` and `assets/js/` — responsive styling and exercise behavior.
- `blog/index.html` and `index.html` — the two primary pages.
- `favicon.png` — the favicon supplied with the request.
- `.github/workflows/deploy.yml` — GitHub Pages Actions build and deploy workflow.

## Deployment

The included Actions workflow builds the Jekyll project with Ruby and deploys `_site/` to GitHub Pages when code is pushed to `main`. In the repository's GitHub Pages settings, select **GitHub Actions** as the build/deployment source. The repository should be named `mortezamirmojarabian.github.io` to match the configured website address.
