import base64
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend

# 암호화된 데이터와 PEM 파일 경로
encrypted_password_data = "UcHLMk/VoP7Wbz4PHe5Rt9m/snFOZn0SYFzQ8sfDT77c5UmugYCBD1htBwzwWcAYkeMfB/rt6YgVKuPI4GigF86tMsGMlzvxzwEqvMEzYBw2fdhqhzKzytI0bAtY3xL36SHmLKX8VljoqnlpzAx73M9ldFS/pGvUBGtSIcr0xEpPCcRV7ZPiMNB5a5PjZtxkQypQxtjdj4oSJholCYpigFwsbToMK9Ufm8AWozDT86J2MSuQlVvgyH88B9e0iVeO8zFHv5h5sfz8dDZoa0rLAOuqjoarhnTR3VsNen1mR3+oksGgEvDY/bwsnvTueD3PL6ZPuiNmETAs3MpzF9MqXw=="
pem_file_path = "adminKey2.pem"

# PEM 파일에서 프라이빗 키 로드
with open(pem_file_path, "rb") as pem_file:
    try:
        private_key = serialization.load_pem_private_key(
            pem_file.read(),
            password=None,
            backend=default_backend()
        )
    except ValueError as e:
        print(f"Error loading private key: {e}")
        exit(1)

# 암호화된 데이터 디코딩
encrypted_data = base64.b64decode(encrypted_password_data)

# 복호화 로직 구현 (여기서는 RSA 암호화 예시)
# 실제로는 AWS에서 사용하는 암호화 방식에 맞춰 수정해야 합니다.
cipher = Cipher(algorithms.AES(private_key), modes.ECB(), backend=default_backend())
decryptor = cipher.decryptor()
decrypted_data = decryptor.update(encrypted_data) + decryptor.finalize()

# 복호화된 비밀번호 출력
print(decrypted_data.decode('utf-8'))
