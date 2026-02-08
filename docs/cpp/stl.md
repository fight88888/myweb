# STL 容器

## 简介

标准模板库（STL）是 C++ 提供的一系列通用模板类和函数的集合，包括容器、算法、迭代器和函数对象等。本文主要介绍 STL 容器。

## 序列容器

### vector

`vector` 是动态数组，可以自动调整大小。

```cpp
#include <vector>

// 创建 vector
std::vector<int> vec1;                    // 空的 vector
std::vector<int> vec2(5);                 // 5 个元素，默认值为 0
std::vector<int> vec3(5, 10);             // 5 个元素，值为 10
std::vector<int> vec4 = {1, 2, 3, 4, 5}; // 初始化列表

// 添加元素
vec1.push_back(10);
vec1.push_back(20);
vec1.push_back(30);

// 访问元素
std::cout << vec1[0] << std::endl;        // 使用下标
std::cout << vec1.at(1) << std::endl;     // 使用 at()，会检查边界
std::cout << vec1.front() << std::endl;   // 第一个元素
std::cout << vec1.back() << std::endl;    // 最后一个元素

// 大小和容量
std::cout << vec1.size() << std::endl;     // 元素个数
std::cout << vec1.capacity() << std::endl; // 容量
vec1.reserve(100);                         // 预留空间
vec1.resize(10);                          // 调整大小

// 遍历
for (int i = 0; i < vec1.size(); i++) {
    std::cout << vec1[i] << " ";
}

for (auto& elem : vec1) {
    std::cout << elem << " ";
}

// 删除元素
vec1.pop_back();               // 删除最后一个元素
vec1.erase(vec1.begin());      // 删除指定位置元素
vec1.clear();                  // 清空所有元素
```

### list

`list` 是双向链表，支持快速插入和删除。

```cpp
#include <list>

std::list<int> lst = {1, 2, 3, 4, 5};

// 添加元素
lst.push_front(0);   // 在前面添加
lst.push_back(6);    // 在后面添加
lst.insert(lst.begin(), -1); // 在指定位置插入

// 访问元素
std::cout << lst.front() << std::endl; // 第一个元素
std::cout << lst.back() << std::endl;  // 最后一个元素

// 删除元素
lst.pop_front();     // 删除第一个元素
lst.pop_back();      // 删除最后一个元素
lst.erase(lst.begin()); // 删除指定位置元素
lst.remove(3);       // 删除所有值为 3 的元素

// 排序
lst.sort();          // 升序排序
lst.reverse();       // 反转

// 合并
std::list<int> lst2 = {10, 20};
lst.merge(lst2);     // 合并两个已排序的列表
```

### deque

`deque` 是双端队列，支持在两端高效地插入和删除。

```cpp
#include <deque>

std::deque<int> dq;

// 添加元素
dq.push_back(1);
dq.push_back(2);
dq.push_front(0);
dq.push_front(-1);

// 访问元素
std::cout << dq[0] << std::endl;      // -1
std::cout << dq.front() << std::endl; // -1
std::cout << dq.back() << std::endl;  // 2

// 删除元素
dq.pop_front();
dq.pop_back();
```

## 关联容器

### map

`map` 是键值对容器，按键排序。

```cpp
#include <map>

// 创建 map
std::map<std::string, int> ages;

// 插入元素
ages["张三"] = 25;
ages["李四"] = 30;
ages["王五"] = 28;

// 使用 insert
ages.insert(std::make_pair("赵六", 35));
ages.emplace("孙七", 40);

// 访问元素
std::cout << ages["张三"] << std::endl;      // 25
std::cout << ages.at("李四") << std::endl;   // 30

// 查找元素
auto it = ages.find("王五");
if (it != ages.end()) {
    std::cout << it->first << ": " << it->second << std::endl;
}

// 遍历
for (const auto& pair : ages) {
    std::cout << pair.first << ": " << pair.second << std::endl;
}

// 删除元素
ages.erase("张三");
```

### set

`set` 是唯一元素的集合，自动排序。

```cpp
#include <set>

std::set<int> s = {5, 2, 8, 1, 5};

// 插入元素（自动去重和排序）
s.insert(3);
s.insert(10);

// 查找元素
if (s.find(5) != s.end()) {
    std::cout << "找到 5" << std::endl;
}

// 遍历
for (const auto& elem : s) {
    std::cout << elem << " ";
}
// 输出: 1 2 3 5 8 10

// 删除元素
s.erase(5);
```

### unordered_map

`unordered_map` 是哈希表实现的键值对容器，查找效率高。

```cpp
#include <unordered_map>

std::unordered_map<std::string, int> scores;

scores.insert({"语文", 90});
scores.insert({"数学", 95});
scores["英语"] = 88;

// 访问
std::cout << scores["语文"] << std::endl;

// 遍历
for (const auto& pair : scores) {
    std::cout << pair.first << ": " << pair.second << std::endl;
}
```

### unordered_set

`unordered_set` 是哈希表实现的集合，查找效率高。

```cpp
#include <unordered_set>

std::unordered_set<int> us = {1, 2, 3, 4, 5};

us.insert(6);
us.insert(3);  // 重复元素不会被插入

if (us.find(3) != us.end()) {
    std::cout << "3 存在于集合中" << std::endl;
}

for (const auto& elem : us) {
    std::cout << elem << " ";
}
```

## 容器适配器

### stack

`stack` 是后进先出（LIFO）的数据结构。

```cpp
#include <stack>

std::stack<int> stk;

stk.push(1);
stk.push(2);
stk.push(3);

std::cout << stk.top() << std::endl;  // 3

stk.pop();  // 弹出 3

std::cout << stk.size() << std::endl; // 2

while (!stk.empty()) {
    std::cout << stk.top() << " ";
    stk.pop();
}
```

### queue

`queue` 是先进先出（FIFO）的数据结构。

```cpp
#include <queue>

std::queue<int> q;

q.push(1);
q.push(2);
q.push(3);

std::cout << q.front() << std::endl;  // 1
std::cout << q.back() << std::endl;   // 3

q.pop();  // 弹出 1

std::cout << q.size() << std::endl;   // 2
```

### priority_queue

`priority_queue` 是优先队列，默认大顶堆。

```cpp
#include <queue>

// 默认大顶堆（最大的元素在顶部）
std::priority_queue<int> pq;
pq.push(5);
pq.push(1);
pq.push(10);

std::cout << pq.top() << std::endl;  // 10

// 小顶堆（最小的元素在顶部）
std::priority_queue<int, std::vector<int>, std::greater<int>> min_pq;
min_pq.push(5);
min_pq.push(1);
min_pq.push(10);

std::cout << min_pq.top() << std::endl;  // 1
```

## 容器通用操作

### 容器的通用成员函数

所有容器都支持的操作：

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5};

// 大小相关
vec.size();      // 元素个数
vec.empty();     // 是否为空
vec.max_size();  // 最大可能大小

// 元素访问
vec.front();     // 第一个元素
vec.back();      // 最后一个元素

// 修改
vec.clear();     // 清空
vec.swap(other); // 交换两个容器
```

### 迭代器

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5};

// 正向迭代器
for (auto it = vec.begin(); it != vec.end(); ++it) {
    std::cout << *it << " ";
}

// 常量迭代器
for (auto it = vec.cbegin(); it != vec.cend(); ++it) {
    std::cout << *it << " ";
}

// 反向迭代器
for (auto it = vec.rbegin(); it != vec.rend(); ++it) {
    std::cout << *it << " ";
}
```

## 算法

STL 提供了大量算法，需要包含 `<algorithm>` 头文件。

```cpp
#include <algorithm>

std::vector<int> vec = {5, 2, 8, 1, 9, 3};

// 排序
std::sort(vec.begin(), vec.end());  // 升序
std::sort(vec.rbegin(), vec.rend()); // 降序

// 查找
auto it = std::find(vec.begin(), vec.end(), 8);
if (it != vec.end()) {
    std::cout << "找到 8" << std::endl;
}

// 二分查找（需要先排序）
bool found = std::binary_search(vec.begin(), vec.end(), 5);

// 计数
int count = std::count(vec.begin(), vec.end(), 3);

// 累积
int sum = std::accumulate(vec.begin(), vec.end(), 0);

// 逆转
std::reverse(vec.begin(), vec.end());
```

## 总结

STL 容器提供了丰富的数据结构和算法，主要类型包括：

**序列容器：**
- `vector` - 动态数组
- `list` - 双向链表
- `deque` - 双端队列

**关联容器：**
- `map` - 键值对（有序）
- `set` - 集合（有序）
- `unordered_map` - 键值对（无序）
- `unordered_set` - 集合（无序）

**容器适配器：**
- `stack` - 栈
- `queue` - 队列
- `priority_queue` - 优先队列

正确使用 STL 容器可以大大提高开发效率和代码质量。
