module Jekyll
  class NestedCategoriesGenerator < Generator
    def generate(site)
      site.data['nested_categories'] = build_nested_categories(site.categories)
    end

    private

    def build_nested_categories(categories)
      tree = {}
      categories.each do |category, posts|
        # Split the category name into parts
        parts = category.split('/')
        current = tree

        parts.each_with_index do |part, idx|
          # Create subcategory structure if it doesn't exist
          current[part] ||= { 'posts' => 0, 'subcategories' => {} }
          current[part]['posts'] += posts.size

          # Move down to the next level of the hierarchy
          current = current[part]['subcategories']
        end
      end
      tree
    end
  end
end
