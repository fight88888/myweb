# 内存管理

## 虚拟内存

### 虚拟内存的概念

虚拟内存是操作系统提供的一种内存管理技术，它将物理内存和磁盘空间结合起来，给程序提供一个比实际物理内存更大的虚拟地址空间。

### 虚拟内存的优点

1. **更大的地址空间** - 程序可以使用比物理内存更大的空间
2. **内存保护** - 每个进程有独立的地址空间，相互隔离
3. **内存映射** - 文件可以直接映射到内存中
4. **公平的物理内存分配** - 操作系统可以更有效地分配物理内存

### 页式存储管理

将虚拟地址空间划分为固定大小的页面（Page），物理内存划分为相同大小的页框（Page Frame）。

```
虚拟地址空间          物理内存
┌────────────┐       ┌────────────┐
│  页 0      │ ──►   │  页框 3    │
├────────────┤       ├────────────┤
│  页 1      │ ──►   │  页框 7    │
├────────────┤       ├────────────┤
│  页 2      │       │  页框 1    │
├────────────┤       ├────────────┤
│  页 3      │ ◄───  │  页框 5    │
└────────────┘       └────────────┘
```

### 页表

页表用于实现虚拟地址到物理地址的映射。

```
页号    页框号    有效位
0       3        1
1       7        1
2       -        0
3       5        1
```

### 地址转换

```
虚拟地址: [页号 | 页内偏移]
          │
          ▼
        页表
          │
          ▼
物理地址: [页框号 | 页内偏移]
```

## 页面置换算法

当发生缺页中断且内存已满时，需要选择一个页面换出到磁盘。

### FIFO（先进先出）

淘汰最早调入内存的页面。

```c
#include <stdio.h>

void fifo(int pages[], int n, int frameCount) {
    int frames[frameCount];
    int index = 0, faults = 0;
    
    for (int i = 0; i < frameCount; i++)
        frames[i] = -1;
    
    for (int i = 0; i < n; i++) {
        int found = 0;
        
        // 检查页面是否在内存中
        for (int j = 0; j < frameCount; j++) {
            if (frames[j] == pages[i]) {
                found = 1;
                break;
            }
        }
        
        if (!found) {
            frames[index] = pages[i];
            index = (index + 1) % frameCount;
            faults++;
        }
    }
    
    printf("FIFO 缺页次数: %d\n", faults);
}
```

### LRU（最近最少使用）

淘汰最近最长时间未被访问的页面。

```c
#include <limits.h>

void lru(int pages[], int n, int frameCount) {
    int frames[frameCount];
    int faults = 0;
    
    for (int i = 0; i < frameCount; i++)
        frames[i] = -1;
    
    for (int i = 0; i < n; i++) {
        int found = 0;
        
        // 检查页面是否在内存中
        for (int j = 0; j < frameCount; j++) {
            if (frames[j] == pages[i]) {
                found = 1;
                break;
            }
        }
        
        if (!found) {
            // 找出最近最少使用的页面
            int lruIndex = 0;
            int minTime = INT_MAX;
            
            for (int j = 0; j < frameCount; j++) {
                int k;
                for (k = i - 1; k >= 0; k--) {
                    if (pages[k] == frames[j]) {
                        break;
                    }
                }
                
                if (k < minTime) {
                    minTime = k;
                    lruIndex = j;
                }
            }
            
            frames[lruIndex] = pages[i];
            faults++;
        }
    }
    
    printf("LRU 缺页次数: %d\n", faults);
}
```

### OPT（最佳置换）

淘汰未来最长时间不会被访问的页面（理论最优，实际不可实现）。

## 内存分配算法

### 首次适应（First Fit）

从低地址开始查找，找到第一个能满足大小要求的空闲区。

### 最佳适应（Best Fit）

查找所有能满足大小要求的空闲区，选择最小的。

### 最差适应（Worst Fit）

查找所有空闲区，选择最大的。

### 快速适应（Quick Fit）

为常用的空闲区大小维护单独的链表。

## 内存分配（C/C++）

### malloc 和 free

```c
#include <stdlib.h>
#include <stdio.h>

int main() {
    // 分配内存
    int* ptr = (int*)malloc(10 * sizeof(int));
    
    if (ptr == NULL) {
        printf("内存分配失败\n");
        return 1;
    }
    
    // 使用内存
    for (int i = 0; i < 10; i++) {
        ptr[i] = i * i;
        printf("%d ", ptr[i]);
    }
    
    // 释放内存
    free(ptr);
    ptr = NULL;
    
    return 0;
}
```

### calloc 和 realloc

```c
#include <stdlib.h>

int main() {
    // calloc 分配并初始化为 0
    int* ptr1 = (int*)calloc(10, sizeof(int));
    
    // realloc 调整内存大小
    int* ptr2 = (int*)malloc(10 * sizeof(int));
    ptr2 = (int*)realloc(ptr2, 20 * sizeof(int));
    
    free(ptr1);
    free(ptr2);
    
    return 0;
}
```

### new 和 delete（C++）

```cpp
#include <iostream>

int main() {
    // 分配单个对象
    int* ptr1 = new int(42);
    std::cout << *ptr1 << std::endl;
    delete ptr1;
    
    // 分配数组
    int* ptr2 = new int[10];
    for (int i = 0; i < 10; i++) {
        ptr2[i] = i;
        std::cout << ptr2[i] << " ";
    }
    std::cout << std::endl;
    delete[] ptr2;
    
    return 0;
}
```

## 内存泄漏

### 什么是内存泄漏

程序动态分配的内存没有被释放，导致可用内存逐渐减少。

### 内存泄漏的原因

1. 忘记释放内存
2. 异常导致跳过释放代码
3. 循环引用
4. 不正确的指针使用

### 检测内存泄漏

#### Valgrind（Linux）

```bash
valgrind --leak-check=full ./program
```

#### AddressSanitizer（GCC/Clang）

```bash
gcc -fsanitize=address -g program.c
./a.out
```

### 避免内存泄漏

1. **RAII（资源获取即初始化）**
```cpp
#include <memory>

void func() {
    auto ptr = std::make_unique<int>(42);
    // 自动释放，无需手动 delete
}
```

2. **使用智能指针**
```cpp
#include <memory>

std::shared_ptr<Resource> createResource() {
    return std::make_shared<Resource>();
}
```

3. **配对使用 new/delete**
```cpp
int* ptr = new int;
delete ptr;

int* arr = new int[10];
delete[] arr;
```

## 内存碎片

### 外部碎片

已分配内存之间的空闲小块，无法满足大的分配请求。

### 内部碎片

分配的内存块大于实际需要的内存。

### 减少碎片的方法

1. 使用内存池
2. 分配固定大小的块
3. 定期整理内存

## 内存池

```cpp
class MemoryPool {
private:
    struct Block {
        Block* next;
    };
    
    Block* freeList;
    size_t blockSize;
    size_t blockCount;
    
public:
    MemoryPool(size_t size, size_t count) 
        : blockSize(size), blockCount(count) {
        char* pool = new char[blockSize * blockCount];
        freeList = (Block*)pool;
        
        for (size_t i = 0; i < blockCount - 1; i++) {
            Block* current = (Block*)(pool + i * blockSize);
            Block* next = (Block*)(pool + (i + 1) * blockSize);
            current->next = next;
        }
        ((Block*)(pool + (blockCount - 1) * blockSize))->next = nullptr;
    }
    
    void* allocate() {
        if (freeList == nullptr) {
            return nullptr;
        }
        
        Block* block = freeList;
        freeList = freeList->next;
        return block;
    }
    
    void deallocate(void* ptr) {
        Block* block = (Block*)ptr;
        block->next = freeList;
        freeList = block;
    }
    
    ~MemoryPool() {
        delete[] (char*)freeList;
    }
};
```

## 总结

内存管理是操作系统的核心功能：

**虚拟内存：**
- 提供更大的地址空间
- 实现内存保护
- 支持内存映射

**页面置换算法：**
- FIFO - 简单但效果一般
- LRU - 实际应用中效果好
- OPT - 理论最优，不可实现

**内存分配：**
- malloc/free（C）
- new/delete（C++）
- 首次适应、最佳适应、最差适应

**内存管理建议：**
- 避免内存泄漏
- 使用智能指针（C++）
- 使用内存池提高性能
- 注意内存碎片问题

良好的内存管理可以提高程序的性能和稳定性。
