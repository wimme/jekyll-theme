# Jekyll theme

## Installation

This theme supports being installed as a [remote theme on GitHub Pages](https://github.com/benbalter/jekyll-remote-theme). No need to copy anything into your site. Just follow these instructions.

### The Quick Version

Add this line to the `_config.yml` of your Jekyll site:

```yaml
remote_theme: wimme/jekyll-theme
```

And copy all the relevant [settings from the theme's `_config.yml`](https://github.com/wimme/jekyll-theme/blob/master/_config.yml). You'll want to change the values to reflect your website, unless your name just happens to be "Blog Author".

Be sure to check out the customization section for tips on customizing the theme.

### Plugins

This theme comes with [`jekyll-seo-tag`](https://github.com/jekyll/jekyll-seo-tag) plugin preinstalled to make sure your website gets the most useful meta tags. See [usage](https://github.com/jekyll/jekyll-seo-tag#usage) to know how to set it up.

### Enabling Google Analytics

To enable Google Analytics, add the following lines to your Jekyll site:

```yaml
  google_analytics: UA-NNNNNNNN-N
```

Google Analytics will only appear in production, i.e., `JEKYLL_ENV=production`

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/wimme/jekyll-theme. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## Development

Want to hack on this theme? Great! Not only is this repository a Jekyll theme, it's also a sample Jekyll site. You can clone it locally and run it see it in action.

```bash
git clone https://github.com/wimme/jekyll-theme
cd jekyll-theme
script/bootstrap.sh
script/serve.sh
```

The `script/bootstrap.sh` script only needs to be run once to set up your environment.

To test your theme, run `script/serve.sh` (or `bundle exec jekyll serve`) and open your browser at `http://localhost:4000`. This starts a Jekyll server using your theme and the contents. As you make modifications, your site will regenerate and you should see the changes in the browser after a refresh.
