
import base64
from io import BytesIO

from flask import Flask, jsonify, make_response, request
from flask_cors import CORS, cross_origin
from flask_restful import Api
from grayscale import run_convert
from PIL import Image

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
api = Api(app)


@app.route('/api/model/test', methods=['POST'])
@cross_origin()
def add_income():
    img_base64 = request.form.get('image')
    furniture_type = request.form.get('type')

    base64_prefix = 'data:image/png;base64,'
    img_base64_cutted = img_base64[len(base64_prefix):]
    img_bytes = base64.b64decode(img_base64_cutted)  
    img_file = BytesIO(img_bytes) 

    img = Image.open(img_file) 
    img.save('./test/testA/test_img.png')
    img.save('./test/testB/test_img.png')

    run_convert(furniture_type)

    converted_img = Image.open('./results/' + furniture_type + '/test_700/images/test_img_fake_B.png')
    byted = BytesIO()
    converted_img.save(byted, 'jpeg')
    im_bytes = byted.getvalue()

    data = {'base64Image': str(base64.b64encode(im_bytes))[2:-1]}
    return make_response(jsonify(data), 200)

if __name__ == '__main__':
    app.run() 