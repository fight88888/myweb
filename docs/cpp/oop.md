# 面向对象编程

## 简介

面向对象编程（OOP）是一种编程范式，它使用"对象"来设计软件。C++ 是一门支持面向对象编程的语言，提供了封装、继承和多态等特性。

## 类和对象

### 类的定义

类是对象的蓝图，定义了对象的属性和行为。

```cpp
class Person {
private:
    std::string name;
    int age;

public:
    // 构造函数
    Person(std::string n, int a) {
        name = n;
        age = a;
    }

    // 成员函数
    void display() {
        std::cout << "姓名: " << name << std::endl;
        std::cout << "年龄: " << age << std::endl;
    }

    // Getter 和 Setter
    std::string getName() { return name; }
    void setName(std::string n) { name = n; }
    
    int getAge() { return age; }
    void setAge(int a) { age = a; }
};
```

### 对象的创建

```cpp
Person person1("张三", 25);
person1.display();

Person person2 = Person("李四", 30);
person2.display();
```

## 封装

封装是将数据和操作数据的方法绑定在一起，并隐藏内部实现细节。

### 访问修饰符

- `private` - 私有成员，只能在类内部访问
- `protected` - 受保护成员，类及其派生类可以访问
- `public` - 公共成员，任何地方都可以访问

```cpp
class BankAccount {
private:
    double balance;  // 私有成员

public:
    BankAccount(double initialBalance) {
        balance = initialBalance;
    }

    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    bool withdraw(double amount) {
        if (amount > 0 && balance >= amount) {
            balance -= amount;
            return true;
        }
        return false;
    }

    double getBalance() {
        return balance;
    }
};
```

## 继承

继承允许创建新类（派生类）从现有类（基类）继承属性和方法。

### 基类和派生类

```cpp
class Animal {
protected:
    std::string name;

public:
    Animal(std::string n) : name(n) {}

    void eat() {
        std::cout << name << " 正在吃东西" << std::endl;
    }

    void sleep() {
        std::cout << name << " 正在睡觉" << std::endl;
    }
};

class Dog : public Animal {
public:
    Dog(std::string n) : Animal(n) {}

    void bark() {
        std::cout << name << " 在汪汪叫" << std::endl;
    }
};

class Cat : public Animal {
public:
    Cat(std::string n) : Animal(n) {}

    void meow() {
        std::cout << name << " 在喵喵叫" << std::endl;
    }
};
```

### 继承的使用

```cpp
Dog dog("小黑");
dog.eat();
dog.bark();

Cat cat("小白");
cat.eat();
cat.meow();
```

## 多态

多态允许使用基类指针或引用来调用派生类的方法。

### 虚函数

```cpp
class Shape {
public:
    virtual double area() {
        return 0.0;
    }
    
    virtual void display() {
        std::cout << "这是一个形状" << std::endl;
    }
};

class Rectangle : public Shape {
private:
    double width, height;

public:
    Rectangle(double w, double h) : width(w), height(h) {}

    double area() override {
        return width * height;
    }
    
    void display() override {
        std::cout << "这是一个矩形，面积: " << area() << std::endl;
    }
};

class Circle : public Shape {
private:
    double radius;

public:
    Circle(double r) : radius(r) {}

    double area() override {
        return 3.14159 * radius * radius;
    }
    
    void display() override {
        std::cout << "这是一个圆形，面积: " << area() << std::endl;
    }
};
```

### 多态的使用

```cpp
Shape* shape1 = new Rectangle(5, 3);
Shape* shape2 = new Circle(2.5);

shape1->display();  // 输出: 这是一个矩形，面积: 15
shape2->display();  // 输出: 这是一个圆形，面积: 19.6349

delete shape1;
delete shape2;
```

## 抽象类

抽象类是包含纯虚函数的类，不能被实例化。

```cpp
class AbstractShape {
public:
    // 纯虚函数
    virtual double area() = 0;
    virtual double perimeter() = 0;
    
    void info() {
        std::cout << "面积: " << area() << std::endl;
        std::cout << "周长: " << perimeter() << std::endl;
    }
};

class Triangle : public AbstractShape {
private:
    double a, b, c;

public:
    Triangle(double side1, double side2, double side3) 
        : a(side1), b(side2), c(side3) {}

    double area() override {
        double s = (a + b + c) / 2;
        return sqrt(s * (s - a) * (s - b) * (s - c));
    }
    
    double perimeter() override {
        return a + b + c;
    }
};
```

## 友元函数和友元类

友元可以访问类的私有成员。

```cpp
class Box {
private:
    double width;

public:
    Box(double w) : width(w) {}
    
    // 友元函数声明
    friend void printWidth(Box box);
    
    // 友元类声明
    friend class Printer;
};

void printWidth(Box box) {
    // 可以访问私有成员
    std::cout << "宽度: " << box.width << std::endl;
}

class Printer {
public:
    void print(Box box) {
        // 可以访问私有成员
        std::cout << "打印宽度: " << box.width << std::endl;
    }
};
```

## 运算符重载

```cpp
class Complex {
private:
    double real, imag;

public:
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}

    // 运算符重载
    Complex operator+(const Complex& other) {
        return Complex(real + other.real, imag + other.imag);
    }

    Complex operator-(const Complex& other) {
        return Complex(real - other.real, imag - other.imag);
    }

    void display() {
        std::cout << real << " + " << imag << "i" << std::endl;
    }
};

int main() {
    Complex c1(3, 4);
    Complex c2(1, 2);
    
    Complex c3 = c1 + c2;
    Complex c4 = c1 - c2;
    
    c3.display();  // 输出: 4 + 6i
    c4.display();  // 输出: 2 + 2i
    
    return 0;
}
```

## 总结

面向对象编程的核心概念：

1. **封装** - 隐藏实现细节，提供公共接口
2. **继承** - 创建新类从现有类继承特性
3. **多态** - 同一接口，不同实现
4. **抽象** - 提取共同特性，定义抽象类

这些特性使代码更加模块化、可重用和易于维护。
