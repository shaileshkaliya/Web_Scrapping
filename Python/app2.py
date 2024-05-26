import nltk
from nltk.tokenize import word_tokenize
from nltk import CFG
from nltk.corpus import stopwords
import string
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('stopwords')

def tokenize_text(text):
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [token for token in tokens if token.lower() not in stop_words and token not in string.punctuation]
    return filtered_tokens

def pos_tags(tokens):
    pos_tags = nltk.pos_tag(tokens)
    determiners = []
    nouns = []
    verbs = []
    prepositions = []
    pronouns = []

    for token, pos_tag in pos_tags:
        if pos_tag.startswith('DT'):
            determiners.append(token.lower())
        elif pos_tag.startswith('NN'):
            nouns.append(token.lower())
        elif pos_tag.startswith('VB'):
            verbs.append(token.lower())
        elif pos_tag.startswith('IN'):
            prepositions.append(token.lower())
        elif pos_tag.startswith('PRP'):
            pronouns.append(token.lower())
    determiners = sorted(set(determiners))
    nouns = sorted(set(nouns))
    verbs = sorted(set(verbs))
    prepositions = sorted(set(prepositions))
    pronouns = sorted(set(pronouns))

    return determiners, nouns, verbs, prepositions, pronouns

def generate_grammar(determiners, nouns, verbs, prepositions):
    grammar_rules = ""

    for det in determiners:
        for noun in nouns:
            det = det.replace("'", "")
            noun = noun.replace("'", "")
            grammar_rules += f"NP -> '{det}' '{noun}'\n"

    for verb in verbs:
        for noun in nouns:
            verb = verb.replace("'", "")
            noun = noun.replace("'", "")
            grammar_rules += f"VP -> '{verb}' 'NP'\n"

        for prep in prepositions:
            for noun in nouns:
                prep = prep.replace("'", "")
                noun = noun.replace("'", "")
                grammar_rules += f"PP -> '{prep}' 'NP'\n"

    for word in determiners + nouns + verbs + prepositions:
        if word.isalpha():
            word = word.replace("'", "")
            grammar_rules += f"{word.upper()} -> '{word}'\n"

    grammar_rules += "S -> NP VP\n"

    grammar = CFG.fromstring(grammar_rules)
    return grammar

def encode_decode_text(text):
    encoded_text = text.encode('utf-8')
    decoded_text = encoded_text.decode('utf-8')
    return encoded_text, decoded_text, text == decoded_text

def analyze_frequency_distribution(tokens):
    word_freq_dist = nltk.FreqDist(tokens)
    most_common = word_freq_dist.most_common(20)
    return most_common

@app.route('/process_data', methods=['POST'])
def process_data():
    data = request.json
    text = data['text']

    # Tokenize text
    tokens = tokenize_text(text)

    # Perform POS tagging
    determiners, nouns, verbs, prepositions, pronouns = pos_tags(tokens)

    # Generate grammar
    grammar = generate_grammar(determiners, nouns, verbs, prepositions)

    # Encode and decode text
    encoded_text, decoded_text, is_same_text = encode_decode_text(text)

    # Analyze frequency distribution
    word_freq_dist = analyze_frequency_distribution(tokens)

    # Prepare response
    response = {
        "tokens": tokens,
        "pos_tags": {
            "determiners": determiners,
            "nouns": nouns,
            "verbs": verbs,
            "prepositions": prepositions,
            "pronouns": pronouns
        },
        "grammar": str(grammar),
        "encoded_text": encoded_text.decode('utf-8'),
        "decoded_text": decoded_text,
        "is_same_text": is_same_text,
        "word_freq_dist": word_freq_dist
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
