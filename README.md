# Blog

# Structure

# Liquid Templating Language
-   ```
    {{ page.lang | default: site.lang | default: "en" }}
    ```
-   ```
    {% if site.paginate %}
        {% assign posts = paginator.posts %}
    {% else %}
        {% assign posts = site.posts %}
    {% endif %}
    ```

# Gem

# run locally
```
kill -9 $(lsof -t -i :4000)
bundle exec jekyll serve --config _config.local.yml --port 4001
```