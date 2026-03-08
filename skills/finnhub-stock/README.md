# Finnhub Stock Query Skill

使用 Finnhub API 查询股票市场数据的 OpenClaw skill。

## 功能特性

- ✅ 实时股票价格查询
- ✅ 公司基本面信息
- ✅ K线历史数据
- ✅ 股票搜索
- ✅ 财务报表查询
- ✅ 新闻获取

## 快速开始

### 查询苹果公司股价
```bash
node ~/.openclaw/workspace/skills/finnhub-stock/scripts/query.mjs quote AAPL
```

### 查询特斯拉公司信息
```bash
node ~/.openclaw/workspace/skills/finnhub-stock/scripts/query.mjs profile TSLA
```

### 搜索股票
```bash
node ~/.openclaw/workspace/skills/finnhub-stock/scripts/query.mjs search Apple
```

## 完整文档

详见 [SKILL.md](./SKILL.md)

## API Key

API key 已配置在脚本中，无需额外设置。

## 限制

免费版限制：每分钟 60 次请求

## 支持的市场

- 美股（US Stocks）
- 全球股票
- 外汇（Forex）
- 加密货币（Crypto）
