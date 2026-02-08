# 进程与线程

## 进程

### 进程的定义

进程是程序在计算机上的一次执行活动，是操作系统进行资源分配和调度的基本单位。

### 进程的特征

1. **动态性** - 进程是程序的执行过程，具有生命周期
2. **并发性** - 多个进程可以同时存在于系统中
3. **独立性** - 进程是独立运行的基本单位
4. **异步性** - 进程的执行是异步的，不可预测

### 进程的状态

```
┌─────────┐
│  就绪   │ ◄───┐
└────┬────┘     │
     │         │
     ▼         │
┌─────────┐    │
│  运行   │────┘
└────┬────┘
     │
     ▼
┌─────────┐
│  阻塞   │ ◄─── I/O 完成
└────┬────┘
     │ I/O 请求
     └────────────────┘
```

- **就绪态** - 进程已获得除 CPU 外的所有资源，等待 CPU 调度
- **运行态** - 进程正在 CPU 上执行
- **阻塞态** - 进程因等待某事件而暂停执行

### 进程控制块（PCB）

进程控制块是进程存在的唯一标识，包含以下信息：

- 进程标识符（PID）
- 处理器状态
- 进程调度信息
- 进程控制信息
- 内存管理信息

### 进程通信（IPC）

#### 管道

```c
#include <unistd.h>
#include <stdio.h>

int main() {
    int pipefd[2];
    char buf[20];
    
    // 创建管道
    if (pipe(pipefd) == -1) {
        perror("pipe");
        return 1;
    }
    
    pid_t pid = fork();
    
    if (pid == 0) {
        // 子进程：写入数据
        close(pipefd[0]); // 关闭读端
        write(pipefd[1], "Hello Pipe!", 12);
        close(pipefd[1]);
    } else {
        // 父进程：读取数据
        close(pipefd[1]); // 关闭写端
        read(pipefd[0], buf, 20);
        printf("父进程收到: %s\n", buf);
        close(pipefd[0]);
    }
    
    return 0;
}
```

#### 消息队列

```c
#include <sys/msg.h>
#include <string.h>

struct message {
    long mtype;
    char mtext[100];
};

int main() {
    int msqid;
    struct message msg;
    
    // 创建消息队列
    msqid = msgget(IPC_PRIVATE, 0666 | IPC_CREAT);
    
    // 发送消息
    msg.mtype = 1;
    strcpy(msg.mtext, "Hello Message Queue!");
    msgsnd(msqid, &msg, sizeof(msg.mtext), 0);
    
    // 接收消息
    msgrcv(msqid, &msg, sizeof(msg.mtext), 1, 0);
    printf("收到消息: %s\n", msg.mtext);
    
    // 删除消息队列
    msgctl(msqid, IPC_RMID, NULL);
    
    return 0;
}
```

#### 共享内存

```c
#include <sys/shm.h>
#include <stdio.h>

int main() {
    int shmid;
    int *shared_data;
    
    // 创建共享内存
    shmid = shmget(IPC_PRIVATE, sizeof(int), 0666 | IPC_CREAT);
    
    // 附加共享内存
    shared_data = (int*)shmat(shmid, NULL, 0);
    *shared_data = 100;
    
    pid_t pid = fork();
    
    if (pid == 0) {
        // 子进程：修改共享内存
        *shared_data = 200;
        printf("子进程写入: %d\n", *shared_data);
        shmdt(shared_data);
    } else {
        wait(NULL);
        // 父进程：读取共享内存
        printf("父进程读取: %d\n", *shared_data);
        shmdt(shared_data);
        shmctl(shmid, IPC_RMID, NULL);
    }
    
    return 0;
}
```

## 线程

### 线程的定义

线程是进程内的执行单元，是 CPU 调度的基本单位。同一进程内的线程共享进程的资源。

### 进程与线程的区别

| 特性        | 进程                     | 线程                     |
|-----------|-------------------------|-------------------------|
| 资源      | 独立拥有                | 共享                    |
| 开销      | 较大                    | 较小                    |
| 通信      | 需要 IPC                | 可直接共享内存          |
| 上下文切换| 较慢                    | 较快                    |
| 隔离性    | 完全隔离                | 不完全隔离              |

### 线程创建（POSIX 线程）

```c
#include <pthread.h>
#include <stdio.h>

void* thread_func(void* arg) {
    printf("线程 ID: %ld\n", pthread_self());
    printf("线程参数: %s\n", (char*)arg);
    return NULL;
}

int main() {
    pthread_t thread_id;
    char* message = "Hello Thread!";
    
    // 创建线程
    pthread_create(&thread_id, NULL, thread_func, message);
    
    // 等待线程结束
    pthread_join(thread_id, NULL);
    
    printf("主线程结束\n");
    
    return 0;
}
```

### 线程同步

#### 互斥锁

```c
#include <pthread.h>

int counter = 0;
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;

void* increment(void* arg) {
    for (int i = 0; i < 100000; i++) {
        pthread_mutex_lock(&mutex);
        counter++;
        pthread_mutex_unlock(&mutex);
    }
    return NULL;
}

int main() {
    pthread_t t1, t2;
    
    pthread_create(&t1, NULL, increment, NULL);
    pthread_create(&t2, NULL, increment, NULL);
    
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    
    printf("Counter: %d\n", counter); // 应该输出 200000
    
    pthread_mutex_destroy(&mutex);
    
    return 0;
}
```

#### 信号量

```c
#include <semaphore.h>

sem_t semaphore;

void* producer(void* arg) {
    for (int i = 0; i < 5; i++) {
        sem_wait(&semaphore);
        printf("生产: %d\n", i);
        sem_post(&semaphore);
    }
    return NULL;
}

void* consumer(void* arg) {
    for (int i = 0; i < 5; i++) {
        sem_wait(&semaphore);
        printf("消费: %d\n", i);
        sem_post(&semaphore);
    }
    return NULL;
}

int main() {
    sem_init(&semaphore, 0, 1);
    
    pthread_t p, c;
    pthread_create(&p, NULL, producer, NULL);
    pthread_create(&c, NULL, consumer, NULL);
    
    pthread_join(p, NULL);
    pthread_join(c, NULL);
    
    sem_destroy(&semaphore);
    
    return 0;
}
```

#### 条件变量

```c
#include <pthread.h>

pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t cond = PTHREAD_COND_INITIALIZER;
int ready = 0;

void* wait_for_signal(void* arg) {
    pthread_mutex_lock(&mutex);
    while (!ready) {
        pthread_cond_wait(&cond, &mutex);
    }
    printf("收到信号，开始工作\n");
    pthread_mutex_unlock(&mutex);
    return NULL;
}

void* send_signal(void* arg) {
    sleep(1);
    pthread_mutex_lock(&mutex);
    ready = 1;
    pthread_cond_signal(&cond);
    printf("发送信号\n");
    pthread_mutex_unlock(&mutex);
    return NULL;
}

int main() {
    pthread_t t1, t2;
    
    pthread_create(&t1, NULL, wait_for_signal, NULL);
    pthread_create(&t2, NULL, send_signal, NULL);
    
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    
    pthread_mutex_destroy(&mutex);
    pthread_cond_destroy(&cond);
    
    return 0;
}
```

## 进程调度

### 调度算法

#### 先来先服务（FCFS）

按照进程到达的顺序进行调度，非抢占式。

#### 短作业优先（SJF）

选择估计运行时间最短的进程优先执行。

#### 时间片轮转（RR）

将 CPU 时间划分为固定大小的时间片，每个进程轮流执行一个时间片。

#### 优先级调度

根据进程的优先级进行调度，优先级高的先执行。

#### 多级反馈队列

设置多个队列，每个队列有不同的优先级和时间片。

### 死锁

#### 死锁的四个必要条件

1. **互斥条件** - 资源不能被多个进程同时使用
2. **请求与保持** - 进程在请求新资源时保持已有资源
3. **不剥夺条件** - 已分配的资源不能被强行剥夺
4. **循环等待** - 存在进程资源的循环等待链

#### 死锁预防

- 破坏互斥条件（对于某些资源）
- 破坏请求与保持条件（一次性申请所有资源）
- 破坏不剥夺条件（允许剥夺）
- 破坏循环等待（资源有序分配）

#### 死锁避免

- 银行家算法
- 资源分配图

#### 死锁检测

- 资源分配图化简
- 死锁检测算法

#### 死锁恢复

- 终止进程
- 抢占资源

## 总结

进程和线程是操作系统中重要的概念：

**进程：**
- 资源分配的基本单位
- 独立的地址空间
- 进程间通信需要特殊机制
- 开销较大

**线程：**
- CPU 调度的基本单位
- 共享进程资源
- 线程间通信简单
- 开销较小

**同步机制：**
- 互斥锁 - 保护临界区
- 信号量 - 控制资源访问
- 条件变量 - 线程间通知

理解进程和线程对于并发编程和系统性能优化至关重要。
