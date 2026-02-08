# 网络安全

## 网络安全概述

### 网络安全的重要性

网络安全保护网络系统、数据和用户免受未经授权的访问、使用、披露、破坏、修改或销毁。

### 网络安全威胁

- **病毒** - 自我复制的恶意程序
- **蠕虫** - 自动传播的恶意程序
- **木马** - 伪装成合法软件的恶意程序
- **钓鱼** - 伪装成可信网站获取信息
- **DDoS 攻击** - 分布式拒绝服务攻击
- **中间人攻击** - 拦截和篡改通信

## 加密技术

### 对称加密

使用相同的密钥进行加密和解密。

#### 常见算法

- AES - 高级加密标准
- DES - 数据加密标准
- 3DES - 三重 DES

#### 示例

```python
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

# 加密
key = b'Sixteen byte key'
cipher = AES.new(key, AES.MODE_CBC)
plaintext = b'Hello, World!'
ciphertext = cipher.encrypt(pad(plaintext, AES.block_size))

# 解密
cipher = AES.new(key, AES.MODE_CBC, cipher.iv)
plaintext = unpad(cipher.decrypt(ciphertext), AES.block_size)
print(plaintext.decode())  # Hello, World!
```

### 非对称加密

使用公钥加密，私钥解密（或相反）。

#### 常见算法

- RSA - 基于大数因子分解
- ECC - 椭圆曲线密码学
- DSA - 数字签名算法

#### 示例

```python
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP

# 生成密钥对
key = RSA.generate(2048)
private_key = key.export_key()
public_key = key.publickey().export_key()

# 加密
cipher = PKCS1_OAEP.new(RSA.import_key(public_key))
ciphertext = cipher.encrypt(b'Hello, World!')

# 解密
cipher = PKCS1_OAEP.new(RSA.import_key(private_key))
plaintext = cipher.decrypt(ciphertext)
print(plaintext.decode())  # Hello, World!
```

### 哈希函数

将任意长度的消息映射为固定长度的摘要。

#### 常见算法

- MD5 - 128 位（已被破解）
- SHA-1 - 160 位（已被破解）
- SHA-256 - 256 位
- SHA-3 - 安全哈希算法

#### 示例

```python
import hashlib

# SHA-256
message = b'Hello, World!'
hash_value = hashlib.sha256(message).hexdigest()
print(hash_value)  # a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e

# MD5（不推荐用于安全场景）
hash_value = hashlib.md5(message).hexdigest()
print(hash_value)  # ed076287532e86365e841e92bfc50d8c
```

## 数字签名

数字签名用于验证消息的真实性和完整性。

### 数字签名过程

```
1. 发送方用私钥对消息哈希签名
2. 发送方发送消息和签名
3. 接收方用公钥验证签名
4. 接收方计算消息哈希并比对
```

### 示例

```python
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA

# 生成密钥对
key = RSA.generate(2048)
private_key = key.export_key()
public_key = key.publickey().export_key()

# 签名
message = b'Hello, World!'
hash_obj = SHA256.new(message)
signature = pkcs1_15.new(RSA.import_key(private_key)).sign(hash_obj)

# 验证
try:
    pkcs1_15.new(RSA.import_key(public_key)).verify(hash_obj, signature)
    print("签名验证成功")
except (ValueError, TypeError):
    print("签名验证失败")
```

## SSL/TLS

### SSL/TLS 概述

SSL/TLS（Secure Sockets Layer/Transport Layer Security）是用于保护网络通信的协议。

### TLS 握手过程

```
客户端                              服务器
    │                                  │
    │────────── ClientHello ──────────▶│
    │                                  │
    │◀───────── ServerHello ───────────│
    │◀───────── Certificate ───────────│
    │◀───────── ServerHelloDone ───────│
    │                                  │
    │────────── ClientKeyExchange ─────▶│
    │────────── ChangeCipherSpec ─────▶│
    │────────── Finished ──────────────▶│
    │                                  │
    │◀───────── ChangeCipherSpec ───────│
    │◀───────── Finished ───────────────│
    │                                  │
    │        安全通信开始                │
```

### 使用 HTTPS

```python
import requests

response = requests.get('https://www.example.com')
print(response.status_code)
```

## 防火墙

### 防火墙类型

#### 包过滤防火墙

根据数据包的头部信息决定是否允许通过。

```
规则: 允许从 IP 192.168.1.100 访问端口 80
```

#### 应用层防火墙

检查应用层的数据内容。

```
规则: 阻止包含恶意代码的 HTTP 请求
```

#### 状态检测防火墙

跟踪连接状态，只允许已建立连接的流量。

### iptables 示例

```bash
# 清除所有规则
iptables -F
iptables -X

# 设置默认策略
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# 允许本地回环
iptables -A INPUT -i lo -j ACCEPT

# 允许已建立的连接
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 允许 SSH
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# 允许 HTTP 和 HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# 保存规则
iptables-save > /etc/iptables/rules.v4
```

## 常见攻击与防御

### SQL 注入

#### 攻击示例

```sql
-- 恶意输入
' OR '1'='1

-- 生成的 SQL
SELECT * FROM users WHERE username = '' OR '1'='1'
```

#### 防御方法

```python
# 使用参数化查询
import sqlite3

cursor.execute(
    "SELECT * FROM users WHERE username = ?",
    (username,)
)
```

### XSS 攻击

#### 攻击示例

```html
<!-- 恶意脚本 -->
<script>alert('XSS')</script>
```

#### 防御方法

```python
from markupsafe import escape

user_input = "<script>alert('XSS')</script>"
safe_output = escape(user_input)
print(safe_output)  # &lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;
```

### CSRF 攻击

#### 攻击原理

攻击者诱导用户访问恶意网站，利用用户的登录状态执行未授权的操作。

#### 防御方法

```python
from flask import Flask, session, request
import secrets

app = Flask(__name__)

@app.route('/transfer', methods=['POST'])
def transfer():
    # 验证 CSRF Token
    token = request.form.get('csrf_token')
    if token != session.get('csrf_token'):
        return 'CSRF token invalid', 403
    
    # 执行转账操作
    return 'Transfer successful'

@app.route('/form')
def form():
    session['csrf_token'] = secrets.token_hex(16)
    return '''
    <form method="POST" action="/transfer">
        <input type="hidden" name="csrf_token" value="{}">
        <input type="text" name="amount">
        <button type="submit">Transfer</button>
    </form>
    '''.format(session['csrf_token'])
```

### DDoS 攻击

#### 攻击类型

- **SYN Flood** - 大量 SYN 请求耗尽服务器资源
- **UDP Flood** - 大量 UDP 数据包
- **HTTP Flood** - 大量 HTTP 请求

#### 防御方法

```nginx
# 限制请求速率
limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;

server {
    limit_req zone=one burst=20 nodelay;
    
    # 阻止特定 IP
    deny 192.168.1.100;
    
    # 连接限制
    limit_conn_zone $binary_remote_addr zone=addr:10m;
    limit_conn addr 10;
}
```

## 安全最佳实践

### 密码安全

```python
import bcrypt

# 哈希密码
password = b'my_password_123'
hashed = bcrypt.hashpw(password, bcrypt.gensalt())

# 验证密码
if bcrypt.checkpw(password, hashed):
    print("密码正确")
else:
    print("密码错误")
```

### 输入验证

```python
from re import match

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return match(pattern, email) is not None

# 使用
if validate_email("user@example.com"):
    print("邮箱格式正确")
```

### 安全头

```python
from flask import Flask, make_response

app = Flask(__name__)

@app.route('/')
def index():
    response = make_response("Hello, World!")
    
    # 设置安全头
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Content-Security-Policy'] = "default-src 'self'"
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    
    return response
```

## 总结

网络安全保护系统和数据的安全：

**加密技术：**
- 对称加密 - 快速，适合大数据
- 非对称加密 - 安全，适合密钥交换
- 哈希函数 - 验证数据完整性

**数字签名：**
- 验证身份
- 确保数据完整性
- 不可否认性

**SSL/TLS：**
- 保护网络通信
- 防止中间人攻击

**常见攻击防御：**
- SQL 注入 - 参数化查询
- XSS - 输出编码
- CSRF - Token 验证
- DDoS - 速率限制

**安全最佳实践：**
- 密码哈希
- 输入验证
- 安全头配置

网络安全是一个持续的过程，需要不断学习和更新防御策略。
