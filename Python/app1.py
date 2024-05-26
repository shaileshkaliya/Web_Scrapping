import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

@app.route('/scrape', methods=['POST'])
@cross_origin()
def scrape():
    data = request.json
    if 'url' not in data:
        return jsonify({"error": "URL not provided"}), 400

    url = data['url']
    try:
        cleaned_text = scrape_site(url)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"cleaned_text": cleaned_text}), 200

@app.route('/proxy', methods=['POST'])
@cross_origin()
def proxy():
    data = request.json
    if 'url' not in data:
        return jsonify({"error": "URL not provided"}), 400

    url = data['url']
    try:
        response = requests.get(url)
        headers = {
            'Content-Type': response.headers.get('Content-Type'),
            'Content-Length': response.headers.get('Content-Length')
        }
        return response.content, response.status_code, headers
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


def scrape_site(url):
    # Send a GET request to the URL
    req = requests.get(url)
    
    # Log the URL and response status code
    print(f"Fetching URL: {url}")
    print(f"Response Status Code: {req.status_code}")
    
    # Check if the request was successful
    if req.status_code != 200:
        req.raise_for_status()

    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(req.content, 'html.parser')

    # Extract text from specified HTML tags
    text = ""
    for tag in soup.find_all(['h1', 'ul', 'li', 'p', 'article']):
        text += tag.get_text() + '\n'

    # Clean the text
    cleaned_text = clean_text(text)
    return cleaned_text

def clean_text(text):
    # Replace multiple whitespaces with a single space
    cleaned_text = ' '.join(text.split())

    # Remove text inside square brackets and the brackets themselves
    cleaned_text = remove_inside_square_brackets(cleaned_text)

    # Replace consecutive newline characters with a single newline
    cleaned_text = cleaned_text.replace('\n', '\n\n')

    return cleaned_text

def remove_inside_square_brackets(text):
    # Find and remove text inside square brackets
    while '[' in text:
        start_index = text.find('[')
        end_index = text.find(']', start_index)
        if end_index != -1:
            text = text[:start_index] + text[end_index + 1:]
        else:
            break
    return text

if __name__ == '__main__':
    # Run the app on all available network interfaces, accessible externally
    app.run(host='0.0.0.0', port=5000, debug=True)
