from flask import Flask, jsonify, request, Response
import json
import pandas as pd
from pykis import PyKis
from pykrx import stock
import time
from flask_cors import CORS
import urllib.request
import ssl

app = Flask(__name__)
cors = CORS(app, resources={r"/stock/*": {"origins": "*"}})
ssl._create_default_https_context = ssl._create_unverified_context
# Initialize PyKis instance
kis = PyKis(
    appkey="PSoA1sHxyXaaDl788Y4yFV3rlC9asgEXYtxI",
    appsecret="ilIW01L49HlcA/spI4llkYRVKxGNE3L7aeCiS/+kJJfl447Eyd+sccR6iWH4QkFO5tG0AZMiDKZoB++Bl3Ii1vty2uQ/rQL4rns3YrQdzL6Y18tyvk7AasogUPqbPGeSJoNLAEAKD5YTu4CfOq4J0R/gfXIcv4eUw2rBaEBeyFPv+BhtO2U=",
    virtual_account=True,
)


# Function to fetch stock info
def fetch_stock_info(stock_code):
    stock = kis.stock(stock_code)
    askp = stock.asking_price()
    return askp

def get_product_name(stock_code):
    item_code = stock_code
    url = "https://m.stock.naver.com/api/stock/%s/integration"%(item_code)
    raw_data = urllib.request.urlopen(url).read()
    json_data = json.loads(raw_data)

    #종목명 가져오기
    stock_name = json_data['stockName']
    print("종목명 : %s"%(stock_name))
    return stock_name

@app.route('/stock', methods=['GET'])
@app.route('/stock/<stock_code>', methods=['GET'])
def get_stock_info(stock_code='005930'):
    askp = fetch_stock_info(stock_code)
    # product_name = get_product_name('005930')
    item_code = stock_code
    url = "https://m.stock.naver.com/api/stock/%s/integration"%(item_code)
    raw_data = urllib.request.urlopen(url).read()
    json_data = json.loads(raw_data)

    #종목명 가져오기
    stock_name = json_data['stockName']
    print("종목명 : %s"%(stock_name))
    
    data = {
        'product_name': "{}".format(stock_name),
        'current_price': askp.stck_prpr,
        'low_price': askp.stck_lwpr,
        'high_price': askp.stck_hgpr,
        'expected_closing_price': askp.antc_cnpr,
        'sell_orders': [{'price': askp.askp[i], 'quantity': askp.askp_rsqn[i]} for i in range(10)],
        'buy_orders': [{'price': askp.bidp[i], 'quantity': askp.bidp_rsqn[i]} for i in range(10)],
    }

    return jsonify(data)


@app.route('/stock/api/stock_data', methods=['GET'])
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
    app.run(host='0.0.0.0', port=5002)
