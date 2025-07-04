#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const postsDir = '_posts';
const posts = [];

// Function to extract title from markdown content
function extractTitle(content) {
    // First, try to extract title from Jekyll front matter
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (frontMatterMatch) {
        const frontMatter = frontMatterMatch[1];
        const titleMatch = frontMatter.match(/^title:\s*(.+)$/m);
        if (titleMatch) {
            return titleMatch[1].trim().replace(/['"]/g, '');
        }
    }
    
    // Remove Jekyll front matter for further processing
    content = content.replace(/^---[\s\S]*?---\n?/, '');
    
    // Look for first H1 header
    const h1Match = content.match(/^# (.+)$/m);
    if (h1Match) {
        return h1Match[1].trim();
    }
    
    // Look for first H2 header
    const h2Match = content.match(/^## (.+)$/m);
    if (h2Match) {
        return h2Match[1].trim();
    }
    
    // Fall back to folder name
    return 'Untitled Post';
}

// Function to extract date from filename or folder name
function extractDate(filename, folderName) {
    const dateMatch = filename.match(/(\d{4}-\d{2}-\d{2})/) || folderName.match(/(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
        const date = new Date(dateMatch[1]);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    return 'Unknown Date';
}

// Read the posts directory
if (fs.existsSync(postsDir)) {
    const folders = fs.readdirSync(postsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    folders.forEach(folder => {
        const folderPath = path.join(postsDir, folder);
        const files = fs.readdirSync(folderPath);
        
        // Find markdown files
        const mdFiles = files.filter(file => file.endsWith('.md'));
        
        mdFiles.forEach(mdFile => {
            const filePath = path.join(folderPath, mdFile);
            const content = fs.readFileSync(filePath, 'utf8');
            
            const title = extractTitle(content);
            const date = extractDate(mdFile, folder);
            
            posts.push({
                title: title,
                date: date,
                folder: folder,
                filename: mdFile
            });
        });
    });
    
    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Write the index file
    fs.writeFileSync('posts-index.json', JSON.stringify(posts, null, 2));
    
    console.log(`Generated index with ${posts.length} posts`);
    console.log('Posts found:');
    posts.forEach(post => {
        console.log(`  - ${post.title} (${post.date})`);
    });
} else {
    console.error('Posts directory not found!');
    process.exit(1);
}
