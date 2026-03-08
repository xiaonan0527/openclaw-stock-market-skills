# Yahoo Finance Skill

查询全球股票信息，支持港股、A股、美股等市场。

## 快速开始

```bash
# 查询腾讯股价
node scripts/query.mjs quote 0700.HK

# 查询阿里巴巴公司信息
node scripts/query.mjs profile 9988.HK

# 搜索股票
node scripts/query.mjs search "Xiaomi"
```

## 支持的市场

- 港股：0700.HK (腾讯), 9988.HK (阿里巴巴), 1810.HK (小米)
- A股：600519.SS (茅台), 000858.SZ (五粮液)
- 美股：AAPL, TSLA, MSFT

详细文档请查看 [SKILL.md](SKILL.md)
