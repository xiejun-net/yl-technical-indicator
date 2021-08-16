## yl-technical-indicators

常用的股票技术指标：

主指标：BOLL, EMA, EMA, MA,SAR

副指标：ARBR, CR, DMA, EMV, KDJ, MACD, MAVOL, RSI, WR

## install

```
# yarn 

```

## build 

```
# yarn build
```
## 使用

### esm方式

```
improt { MACD } from 'yl-technical-indicator'

/*
* dataList: 行情数据 
* params: 指标设置参数
*/
let res = MACD(dataList, params = [])

```

### commonjs

```
<script src="../lib/bundle.cjs.js"></script>

<script>
var ylIndicator = window[`ylIndicator`];
var result = ylIndicator.WR(data, [6, 10]);
console.log('result==>', ylIndicator, result)
</script>
```
