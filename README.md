# Jerome's Blog

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

## Post Format

Posts can include Jekyll front matter for metadata:

```markdown
---
layout: post
title: Your Post Title
---

# Your Post Content

Your markdown content here...
```

Or use standard markdown headers:

```markdown
# Your Post Title

Your markdown content here...
```

## Deployment

Since this is a static site, you can deploy it to any static hosting service:

- **GitHub Pages**: Just push to your repository
- **Netlify**: Connect your repository and deploy
- **Vercel**: Connect your repository and deploy
- **Any static hosting**: Upload the files to your web server

Make sure to run `npm run build` before deploying to ensure the post index is up to date.

## Benefits Over Jekyll

- **No Ruby dependencies**: Just Node.js for the build script
- **Faster development**: No need to wait for Jekyll to rebuild
- **Simpler deployment**: Just static files, no server-side processing
- **Better performance**: Pure JavaScript, no server-side rendering needed
- **Easier maintenance**: Fewer dependencies and moving parts

- **Project Repository**: If the repository is not named `<username>.github.io`, the blog will be accessible at `https://<username>.github.io/<repository-name>/`.  
  Example: If the repository is `my-blog`, the blog URL will be `https://johndoe.github.io/my-blog/`.

- **Custom Domain**: To use a custom domain:
  1. Add a `CNAME` file to the root of the `gh-pages` branch containing your domain name (e.g., `www.example.com`).
  2. Configure your DNS settings to point to GitHub Pages' servers.

To verify the deployment URL, go to **Settings** → **Pages** in your repository. The URL will be displayed there.
