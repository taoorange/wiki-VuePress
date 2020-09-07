# 变量声明

学习阮老师的es6入门，获益匪浅，自己跟着电子书敲了demo，把自己之前不熟悉的地方又过了一遍。地址在[这里。](https://es6.ruanyifeng.com/#docs/let)


这里整理了一下变量声明6种方式的思维导图，class、和import另做介绍。
![变量声明.png](https://cdn.nlark.com/yuque/0/2020/png/1774700/1597980513106-2046bba7-d3fc-443c-b85f-ceca3d8dab48.png#align=left&display=inline&height=273&margin=%5Bobject%20Object%5D&name=%E5%8F%98%E9%87%8F%E5%A3%B0%E6%98%8E.png&originHeight=947&originWidth=2251&size=174011&status=done&style=none&width=650)
# 一、变量声明let、const、var、function、import、class


## 1、函数的变量声明在块级作用域中的提升


### 栗子一：
es5中在块级作用域中声明函数是"非法的"。但是没有浏览器遵守这个约定。
```js
// 情况一
if (true) {
  function f() {}
}

// 情况二
try {
  function f() {}
} catch(e) {
  // ...
}
```
这两种情况在浏览器中都是不会报错的。


### 栗子二：
在es6中，明确规定了在块级作用域中可以声明函数。
——函数在块级作用域外访问不到
```js
// 浏览器的 ES6 环境
function f() { console.log('I am outside!'); }

(function () {
  if (false) {
  	function f() { console.log('I am inside!'); }
    // 重复声明一次函数f
  }

  f();	// 此处执行报错，因为找不到上面块级作用域中函数f
}());
```
![微信图片_20200805143859.png](https://cdn.nlark.com/yuque/0/2020/png/1774700/1596609550413-240177dc-5221-4911-a503-4af69f420344.png#align=left&display=inline&height=97&margin=%5Bobject%20Object%5D&name=%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200805143859.png&originHeight=103&originWidth=747&size=7362&status=done&style=none&width=705)


### 栗子三：
我们改变一下代码：
```js
function f() { console.log('I am outside!'); }

(function () {
  function f() { console.log('I am inside!'); }
  if (false) {
    // 重复声明一次函数f
  }

  f(); // 可以访问到同一作用域下的f
}());
```
![微信图片_20200805144003.png](https://cdn.nlark.com/yuque/0/2020/png/1774700/1596609615353-1c9c8595-89ac-40f1-90c7-27ad768841e4.png#align=left&display=inline&height=78&margin=%5Bobject%20Object%5D&name=%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200805144003.png&originHeight=78&originWidth=631&size=5019&status=done&style=none&width=631)


再改一下代码
```js
// 浏览器的 ES6 环境
function f() { console.log('I am outside!'); }

(function () {
  f();  // 此时的f函数是undefined还是找到作用域外的f呢？
}());
```
**![微信图片_20200805144240.png](https://cdn.nlark.com/yuque/0/2020/png/1774700/1596609770214-75997e97-b1c6-4ece-bd12-b6442bb32e2c.png#align=left&display=inline&height=69&margin=%5Bobject%20Object%5D&name=%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200805144240.png&originHeight=69&originWidth=572&size=4261&status=done&style=none&width=572)**
**
我们看到代码输出了，说明访问到了作用域外的f函数。
看到这里，我们发现在块级作用域中，函数存在声明提升！！！


现在我们再回到栗子二，实际上相当于下面的代码：
```js
// 浏览器的 ES6 环境
function f() { console.log('I am outside!'); }

(function () {
	var f = undefined
  if (false) {
  	function f() { console.log('I am inside!'); }
    // 重复声明一次函数f
  }

  f();
}());
```






## 2、const


首先明确，const并不是定义一个常量，而是定义指向常量指针的内存地址的数据不变（以前模模糊糊不清楚，多亏阮老师解惑了）。
对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，`const`只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了。
```js
const foo = {}

foo.a =1
foo.b = 2

console.log(foo)

```
![微信图片_20200805152221.png](https://cdn.nlark.com/yuque/0/2020/png/1774700/1596612152708-470eb6c3-a262-4268-8b66-cd0abde824a5.png#align=left&display=inline&height=63&margin=%5Bobject%20Object%5D&name=%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200805152221.png&originHeight=63&originWidth=429&size=2121&status=done&style=none&width=429)


我们看到数据变化了。因此，定义不可变的对象需要用：
```js
const foo = Object.freeze({})
```








