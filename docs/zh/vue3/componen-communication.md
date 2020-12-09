# vue组件间通信的8种方式

<a name="dmHAu"></a>
# 一、A→B→C祖孙传值类型
A→B→C传值方式是工作中最常见的传值方式，依次是组件的包含顺序。
<a name="liNGn"></a>
## 1、props/$emit
当然，我们可以利用两次props接收参数，知道参数从A传到C，这种方式不再赘述。
<a name="DJF4a"></a>
## 2、vuex
还有通过vuex，不过有点大材小用，引起state维护的参数过多等，这种方式也不赘述了。
<a name="PCeou"></a>
## 3、provide、inject传值
provice/inject传值的方式，适合所有的向下传值类型，层级可以很深，多用于组件开发。业务开发中很少用到。
<a name="g3D8r"></a>
### 
<a name="WRGJz"></a>
### A组件
```
// provide作为一个属性使用，和data，methods等统级，将要传递给子孙的属性放在里面
provide() {
    return {
      toSon: 'this is to my son'
    }
},
```
<a name="49CA2"></a>
### 
<a name="7lUpb"></a>
### B、C等子孙组件
```
// inject是一个对象
inject: {
    toSon: {
      default: '' // 设置接收属性的默认值
    }
 },
 
 // inject也可以是一个数组
 inject:['toSon']
```


<a name="gZHrM"></a>
## 4、$attr、$listeners传值
*这两个属性都是绑在组件B上面的，组件B起到一个承上启下的作用。<br />$attr用于将A组件传递过来的属性，下传给C组件<br />$listeners用于将C组件发射的数据，上传给A组件<br />inheritAttrs用于设置属性，当设置为false时候，dom上则不会出现属性。
<a name="4lQcM"></a>
### 尚不明确的点inheritAttrs
<a name="c60s9"></a>
### A组件
```
<component-b
      :pagination="pagination" // 将属性传递给B和C
      v-on:propToComponentA="listenComponentC" // 监听c组件的事件
 />
 
 methods: {
 	listenComponentC(data) {
  
  }
 }
```


<a name="yrdYP"></a>
### B组件
```
<component-c  v-bind="$attrs" v-on="$listeners"/>
inheritAttrs: false
```


<a name="wuVPX"></a>
### C组件
```
	inheritAttrs: false,
  props: {
  	in
  },
  async created() {
   console.log(this.$attrs)
   // 输出可以发现$attrs对象是A组件传递过来的属性
  },
  methods: {
    propToComponentA() {
      const data = {
        name: '古天乐'
      }
      // b组件，c组件都可以监听事件propToComponentA
      this.$emit('propToComponentA',data)
    }
  },
```
这种方式比vuex轻量，而且很方便。<br />

<a name="sIFVN"></a>
### $listeners的事件穿透
$listeners最大的作用，不是组件传值，工作中用到$listeners的组件传值。用的最多的往往是对组件的二次封装时候，用来穿透事件监听。<br />
<br />
<br />
<br />
<br />
<br />

<a name="i6TjR"></a>
## 5、$children、$parent
有时候也有人用这种方式进行组件传值，我几乎不用。<br />欧尔父组件调用子组件事件时候，为了少些代码，直接一个this.$refs.childrenName.childrenField 完事。<br />childrenName   是ref指向的子组件名称<br />childrenField     是子组件中的事件或者参数<br />闲话少说，还是来说说$children、$parent

<a name="nayoJ"></a>
### $children
在父组件中，通过$children可以获得所有无序的子组件组成的数组。<br />注意，当你想用$children调用儿子组件中的方法或者参数时候，一定是需要等挂在完毕，在mounted中调用，或者是$nextTick<br />

<a name="ako2I"></a>
### $parent
子组件可以通过this.$parent获取父组件实例。同样的，打点调用父组件的方法。

<a name="nS6K6"></a>
## 6、中央事件总线 $emit/$on
这个其实是一种思路，eventBus<br />就是创建一个全局的eventBus，然后将你需要的变量、事件等都挂载在上面。需要的时候去获取。<br />现在vue开发很少有人用这种方法了，有了vuex，谁还会去用呢。<br />下面简单介绍一下。<br />

<a name="uOeKK"></a>
### 创建全局响应式变量
一般在main.js中定义一个全局变量，挂在到window下
```
import Vue from 'vue'
window.eventBus = new Vue()
// 也可以挂载到vue原型链上,二选其一
Vue.prototype.$eventBus = new Vue();
```
从这里可以看出eventBus就是一个vue实例，但是是个很奇怪的实例，因为没有router，没有挂载app等，当然，这个实例肯定是响应式，这就是它的作用。<br />接下来，要做的就是将开发中的兄弟组件之间需要传递的变量挂载到上面。<br />

<a name="44yBS"></a>
### 事件挂载到eventBus
C组件
```
// c组件发射了一名为dataFrom的事件，并挂载了数据this.dataA
this.$eventBus.$emit('dataFrom', this.dataA);
```


<a name="Dy0Bi"></a>
### 接收eventBus的事件
因为$eventBus是全局，且响应式的，任何一个组件都可以进行接收
```
this.$eventBus.$on('dataFrom',  function (data) {
     // handle data code
});
```

<br />如果想接收一次事件后移除，就用$once<br />

```
this.$eventBus.$once('dataFrom',  function (data) {
     // handle data code
});
```

<br />
<br />
<br />

<a name="lsJ5Y"></a>
## 7、组件v-modle传值，子传父B→A
有一种开发中的特殊情况，大家在封装属于自己的表单组件或者对element-ui的表单进行二次封装是时候一定遇到过。<br />
<br />举个栗子：<br />
<br />功能要求：我们要对el-input进行二次封装，功能为只能输入数字,，小数点最多保留两位。当尝试输入其他格式，或者尝试三位小数点时候给出 el-form-item__error 的提示。<br />
<br />解决思路：封装一个组件，正则校验只能输入数字。这里涉及到一个问题，如何子给父组件传值，父组件如何给子组件传值。父子组件传值应该是联动的，如何处理。<br />
<br />[代码地址](https://github.com/taoorange/lin-cms-vue/blob/master/src/component/base/number-input/index.vue)：[https://github.com/taoorange/lin-cms-vue/blob/master/src/component/base/number-input/index.vue](https://github.com/taoorange/lin-cms-vue/blob/master/src/component/base/number-input/index.vue)<br />
<br />我们的做法如下：
<a name="yrEAU"></a>
### 子组件
在子组件的props定义变量value,用来接收父组件绑定的v-model<br />在子组件中，通过  this.$emit('input', val)将子组件处理好的父组件传递过来的数据，再回传绑定给父组件在子组件绑定的v-modle属性上。<br />这其实是一个同时改变子父组件的逻辑。<br />
<br />子组件代码：
```
<template>
  <div>
    <el-input
      :disabled="disabled"
      :readonly="readonly"
      :value="value"
      :size="size"
      :positive="positive"
      :integerOnly="integerOnly"
      :placeholder="placeholder"
      :remain="remain"
      :max="max"
      @input="changeInput($event)"
    >
      <template v-if="slotName" :slot="slotType">{{ slotName }}</template>
    </el-input>
    <div v-if="errorMessage" class="el-form-item__error">{{ errorMessage }}</div>
  </div>
</template>
<script>
// 对</el-input>做二次封装，主要用来处理数字输入的小数点保留问题
export default {
  name: 'NumberInput',
  props: {
    slotType: {
      type: String,
      default: 'append',
    },
    slotName: {
      type: String,
      default: null,
    },
    value: {
      type: [Number, String],
      default: null,
    },
    size: {
      type: String,
      default: 'small',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      defalut: '请输入',
    },
    remain: {
      type: [Number, String],
      default: 2, // 默认保留2位小数
    },
    // 限制是否只能输入为正整数
    integerOnly: {
      type: Boolean,
      defalut: false,
    },
    min: {
      type: Number,
      default: -999999999999,
    },
    max: {
      type: Number,
      default: 99999999999999,
    },
    // 限制是否只能为正数
    positive: {
      type: Boolean,
      defalut: false,
    },
  },
  data() {
    return {
      errorMessage: '',
    }
  },
  methods: {
    changeInput(value) {
      let val
      if (!this.integerOnly) {
        // 限制输入框只能为数字和小数点，限制可输入数字的位数
        // 限制只能为正数
        if (this.positive) {
          val = value.replace(/[^\d.]/g, '')
        } else {
          val = value.replace(/[^\d.-]/g, '')
          // val = value.replace(/[^\-?][\d][\.?][\d]/g, '')
        }

        // 校验小数点位数
        if (val.toString().indexOf('.') > -1) {
          const a = val.toString().split('.')
          if (a[1].length > this.remain) {
            val = parseFloat(val).toFixed(this.remain)
            this.errorMessage = `仅支持${this.remain}位小数输入`
          } else {
            this.errorMessage = null
          }
        }
      } else {
        // 限制输入框只能为正整数
        val = value.replace(/[^\d]/g, '')
      }
      if (val > this.max) {
        val = this.max
      }
      if (val && val < this.min) {
        val = this.min
      }
      this.$emit('input', val)
    },
  },
}
</script>
<style lang="scss" scoped>
  /deep/.el-input-group__append {
    padding: 0 5px;
    font-size: 13px;
  }
</style>

```


<a name="b6vXf"></a>
### 父组件

<br />在父组件中，我们通过v-model给子组件绑定值（子组件通过props中的value接收）。
```
// 设置了支持保留4位小数
<number-input :remain="4" v-model="numberMoney"></number-input>
```

<br />
<br />之前说过了vue组件通信 A→B→C模式：<br />
<br />
<br />
<br />接下来，说一下非A→B→C模式的一些组件通信小技巧。<br />

<a name="BoeTt"></a>
# 8、A→B&A→C模式
有下面一个场景：<br />A组件拥有子组件B、C（或者更多）,并且子组件props都接收类似的参数。此时，当B组件需要修改props参数时候，C组件也要跟着修改，有些麻烦，代码看起来比较冗余。<br />那么，有没有什么办法，让B、C接受的参数，一起变化呢。<br />答案是有的。<br />

<a name="bZoeJ"></a>
### A组件：
```
<template>
  <div class="father-component">
    <son-component :modelSon="modelSon" />
    <son-component2 :modelSon="modelSon" />
  </div>
</template>

import SonComponent from './son-component'
import SonComponent2 from './son-component2'
export default {
  name: 'ComponentA',
  components: {
    SonComponent,
    SonComponent2
  },
  data() {
    return {
      modelSon: '父亲'
    }
  },
 }
```


<a name="dYSRk"></a>
### B组件：
```
export default {
  name: 'ComponentB',
  props: {
    modelSon: {
      type: String,
      default: ''
    }
  }
}
```

<br />我的奇淫巧技是这样的，我们知道，当引入一个组件的时候，是可以获取到组件中的各种信息的，包括props。我们在C组件中，直接引入B组件的props，然后填入C组件的props中。这样，当B组件的props改变时候，C组件就自然修改了。<br />代码如下：
<a name="XVDPt"></a>
### C组件：
```
import BigBrother from './son-component'

export default {
  name: '',
  props: {
    ...BigBrother.props
  },
}
```
其实这种方式算不上组件间通信，只能算是组件间获取参数的一种方式。这种奇淫巧技，工作中一般不常用。<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />

