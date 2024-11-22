import matplotlib.pyplot as plt
import skimage.io as io
from skimage.feature import match_template
from skimage.transform import resize, rescale
import numpy as np
import json
from flask import Flask, request, make_response

app = Flask(__name__)
    
@app.route("/locate", methods=["POST"])
def locate_icon():
    headers = {"Content-Type": "application/json"}
    for uploadedFile in request.files.getlist("file"):
        image = io.imread(uploadedFile)[:,:,:3]

    iconName="data/element-snaps/" + request.form.get("iconName") + ".png"

    icon = io.imread(iconName)[:,:,:3] # Ikonica (samo prva tri kanala jer ima 4)

    imageW= image.shape[1]
    icon= rescale(icon, imageW/2048)

    new_image = rescale(image, 0.6)
    new_icon = rescale(icon, 0.6)

    result = match_template(new_image, new_icon)
    ij = np.unravel_index(np.argmax(result), result.shape) #koordinate tacke gde postoji najveca korelacija
    x, y = ij[::-1][1:]
    xr = (x + new_icon.shape[1]/2)/new_image.shape[1]
    yr = (y + new_icon.shape[0]/2)/new_image.shape[0]
    result = { "x": xr, "y": yr }
    return make_response(json.dumps(result, indent=4), 200, headers)


if __name__ == "__main__":
    app.run(port=5000)