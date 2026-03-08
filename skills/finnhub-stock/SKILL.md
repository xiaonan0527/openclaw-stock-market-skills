---
name: finnhub-stock
description: 使用 Finnhub API 查询股票实时价格、公司基本面、K线数据、财务报表等信息。支持美股、全球股票、外汇和加密货币。
metadata: 
  clawdbot:
    emoji: "📈"
    requires:
      env: ["FINNHUB_API_KEY"]
    primaryEnv: "FINNHUB_API_KEY"
    files: ["scripts/*"]
env:
  - FINNHUB_API_KEY
requirements:
  env_vars:
    - FINNHUB_API_KEY
credentials:
  primary: FINNHUB_API_KEY
  scope: read-only
  endpoint: https://finnhub.io/api/v1
triggers:
  - 股票
  - 股价
  - stock
  - finnhub
  - 查询股票
  - 股票信息
  - 公司基本面
  - K线
  - 财报
priority: 80
---

# Finnhub 股票查询 Skill

使用 Finnhub API 查询股票市场数据，包括实时价格、公司基本面、K线数据、财务报表等。

## 功能

1. **实时股票价格** - 获取股票的实时报价
2. **公司基本面** - 查询公司概况、行业、市值等信息
3. **K线数据** - 获取历史价格数据（日线、周线、月线）
4. **财务报表** - 查询收入报表、资产负债表、现金流量表
5. **新闻情感** - 获取股票相关新闻和情感分析
6. **搜索股票** - 根据公司名称或代码搜索股票
7. **分析师评级** - 查询分析师推荐、目标价、盈利预测（新增）

## 使用方法

### 1. 查询实时股票价格

```bash
node ~/.openclaw/workspace/skills/finnhub-stock/scripts/query.mjs quote AAPL
```

### 2. 查询公司基本面

```bash
node ~/.openclaw/workspace/skills/finnhub-stock/scripts/query.mjs profile AAPL
```

### 3. 获取K线数据

```bash
node ~/.openclaw/workspace/skills/finnhub-stock/scripts/query.mjs candle AAPL --resolution D --days 30
```

### 4. 搜索股票

```bash
node ~/.openclaw/workspace/skills/finnhub-stock/scripts/query.mjs search Apple
```

### 5. 查询财务报表

```bash
node ~/.openclaw/workspace/skills/finnhub-stock/scripts/query.mjs financials AAPL
```

### 6. 获取新闻

```bash
node ~/.openclaw/workspace/skills/finnhub-stock/scripts/query.mjs news AAPL
```

### 7. 查询综合分析师评级（推荐）

```bash
node ~/.openclaw/workspace/skills/finnhub-stock/scripts/query.mjs rating AAPL
```

### 8. 查询分析师推荐趋势

```bash
node ~/.openclaw/workspace/skills/finnhub-stock/scripts/query.mjs recommendation TSLA
```

### 9. 查询分析师目标价

```bash
node ~/.openclaw/workspace/skills/finnhub-stock/scripts/query.mjs target MSFT
```

### 10. 查询盈利预测

```bash
node ~/.openclaw/workspace/skills/finnhub-stock/scripts/query.mjs earnings GOOGL
```

## 参数说明

- `symbol`: 股票代码（如 AAPL, TSLA, MSFT）
- `--resolution`: K线分辨率（1, 5, 15, 30, 60, D, W, M）
- `--days`: 获取最近N天的数据
- `--from`: 开始日期（YYYY-MM-DD）
- `--to`: 结束日期（YYYY-MM-DD）

## 支持的市场

- 美股（US Stocks）
- 全球股票
- 外汇（Forex）
- 加密货币（Crypto）

## API 限制

免费版限制：
- 每分钟 60 次请求
- 实时数据访问

## 示例

### 查询苹果公司股价
```bash
node ~/.openclaw/workspace/skills/finnhub-stock/scripts/query.mjs quote AAPL
```

输出：
```json
{
  "c": 150.25,  // 当前价格
  "h": 151.50,  // 最高价
  "l": 149.80,  // 最低价
  "o": 150.00,  // 开盘价
  "pc": 149.50, // 前收盘价
  "t": 1234567890
}
```

### 查询特斯拉公司信息
```bash
node ~/.openclaw/workspace/skills/finnhub-stock/scripts/query.mjs profile TSLA
```

### 获取最近30天的日K线
```bash
node ~/.openclaw/workspace/skills/finnhub-stock/scripts/query.mjs candle AAPL --resolution D --days 30
```

## 配置

需要在 `.openclaw/env.json` 中配置 Finnhub API key：

```json
{
  "FINNHUB_API_KEY": "your_api_key_here"
}
```

获取 API key：访问 [Finnhub.io](https://finnhub.io/) 注册免费账号。

## 注意事项

1. 需要在 `.openclaw/env.json` 中配置 `FINNHUB_API_KEY` 环境变量
2. 股票代码需要使用正确的格式（通常是大写）
3. 免费版有请求频率限制（每分钟60次），请合理使用
4. 数据仅供参考，不构成投资建议

## 技术细节

- 使用 Node.js 实现
- RESTful API 调用
- JSON 格式输出
- 支持命令行参数
