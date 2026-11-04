# mortezamirmojarabian.github.io

Personal website & blog — Jekyll on GitHub Pages. Two pages: **Home** and **Blog**
(articles + interactive exercises, paginated 5 per page).

## Setup
1. Save the attached 32×32 gold "M" image as `assets/favicon.png`.
2. In `_config.yml`, replace the placeholders: `author.email`, `author.telegram`,
   `author.twitter`, and the project URLs.
3. Push everything to the `mortezamirmojarabian.github.io` repository (branch `main`).
4. Repo → Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
   GitHub Pages builds Jekyll automatically (`jekyll-paginate` is supported).

## Local preview
    bundle install
    bundle exec jekyll serve

## Adding posts
Create `_posts/YYYY-MM-DD-slug.md` with `categories: [article]` or `categories: [exercise]`.
For interactive exercises, copy a `.quiz` block from an existing exercise post —
`assets/js/quiz.js` handles checking, feedback and explanations automatically.