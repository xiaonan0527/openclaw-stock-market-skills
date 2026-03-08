# 股神 - 双报告模式配置完成 ✅

## 配置概览

### 📊 报告类型
1. **港股动量报告** - 每天早上 8:30
2. **美股动量报告** - 每天晚上 20:30

### 🎯 观察池
- **美股**: 10只（AAPL, MSFT, NVDA, TSLA, AMD, MRNA, BNTX, PLTR, COIN, NIO）
- **港股**: 10只（腾讯0700、阿里9988、小米1810、美团3690、比亚迪1211、理想2015、小鹏9868、港交所0388、中国移动0941、平安2318）

### 🔧 技术架构
- **美股数据源**: Finnhub API（免费版）
- **港股数据源**: Yahoo Finance API（免费）
- **报告生成**: Node.js 脚本
- **发送渠道**: 飞书机器人

---

## 使用方法

### 手动生成报告

```bash
# 港股报告
node scripts/generate-report.mjs --market=hk

# 美股报告
node scripts/generate-report.mjs --market=us

# 综合报告（港股+美股）
node scripts/generate-report.mjs --market=all
```

### 定时任务配置

#### 方式一：使用 cron
```bash
crontab -e
```

添加：
```cron
30 8 * * * cd /root/.openclaw/workspace-stock && node scripts/generate-report.mjs --market=hk
30 20 * * * cd /root/.openclaw/workspace-stock && node scripts/generate-report.mjs --market=us
```

#### 方式二：使用 OpenClaw
已在 HEARTBEAT.md 中配置，OpenClaw 会自动执行。

---

## 报告内容

### 港股报告（早上 8:30）
```
📊 《港股动量报告》
🇭🇰 【港股市场】
  🎯 市场立场（激进买入/保守买入/持币观望）
  📈 观察名单（Top 3 高动量标的）
  ⚠️ 风险提示（仓位建议）
```

### 美股报告（晚上 20:30）
```
📊 《美股动量报告》
🇺🇸 【美股市场】
  🎯 市场立场（激进买入/保守买入/持币观望）
  📈 观察名单（Top 3 高动量标的）
  ⚠️ 风险提示（仓位建议）
```

---

## 文件结构

```
workspace-stock/
├── finnhub-stock/          # 美股数据 skill
│   └── scripts/query.mjs
├── yahoo-finance/          # 港股数据 skill
│   └── scripts/query.mjs
├── scripts/
│   └── generate-report.mjs # 报告生成器（支持 --market 参数）
├── HEARTBEAT.md            # 定时任务配置
├── CRON.md                 # Cron 配置说明
└── README.md               # 本文档
```

---

## 下一步

1. ✅ 脚本已配置完成
2. ⏳ 需要配置定时任务（cron 或 OpenClaw）
3. ⏳ 测试报告发送到飞书

---

## 注意事项

1. **API 限制**: 
   - Finnhub 免费版：每分钟60次请求
   - Yahoo Finance：无明确限制，但建议合理使用

2. **数据延迟**:
   - 美股：实时数据
   - 港股：约15分钟延迟

3. **交易日**:
   - 建议只在交易日发送报告
   - 可以在 cron 中添加日期判断

4. **时区**:
   - 所有时间均为北京时间（UTC+8）
   - Cron 配置需要根据服务器时区调整
