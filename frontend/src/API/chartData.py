from flask import Flask, jsonify, request
from pykrx import stock
import pandas as pd
import json
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/stock_data', methods=['GET'])
def get_stock_data():
    # 종목 코드 받아오기
    code = request.args.get('code', '005930')  # 기본값으로 '005930' (삼성전자)

    # 100일 전 날짜 구하기
    today = pd.Timestamp.today().date()
    start_date = today - pd.DateOffset(days=100)

    # 종목 코드를 이용해 해당 종목의 100일간의 일별 시세 데이터 가져오기
    df = stock.get_market_ohlcv_by_date(start_date.strftime('%Y%m%d'), today.strftime('%Y%m%d'), code)
    # DataFrame을 JSON 형태로 변환하여 반환
    json_data = df.to_json(orient='index', force_ascii=False)
    
    return jsonify(json.loads(json_data))

if __name__ == '__main__':
    app.run(debug=True, port=5001)
