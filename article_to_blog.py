import trafilatura
import json
import re
import argparse
from datetime import datetime
import sys

def extract_article(url):
    """Extract content from a URL and format it for blog creation."""
    try:
        # Download the webpage content
        downloaded = trafilatura.fetch_url(url)
        
        if not downloaded:
            print(f"Failed to download content from {url}")
            return None
        
        # Extract the main content with formatting
        extracted = trafilatura.extract(downloaded, 
                                      include_links=True,
                                      include_images=True, 
                                      include_formatting=True,
                                      output_format="xml")
        
        if not extracted:
            print(f"Failed to extract meaningful content from {url}")
            return None
        
        # Extract title
        title_match = re.search(r'<title>(.*?)</title>', extracted, re.DOTALL)
        title = title_match.group(1) if title_match else "Untitled Article"
        
        # Extract paragraphs
        paragraphs = re.findall(r'<p>(.*?)</p>', extracted, re.DOTALL)
        
        # Extract headings for potential subtitle
        headings = re.findall(r'<head[1-3]>(.*?)</head[1-3]>', extracted, re.DOTALL)
        
        # Choose subtitle from first heading or first paragraph
        subtitle = headings[0] if headings else (paragraphs[0] if paragraphs else "")
        if len(subtitle) > 120:  # If too long, truncate
            subtitle = subtitle[:117] + "..."
        
        # Generate slug from title
        slug = title.lower().replace(' ', '-')
        # Remove special characters
        slug = re.sub(r'[^a-z0-9\-]', '', slug)
        # Remove multiple hyphens
        slug = re.sub(r'-+', '-', slug)
        
        # Build content - join paragraphs with double newlines
        content = "\n\n".join([p.strip() for p in paragraphs if p.strip()])
        
        # Calculate approximate read time (average reading speed: 200 words per minute)
        word_count = len(content.split())
        read_time = max(1, round(word_count / (200)))
        
        return {
            "title": title,
            "subtitle": subtitle,
            "content": content,
            "slug": slug,
            "category": "Career Insights",  # Default category
            "readTime": f"{read_time} min read",
            "bannerImage": "",  # You'll need to add this manually
            "published": False  # Default to unpublished
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

def print_formatted_output(article_data):
    """Print the article data in a formatted way that's easy to copy-paste."""
    print("\n" + "="*50)
    print(" ARTICLE EXTRACTED SUCCESSFULLY ")
    print("="*50 + "\n")
    
    print(f"TITLE: {article_data['title']}")
    print(f"SUBTITLE: {article_data['subtitle']}")
    print(f"CATEGORY: {article_data['category']}")
    print(f"SLUG: {article_data['slug']}")
    print(f"READ TIME: {article_data['readTime']}")
    
    print("\n" + "-"*50)
    print(" CONTENT (Copy and paste into your blog editor)")
    print("-"*50 + "\n")
    
    print(article_data['content'])
    
    print("\n" + "="*50)
    print(" END OF ARTICLE ")
    print("="*50 + "\n")
    
    print("Instructions:")
    print("1. Copy the content section and paste it into your blog editor")
    print("2. Fill in the title, subtitle, and other fields")
    print("3. Add a banner image")
    print("4. Review and publish when ready")

def main():
    parser = argparse.ArgumentParser(description='Extract article content for blog creation')
    parser.add_argument('url', help='URL of the article to extract')
    parser.add_argument('--output', '-o', help='Output file for JSON data (optional)')
    
    if len(sys.argv) == 1:
        # If no arguments are provided, show example usage
        parser.print_help()
        print("\nExample usage:")
        print("  python article_to_blog.py https://example.com/article")
        return
    
    args = parser.parse_args()
    
    print(f"Extracting content from: {args.url}")
    article_data = extract_article(args.url)
    
    if not article_data:
        print("Failed to extract article content. Please try another URL or check your connection.")
        return
    
    # Print formatted output for copy-pasting
    print_formatted_output(article_data)
    
    # Save to file if output path was specified
    if args.output:
        with open(args.output, 'w') as f:
            json.dump(article_data, f, indent=2)
        print(f"Article data saved to {args.output}")

if __name__ == "__main__":
    main()