# TCP/IP 协议

## TCP/IP 概述

### 什么是 TCP/IP

TCP/IP（Transmission Control Protocol/Internet Protocol）是互联网的基础协议栈，由一系列协议组成，用于实现网络通信。

### TCP/IP 分层模型

```
┌─────────────────┐
│  应用层    │
├─────────────────┤
│  传输层 (Transport)   │
├─────────────────┤
│  网络层 (Network)     │
├─────────────────┤
│ 链路层 (Link) │
└─────────────────┘
```

### 各层功能

#### 应用层

- 处理特定的应用程序协议
- 常见协议：HTTP, FTP, SMTP, DNS

#### 传输层

- 提供端到端的通信
- 主要协议：TCP, UDP

#### 网络层

- 负责数据包的路由和转发
- 主要协议：IP, ICMP, ARP

#### 链路层

- 处理物理传输
- 常见协议：Ethernet, Wi-Fi

## IP 协议

### IP 地址

IP 地址用于标识网络中的设备，分为 IPv4 和 IPv6。

#### IPv4 地址

```
格式: xxx.xxx.xxx.xxx
范围: 0.0.0.0 到 255.255.255.255

示例: 192.168.1.1
```

#### IPv6 地址

```
格式: xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx
示例: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
```

### IP 地址分类

#### A 类地址

- 范围：1.0.0.0 到 126.255.255.255
- 网络位：8 位
- 主机位：24 位

#### B 类地址

- 范围：128.0.0.0 到 191.255.255.255
- 网络位：16 位
- 主机位：16 位

#### C 类地址

- 范围：192.0.0.0 到 223.255.255.255
- 网络位：24 位
- 主机位：8 位

### 子网掩码

用于区分 IP 地址中的网络部分和主机部分。

```
IP 地址: 192.168.1.1
子网掩码: 255.255.255.0

网络地址: 192.168.1.0
主机地址: 0.0.0.1
```

## TCP 协议

### TCP 特点

- **面向连接** - 需要建立连接后才能通信
- **可靠传输** - 保证数据不丢失、不重复
- **流量控制** - 控制发送速率
- **拥塞控制** - 避免网络拥塞
- **全双工** - 双向通信

### TCP 三次握手

```
客户端                              服务器
    │                                  │
    │────────── SYN, Seq=x ────────────▶│
    │                                  │
    │◀───── SYN-ACK, Seq=y, Ack=x+1 ───│
    │                                  │
    │────────── ACK, Ack=y+1 ──────────▶│
    │                                  │
    │         连接建立完成               │
```

```c
// TCP 客户端三次握手示例
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

int main() {
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    
    struct sockaddr_in server_addr;
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(8080);
    inet_pton(AF_INET, "127.0.0.1", &server_addr.sin_addr);
    
    // 发送 SYN（发起连接）
    if (connect(sock, (struct sockaddr*)&server_addr, 
                sizeof(server_addr)) == 0) {
        // 连接建立完成
        // 已经完成三次握手
    }
    
    close(sock);
    return 0;
}
```

### TCP 四次挥手

```
客户端                              服务器
    │                                  │
    │────────── FIN, Seq=u ────────────▶│
    │                                  │
    │◀───────── ACK, Ack=u+1 ──────────│
    │                                  │
    │◀───────── FIN, Seq=w ───────────│
    │                                  │
    │────────── ACK, Ack=w+1 ──────────▶│
    │                                  │
    │         连接关闭完成               │
```

### TCP 滑动窗口

滑动窗口用于流量控制，接收方告诉发送方可以发送多少数据。

```
发送方窗口:
┌─────────────────────────────────────┐
│  已发送已确认 │ 已发送未确认 │ 可发送 │
└─────────────────────────────────────┘
              ▲           ▲
           窗口左边     窗口右边
```

### TCP 拥塞控制

#### 慢启动

- 开始时窗口大小为 1
- 每收到一个 ACK，窗口大小加 1
- 窗口指数增长

#### 拥塞避免

- 窗口达到阈值后，线性增长
- 每个往返时间（RTT）窗口加 1

#### 快速重传

- 收到 3 个重复 ACK，立即重传

#### 快速恢复

- 拥塞窗口减半，进入拥塞避免阶段

## UDP 协议

### UDP 特点

- **无连接** - 不需要建立连接
- **不可靠** - 可能丢包、乱序
- **简单高效** - 开销小，速度快
- **支持广播和组播**

### UDP vs TCP

| 特性      | TCP           | UDP            |
|---------|---------------|----------------|
| 连接      | 面向连接      | 无连接          |
| 可靠性     | 可靠          | 不可靠          |
| 速度      | 较慢          | 较快            |
| 开销      | 较大          | 较小            |
| 应用场景   | 文件传输、网页 | 视频、游戏      |

### UDP 示例

```c
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <stdio.h>
#include <string.h>

// UDP 服务器
void udp_server() {
    int sock = socket(AF_INET, SOCK_DGRAM, 0);
    
    struct sockaddr_in server_addr;
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(8080);
    server_addr.sin_addr.s_addr = INADDR_ANY;
    
    bind(sock, (struct sockaddr*)&server_addr, sizeof(server_addr));
    
    char buffer[1024];
    struct sockaddr_in client_addr;
    socklen_t addr_len = sizeof(client_addr);
    
    int n = recvfrom(sock, buffer, sizeof(buffer), 0,
                     (struct sockaddr*)&client_addr, &addr_len);
    buffer[n] = '\0';
    
    printf("收到消息: %s\n", buffer);
    
    const char* response = "Hello from server";
    sendto(sock, response, strlen(response), 0,
           (struct sockaddr*)&client_addr, addr_len);
    
    close(sock);
}

// UDP 客户端
void udp_client() {
    int sock = socket(AF_INET, SOCK_DGRAM, 0);
    
    struct sockaddr_in server_addr;
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(8080);
    inet_pton(AF_INET, "127.0.0.1", &server_addr.sin_addr);
    
    const char* message = "Hello from client";
    sendto(sock, message, strlen(message), 0,
           (struct sockaddr*)&server_addr, sizeof(server_addr));
    
    char buffer[1024];
    int n = recvfrom(sock, buffer, sizeof(buffer), 0, NULL, NULL);
    buffer[n] = '\0';
    
    printf("收到响应: %s\n", buffer);
    
    close(sock);
}
```

## 端口号

端口号用于标识不同的应用程序。

### 端口范围

- **知名端口（0-1023）** - 系统保留，需要 root 权限
- **注册端口（1024-49151）** - 由 IANA 分配
- **动态端口（49152-65535）** - 动态分配

### 常见端口

```
21  - FTP
22  - SSH
23  - Telnet
25  - SMTP
53  - DNS
80  - HTTP
110 - POP3
143 - IMAP
443 - HTTPS
3306 - MySQL
```

## Socket 编程

### Socket 类型

- **SOCK_STREAM** - 流式套接字（TCP）
- **SOCK_DGRAM** - 数据报套接字（UDP）
- **SOCK_RAW** - 原始套接字

### TCP 服务器

```c
#include <sys/socket.h>
#include <netinet/in.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>

int main() {
    int server_fd, client_fd;
    struct sockaddr_in server_addr, client_addr;
    socklen_t addr_len = sizeof(client_addr);
    
    // 创建 socket
    server_fd = socket(AF_INET, SOCK_STREAM, 0);
    
    // 设置地址重用
    int opt = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
    
    // 绑定地址
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(8080);
    
    bind(server_fd, (struct sockaddr*)&server_addr, sizeof(server_addr));
    
    // 监听
    listen(server_fd, 5);
    
    printf("服务器启动，等待连接...\n");
    
    // 接受连接
    client_fd = accept(server_fd, (struct sockaddr*)&client_addr, &addr_len);
    
    printf("客户端连接成功\n");
    
    // 接收数据
    char buffer[1024];
    int n = recv(client_fd, buffer, sizeof(buffer), 0);
    buffer[n] = '\0';
    
    printf("收到消息: %s\n", buffer);
    
    // 发送响应
    const char* response = "Hello from server";
    send(client_fd, response, strlen(response), 0);
    
    close(client_fd);
    close(server_fd);
    
    return 0;
}
```

### TCP 客户端

```c
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>

int main() {
    int sock;
    struct sockaddr_in server_addr;
    
    // 创建 socket
    sock = socket(AF_INET, SOCK_STREAM, 0);
    
    // 连接服务器
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(8080);
    inet_pton(AF_INET, "127.0.0.1", &server_addr.sin_addr);
    
    if (connect(sock, (struct sockaddr*)&server_addr, sizeof(server_addr)) == 0) {
        printf("连接服务器成功\n");
        
        // 发送数据
        const char* message = "Hello from client";
        send(sock, message, strlen(message), 0);
        
        // 接收响应
        char buffer[1024];
        int n = recv(sock, buffer, sizeof(buffer), 0);
        buffer[n] = '\0';
        
        printf("收到响应: %s\n", buffer);
    }
    
    close(sock);
    
    return 0;
}
```

## 总结

TCP/IP 协议是现代网络通信的基础：

**核心协议：**
- IP - 网络层协议，负责路由
- TCP - 可靠传输协议
- UDP - 不可靠但快速的传输协议

**关键概念：**
- IP 地址和子网掩码
- 端口号
- TCP 三次握手和四次挥手
- 滑动窗口和拥塞控制

**应用场景：**
- TCP - 文件传输、网页浏览、邮件
- UDP - 视频流、在线游戏、DNS

理解 TCP/IP 协议对于网络编程和系统设计至关重要。
