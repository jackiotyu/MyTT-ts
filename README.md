# MyTT-ts

[![npm](https://img.shields.io/npm/v/mytt-ts)](https://www.npmjs.com/package/mytt-ts)
[![npm bundle size](https://img.shields.io/bundlephobia/min/mytt-ts)](https://bundlephobia.com/package/mytt-ts)
[![npm downloads](https://img.shields.io/npm/dt/mytt-ts)](https://www.npmjs.com/package/mytt-ts)
[![NPM License](https://img.shields.io/npm/l/mytt-ts)](https://github.com/jackiotyu/MyTT-ts/blob/main/LICENSE)

MyTT 的 TypeScript 实现版本，将通达信、同花顺、文华麦语言等指标公式移植到 TypeScript 中。这是一个轻量级的技术分析指标库，提供了常用的股票、期货技术分析指标。

> 本项目是 [MyTT](https://github.com/mpquant/MyTT) 的 TypeScript 实现版本。

## 特点

- 🎯 完全使用 TypeScript 编写，提供完整的类型定义
- 📦 支持 ESM 和 CommonJS 两种模块规范
- 🚀 基于数组运算，性能优异
- 💡 API 设计与通达信、同花顺等软件保持一致
- 🔧 不依赖其他第三方库，体积小巧
- ✨ 支持所有主流技术指标：MACD、KDJ、RSI、BOLL等

## 安装

```bash
# npm
npm install mytt-ts

# yarn
yarn add mytt-ts

# pnpm
pnpm add mytt-ts
```

## 类型定义

该库提供完整的 TypeScript 类型定义：

```typescript
import { Series, MACD, KDJ } from 'mytt-ts';

// 基础类型
type Series = number[];           // 数值序列
type BoolSeries = boolean[];      // 布尔序列

// 指标函数类型示例
function MACD(
  close: Series,
  short?: number,   // 默认值 12
  long?: number,    // 默认值 26
  m?: number        // 默认值 9
): [Series, Series, Series];  // 返回 [DIF, DEA, MACD]

function KDJ(
  close: Series,
  high: Series,
  low: Series,
  n?: number,       // 默认值 9
  m1?: number,      // 默认值 3
  m2?: number       // 默认值 3
): [Series, Series, Series];  // 返回 [K, D, J]
```

### 使用示例

```typescript
import { MA, MACD, KDJ, Series } from 'mytt-ts';

// 定义数据
const closePrice: Series = [10, 11, 12, 11, 10];
const highPrice: Series = [12, 13, 14, 12, 11];
const lowPrice: Series = [9, 10, 11, 10, 9];

// 计算指标
const ma5 = MA(closePrice, 5);
const [dif, dea, macd] = MACD(closePrice);
const [k, d, j] = KDJ(closePrice, highPrice, lowPrice);

// 类型安全
const wrongInput: Series = ['10', 11, 12]; // TS 会报错
MA(wrongInput, 5); // TS 会报错
```

### 错误处理

所有指标函数都会对输入进行基本验证：
- 输入序列必须是数字数组
- 参数必须是有效的数字
- 序列长度必须足够计算指标

```typescript
import { MA, Series } from 'mytt-ts';

// 序列太短
const shortSeries: Series = [1, 2];
const ma5 = MA(shortSeries, 5); // 前面的值会是 NaN

// 处理 NaN
const result = ma5.map(v => isNaN(v) ? null : v);
```