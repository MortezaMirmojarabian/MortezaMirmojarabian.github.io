# Generate static pages for the Blog index and subsequent Blog result pages.
# This plugin is built with GitHub Actions so the same pagination works on GitHub Pages.
module Jekyll
  class BlogPaginationGenerator < Generator
    priority :lowest

    def generate(site)
      blog_page = site.pages.find { |page| page.url == "/blog/" }
      return unless blog_page

      posts = site.posts.docs.sort_by(&:date).reverse
      per_page = [site.config.fetch("posts_per_page", 4).to_i, 1].max
      total_pages = [(posts.length.to_f / per_page).ceil, 1].max

      (1..total_pages).each do |number|
        page = if number == 1
          blog_page
        else
          Jekyll::PageWithoutAFile.new(site, site.source, "blog/page/#{number}", "index.html").tap do |generated|
            generated.content = ""
            generated.data["layout"] = "blog"
            generated.data["title"] = "Blog — Page #{number}"
            generated.data["description"] = site.config["description"]
          end
        end

        page.data["paginator"] = {
          "current_page" => number,
          "total_pages" => total_pages,
          "total_posts" => posts.length,
          "per_page" => per_page,
          "posts" => posts.slice((number - 1) * per_page, per_page) || [],
          "previous_page_path" => number > 1 ? (number == 2 ? "/blog/" : "/blog/page/#{number - 1}/") : nil,
          "next_page_path" => number < total_pages ? "/blog/page/#{number + 1}/" : nil
        }

        site.pages << page unless number == 1
      end
    end
  end
end
