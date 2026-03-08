# Skills 配置指南

这个目录包含三个股票数据查询 skills：

## 1. qveris-official - A股数据（同花顺）
- **功能**: A股实时行情、历史数据、技术指标、公司基本面
- **数据源**: 同花顺 iFinD
- **需要配置**: `QVERIS_API_KEY`

## 2. yahoo-finance - 港股数据
- **功能**: 港股实时报价、公司信息、历史数据、股票搜索
- **数据源**: Yahoo Finance API
- **需要配置**: 无（免费 API，无需 API key）

## 3. finnhub-stock - 美股数据
- **功能**: 美股实时报价、公司基本面、K线数据、财务报表、分析师评级
- **数据源**: Finnhub API
- **需要配置**: `FINNHUB_API_KEY`

## 配置方法

### 1. 复制配置示例文件

```bash
cd /root/.openclaw/workspace-stock
cp .openclaw/env.example.json .openclaw/env.json
```

### 2. 编辑配置文件

编辑 `.openclaw/env.json`，填入你的 API keys：

```json
{
  "QVERIS_API_KEY": "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "FINNHUB_API_KEY": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

### 3. 获取 API Keys

- **QVeris API Key**: 访问 [QVeris.ai](https://qveris.ai/) 注册账号
- **Finnhub API Key**: 访问 [Finnhub.io](https://finnhub.io/) 注册免费账号
- **Yahoo Finance**: 无需 API key

## 安全提示

⚠️ **重要**: 
- `.openclaw/env.json` 包含敏感信息，不要提交到 Git
- 分享 skills 时，只分享 `env.example.json`，不要分享 `env.json`
- 所有 API keys 都从环境变量读取，代码中没有硬编码

## 验证配置

配置完成后，可以测试一下：

```bash
# 测试 A股查询（需要 QVERIS_API_KEY）
node skills/qveris-official/scripts/qveris_tool.mjs search "China A-share real-time stock price"

# 测试港股查询（无需 API key）
node skills/yahoo-finance/scripts/query.mjs quote 0700.HK

# 测试美股查询（需要 FINNHUB_API_KEY）
# 注意：直接运行脚本时需要手动设置环境变量
FINNHUB_API_KEY=your_key node skills/finnhub-stock/scripts/query.mjs quote AAPL
```

## 文件结构

```
skills/
├── qveris-official/
│   ├── SKILL.md
│   ├── CAPABILITIES.md
│   └── scripts/
│       └── qveris_tool.mjs
├── yahoo-finance/
│   ├── SKILL.md
│   └── scripts/
│       └── query.mjs
└── finnhub-stock/
    ├── SKILL.md
    └── scripts/
        └── query.mjs

.openclaw/
├── env.json           # 实际配置（不要分享）
└── env.example.json   # 配置示例（可以分享）
```

## 分享 Skills

如果你想分享这些 skills 给其他人：

1. ✅ **可以分享**:
   - `skills/` 目录下的所有文件
   - `.openclaw/env.example.json`
   - 这个 README.md

2. ❌ **不要分享**:
   - `.openclaw/env.json`（包含你的 API keys）
   - 任何包含 API keys 的文件

## 更新记录

- **2026-03-08**: 
  - 修复 finnhub-stock 的 API key 硬编码问题
  - 所有 API keys 改为从环境变量读取
  - 添加配置示例文件和文档
