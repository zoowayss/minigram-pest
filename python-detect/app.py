from flask import Flask, request, jsonify
import base64
import os

app = Flask(__name__)

@app.route('/detect', methods=['POST'])
def detect():
    try:
        # 获取base64图片数据
        data = request.json
        image_base64 = data.get('image')
        
        # 这里可以添加实际的AI模型检测逻辑
        # 目前返回示例数据
        
        result = {
            "class": "草地贪夜蛾",
            "confidence": 0.95,
            "x": 100,
            "y": 200,
            "w": 300,
            "h": 400,
            "resultImage": "http://127.0.0.1:8080/static/result.jpg"  # 使用本地图片
        }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True) 