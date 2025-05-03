import trafilatura
import requests
import json
import re
import argparse
import sys
import getpass

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
            "published": False
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

def login_to_site(base_url, email, password):
    """Log in to the Expert Recruitments site and return session cookie."""
    try:
        login_url = f"{base_url}/api/login"
        response = requests.post(login_url, json={"email": email, "password": password})
        
        if response.status_code != 200:
            print(f"Login failed: {response.text}")
            return None
            
        # Get the session cookie
        cookies = response.cookies
        return cookies
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return None

def create_blog_post(base_url, cookies, blog_data):
    """Create a blog post via the API."""
    try:
        create_url = f"{base_url}/api/blog-posts"
        response = requests.post(create_url, json=blog_data, cookies=cookies)
        
        if response.status_code not in [200, 201]:
            print(f"Failed to create blog post: {response.text}")
            return False
            
        print(f"Blog post created successfully!")
        return True
        
    except Exception as e:
        print(f"Error creating blog post: {str(e)}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Extract article and post to blog')
    parser.add_argument('url', help='URL of the article to extract')
    parser.add_argument('--api', default='http://localhost:5000', help='Base URL of the API')
    parser.add_argument('--email', help='Admin email for login')
    parser.add_argument('--preview', action='store_true', help='Preview only, do not post')
    
    if len(sys.argv) == 1:
        # If no arguments are provided, show example usage
        parser.print_help()
        print("\nExample usage:")
        print("  python article_to_api.py https://example.com/article --email admin@example.com")
        return
    
    args = parser.parse_args()
    
    print(f"Extracting content from: {args.url}")
    article_data = extract_article(args.url)
    
    if not article_data:
        print("Failed to extract article content. Please try another URL.")
        return
    
    # Print preview
    print("\n============= ARTICLE PREVIEW =============")
    print(f"Title: {article_data['title']}")
    print(f"Subtitle: {article_data['subtitle']}")
    print(f"Category: {article_data['category']}")
    print(f"Slug: {article_data['slug']}")
    print(f"Read Time: {article_data['readTime']}")
    print("\nContent Preview (first 200 chars):")
    print(f"{article_data['content'][:200]}...")
    print("==========================================\n")
    
    # If preview only, stop here
    if args.preview:
        print("Preview mode - not posting to blog.")
        return
    
    # Get login credentials
    email = args.email or input("Enter admin email: ")
    password = getpass.getpass("Enter password: ")
    
    # Login
    print("Logging in...")
    cookies = login_to_site(args.api, email, password)
    if not cookies:
        return
    
    # Confirm before posting
    confirm = input("Create this blog post? (y/n): ")
    if confirm.lower() != 'y':
        print("Cancelled.")
        return
    
    # Create blog post
    success = create_blog_post(args.api, cookies, article_data)
    if success:
        print(f"Blog post '{article_data['title']}' has been created successfully.")
        print(f"You can now view and edit it in the blog management section.")

if __name__ == "__main__":
    main()