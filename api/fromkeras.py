from keras.models import load_model  # TensorFlow is required for Keras to work
import cv2  # Install opencv-python
import numpy as np

def my_custom_DepthwiseConv2D(config, **kwargs):
    # Extract relevant parameters from config (assuming you know the structure)
    kernel_size = config['kernel_size']
    strides = config['strides']
    padding = config['padding']
    data_format = config['data_format']
    dilation_rate = config['dilation_rate']
    activation = config['activation']
    use_bias = config['use_bias']
    # ... (extract other relevant parameters)

    # Handle groups argument (if present in kwargs)
    groups = kwargs.pop('groups', 1)  # Default groups to 1 if not provided

    # Create a SeparableConv2D layer to mimic DepthwiseConv2D behavior
    x = SeparableConv2D(filters=config['filters'],
                         kernel_size=kernel_size,
                         strides=strides,
                         padding=padding,
                         data_format=data_format,
                         dilation_rate=dilation_rate,
                         depth_multiplier=groups,  # Set depth_multiplier to groups
                         activation=activation,
                         use_bias=use_bias,
                         **kwargs)  # Pass remaining kwargs
    return x

# Disable scientific notation for clarity
np.set_printoptions(suppress=True)

# Load the model

# Load the model configuration
config = load_model("keras_model.h5", compile=False)  # Load without compiling

# Pass the configuration to your custom function
model = load_model("keras_model.h5", compile=False, custom_objects=custom_objects)
custom_objects={'DepthwiseConv2D': my_custom_DepthwiseConv2D(config=config)})  # Pass config


# Load the labels
class_names = open("labels.txt", "r").readlines()

# CAMERA can be 0 or 1 based on default camera of your computer
camera = cv2.VideoCapture(0)

while True:
    # Grab the webcamera's image.
    ret, image = camera.read()

    # Resize the raw image into (224-height,224-width) pixels
    image = cv2.resize(image, (224, 224), interpolation=cv2.INTER_AREA)

    # Show the image in a window
    cv2.imshow("Webcam Image", image)

    # Make the image a numpy array and reshape it to the models input shape.
    image = np.asarray(image, dtype=np.float32).reshape(1, 224, 224, 3)

    # Normalize the image array
    image = (image / 127.5) - 1

    # Predicts the model
    prediction = model.predict(image)
    index = np.argmax(prediction)
    class_name = class_names[index]
    confidence_score = prediction[0][index]

    # Print prediction and confidence score
    print("Class:", class_name[2:], end="")
    print("Confidence Score:", str(np.round(confidence_score * 100))[:-2], "%")

    # Listen to the keyboard for presses.
    keyboard_input = cv2.waitKey(1)

    # 27 is the ASCII for the esc key on your keyboard.
    if keyboard_input == 27:
        break

camera.release()
cv2.destroyAllWindows()