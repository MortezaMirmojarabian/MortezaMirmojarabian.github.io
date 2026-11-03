# Creates a paginated /blog/ index and /blog/page/N/ pages without an
# additional pagination gem. This runs in the GitHub Actions Jekyll build.
module Jekyll
  class BlogPaginationGenerator < Generator
    safe true
    priority :low

    def generate(site)
      posts = site.posts.docs.sort_by { |post| post.date }.reverse
      per_page = (site.config.dig('blog', 'posts_per_page') || 6).to_i
      per_page = 6 if per_page < 1
      total_pages = [(posts.length.to_f / per_page).ceil, 1].max

      (1..total_pages).each do |page_number|
        directory = page_number == 1 ? 'blog' : "blog/page/#{page_number}"
        page = PageWithoutAFile.new(site, site.source, directory, 'index.html')
        page.data['layout'] = 'blog-index'
        page.data['title'] = page_number == 1 ? 'Blog' : "Blog — Page #{page_number}"
        page.data['description'] = 'English language articles and interactive exercises.'
        page.data['permalink'] = page_number == 1 ? '/blog/' : "/blog/page/#{page_number}/"
        page.data['posts'] = posts.slice((page_number - 1) * per_page, per_page) || []
        page.data['current_page'] = page_number
        page.data['total_pages'] = total_pages
        page.data['total_posts'] = posts.length
        site.pages << page
      end
    end
  end
end
