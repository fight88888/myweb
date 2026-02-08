# HTTP 协议

## HTTP 概述

### 什么是 HTTP

HTTP（Hypertext Transfer Protocol）超文本传输协议，是用于在 Web 浏览器和 Web 服务器之间传输数据的协议。

### HTTP 特点

- **简单快速** - 请求方式简单，通信速度快
- **灵活** - 可以传输任意类型的数据
- **无状态** - 每次请求都是独立的
- **无连接** - 请求-响应模式，请求完成后断开连接

## HTTP 版本

### HTTP/1.0

- 每个请求都需要建立新的 TCP 连接
- 不支持持久连接
- 不支持管道化

### HTTP/1.1

- 支持持久连接（Keep-Alive）
- 支持管道化（Pipeline）
- 增加了缓存机制
- 增加了 Host 头部

### HTTP/2.0

- 多路复用
- 头部压缩（HPACK）
- 二进制协议
- 服务器推送

### HTTP/3.0

- 基于 QUIC 协议（UDP）
- 解决了队头阻塞问题
- 更快的连接建立

## HTTP 请求

### 请求格式

```
请求行
请求头部
空行
请求体
```

### 请求示例

```http
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html,application/xhtml+xml
Connection: keep-alive

(空行)
```

### 请求方法

#### GET

```http
GET /users?id=123 HTTP/1.1
Host: api.example.com
```

- 用于请求资源
- 参数在 URL 中
- 幂等，可以缓存

#### POST

```http
POST /users HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
    "name": "张三",
    "age": 25
}
```

- 用于创建资源
- 参数在请求体中
- 不幂等，不可缓存

#### PUT

```http
PUT /users/123 HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
    "name": "李四",
    "age": 30
}
```

- 用于更新资源（全部）
- 幂等

#### PATCH

```http
PATCH /users/123 HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
    "age": 31
}
```

- 用于更新资源（部分）
- 不幂等

#### DELETE

```http
DELETE /users/123 HTTP/1.1
Host: api.example.com
```

- 用于删除资源
- 幂等

#### HEAD

```http
HEAD /index.html HTTP/1.1
Host: www.example.com
```

- 类似 GET，只返回头部
- 用于检查资源是否存在

#### OPTIONS

```http
OPTIONS /api HTTP/1.1
Host: api.example.com

Origin: http://localhost:3000
```

- 用于查询服务器支持的请求方法
- 用于 CORS 预检请求

## HTTP 响应

### 响应格式

```
状态行
响应头部
空行
响应体
```

### 响应示例

```http
HTTP/1.1 200 OK
Date: Mon, 23 Oct 2023 10:00:00 GMT
Server: nginx/1.18.0
Content-Type: application/json
Content-Length: 1024

{
    "status": "success",
    "data": {
        "id": 123,
        "name": "张三"
    }
}
```

### 状态码

#### 1xx 信息响应

- `100 Continue` - 继续请求
- `101 Switching Protocols` - 切换协议

#### 2xx 成功响应

- `200 OK` - 请求成功
- `201 Created` - 资源创建成功
- `204 No Content` - 成功但无返回内容

#### 3xx 重定向

- `301 Moved Permanently` - 永久重定向
- `302 Found` - 临时重定向
- `304 Not Modified` - 资源未修改

#### 4xx 客户端错误

- `400 Bad Request` - 请求错误
- `401 Unauthorized` - 未授权
- `403 Forbidden` - 禁止访问
- `404 Not Found` - 资源未找到
- `405 Method Not Allowed` - 方法不允许

#### 5xx 服务器错误

- `500 Internal Server Error` - 服务器内部错误
- `502 Bad Gateway` - 网关错误
- `503 Service Unavailable` - 服务不可用
- `504 Gateway Timeout` - 网关超时

## HTTP 头部

### 请求头部

```http
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: text/html,application/json
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Accept-Encoding: gzip, deflate, br
Content-Type: application/json
Content-Length: 1024
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Cookie: session_id=abc123
```

### 响应头部

```http
Content-Type: application/json
Content-Length: 1024
Content-Encoding: gzip
Cache-Control: max-age=3600
Expires: Mon, 23 Oct 2023 11:00:00 GMT
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Server: nginx/1.18.0
Set-Cookie: session_id=abc123; Path=/; HttpOnly; Secure
```

### 常见头部字段

#### Content-Type

```
Content-Type: text/html
Content-Type: application/json
Content-Type: image/png
Content-Type: multipart/form-data
```

#### Content-Length

```
Content-Length: 1024
```

#### Cache-Control

```
Cache-Control: max-age=3600
Cache-Control: no-cache
Cache-Control: no-store
```

#### Authorization

```
Authorization: Bearer <token>
Authorization: Basic <base64>
```

#### Cookie / Set-Cookie

```http
Set-Cookie: session_id=abc123; Path=/; HttpOnly; Secure
```

## HTTPS

### 什么是 HTTPS

HTTPS（HTTP Secure）是 HTTP 的安全版本，通过 SSL/TLS 加密通信。

### HTTPS 工作流程

```
1. 客户端发送 HTTPS 请求
2. 服务器返回数字证书
3. 客户端验证证书
4. 客户端生成会话密钥
5. 使用服务器公钥加密会话密钥
6. 服务器使用私钥解密会话密钥
7. 双方使用会话密钥加密通信
```

### HTTPS 示例

```http
GET /api/users HTTP/1.1
Host: api.example.com
Connection: TLS 1.3
```

## RESTful API

### RESTful 原则

1. **资源导向** - 一切皆资源
2. **统一接口** - 使用标准的 HTTP 方法
3. **无状态** - 服务器不保存客户端状态
4. **可缓存** - 响应可以被缓存
5. **分层系统** - 客户端不知道是否连接到终端服务器

### RESTful API 示例

```http
# 获取所有用户
GET /api/users

# 获取特定用户
GET /api/users/123

# 创建用户
POST /api/users
Content-Type: application/json

{
    "name": "张三",
    "age": 25
}

# 更新用户
PUT /api/users/123
Content-Type: application/json

{
    "name": "李四",
    "age": 30
}

# 删除用户
DELETE /api/users/123
```

## HTTP 编程示例

### Python 请求

```python
import requests

# GET 请求
response = requests.get('https://api.example.com/users')
data = response.json()

# POST 请求
response = requests.post(
    'https://api.example.com/users',
    json={'name': '张三', 'age': 25}
)

# 带请求头
headers = {
    'Authorization': 'Bearer token123',
    'Content-Type': 'application/json'
}
response = requests.get('https://api.example.com/users', headers=headers)
```

### Node.js 请求

```javascript
const axios = require('axios');

// GET 请求
axios.get('https://api.example.com/users')
    .then(response => console.log(response.data))
    .catch(error => console.error(error));

// POST 请求
axios.post('https://api.example.com/users', {
    name: '张三',
    age: 25
})
.then(response => console.log(response.data))
.catch(error => console.error(error));
```

### cURL 命令

```bash
# GET 请求
curl https://api.example.com/users

# POST 请求
curl -X POST https://api.example.com/users \
     -H "Content-Type: application/json" \
     -d '{"name": "张三", "age": 25}'

# 带认证
curl -H "Authorization: Bearer token123" \
     https://api.example.com/users
```

## 总结

HTTP 协议是 Web 应用的基础：

**HTTP 版本：**
- HTTP/1.0 - 基础版本
- HTTP/1.1 - 广泛使用
- HTTP/2.0 - 性能优化
- HTTP/3.0 - 基于 UDP

**请求方法：**
- GET - 获取资源
- POST - 创建资源
- PUT - 更新资源
- DELETE - 删除资源
- HEAD, OPTIONS 等

**状态码：**
- 2xx - 成功
- 3xx - 重定向
- 4xx - 客户端错误
- 5xx - 服务器错误

**HTTPS：**
- 加密通信
- 保护数据安全

理解 HTTP 协议对于 Web 开发和 API 设计非常重要。
