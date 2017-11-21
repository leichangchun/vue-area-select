# vue-area-select
一个简单的省区市滑动选择插件

## 安装
```JS
npm install vue-area-select-lei --save
```

## 使用
```JS
//ES6引入
import areaSelect from 'vue-area-select-lei'
//require引入
var areaSelect = require('AreaSelect')

Vue.use(areaSelect)

//组件中使用
<vue-area-select></vue-area-select>
```

## 配置

```html
<vue-area-select :isShow="isShow"
                 :font-size="size"
                 active-color="green"
                 :line-height="height"
                 @fade="hidden"
                 @selectdone="doSomething"></vue-area-select>
```

### Props说明

|    参数    |    作用   |   类型   | 默认值 |
| -----------------  | ---------------- | :--------: | :----------: |
| isShow        | 显示插件 |Boolean | false
| font-size       | 省市区文字的大小 |Number| 14 (px)
| active-color        | 被选中的颜色 |String | rgb(84, 193, 153)
| line-height        | 数据的行高 |Number | 30 (px)


### 事件

| name | Description   |
| :--------:   | -----  |
|    fade    |  隐藏插件的事件
|    selectdone    |  选择省市区完成的事件，一并返回位置数据

#### 位置数据格式
```JS
{
  province:"河北省"
  city:"秦皇岛市",
  district:"北戴河区",
  location:{
    lat:39.83507
    lng:119.48458
  }
}
```
