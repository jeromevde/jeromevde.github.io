# so this will basically transform any markdown image link 
# from ![alt](/path/to/image.jpg) to ![alt]({{ /path/to/image.jpg | relative_url }})
# allowing to keep existing markdowns but make them work with another base_url

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
        content.gsub(/!\[(.*?)\]\((\/.*?)\)/, '![\1]({{\2 | relative_url}})')
      end
    end
  end