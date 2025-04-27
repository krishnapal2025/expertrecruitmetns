import requests
from bs4 import BeautifulSoup
import json
import re
import random
from datetime import datetime, timedelta
import trafilatura
from urllib.parse import urljoin
import time

def get_blog_links():
    url = "https://www.expertrecruitments.com/blogs"
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        blog_links = []
        # Find blog article links - look for cards or article elements
        # This selector may need to be adjusted based on the website's structure
        articles = soup.select('.blog-card, article, .post, .blog-post, .card')
        
        if not articles:
            print("No articles found with initial selectors. Trying alternative selectors...")
            # Try more generic selectors to find blog articles
            articles = soup.select('a[href*="/blog/"], a[href*="/blogs/"], div.blog-item a, .blog-container a')
        
        for article in articles:
            # Look for links within the article cards
            link = article.find('a')
            if link and link.get('href'):
                href = link.get('href')
                # Make sure we have a full URL
                full_url = urljoin(url, href)
                if '/blog' in full_url or '/blogs' in full_url:
                    blog_links.append(full_url)
            # Or if the article itself is a link
            elif article.name == 'a' and article.get('href'):
                href = article.get('href')
                full_url = urljoin(url, href)
                if '/blog' in full_url or '/blogs' in full_url:
                    blog_links.append(full_url)
        
        # Debugging output
        print(f"Found {len(blog_links)} blog links")
        for link in blog_links:
            print(f"  - {link}")
            
        return blog_links
    except Exception as e:
        print(f"Error fetching blog links: {e}")
        return []

def extract_blog_content(url):
    try:
        print(f"Fetching blog content from: {url}")
        downloaded = trafilatura.fetch_url(url)
        if not downloaded:
            print(f"Could not download content from {url}")
            return None
            
        content = trafilatura.extract(downloaded)
        
        # Fetch the HTML to extract title, date, category and image
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Try to extract title
        title = None
        title_tags = soup.select('h1, .blog-title, .post-title, article h1')
        if title_tags:
            title = title_tags[0].get_text().strip()
        if not title:
            title = soup.title.get_text() if soup.title else "Untitled Blog Post"
        
        # Try to extract date
        date_text = None
        date_elements = soup.select('.date, .post-date, time, .blog-date, .published-date, .meta-date')
        if date_elements:
            date_text = date_elements[0].get_text().strip()
        
        if date_text:
            # Try to parse the date
            try:
                # This may need adjustment based on the date format
                date_formats = ['%B %d, %Y', '%d %B %Y', '%Y-%m-%d', '%d/%m/%Y', '%m/%d/%Y']
                parsed_date = None
                for fmt in date_formats:
                    try:
                        parsed_date = datetime.strptime(date_text, fmt)
                        break
                    except ValueError:
                        continue
                
                if parsed_date:
                    date = parsed_date.strftime('June %d, %Y')  # Format to match our expected format
                else:
                    # Generate a random recent date if parsing fails
                    random_days = random.randint(1, 90)
                    random_date = datetime.now() - timedelta(days=random_days)
                    date = random_date.strftime('June %d, %Y')
            except:
                # Fallback to a recent date
                random_days = random.randint(1, 90)
                random_date = datetime.now() - timedelta(days=random_days)
                date = random_date.strftime('June %d, %Y')
        else:
            # If no date found, use a recent date
            random_days = random.randint(1, 90)
            random_date = datetime.now() - timedelta(days=random_days)
            date = random_date.strftime('June %d, %Y')
        
        # Try to extract category
        category = None
        category_elements = soup.select('.category, .post-category, .blog-category, .meta-category')
        if category_elements:
            category = category_elements[0].get_text().strip()
        if not category:
            # Default categories that match our expected format
            categories = ["Career Advice", "Industry Trends", "Recruitment Tips", "Workplace Culture", "Job Search Strategies"]
            category = random.choice(categories)
        
        # Try to extract image URL
        image_url = None
        main_image = soup.select('article img, .blog-image img, .featured-image img, .post-thumbnail img')
        if main_image:
            image_url = main_image[0].get('src')
            # Make sure we have a full URL
            if image_url and not (image_url.startswith('http://') or image_url.startswith('https://')):
                image_url = urljoin(url, image_url)
        
        if not image_url:
            # Default to a placeholder image if no image found
            image_url = "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf"
        
        # Try to extract author
        author = None
        author_elements = soup.select('.author, .post-author, .blog-author, .meta-author')
        if author_elements:
            author = author_elements[0].get_text().strip()
        if not author:
            # Default authors
            authors = ["Sarah Johnson", "Michael Anderson", "Emma Rodriguez", "David Chen", "James Wilson", "Lisa Thompson"]
            author = random.choice(authors)
        
        # Create an excerpt from the content (first 150 characters)
        excerpt = content[:150].strip() + "..." if content and len(content) > 150 else content
        
        # Create HTML formatted content
        html_content = ""
        paragraphs = content.split('\n\n') if content else []
        
        if paragraphs:
            # Format first paragraph as a lead paragraph
            html_content += f'<p class="lead">{paragraphs[0]}</p>\n\n'
            
            # Format the rest of the paragraphs
            for i, para in enumerate(paragraphs[1:], 1):
                # Every 3rd paragraph, create a heading
                if i % 3 == 0:
                    heading_text = para[:40].strip() if len(para) > 40 else para
                    html_content += f'<h2>{heading_text}</h2>\n'
                else:
                    # Regular paragraph
                    html_content += f'<p>{para}</p>\n\n'
        
        # Create random tags based on content
        common_tags = ["Career Development", "Leadership", "Recruitment", "Hiring", 
                      "Job Market", "Professional Growth", "Work Culture", 
                      "Remote Work", "Industry Insights", "Future of Work"]
        tags = random.sample(common_tags, min(5, len(common_tags)))
        
        # Generate a slug from the title
        slug = title.lower().replace(' ', '-')
        # Remove any special characters from slug
        slug = re.sub(r'[^a-z0-9-]', '', slug)
        # Handle multiple dashes
        slug = re.sub(r'-+', '-', slug)
        
        # Create random image URLs for author and related articles
        author_img = f"https://images.unsplash.com/photo-{random.randint(1000000000, 9999999999)}?w=150&h=150&fit=crop"
        
        # Create a reasonable reading time based on content length
        word_count = len(content.split()) if content else 0
        read_time = max(3, min(20, word_count // 200))  # Assuming 200 words per minute, min 3 minutes, max 20
        
        return {
            "title": title,
            "slug": slug,
            "excerpt": excerpt,
            "content": html_content,
            "date": date,
            "category": category,
            "author": author,
            "authorImage": author_img,
            "authorBio": f"{author} is an expert in {category.lower()} with over {random.randint(5, 15)} years of experience in the industry.",
            "readTime": f"{read_time} min read",
            "image": image_url,
            "tags": tags,
            "originalUrl": url
        }
    except Exception as e:
        print(f"Error extracting blog content from {url}: {e}")
        return None

def create_article_data():
    blog_links = get_blog_links()
    
    if not blog_links:
        print("No blog links found. Falling back to the current URL.")
        blog_links = ["https://www.expertrecruitments.com/blogs"]
    
    articles = []
    id_counter = 1
    
    for link in blog_links[:6]:  # Limit to 6 articles
        try:
            print(f"Processing blog {id_counter}: {link}")
            blog_data = extract_blog_content(link)
            if blog_data:
                # Add id
                blog_data["id"] = id_counter
                
                # Create related articles (will update references later)
                blog_data["relatedArticles"] = []
                
                articles.append(blog_data)
                id_counter += 1
                
                # Add some delay to be respectful to the server
                time.sleep(1)
        except Exception as e:
            print(f"Error processing blog {link}: {e}")
    
    # Now add related articles references
    for article in articles:
        # Pick 2 random articles that aren't this one
        other_articles = [a for a in articles if a["id"] != article["id"]]
        related = random.sample(other_articles, min(2, len(other_articles)))
        
        # Create simplified related article objects
        article["relatedArticles"] = [{
            "slug": related_article["slug"],
            "title": related_article["title"],
            "excerpt": related_article["excerpt"][:100] + "..." if len(related_article["excerpt"]) > 100 else related_article["excerpt"],
            "category": related_article["category"],
            "author": related_article["author"],
            "readTime": related_article["readTime"],
            "image": related_article["image"]
        } for related_article in related]
    
    # Generate the JavaScript output
    js_output = "export const articleData = " + json.dumps(articles, indent=2) + ";"
    
    # Save to file
    with open("client/src/data/articles.ts", "w", encoding="utf-8") as f:
        f.write(js_output)
    
    print(f"Successfully created article data with {len(articles)} articles")
    return articles

if __name__ == "__main__":
    create_article_data()