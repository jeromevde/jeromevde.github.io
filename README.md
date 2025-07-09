# A Blog

A simple, JavaScript-based markdown blog that parses and displays markdown files without into a blog

## Usage

### Adding New Posts

1. Create a new folder in `_posts/` with the format `YYYY-MM-DD-title/`
2. Add your markdown file inside the folder
3. Include any images or assets in the same folder
4. Run the build script to update the index

### Building the Site

```bash
npm run build
```

This will:
- Scan all markdown files in the `_posts/` directory
- Extract titles from Jekyll front matter or markdown headers
- Generate a `posts-index.json` file with all posts

### Running Locally

```bash
npm run serve
```

This will start a local HTTP server on port 8080. Open `http://localhost:8080` in your browser.
