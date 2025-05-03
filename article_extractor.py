import trafilatura
import json
import sys
import re
from datetime import datetime

def get_article_content(url):
    """
    Extract content from a URL using trafilatura.
    Returns a dictionary with title, content, and other metadata.
    """
    try:
        # Download the webpage content
        downloaded = trafilatura.fetch_url(url)
        
        if not downloaded:
            return {"error": f"Failed to download content from {url}"}
        
        # Extract the main content
        extracted = trafilatura.extract(downloaded, include_links=True, 
                                       include_images=True, 
                                       include_formatting=True,
                                       output_format="xml")
        
        if not extracted:
            return {"error": f"Failed to extract content from {url}"}
        
        # Process the XML to get title and content
        # Extract title
        title_match = re.search(r'<title>(.*?)</title>', extracted, re.DOTALL)
        title = title_match.group(1) if title_match else "Untitled Article"
        
        # Extract paragraphs and headings
        content = []
        
        # Extract headings (h1, h2, h3)
        headings = re.findall(r'<head[1-3]>(.*?)</head[1-3]>', extracted, re.DOTALL)
        
        # Extract paragraphs
        paragraphs = re.findall(r'<p>(.*?)</p>', extracted, re.DOTALL)
        
        # Combine them with proper order
        for p in paragraphs:
            # Clean up HTML entities and extra spaces
            cleaned_p = p.strip()
            if cleaned_p:
                content.append({"type": "paragraph", "content": cleaned_p})
        
        # Generate a slug from the title
        slug = title.lower().replace(' ', '-')
        # Remove special characters
        slug = re.sub(r'[^a-z0-9\-]', '', slug)
        # Remove multiple hyphens
        slug = re.sub(r'-+', '-', slug)
        
        # Extract potential subtitle (first paragraph or first heading)
        subtitle = paragraphs[0] if paragraphs else ""
        if len(subtitle) > 120:  # If too long, truncate
            subtitle = subtitle[:117] + "..."
            
        # Create blog post data in the expected format
        blog_data = {
            "title": title,
            "subtitle": subtitle,
            "content": "\n\n".join([p["content"] for p in content]),
            "slug": slug,
            "category": "Career Insights",  # Default category
            "readTime": f"{max(3, len(''.join([p['content'] for p in content])) // 1000)} min read"
        }
        
        return blog_data
        
    except Exception as e:
        return {"error": f"Error extracting content: {str(e)}"}

def main():
    if len(sys.argv) < 2:
        print("Usage: python article_extractor.py <url>")
        return
    
    url = sys.argv[1]
    result = get_article_content(url)
    
    if "error" in result:
        print(f"Error: {result['error']}")
    else:
        print(json.dumps(result, indent=2))
        print("\n======= COPY THE CONTENT BELOW FOR BLOG CREATOR =======\n")
        print(f"Title: {result['title']}")
        print(f"Subtitle: {result['subtitle']}")
        print(f"Category: {result['category']}")
        print(f"Slug: {result['slug']}")
        print("\nContent:")
        print(result['content'])

if __name__ == "__main__":
    main()