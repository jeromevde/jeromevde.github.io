module Jekyll
    class CopyPostAssets < Generator
        safe true
        # =begin
        # This plugin copies assets from the _posts directory to the _site directory.
        # It specifically processes all files but .md files.
        # =end
        def generate(site)
            print "site.source: #{site.source}\n"
            post_directory = File.join(site.source, '_posts') # Path to _posts directory
            if Dir.exist?(post_directory)
                Dir.glob(File.join(post_directory, '**', '*')) do |asset|
                    next unless File.file?(asset)             # Skip directories
                    next if File.extname(asset) == ".md"      # Skip .md files
                    relative_path = asset.sub(post_directory + '/', '') # Get the relative path
                    static_file = Jekyll::StaticFile.new(site, post_directory, site.dest, relative_path)
                    site.static_files << static_file
                    puts "Marked for future copy: #{asset} to #{File.join(site.dest, relative_path)}"
                end
                end
            else
                puts "No _posts directory found at: #{post_directory}"
            end
        end
    end
end
