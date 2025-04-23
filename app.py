from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('chatbot.html')


@app.route('/get', methods=['GET'])
def get_bot_response():
    user_input = request.args.get('msg')
    response = generate_response(user_input)
    return jsonify(str(response))


def generate_response(user_input):
    user_input = user_input.lower()

    matched_topics = []

    if "contact" in user_input or "email" in user_input or "phone" in user_input or "call" in user_input:
        matched_topics.append("contact")

    if "hello" in user_input or "hi" in user_input or "hey" in user_input:
        matched_topics.append("greeting")

    if "opening hours" in user_input or "open" in user_input:
        matched_topics.append("opening hours")

    if "location" in user_input or "address" in user_input:
        matched_topics.append("location")

    # Prioritize responses
    if "opening hours" in matched_topics:
        return (
            "Hi! Here's our list of opening hours:<br>"
            "<strong>Monday - Saturday:</strong> 10am - 10pm<br>"
            "<strong>Sunday:</strong> 10am - 8pm"
        )

    if "contact" in matched_topics:
        return "You can contact us at info@example.com or call us on 01234 567890."

    if "greeting" in matched_topics:
        return "Hey there! How can I help you today?"

    if "location" in matched_topics:
        return (
            "This is where you can find us:<br>"
            "(insert address)"
        )

    return "I'm not sure I understand — could you try rephrasing your question?"


if __name__ == '__main__':
    app.run(debug=True)











