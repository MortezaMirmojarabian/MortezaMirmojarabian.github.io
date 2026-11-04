source "https://rubygems.org"

# Only needed to preview the site on your own computer.
# GitHub Pages builds the site itself and pins these exact versions.
gem "github-pages", group: :jekyll_plugins

# `jekyll serve` needs a web server on Ruby 3+
gem "webrick", "~> 1.8"

# Windows and JRuby do not ship time-zone data (the site sets a time zone)
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end
