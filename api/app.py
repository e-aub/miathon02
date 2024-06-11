from keras.models import load_model  # TensorFlow is required for Keras to work
from PIL import Image, ImageOps  # Install pillow instead of PIL
import numpy as np
from flask import Flask, request, jsonify

# Disable scientific notation for clarity
np.set_printoptions(suppress=False)

# Load the model
model = load_model("keras_model.h5", compile=False)

# Load the labels
class_names = open("labels.txt", "r").readlines()

# Create the array of the right shape to feed into the keras model
# The 'length' or number of images you can put into the array is
# determined by the first position in the shape tuple, in this case 1
data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)

# Function to pre-process image
def preprocess_image(image):
    # resizing the image to be at least 224x224 and then cropping from the center
    size = (224, 224)
    image = ImageOps.fit(image, size, Image.Resampling.LANCZOS)
    # turn the image into a numpy array
    image_array = np.asarray(image)
    # Normalize the image
    normalized_image_array = (image_array.astype(np.float32) / 127.5) - 1
    return normalized_image_array


def classify_image(normalized_image_array):
    # Load the image into the array
    data[0] = normalized_image_array
    # Predicts the model
    prediction = model.predict(data)
    index = np.argmax(prediction)
    class_name = class_names[index]
    confidence_score = prediction[0][index]
    return {"class": class_name[2:], "confidence": confidence_score}

# Flask app initialization
app = Flask(__name__)

@app.route("/classification", methods=["POST"])
def handle_image_upload():
  # Check if image data is present
  if "image" not in request.files:
    return jsonify({"error": "No image uploaded"}), 400

  # Get image data
  image_file = request.files["image"]
  image_bytes = image_file.read()
  image = preprocess_image(image_bytes)

  # Classify image
  try:
    classification_data = classify_image(image)
    return jsonify(classification_data), 200
  except Exception as e:
    return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
  app.run(port=3000)  # Change host and port as needed



