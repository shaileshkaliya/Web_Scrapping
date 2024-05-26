import json
from flask import Flask, request, jsonify
import boto3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire application

dynamodb = boto3.resource('dynamodb')
table_name = "table"

def get_latest_data_id():
    table = dynamodb.Table(table_name)
    
    # Perform a scan operation to retrieve all items
    response = table.scan(
        Limit=1  # Limit to retrieve only one item
    )

    # Extract the ID of the latest inserted item
    latest_item = response.get('Items', [])
    if latest_item:
        latest_id = latest_item[0]['id']
        return latest_id
    else:
        return 0

@app.route('/insert_data', methods=['POST'])
def insert_data():
    try:
        data = request.get_json()

        # Generate next primary key
        next_primary_key = get_latest_data_id()

        # Prepare item for DynamoDB
        item = {
            "id": next_primary_key + 1,
            "tokens": data.get("tokens", []),
            "pos_tags": {
                "determiners": data["pos_tags"].get("determiners", []),
                "nouns": data["pos_tags"].get("nouns", []),
                "verbs": data["pos_tags"].get("verbs", []),
                "prepositions": data["pos_tags"].get("prepositions", []),
                "pronouns": data["pos_tags"].get("pronouns", [])
            },
            "grammar": data.get("grammar", "Not Available"),
            "encoded_text": data.get("encoded_text", "Not Available"),
            "decoded_text": data.get("decoded_text", "Not Available"),
            "is_same_text": data.get("is_same_text", False),
            "word_freq_dist": {item[0]: item[1] for item in data.get("word_freq_dist", [])}
        }

        # Save data to DynamoDB
        table = dynamodb.Table(table_name)
        table.put_item(Item=item)

        response = {"message": "Data inserted successfully"}
        
        return jsonify(response), 200

    except Exception as e:
        response = {"error_message": str(e)}
        return jsonify(response), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
