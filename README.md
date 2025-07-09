# A Blog

A simple, JavaScript-based markdown blog that parses and displays markdown files without requiring Jekyll or any build tools beyond Node.js.

## Features

- **Pure JavaScript**: No Jekyll, no Ruby dependencies
- **Markdown Support**: Automatic parsing of markdown files with support for:
  - Headers (H1, H2, H3)
  - Bold and italic text
  - Links and images
  - Code blocks and inline code
  - Lists and blockquotes
  - Tables
- **Responsive Design**: Clean, modern UI that works on all devices
- **Automatic Indexing**: Build script automatically generates an index of all posts

## Structure

```
├── index.html          # Main application file
├── build.js            # Build script to generate post index
├── package.json        # Project configuration
├── posts-index.json    # Generated index of all posts
└── _posts/             # Blog posts directory
    └── YYYY-MM-DD-title/
        ├── post.md     # Main post content
        └── assets/     # Images and other assets
```

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
