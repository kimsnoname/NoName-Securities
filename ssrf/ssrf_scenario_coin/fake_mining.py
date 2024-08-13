import time
import hashlib
import random
import string
import argparse
from art import text2art
from termcolor import colored

# 가짜 지갑 클래스
class FakeWallet:
    def __init__(self, address):
        self.address = address
        self.balance = 0

    def add_coins(self, amount):
        self.balance += amount
        print(f"Coins added: {amount}. Current balance: {self.balance}")

# 임의의 문자열 생성 함수
def generate_random_string(length=64):
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for i in range(length))

# 가짜 채굴 함수
def fake_mining(wallet, pool, coins_per_block=10, difficulty=2):
    print(f"Starting fake mining process with pool {pool}...")
    total_speed = 0
    speed_count = 0
    try:
        while True:
            # 작업 증명(Proof of Work) 시뮬레이션
            random_string = generate_random_string()
            fake_hash = hashlib.sha256(random_string.encode()).hexdigest()
            
            # 가짜 난이도 검증
            if fake_hash.startswith('0' * difficulty):
                print(f"Successfully mined a block: {fake_hash}")
                wallet.add_coins(coins_per_block)
            
            # 랜덤 마이닝 속도 생성
            mining_speed = round(random.uniform(40, 50), 3)
            total_speed += mining_speed
            speed_count += 1
            
            # 현재 작업 증명 시도 출력
            print(f"Attempting proof of work with pool {pool}, wallet {wallet.address}, mining speed {mining_speed} H/s...")

            # 마이닝 속도 조절
            time.sleep(0.2)
    except KeyboardInterrupt:
        print("Stopping fake mining process...")
        if speed_count > 0:
            average_speed = total_speed / speed_count
        else:
            average_speed = 0
        print(f"Average mining speed: {average_speed:.3f} H/s")
        print(f"Total coins mined: {wallet.balance}")

# 무지개색 그라데이션 함수
def rainbow_text(text):
    colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta']
    colored_chars = [colored(char, colors[i % len(colors)]) for i, char in enumerate(text)]
    return ''.join(colored_chars)

# 메인 함수
if __name__ == "__main__":
    # 명령줄 인수 파서 설정
    parser = argparse.ArgumentParser(description='Fake Mining Script')
    parser.add_argument('-pool', type=str, required=True, help='Coin mining pool address')
    parser.add_argument('-wal', type=str, required=True, help='Wallet address')
    args = parser.parse_args()
    
    # ASCII 아트 생성
    ascii_art = text2art("Fake Miner")
    
    # 무지개색 적용
    colored_ascii_art = '\n'.join([rainbow_text(line) for line in ascii_art.split('\n')])
    
    # ASCII 아트 출력
    print(colored_ascii_art)
    
    # 가짜 지갑 생성
    wallet = FakeWallet(args.wal)
    
    # 가짜 마이닝 시작
    fake_mining(wallet, args.pool)
