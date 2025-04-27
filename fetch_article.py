import requests
from bs4 import BeautifulSoup

def fetch_article():
    url = 'https://www.expertrecruitments.com/blog/executive-search-firms-find-top-talent'
    
    try:
        response = requests.get(url)
        if response.status_code != 200:
            print(f"Failed to retrieve the page. Status code: {response.status_code}")
            return None
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Try to find the main article content
        article = soup.find('article')
        if not article:
            # Try alternative selectors if article tag is not found
            article = soup.find('div', class_='blog-content') or \
                     soup.find('div', class_='post-content') or \
                     soup.find('div', class_='entry-content') or \
                     soup.find('main')
        
        if not article:
            print("Could not find article content")
            return None
        
        # Try to find the title
        title = soup.find('h1') or soup.find('h1', class_='post-title')
        title_text = title.text.strip() if title else "How Executive Search Firms Find Top Talent"
        
        # Try to extract the content as HTML
        content_html = str(article)
        
        # Get plain text as fallback
        content_text = article.get_text()
        
        return {
            "title": title_text,
            "html": content_html,
            "text": content_text,
            "url": url
        }
    
    except Exception as e:
        print(f"Error occurred: {e}")
        return None

if __name__ == "__main__":
    article_data = fetch_article()
    if article_data:
        print(f"Title: {article_data['title']}")
        print(f"Content length: {len(article_data['text'])} characters")
        print("-" * 50)
        print(article_data['text'][:500] + "..." if len(article_data['text']) > 500 else article_data['text'])
        
        # Save the HTML to a file
        with open("article_content.html", "w", encoding="utf-8") as f:
            f.write(article_data['html'])
        
        print("-" * 50)
        print("Full HTML content saved to article_content.html")
    else:
        print("Failed to fetch article data")