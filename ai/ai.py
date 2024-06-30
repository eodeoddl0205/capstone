from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import numpy as np
import tensorflow as tf
from keras._tf_keras.keras.preprocessing import image
from keras._tf_keras.keras.applications.mobilenet_v2 import preprocess_input
import keras._tf_keras.keras as keras
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://34.27.8.184", "https://localhost:8000"]}})

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

model = keras.models.load_model('logo_classifier.h5')

with open('class_indices.json', 'r') as f:
    class_indices = json.load(f)
index_to_class = {v: k for k, v in class_indices.items()}

def save_file(file, filename):
    data = file.read()
    with open(filename, 'wb') as f:
        f.write(data)

def predict_image(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.
    
    predictions = model.predict(img_array)
    return predictions


@app.route('/ai', methods=['POST'])
def predict():
    if request.method == 'POST':
        if 'image' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        file = request.files['image']

        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        if file:
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            save_file(file, filepath)

            try:
                predictions = predict_image(filepath)
                a = []
                b = []
                for idx, prob in enumerate(predictions[0]):
                    a.append(prob)
                    b.append(index_to_class[idx])
                for i in range(len(a)):
                    a[i] = float(a[i])
                A = a[:]
                a.sort(reverse=True)
                result = b[A.index(a[0])]
            finally:
                if os.path.exists(filepath):
                    os.remove(filepath)
        
        return jsonify({"result": result, "predictions": str(predictions)}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)