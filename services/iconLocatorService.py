import matplotlib.pyplot as plt
import skimage.io as io
from skimage.feature import match_template
from skimage.transform import resize, rescale
import numpy as np
import json
from flask import Flask, request, make_response

app = Flask(__name__)
headers = {"Content-Type": "application/json"}

# This is so that playwright can start web service
@app.route("/", methods=["GET"])
@app.route("/index.html", methods=["GET"])
def spin_up():
    
    result = { "staus": "up" }
    return make_response(json.dumps(result, indent=4), 200, headers)

# TODO: Make another endpoint to take in both screenshot and images
@app.route("/locate", methods=["POST"])
def locate_icon():
    for uploadedFile in request.files.getlist("file"):
        image = io.imread(uploadedFile)[:,:,:3]

    iconName="data/element-snaps/" + request.form.get("iconName") + ".png"

    icon = io.imread(iconName)[:,:,:3]

    imageW= image.shape[1]
    icon= rescale(icon, imageW/2048)

    new_image = rescale(image, 0.6)
    new_icon = rescale(icon, 0.6)

    result = match_template(new_image, new_icon)
    ij = np.unravel_index(np.argmax(result), result.shape)
    x, y = ij[::-1][1:]
    xr = (x + new_icon.shape[1]/2)/new_image.shape[1]
    yr = (y + new_icon.shape[0]/2)/new_image.shape[0]
    result = { "x": xr, "y": yr, "certainty": np.max(result) }
    return make_response(json.dumps(result, indent=4), 200, headers)

@app.route("/locate-fast", methods=["POST"])
def locate_icon_fast():
    try:
        threshold = float(request.form.get("threshold", 0.5))  # Default: 50% if not provided
    except ValueError:
        response_data = {"error": "Invalid threshold value. Must be a number."}
        return make_response(json.dumps(response_data, indent=4), 400, headers)

    for uploadedFile in request.files.getlist("file"):
        image = io.imread(uploadedFile)[:, :, :3]

    iconName = "data/element-snaps/" + request.form.get("iconName") + ".png"
    icon = io.imread(iconName)[:, :, :3]

    imageW = image.shape[1]
    icon = rescale(icon, imageW / 2048)

    new_image = rescale(image, 0.6)
    new_icon = rescale(icon, 0.6)

    # Perform template matching
    result = match_template(new_image, new_icon)
    max_corr = np.max(result)  # Find the maximum correlation value

    if max_corr >= threshold:
        # Locate the match coordinates
        ij = np.unravel_index(np.argmax(result), result.shape)
        x, y = ij[::-1][1:]
        xr = (x + new_icon.shape[1] / 2) / new_image.shape[1]
        yr = (y + new_icon.shape[0] / 2) / new_image.shape[0]
        result = { "x": xr, "y": yr, "certainty": np.max(result) }
        return make_response(json.dumps(result, indent=4), 200, headers)

    # If no match exceeds the threshold
    response_data = {"error": f"No match found with certainty >= {threshold * 100:.1f}%"}
    return make_response(json.dumps(response_data, indent=4), 404, headers)


if __name__ == "__main__":
    app.run(port=5000)