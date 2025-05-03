import trafilatura
import json
import re
from flask import Flask, request, render_template_string, jsonify, session
import argparse
import secrets
import requests

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

HTML_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <title>Article to Blog Converter</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            display: flex;
            gap: 20px;
        }
        .input-section {
            flex: 1;
        }
        .output-section {
            flex: 1;
        }
        h1 {
            color: #333;
        }
        label {
            display: block;
            margin-top: 10px;
            font-weight: bold;
        }
        input[type="text"], textarea {
            width: 100%;
            padding: 8px;
            margin-top: 5px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        textarea {
            min-height: 300px;
            font-family: monospace;
        }
        button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
        }
        button:hover {
            background-color: #45a049;
        }
        .card {
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 15px;
            margin-top: 15px;
            background-color: #f9f9f9;
        }
        .error {
            color: red;
            font-weight: bold;
        }
        .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 2s linear infinite;
            margin: 20px auto;
            display: none;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .copy-button {
            background-color: #008CBA;
            margin-left: 10px;
        }
        .success-message {
            color: green;
            display: none;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <h1>Article to Blog Converter</h1>
    <p>This tool helps you convert online articles into blog posts for the Expert Recruitments blog creator.</p>
    
    <div class="container">
        <div class="input-section">
            <div class="card">
                <h2>Input</h2>
                <label for="url">Article URL:</label>
                <input type="text" id="url" name="url" placeholder="https://example.com/article">
                
                <button id="extract-button" onclick="extractArticle()">Extract Article</button>
                <div id="loader" class="loader"></div>
                <div id="error-message" class="error"></div>
                
                <div id="success-message" class="success-message">
                    Content extracted successfully! ✓
                </div>
            </div>
        </div>
        
        <div class="output-section">
            <div class="card">
                <h2>Blog Post Data</h2>
                
                <label for="title">Title:</label>
                <input type="text" id="title" name="title">
                
                <label for="subtitle">Subtitle:</label>
                <input type="text" id="subtitle" name="subtitle">
                
                <label for="category">Category:</label>
                <input type="text" id="category" name="category" value="Career Insights">
                
                <label for="slug">Slug:</label>
                <input type="text" id="slug" name="slug">
                
                <label for="readTime">Read Time:</label>
                <input type="text" id="readTime" name="readTime">
            </div>
            
            <div class="card">
                <h2>Content:</h2>
                <textarea id="content" name="content" placeholder="Article content will appear here"></textarea>
                <button onclick="copyContent('content')" class="copy-button">Copy Content</button>
            </div>
            
            <div class="card">
                <h2>Admin Login (Optional)</h2>
                <p>Login to post directly to your blog:</p>
                
                <label for="base_url">Site URL:</label>
                <input type="text" id="base_url" name="base_url" value="http://localhost:3000" placeholder="http://localhost:3000">
                
                <label for="email">Admin Email:</label>
                <input type="text" id="email" name="email" placeholder="admin@example.com">
                
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" placeholder="••••••••">
                
                <button onclick="createBlogPost()" class="create-button" style="background-color: #ff6f00; width: 100%; margin-top: 15px;">Create Blog Post</button>
                <div id="create-status" class="status-message"></div>
            </div>
        </div>
    </div>
    
    <script>
        function extractArticle() {
            const url = document.getElementById('url').value;
            if (!url) {
                document.getElementById('error-message').textContent = "Please enter a URL";
                return;
            }
            
            document.getElementById('loader').style.display = 'block';
            document.getElementById('error-message').textContent = '';
            document.getElementById('success-message').style.display = 'none';
            
            fetch('/extract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url }),
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('loader').style.display = 'none';
                
                if (data.error) {
                    document.getElementById('error-message').textContent = data.error;
                    return;
                }
                
                document.getElementById('title').value = data.title || '';
                document.getElementById('subtitle').value = data.subtitle || '';
                document.getElementById('category').value = data.category || 'Career Insights';
                document.getElementById('slug').value = data.slug || '';
                document.getElementById('readTime').value = data.readTime || '';
                document.getElementById('content').value = data.content || '';
                
                document.getElementById('success-message').style.display = 'block';
            })
            .catch(error => {
                document.getElementById('loader').style.display = 'none';
                document.getElementById('error-message').textContent = "Error extracting article: " + error.message;
            });
        }
        
        function copyContent(elementId) {
            const copyText = document.getElementById(elementId);
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            document.execCommand("copy");
            
            // Show brief "copied" message
            const originalText = "Copy Content";
            const copyButton = document.querySelector(".copy-button");
            copyButton.textContent = "Copied! ✓";
            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 2000);
        }
        
        function createBlogPost() {
            // Get admin credentials
            const baseUrl = document.getElementById('base_url').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Get blog data
            const blogData = {
                title: document.getElementById('title').value,
                subtitle: document.getElementById('subtitle').value,
                content: document.getElementById('content').value,
                slug: document.getElementById('slug').value,
                category: document.getElementById('category').value,
                readTime: document.getElementById('readTime').value,
                published: true  // Set to published by default
            };
            
            // Validate inputs
            if (!blogData.title || !blogData.content) {
                updateStatus('Please make sure title and content are filled', 'error');
                return;
            }
            
            if (!email || !password) {
                updateStatus('Admin email and password are required', 'error');
                return;
            }
            
            // Show loading state
            const button = document.querySelector('.create-button');
            const originalText = button.textContent;
            button.textContent = 'Creating...';
            button.disabled = true;
            
            // First, login
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ baseUrl, email, password }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Login failed. Please check your credentials.');
                }
                return response.json();
            })
            .then(data => {
                // Now create the blog post
                return fetch('/api/create-blog', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ blogData, baseUrl }),
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to create blog post.');
                }
                return response.json();
            })
            .then(data => {
                updateStatus('Blog post created successfully! ✓', 'success');
                // Reset button
                button.textContent = originalText;
                button.disabled = false;
            })
            .catch(error => {
                updateStatus('Error: ' + error.message, 'error');
                // Reset button
                button.textContent = originalText;
                button.disabled = false;
            });
        }
        
        function updateStatus(message, type) {
            const statusElement = document.getElementById('create-status');
            statusElement.textContent = message;
            statusElement.style.display = 'block';
            
            if (type === 'error') {
                statusElement.style.color = 'red';
            } else if (type === 'success') {
                statusElement.style.color = 'green';
            } else {
                statusElement.style.color = 'black';
            }
            
            // Clear after 5 seconds
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 5000);
        }
    </script>
</body>
</html>
'''

def extract_article(url):
    """Extract content from a URL and format it for blog creation."""
    try:
        # Download the webpage content
        downloaded = trafilatura.fetch_url(url)
        
        if not downloaded:
            return {"error": f"Failed to download content from {url}"}
        
        # Extract the main content with formatting
        extracted = trafilatura.extract(downloaded, 
                                      include_links=True,
                                      include_images=True, 
                                      include_formatting=True,
                                      output_format="xml")
        
        if not extracted:
            return {"error": f"Failed to extract meaningful content from {url}"}
        
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
        }
        
    except Exception as e:
        return {"error": f"Error: {str(e)}"}

@app.route('/')
def home():
    return render_template_string(HTML_TEMPLATE)

@app.route('/extract', methods=['POST'])
def extract():
    data = request.get_json()
    url = data.get('url', '')
    
    if not url:
        return jsonify({"error": "No URL provided"})
    
    result = extract_article(url)
    return jsonify(result)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Web interface for extracting articles for blog creation')
    parser.add_argument('--port', type=int, default=5500, help='Port to run the server on')
    args = parser.parse_args()
    
    print(f"Starting web server on port {args.port}")
    print(f"Open your browser and navigate to http://localhost:{args.port}/")
    app.run(host='0.0.0.0', port=args.port)