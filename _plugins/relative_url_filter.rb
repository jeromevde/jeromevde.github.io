# _plugins/relative_url_filter.rb

module Jekyll
    class RelativeUrlFilter < Jekyll::Generator
      safe true
  
      def generate(site)
        site.pages.each do |page|
          if page.ext == '.md'
            page.content = process_content(page.content)
          end
        end
  
        site.posts.docs.each do |post|
          post.content = process_content(post.content)
        end
      end
  
      def process_content(content)
        # Process image URLs
        content = content.gsub(/!\[(.*?)\]\((\/.*?)\)/, '![\1]({{\2 | relative_url}})')
        # Process other URLs (e.g., links)
        content = content.gsub(/\[(.*?)\]\((\/.*?)\)/, '[\1]({{\2 | relative_url}})')
        content
      end
    end
  end