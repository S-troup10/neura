import pusher
import spacy

# Load English NLP model
nlp = spacy.load("en_core_web_sm")


pusher_client = pusher.Pusher(
  app_id='1956553',
  key='8018b9bc86b3bc4a7fab',
  secret='3cc0d63b9fdb0ef8b78d',
  cluster='ap4',
  ssl=True
)

def send(data):
    print(data)
    #pusher_client.trigger('product', 'product-data', data)
    
def summarize_title(title, word_limit=6):
    # Process the title with spaCy
    doc = nlp(title)

    # Extract noun phrases (e.g., "Leather Shoulder Bag")
    noun_chunks = [" ".join(chunk.text.split()[:2]) for chunk in doc.noun_chunks]

    # If no noun phrases, fallback to important words
    keywords = noun_chunks if noun_chunks else [token.text for token in doc if token.pos_ in ("NOUN", "PROPN")]

    # Join only the first few keywords
    return " ".join(keywords[:word_limit])
  
  
  
  @app.route('/start_scrape', methods=['POST'])
def start_scrape():
    data = request.json
    search_term = data.get('search', '').strip()

    if not search_term:  # Prevent empty search from running
        return jsonify({"error": "Search term is required"}), 400

    # Start the Scrapy spider with the search term
    subprocess.Popen(["python", "scraper.py", search_term])

    return jsonify({"message": f"Scraping started for '{search_term}'"}), 200