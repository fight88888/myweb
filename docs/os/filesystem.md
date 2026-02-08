# 文件系统

## 文件系统概述

### 文件系统的定义

文件系统是操作系统用于管理存储设备上数据的机制，提供了文件和目录的抽象，实现了数据的持久化存储。

### 文件系统的功能

1. **文件管理** - 创建、删除、读写文件
2. **目录管理** - 组织文件的结构
3. **存储空间管理** - 分配和回收存储空间
4. **文件共享与保护** - 控制文件访问权限

## 文件

### 文件的属性

- 文件名
- 文件类型
- 文件大小
- 创建时间
- 修改时间
- 访问时间
- 所有者
- 权限

### 文件的类型

- 普通文件
- 目录文件
- 字符设备文件
- 块设备文件
- 符号链接文件
- 套接字文件

### 文件的操作

### 创建文件

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    FILE* file = fopen("test.txt", "w");
    
    if (file == NULL) {
        perror("创建文件失败");
        return 1;
    }
    
    fprintf(file, "Hello, File System!\n");
    
    fclose(file);
    
    return 0;
}
```

### 读取文件

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    FILE* file = fopen("test.txt", "r");
    
    if (file == NULL) {
        perror("打开文件失败");
        return 1;
    }
    
    char buffer[256];
    while (fgets(buffer, sizeof(buffer), file) != NULL) {
        printf("%s", buffer);
    }
    
    fclose(file);
    
    return 0;
}
```

### 写入文件

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    FILE* file = fopen("output.txt", "w");
    
    if (file == NULL) {
        perror("打开文件失败");
        return 1;
    }
    
    // 使用 fprintf 写入
    fprintf(file, "Name: %s\n", "张三");
    fprintf(file, "Age: %d\n", 25);
    
    // 使用 fwrite 写入二进制数据
    int numbers[] = {1, 2, 3, 4, 5};
    fwrite(numbers, sizeof(int), 5, file);
    
    fclose(file);
    
    return 0;
}
```

### 删除文件

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    if (remove("test.txt") == 0) {
        printf("文件删除成功\n");
    } else {
        perror("文件删除失败");
    }
    
    return 0;
}
```

## 目录

### 目录的结构

```
/
├── home
│   ├── user1
│   │   ├── documents
│   │   └── pictures
│   └── user2
├── var
│   ├── log
│   └── tmp
└── etc
```

### 目录操作

### 创建目录

```c
#include <sys/stat.h>
#include <stdio.h>

int main() {
    if (mkdir("newdir", 0755) == 0) {
        printf("目录创建成功\n");
    } else {
        perror("目录创建失败");
    }
    
    return 0;
}
```

### 遍历目录

```c
#include <dirent.h>
#include <stdio.h>

int main() {
    DIR* dir;
    struct dirent* entry;
    
    dir = opendir(".");
    
    if (dir == NULL) {
        perror("打开目录失败");
        return 1;
    }
    
    while ((entry = readdir(dir)) != NULL) {
        printf("%s\n", entry->d_name);
    }
    
    closedir(dir);
    
    return 0;
}
```

### 删除目录

```c
#include <unistd.h>
#include <stdio.h>

int main() {
    if (rmdir("newdir") == 0) {
        printf("目录删除成功\n");
    } else {
        perror("目录删除失败");
    }
    
    return 0;
}
```

## 文件权限

### 权限类型

- **读（r）** - 4
- **写（w）** - 2
- **执行（x）** - 1

### 权限示例

```
-rw-r--r--  1  user  group  1024  Jan 1 12:00  file.txt
│  │││││   │   │     │       │     │          │
│  │││││   │   │     │       │     修改时间    文件名
│  │││││   │   │     │       大小
│  │││││   │   │     组名
│  │││││   │   用户名
│  │││││   链接数
│  ││└┴┴───── 其他用户权限
│  │└┴─────── 组用户权限
│  └────────── 用户权限
└───────────── 文件类型
```

### 修改权限

```bash
# 数字方式
chmod 755 file.txt  # rwxr-xr-x
chmod 644 file.txt  # rw-r--r--

# 符号方式
chmod u+x file.txt  # 给用户添加执行权限
chmod g-w file.txt  # 移除组的写权限
chmod o=r file.txt  # 设置其他用户的只读权限
```

## 文件系统类型

### FAT（File Allocation Table）

- 简单、兼容性好
- 不支持大文件和权限
- 适用于 U 盘等可移动设备

### NTFS（New Technology File System）

- 支持大文件、权限
- 日志功能，安全可靠
- Windows 默认文件系统

### ext4（Fourth Extended Filesystem）

- Linux 默认文件系统
- 支持大文件、日志
- 性能和稳定性好

### APFS（Apple File System）

- macOS 默认文件系统
- 支持加密、快照
- 针对闪存优化

## 存储空间管理

### 连续分配

```
┌─────────────────────────────────────┐
│ 文件1 │ 文件2 │ 文件3 │     空闲     │
└─────────────────────────────────────┘
```

优点：访问速度快
缺点：会产生外部碎片

### 链接分配

```
文件: 100 → 200 → 300 → 400 → NULL
```

优点：无外部碎片
缺点：随机访问效率低

### 索引分配

```
索引表: [100, 200, 300, 400, ...]
```

优点：支持随机访问
缺点：需要额外的索引空间

## 文件描述符

### 文件描述符表

```
进程文件描述符表
┌──────┬──────────┐
│  0   │ 标准输入  │
├──────┼──────────┤
│  1   │ 标准输出  │
├──────┼──────────┤
│  2   │ 标准错误  │
├──────┼──────────┤
│  3   │  文件A   │
└──────┴──────────┘
```

### 使用文件描述符操作

```c
#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main() {
    int fd = open("test.txt", O_RDWR | O_CREAT, 0644);
    
    if (fd == -1) {
        perror("打开文件失败");
        return 1;
    }
    
    // 写入数据
    char* data = "Hello, File Descriptor!\n";
    write(fd, data, 24);
    
    // 移动文件指针
    lseek(fd, 0, SEEK_SET);
    
    // 读取数据
    char buffer[100];
    int n = read(fd, buffer, sizeof(buffer));
    buffer[n] = '\0';
    printf("读取: %s", buffer);
    
    close(fd);
    
    return 0;
}
```

## 文件锁定

### 文件锁类型

- **共享锁（读锁）** - 多个进程可以同时持有
- **排他锁（写锁）** - 只能被一个进程持有

### 使用文件锁

```c
#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main() {
    int fd = open("lockfile", O_RDWR | O_CREAT, 0644);
    
    // 获取排他锁
    struct flock lock;
    lock.l_type = F_WRLCK;     // 排他锁
    lock.l_whence = SEEK_SET;
    lock.l_start = 0;
    lock.l_len = 0;             // 锁定整个文件
    
    if (fcntl(fd, F_SETLK, &lock) == -1) {
        perror("获取锁失败");
        close(fd);
        return 1;
    }
    
    printf("获得锁，执行临界区操作...\n");
    sleep(5);
    
    // 释放锁
    lock.l_type = F_UNLCK;
    fcntl(fd, F_SETLK, &lock);
    
    printf("释放锁\n");
    close(fd);
    
    return 0;
}
```

## 内存映射文件

### mmap 使用

```c
#include <sys/mman.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main() {
    int fd = open("data.bin", O_RDWR | O_CREAT, 0644);
    
    // 设置文件大小
    ftruncate(fd, 4096);
    
    // 映射文件到内存
    void* mapped = mmap(NULL, 4096, PROT_READ | PROT_WRITE, 
                        MAP_SHARED, fd, 0);
    
    if (mapped == MAP_FAILED) {
        perror("mmap 失败");
        close(fd);
        return 1;
    }
    
    // 像访问内存一样访问文件
    char* data = (char*)mapped;
    strcpy(data, "Hello, mmap!");
    
    // 同步到磁盘
    msync(mapped, 4096, MS_SYNC);
    
    // 解除映射
    munmap(mapped, 4096);
    close(fd);
    
    return 0;
}
```

## 总结

文件系统是操作系统的核心组件：

**文件操作：**
- 创建、读取、写入、删除
- 文件描述符管理
- 文件权限控制

**目录管理：**
- 目录结构
- 遍历和操作
- 文件组织

**存储管理：**
- 连续分配
- 链接分配
- 索引分配

**高级特性：**
- 文件锁定
- 内存映射
- 文件系统类型

理解文件系统对于系统编程和数据管理非常重要。
