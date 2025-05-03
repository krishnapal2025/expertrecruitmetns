# Article to Blog Tools

This collection of tools helps you convert articles from websites into blog posts for the Expert Recruitments blog creator.

## Quick Start

The easiest way to use these tools is with the web interface:

```bash
python article_web_converter.py
```

Then open your browser to http://localhost:5500/

## Available Tools

### 1. Web Interface (Recommended)

The web interface provides an easy-to-use GUI for extracting articles and copying content.

```bash
python article_web_converter.py --port 5500
```

### 2. Command-Line Tools

#### Basic Extractor

For simple extraction to the console:

```bash
python article_to_blog.py https://example.com/article
```

#### Direct API Integration

For posting directly to the blog API (requires admin credentials):

```bash
python article_to_api.py https://example.com/article --email admin@example.com
```

Options:
- `--preview`: Show a preview without posting to the blog
- `--api`: Specify a different API URL (default: http://localhost:5000)

## How It Works

1. The tools use the Trafilatura library to extract clean, readable content from web pages
2. The content is formatted to work with your blog post creator
3. You can either:
   - Copy and paste the content into the blog creator form
   - Post directly to the API (with article_to_api.py)

## Tips for Best Results

- Choose articles with clear, well-structured content
- Review and edit the extracted content before posting
- Add a banner image (not automatically extracted)
- Check formatting and adjust as needed

## Requirements

- Python 3.6+
- trafilatura
- flask (for web interface)
- requests (for API integration)