---
name: yahoo-finance
description: 使用 Yahoo Finance API 查询全球股票信息，支持港股、A股、美股等市场。提供实时报价、公司信息、历史数据等功能。
metadata: {"clawdbot":{"emoji":"📊"}}
triggers:
  - 港股
  - A股
  - yahoo finance
  - 查询港股
  - 查询A股
  - 全球股票
priority: 80
---

# Yahoo Finance 股票查询 Skill

使用 Yahoo Finance API 查询全球股票市场数据，支持港股、A股、美股等市场。

## 功能

1. **实时股票报价** - 获取股票的实时报价（延迟约15分钟）
2. **公司基本信息** - 查询公司概况、行业、市值等信息
3. **历史价格数据** - 获取历史价格数据（支持多种时间范围和间隔）
4. **搜索股票** - 根据公司名称或代码搜索股票

## 支持的市场

- **港股**（Hong Kong Stock Exchange）
- **A股**（Shanghai & Shenzhen Stock Exchange）
- **美股**（US Stock Markets）
- **全球其他市场**

## 股票代码格式

### 港股
- 腾讯控股：`0700.HK`
- 阿里巴巴：`9988.HK`
- 小米集团：`1810.HK`
- 美团：`3690.HK`
- 比亚迪：`1211.HK`

### A股
- 上证指数：`000001.SS`
- 贵州茅台：`600519.SS`
- 五粮液：`000858.SZ`
- 宁德时代：`300750.SZ`

### 美股
- 苹果：`AAPL`
- 特斯拉：`TSLA`
- 微软：`MSFT`

## 使用方法

### 1. 查询实时股票报价

```bash
node ~/.openclaw/workspace-stock/yahoo-finance/scripts/query.mjs quote 0700.HK
```

### 2. 查询公司基本信息

```bash
node ~/.openclaw/workspace-stock/yahoo-finance/scripts/query.mjs profile 9988.HK
```

### 3. 获取历史价格数据

```bash
node ~/.openclaw/workspace-stock/yahoo-finance/scripts/query.mjs history 0700.HK --range 1mo --interval 1d
```

### 4. 搜索股票

```bash
node ~/.openclaw/workspace-stock/yahoo-finance/scripts/query.mjs search "Tencent"
```

## 参数说明

### 历史数据范围 (--range)
- `1d` - 1天
- `5d` - 5天
- `1mo` - 1个月
- `3mo` - 3个月
- `6mo` - 6个月
- `1y` - 1年
- `2y` - 2年
- `5y` - 5年
- `10y` - 10年
- `ytd` - 年初至今
- `max` - 最大范围

### 数据间隔 (--interval)
- `1m`, `2m`, `5m`, `15m`, `30m`, `60m`, `90m` - 分钟级
- `1h` - 小时
- `1d` - 日线
- `5d` - 5日线
- `1wk` - 周线
- `1mo` - 月线
- `3mo` - 季线

## 示例

### 查询腾讯股价
```bash
node ~/.openclaw/workspace-stock/yahoo-finance/scripts/query.mjs quote 0700.HK
```

输出：
```
📈 0700.HK 实时报价:

交易所:   HKSE
货币:     HKD
当前价格: HKD 385.60
开盘价:   HKD 382.00
最高价:   HKD 388.20
最低价:   HKD 380.40
前收盘:   HKD 383.00
涨跌额:   HKD 2.60
涨跌幅:   0.68%
成交量:   25,432,100
```

### 查询阿里巴巴公司信息
```bash
node ~/.openclaw/workspace-stock/yahoo-finance/scripts/query.mjs profile 9988.HK
```

### 获取小米最近3个月的日K线
```bash
node ~/.openclaw/workspace-stock/yahoo-finance/scripts/query.mjs history 1810.HK --range 3mo --interval 1d
```

### 搜索比亚迪
```bash
node ~/.openclaw/workspace-stock/yahoo-finance/scripts/query.mjs search "BYD"
```

## 模块导入使用

在其他脚本中导入使用：

```javascript
import { fetchQuote, fetchProfile, fetchHistory, fetchSearch } from '../yahoo-finance/scripts/query.mjs';

// 查询腾讯股价
const quote = await fetchQuote('0700.HK');
console.log(quote.regularMarketPrice);

// 查询公司信息
const profile = await fetchProfile('9988.HK');
console.log(profile.longName);

// 获取历史数据
const history = await fetchHistory('1810.HK', '1mo', '1d');
console.log(history.close);

// 搜索股票
const results = await fetchSearch('Tencent');
console.log(results.quotes);
```

## 注意事项

1. **数据延迟**：Yahoo Finance 免费数据通常有15分钟左右的延迟
2. **请求频率**：虽然没有明确的请求限制，但建议合理使用，避免过于频繁的请求
3. **数据准确性**：数据仅供参考，不构成投资建议
4. **API 稳定性**：Yahoo Finance 是非官方 API，可能会有变动

## 技术细节

- 使用 Node.js 原生 `https` 模块
- RESTful API 调用
- JSON 格式输出
- 支持命令行和模块导入两种使用方式
- 完全免费，无需 API Key
