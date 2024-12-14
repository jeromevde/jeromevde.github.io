# GitHub Actions for Jekyll Blog

This repository uses GitHub Actions to automate the deployment of the Jekyll blog. The workflow is defined in the `.github/workflows/deploy.yml` file.

## Workflow Overview

The workflow is triggered on every push to the `main` branch. It performs the following steps:

1. **Checkout Repository**: Checks out the repository to the runner.
2. **Set up Ruby**: Sets up the Ruby environment required for Jekyll.
3. **Install Dependencies**: Installs the necessary dependencies using `bundler`.
4. **Build Site**: Builds the Jekyll site.
5. **Deploy to GitHub Pages**: Deploys the generated site to the `gh-pages` branch.

## File: `.github/workflows/deploy.yml`

```yaml
name: Deploy Jekyll site to GitHub Pages

on:
    push:
        branches:
            - main

jobs:
    build:
        runs-on: ubuntu-latest

        steps:
            - name: Checkout repository
                uses: actions/checkout@v2

            - name: Set up Ruby
                uses: ruby/setup-ruby@v1
                with:
                    ruby-version: '2.7'

            - name: Install dependencies
                run: bundle install

            - name: Build site
                run: bundle exec jekyll build

            - name: Deploy to GitHub Pages
                uses: peaceiris/actions-gh-pages@v3
                with:
                    github_token: ${{ secrets.GITHUB_TOKEN }}
                    publish_dir: ./_site
```

This workflow ensures that your Jekyll blog is automatically built and deployed to GitHub Pages whenever changes are pushed to the `main` branch.