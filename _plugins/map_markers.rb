module Jekyll
  class MapMarkersGenerator < Generator
    def generate(site)
      # Process all posts and add URL to their markers
      site.posts.docs.each do |post|
        next unless post.data['map'] && post.data['map']['markers']

        post.data['map']['markers'] = process_markers(post.data['map']['markers'], post.url)
      end

      # Generate marker collections for different views
      site.data['all_markers'] = collect_all_markers(site.posts.docs)
      site.data['markers_by_category'] = collect_markers_by_category(site.posts.docs)
      site.data['markers_by_tag'] = collect_markers_by_tag(site.posts.docs)
    end

    private

    # Process markers to add post URLs and other metadata
    def process_markers(markers, post_url = nil)
      return [] unless markers

      markers.map do |marker|
        processed_marker = marker.dup

        # Add post URL if not already present
        unless processed_marker['url']
          processed_marker['url'] = post_url if post_url
        end

        processed_marker
      end
    end

    # Collect all markers from posts with their URLs
    def collect_all_markers(posts)
      all_markers = []

      posts.each do |post|
        next unless post.data['map'] && post.data['map']['markers']

        all_markers.concat(post.data['map']['markers'])
      end

      all_markers
    end

    # Collect markers grouped by category (hierarchical)
    def collect_markers_by_category(posts)
      markers_by_category = {}

      posts.each do |post|
        next unless post.data['map'] && post.data['map']['markers']
        next unless post.data['categories']

        markers = post.data['map']['markers']

        post.data['categories'].each do |category|
          # Split "a/b/c" into ["a", "a/b", "a/b/c"]
          category_parts = category.split('/')
          hierarchy = []
          category_parts.each_with_index do |part, index|
            hierarchy << category_parts[0..index].join('/')
          end

          # Add markers to each level of the hierarchy
          hierarchy.each do |cat|
            markers_by_category[cat] ||= []
            markers_by_category[cat].concat(markers)
          end
        end
      end

      # Remove duplicates within each category
      markers_by_category.each do |category, markers|
        markers_by_category[category] = markers.uniq { |m| [m['title'], m['position']] }
      end

      markers_by_category
    end

    # Collect markers grouped by tag
    def collect_markers_by_tag(posts)
      markers_by_tag = {}

      posts.each do |post|
        next unless post.data['map'] && post.data['map']['markers']
        next unless post.data['tags']

        post.data['tags'].each do |tag|
          markers_by_tag[tag] ||= []
          markers_by_tag[tag].concat(post.data['map']['markers'])
        end
      end

      markers_by_tag
    end
  end
end
