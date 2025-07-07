/**
 * Simple Markdown Parser
 * Converts markdown text to HTML with support for common markdown features
 */

class MarkdownParser {
    constructor() {
        this.imageBasePath = '';
    }

    /**
     * Set the base path for resolving relative image URLs
     * @param {string} basePath - Base path for images
     */
    setImageBasePath(basePath) {
        this.imageBasePath = basePath;
    }

    /**
     * Parse markdown text to HTML
     * @param {string} text - Markdown text to parse
     * @returns {string} HTML string
     */
    parse(text) {
        if (!text) return { html: '', toc: [] };

        // Remove Jekyll front matter
        text = text.replace(/^---[\s\S]*?---\n?/, '');
        
        const toc = [];
        let idCounter = 0;

        // Process headings and create collapsible sections
        const lines = text.split('\n');
        let processedText = '';
        const openLevels = [];

        const getHeadingLevel = (line) => {
            if (line.startsWith('### ')) return 3;
            if (line.startsWith('## ')) return 2;
            if (line.startsWith('# ')) return 1;
            return 0;
        };

        const closeSections = (level) => {
            while (openLevels.length > 0 && openLevels[openLevels.length - 1] >= level) {
                processedText += '</details>\n';
                openLevels.pop();
            }
        };

        lines.forEach(line => {
            const level = getHeadingLevel(line);
            if (level > 0) {
                closeSections(level);
                const title = line.substring(level + 1).trim();
                const id = `heading-${idCounter++}`;
                toc.push({ level, text: title, id });
                processedText += `<details open><summary><h${level} id="${id}">${title}</h${level}></summary>\n`;
                openLevels.push(level);
            } else {
                processedText += line + '\n';
            }
        });

        closeSections(1); // Close all remaining open sections
        text = processedText;

        // Bold and italic (process bold+italic first to avoid conflicts)
        text = text.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Strikethrough
        text = text.replace(/~~(.*?)~~/g, '<del>$1</del>');
        
        // HTML img tags (process first)
        text = text.replace(/<img([^>]*?)src=["']([^"']+)["']([^>]*?)>/g, (match, beforeSrc, src, afterSrc) => {
            const alt = this.extractAttribute(match, 'alt') || '';
            const width = this.extractAttribute(match, 'width');
            const height = this.extractAttribute(match, 'height');
            const style = this.extractAttribute(match, 'style');
            
            let processedSrc = src;
            // Handle relative paths
            if (!src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('/')) {
                processedSrc = this.imageBasePath + src;
            }
            
            // Rebuild img tag with processed src
            let imgTag = `<img src="${processedSrc}" alt="${alt}" loading="lazy"`;
            if (width) imgTag += ` width="${width}"`;
            if (height) imgTag += ` height="${height}"`;
            if (style) imgTag += ` style="${style}"`;
            else imgTag += ` style="max-width: 100%; height: auto;"`;
            imgTag += ' />';
            
            return imgTag;
        });
        
        // Images with enhanced support (markdown syntax) - BEFORE links
        text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
            return this.processImage(alt, src);
        });
        
        // Links (process AFTER images to avoid conflicts)
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        
        // YouTube video embeds (process after links)
        text = this.processYouTubeVideos(text);
        
        // Code blocks (process before inline code)
        text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang ? ` class="language-${lang}"` : '';
            return `<pre><code${language}>${this.escapeHtml(code.trim())}</code></pre>`;
        });
        
        // Inline code
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Horizontal rules
        text = text.replace(/^---$/gm, '<hr>');
        text = text.replace(/^\*\*\*$/gm, '<hr>');
        
        // Lists (unordered)
        text = text.replace(/^\* (.*$)/gm, '<li>$1</li>');
        text = text.replace(/^- (.*$)/gm, '<li>$1</li>');
        text = text.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
        
        // Lists (ordered)
        text = text.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
        
        // Blockquotes
        text = text.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
        
        // Tables
        text = this.processTables(text);
        
        // Line breaks and paragraphs
        text = text.replace(/\n\n/g, '</p><p>');
        text = '<p>' + text + '</p>';
        
        // Clean up empty paragraphs and fix nesting
        text = text.replace(/<p><\/p>/g, '');
        text = text.replace(/<p>(<h[1-6]>.*?<\/h[1-6]>)<\/p>/g, '$1');
        text = text.replace(/<p>(<ul>.*?<\/ul>)<\/p>/gs, '$1');
        text = text.replace(/<p>(<ol>.*?<\/ol>)<\/p>/gs, '$1');
        text = text.replace(/<p>(<pre>.*?<\/pre>)<\/p>/gs, '$1');
        text = text.replace(/<p>(<blockquote>.*?<\/blockquote>)<\/p>/g, '$1');
        text = text.replace(/<p>(<hr>)<\/p>/g, '$1');
        text = text.replace(/<p>(<table>.*?<\/table>)<\/p>/gs, '$1');
        
        return { html: text, toc };
    }

    /**
     * Process image tags with enhanced support
     * @param {string} alt - Alt text
     * @param {string} src - Image source
     * @returns {string} HTML img tag
     */
    processImage(alt, src) {
        let imageSrc = src;
        
        // Handle relative paths
        if (!src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('/')) {
            imageSrc = this.imageBasePath + src;
        }
        
        // Add lazy loading and responsive attributes
        return `<img src="${imageSrc}" alt="${alt}" loading="lazy" style="max-width: 100%; height: auto;" />`;
    }

    /**
     * Process YouTube video URLs and convert them to embedded videos
     * @param {string} text - Text containing potential YouTube URLs
     * @returns {string} Text with YouTube URLs converted to embedded videos
     */
    processYouTubeVideos(text) {
        // YouTube URL patterns
        const youtubePatterns = [
            // https://www.youtube.com/watch?v=VIDEO_ID
            /https:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)(?:&[^\s]*)?/g,
            // https://youtu.be/VIDEO_ID
            /https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)(?:\?[^\s]*)?/g,
            // https://m.youtube.com/watch?v=VIDEO_ID
            /https:\/\/m\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)(?:&[^\s]*)?/g
        ];
        
        youtubePatterns.forEach(pattern => {
            text = text.replace(pattern, (match, videoId) => {
                return this.createYouTubeEmbed(videoId);
            });
        });
        
        return text;
    }

    /**
     * Create YouTube embed HTML
     * @param {string} videoId - YouTube video ID
     * @returns {string} YouTube embed HTML
     */
    createYouTubeEmbed(videoId) {
        return `<div class="youtube-embed" style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%; margin: 20px 0;">
            <iframe 
                src="https://www.youtube.com/embed/${videoId}" 
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
                allowfullscreen 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
            </iframe>
        </div>`;
    }

    /**
     * Process tables in markdown
     * @param {string} text - Text containing potential tables
     * @returns {string} Text with tables converted to HTML
     */
    processTables(text) {
        const tableRegex = /^(\|.*\|)\n(\|[-:\s]+\|)\n((?:\|.*\|\n?)*)/gm;
        
        return text.replace(tableRegex, (match, header, separator, rows) => {
            const headerCells = header.split('|').slice(1, -1).map(cell => 
                `<th>${cell.trim()}</th>`
            ).join('');
            
            const bodyRows = rows.trim().split('\n').map(row => {
                const cells = row.split('|').slice(1, -1).map(cell => 
                    `<td>${cell.trim()}</td>`
                ).join('');
                return `<tr>${cells}</tr>`;
            }).join('');
            
            return `<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
        });
    }

    /**
     * Extract attribute value from HTML tag
     * @param {string} htmlTag - HTML tag string
     * @param {string} attribute - Attribute name to extract
     * @returns {string|null} Attribute value or null if not found
     */
    extractAttribute(htmlTag, attribute) {
        const regex = new RegExp(`${attribute}=["']([^"']+)["']`, 'i');
        const match = htmlTag.match(regex);
        return match ? match[1] : null;
    }

    /**
     * Escape HTML characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Export for use in other files
window.MarkdownParser = MarkdownParser;
