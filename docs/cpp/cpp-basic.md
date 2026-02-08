# C++ 基础语法

## 简介

C++ 是一种通用的编程语言，由 Bjarne Stroustrup 于 1979 年在贝尔实验室开始开发。C++ 是 C 语言的扩展，增加了面向对象编程的特性。

## Hello World

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

## 基本数据类型

C++ 提供了以下基本数据类型：

- `int` - 整数
- `float` - 单精度浮点数
- `double` - 双精度浮点数
- `char` - 字符
- `bool` - 布尔值

### 示例

```cpp
int age = 25;
float price = 19.99;
double pi = 3.14159265359;
char grade = 'A';
bool isPassed = true;
```

## 变量声明

在 C++ 中，变量在使用前必须声明：

```cpp
int a;          // 声明
int b = 10;      // 声明并初始化
int c{20};       // 列表初始化 (C++11)
auto d = 3.14;   // 类型推导 (C++11)
```

## 常量

使用 `const` 关键字定义常量：

```cpp
const int MAX_SIZE = 100;
const double PI = 3.14159;
```

## 运算符

### 算术运算符

- `+` - 加法
- `-` - 减法
- `*` - 乘法
- `/` - 除法
- `%` - 取模

### 关系运算符

- `==` - 等于
- `!=` - 不等于
- `>` - 大于
- `<` - 小于
- `>=` - 大于等于
- `<=` - 小于等于

### 逻辑运算符

- `&&` - 逻辑与
- `||` - 逻辑或
- `!` - 逻辑非

## 控制流

### if-else 语句

```cpp
int score = 85;
if (score >= 90) {
    std::cout << "A" << std::endl;
} else if (score >= 80) {
    std::cout << "B" << std::endl;
} else {
    std::cout << "C" << std::endl;
}
```

### for 循环

```cpp
for (int i = 0; i < 10; i++) {
    std::cout << i << " ";
}
```

### while 循环

```cpp
int i = 0;
while (i < 10) {
    std::cout << i << " ";
    i++;
}
```

### do-while 循环

```cpp
int i = 0;
do {
    std::cout << i << " ";
    i++;
} while (i < 10);
```

## 函数

### 函数定义

```cpp
int add(int a, int b) {
    return a + b;
}

int main() {
    int result = add(5, 3);
    std::cout << result << std::endl;
    return 0;
}
```

### 函数参数

#### 值传递

```cpp
void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}
```

#### 引用传递

```cpp
void swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}
```

#### 指针传递

```cpp
void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}
```

## 数组

### 一维数组

```cpp
int arr[5] = {1, 2, 3, 4, 5};

for (int i = 0; i < 5; i++) {
    std::cout << arr[i] << " ";
}
```

### 二维数组

```cpp
int matrix[2][3] = {
    {1, 2, 3},
    {4, 5, 6}
};

for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 3; j++) {
        std::cout << matrix[i][j] << " ";
    }
    std::cout << std::endl;
}
```

## 指针

### 指针基础

```cpp
int num = 42;
int* ptr = &num;  // ptr 指向 num

std::cout << "num = " << num << std::endl;
std::cout << "&num = " << &num << std::endl;
std::cout << "ptr = " << ptr << std::endl;
std::cout << "*ptr = " << *ptr << std::endl;
```

### 指针与数组

```cpp
int arr[] = {10, 20, 30, 40, 50};
int* ptr = arr;  // 等同于 &arr[0]

for (int i = 0; i < 5; i++) {
    std::cout << *(ptr + i) << " ";
}
```

## 引用

```cpp
int num = 10;
int& ref = num;  // ref 是 num 的引用

ref = 20;  // 现在num的值变为20
std::cout << num << std::endl;  // 输出: 20
```

## 总结

本文介绍了 C++ 的基础语法，包括：

- 基本数据类型
- 变量和常量
- 运算符
- 控制流
- 函数
- 数组
- 指针和引用

这些基础知识为学习更高级的 C++ 特性打下了坚实的基础。
