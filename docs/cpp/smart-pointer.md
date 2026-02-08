# 智能指针

## 简介

智能指针是 C++11 引入的用于管理动态内存的工具，它们在超出作用域时自动释放内存，避免内存泄漏。C++ 标准库提供了四种智能指针：

1. `std::unique_ptr` - 独占所有权
2. `std::shared_ptr` - 共享所有权
3. `std::weak_ptr` - 弱引用
4. `std::auto_ptr` - 已废弃（C++17 移除）

## unique_ptr

`unique_ptr` 独占对象的所有权，不能复制，只能移动。

```cpp
#include <memory>
#include <iostream>

class Resource {
public:
    Resource() { std::cout << "Resource 构造" << std::endl; }
    ~Resource() { std::cout << "Resource 析构" << std::endl; }
    void doSomething() { std::cout << "使用 Resource" << std::endl; }
};

void uniquePtrExample() {
    // 创建 unique_ptr
    std::unique_ptr<Resource> ptr1(new Resource());
    
    // 使用 make_unique（推荐）
    auto ptr2 = std::make_unique<Resource>();
    
    // 访问成员
    ptr1->doSomething();
    (*ptr1).doSomething();
    
    // 所有权转移（移动）
    std::unique_ptr<Resource> ptr3 = std::move(ptr1);
    // 现在 ptr1 为 nullptr，ptr3 拥有对象
    
    // 使用 get() 获取原始指针
    Resource* rawPtr = ptr3.get();
    rawPtr->doSomething();
    
    // 使用 reset() 释放所有权
    ptr3.reset();
    // ptr3 现在为 nullptr，对象被销毁
    
    // 自定义删除器
    auto deleter = [](Resource* p) {
        std::cout << "自定义删除器" << std::endl;
        delete p;
    };
    std::unique_ptr<Resource, decltype(deleter)> ptr4(new Resource(), deleter);
    
    // 数组支持
    std::unique_ptr<int[]> arr(new int[5]{1, 2, 3, 4, 5});
    for (int i = 0; i < 5; ++i) {
        std::cout << arr[i] << " ";
    }
}
```

## shared_ptr

`shared_ptr` 允许多个指针共享同一个对象的所有权，当最后一个 `shared_ptr` 被销毁时，对象被删除。

```cpp
#include <memory>
#include <iostream>

class Widget {
public:
    Widget(int id) : id_(id) { 
        std::cout << "Widget " << id_ << " 构造" << std::endl; 
    }
    ~Widget() { 
        std::cout << "Widget " << id_ << " 析构" << std::endl; 
    }
    void display() { 
        std::cout << "Widget " << id_ << std::endl; 
    }
private:
    int id_;
};

void sharedPtrExample() {
    // 创建 shared_ptr
    std::shared_ptr<Widget> ptr1 = std::make_shared<Widget>(1);
    
    // 引用计数
    std::cout << "引用计数: " << ptr1.use_count() << std::endl; // 1
    
    // 复制构造
    {
        std::shared_ptr<Widget> ptr2 = ptr1;
        std::cout << "引用计数: " << ptr1.use_count() << std::endl; // 2
        ptr2->display();
    } // ptr2 离开作用域，引用计数减 1
    
    std::cout << "引用计数: " << ptr1.use_count() << std::endl; // 1
    
    // 赋值
    std::shared_ptr<Widget> ptr3;
    ptr3 = ptr1;
    std::cout << "引用计数: " << ptr1.use_count() << std::endl; // 2
    
    // reset
    ptr3.reset();
    std::cout << "引用计数: " << ptr1.use_count() << std::endl; // 1
    
    // 检查是否为空
    if (ptr1) {
        std::cout << "ptr1 不为空" << std::endl;
    }
    
    if (!ptr3) {
        std::cout << "ptr3 为空" << std::endl;
    }
    
    // 自定义删除器
    auto deleter = [](Widget* p) {
        std::cout << "自定义删除器: Widget " << p->getId() << std::endl;
        delete p;
    };
    std::shared_ptr<Widget> ptr4(new Widget(2), deleter);
}

// 循环引用问题
class B;

class A {
public:
    std::shared_ptr<B> b_ptr;
    ~A() { std::cout << "A 析构" << std::endl; }
};

class B {
public:
    std::shared_ptr<A> a_ptr;
    ~B() { std::cout << "B 析构" << std::endl; }
};

void circularReferenceExample() {
    auto a = std::make_shared<A>();
    auto b = std::make_shared<B>();
    
    a->b_ptr = b;
    b->a_ptr = a;
    
    // 这里会造成循环引用，导致内存泄漏
    // 对象不会被正确析构
}
```

## weak_ptr

`weak_ptr` 是 `shared_ptr` 的观察者，不增加引用计数，用于解决循环引用问题。

```cpp
#include <memory>
#include <iostream>

class Node {
public:
    std::shared_ptr<Node> next;
    std::weak_ptr<Node> prev;  // 使用 weak_ptr 避免循环引用
    
    ~Node() { std::cout << "Node 析构" << std::endl; }
};

void weakPtrExample() {
    auto node1 = std::make_shared<Node>();
    auto node2 = std::make_shared<Node>();
    
    node1->next = node2;
    node2->prev = node1;
    
    // 正确析构，没有内存泄漏
    
    // 使用 weak_ptr
    std::weak_ptr<Node> weakNode = node1;
    
    // 检查对象是否存在
    if (auto shared = weakNode.lock()) {
        shared->next; // 使用对象
        std::cout << "对象仍然存在" << std::endl;
    } else {
        std::cout << "对象已被销毁" << std::endl;
    }
    
    // 检查引用计数（不包括 weak_ptr）
    std::cout << "use_count: " << weakNode.use_count() << std::endl;
    
    // 释放 node1
    node1.reset();
    
    // 现在对象可能已被销毁
    if (weakNode.expired()) {
        std::cout << "对象已被销毁" << std::endl;
    }
}
```

## 智能指针最佳实践

### 1. 使用 make_shared 和 make_unique

```cpp
// 推荐
auto ptr1 = std::make_shared<Resource>();
auto ptr2 = std::make_unique<Resource>();

// 不推荐（效率较低，可能产生异常泄漏）
std::shared_ptr<Resource> ptr1(new Resource());
std::unique_ptr<Resource> ptr2(new Resource());
```

### 2. 避免混合使用原始指针和智能指针

```cpp
// 不好的做法
Resource* rawPtr = new Resource();
std::shared_ptr<Resource> smartPtr(rawPtr);
// 不要再使用 rawPtr，可能会被重复删除

// 好的做法
auto smartPtr = std::make_shared<Resource>();
```

### 3. 避免从智能指针获取原始指针后手动删除

```cpp
auto ptr = std::make_shared<Resource>();
Resource* raw = ptr.get();
delete raw;  // 错误！智能指针会再次删除
```

### 4. 作为函数参数

```cpp
// 只读，不涉及所有权
void process(const std::shared_ptr<Resource>& ptr);

// 转移所有权
void accept(std::unique_ptr<Resource> ptr);

// 只使用对象，不关心智能指针
void process(Resource* ptr);

// 最佳：如果只需要使用对象，传递原始指针或引用
void process(Resource& resource);
```

### 5. 返回智能指针

```cpp
// 工厂函数
std::unique_ptr<Resource> createResource() {
    return std::make_unique<Resource>();
}

std::shared_ptr<Resource> createSharedResource() {
    return std::make_shared<Resource>();
}
```

## 使用场景

### unique_ptr 使用场景

- 独占所有权的情况
- 函数内部创建对象并返回
- PIMPL 模式
- 工厂模式

```cpp
// 工厂函数
std::unique_ptr<Shape> createShape(ShapeType type) {
    switch (type) {
        case CIRCLE: return std::make_unique<Circle>();
        case RECTANGLE: return std::make_unique<Rectangle>();
        default: return nullptr;
    }
}
```

### shared_ptr 使用场景

- 多个对象需要共享所有权
- 缓存
- 观察者模式
- 异步操作

```cpp
// 缓存示例
class Cache {
private:
    std::unordered_map<std::string, std::shared_ptr<Data>> cache_;
    
public:
    std::shared_ptr<Data> get(const std::string& key) {
        auto it = cache_.find(key);
        if (it != cache_.end()) {
            return it->second;
        }
        
        auto data = std::make_shared<Data>(loadData(key));
        cache_[key] = data;
        return data;
    }
};
```

### weak_ptr 使用场景

- 观察者模式
- 缓存
- 避免循环引用
- 延迟销毁

```cpp
// 观察者模式
class Subject {
private:
    std::vector<std::weak_ptr<Observer>> observers_;
    
public:
    void attach(const std::shared_ptr<Observer>& obs) {
        observers_.push_back(obs);
    }
    
    void notify() {
        for (auto it = observers_.begin(); it != observers_.end(); ) {
            if (auto obs = it->lock()) {
                obs->update();
                ++it;
            } else {
                // 观察者已被销毁，移除
                it = observers_.erase(it);
            }
        }
    }
};
```

## 总结

智能指针是现代 C++ 中管理内存的重要工具：

**unique_ptr：**
- 独占所有权
- 不能复制，只能移动
- 零开销

**shared_ptr：**
- 共享所有权
- 引用计数
- 可能导致循环引用

**weak_ptr：**
- 不增加引用计数
- 用于观察对象
- 解决循环引用

**最佳实践：**
- 优先使用 `make_shared` 和 `make_unique`
- 避免混合使用原始指针和智能指针
- 根据所有权语义选择合适的智能指针
- 注意循环引用问题

正确使用智能指针可以大大减少内存泄漏和悬空指针的问题。
