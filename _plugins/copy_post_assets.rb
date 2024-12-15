module Jekyll
    class CopyPostAssets < Generator
        safe true

        def generate(site)
            post_directory = File.join(site.source, '_posts') # Path to _posts directory
            puts "post_directory: #{post_directory}"

            if Dir.exist?(post_directory)
                Dir.glob(File.join(post_directory, '**', '*')) do |asset|
                    next unless File.file?(asset)             # Skip directories
                    next if File.extname(asset) == ".md"      # Skip .md files

                    puts "Marking asset for copy: #{asset}"

                    # Extract the relative path of the asset
                    relative_path = asset.sub(post_directory + '/', '') # Get the relative path

                    # Create a new StaticFile object
                    print "eyy"
                    print "site: #{site}\n"
                    print "site.source: #{site.source}\n"
                    print "File.dirname(relative_path): #{File.dirname(relative_path)}\n"
                    print "File.basename(relative_path): #{File.basename(relative_path)}\n"
                    static_file = Jekyll::StaticFile.new(site, site.source+"/_posts", "", relative_path)

                    # Add the StaticFile object to the site's static_files array
                    site.static_files << static_file

                    puts "Marked for future copy: #{asset} to #{File.join(site.dest, relative_path)}"
                end

                puts "Files to be copied to destination directory (#{site.dest}):"
                site.static_files.each do |file|
                    puts file.path  # Log each static file's path that will be copied
                end
            else
                puts "No _posts directory found at: #{post_directory}"
            end
        end
    end
end
