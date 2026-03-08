# OpenClaw Stock Market Skills

<div align="center">

[![OpenClaw](https://img.shields.io/badge/OpenClaw-Skills-blue?style=flat-square)](https://openclaw.ai)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/xiaonan0527/openclaw-stock-market-skills?style=flat-square)](https://github.com/xiaonan0527/openclaw-stock-market-skills/stargazers)

**全球股票市场数据查询 Skills for OpenClaw AI Agent**

覆盖 A股 🇨🇳 · 港股 🇭🇰 · 美股 🇺🇸

[快速开始](#快速开始) · [文档](skills/README.md) · [贡献指南](#贡献) · [问题反馈](https://github.com/xiaonan0527/openclaw-stock-market-skills/issues)

</div>

---

## ✨ 特性

- 🌏 **多市场覆盖** - 支持 A股、港股、美股三大主要市场
- 📊 **实时数据** - 实时行情、历史数据、技术指标
- 🏢 **基本面分析** - 公司信息、财务报表、分析师评级
- 🔒 **安全设计** - API keys 从环境变量读取，无硬编码
- 📦 **开箱即用** - 完整配置指南，快速集成

## 📦 包含的 Skills

| Skill | 市场 | 数据源 | 功能 |
|-------|------|--------|------|
| **qveris-official** | 🇨🇳 A股 | 同花顺 iFinD | 实时行情、历史数据、技术指标、公司基本面 |
| **yahoo-finance** | 🇭🇰 港股 | Yahoo Finance | 实时报价、公司信息、历史数据（免费） |
| **finnhub-stock** | 🇺🇸 美股 | Finnhub | 实时报价、K线数据、财务报表、分析师评级 |

## 🚀 快速开始

### 1. 安装

```bash
# 克隆仓库
git clone https://github.com/xiaonan0527/openclaw-stock-market-skills.git

# 复制 skills 到你的 OpenClaw workspace
cp -r openclaw-stock-market-skills/skills/* /path/to/openclaw/workspace/skills/
```

### 2. 配置

```bash
# 复制配置示例
cp .openclaw/env.example.json /path/to/openclaw/workspace/.openclaw/env.json

# 编辑配置文件，填入你的 API keys
nano /path/to/openclaw/workspace/.openclaw/env.json
```

### 3. 获取 API Keys

- **QVeris** (A股): [qveris.ai](https://qveris.ai/)
- **Finnhub** (美股): [finnhub.io](https://finnhub.io/)
- **Yahoo Finance** (港股): 无需 API key

### 4. 使用

```bash
# 查询 A股（茅台）
node skills/qveris-official/scripts/qveris_tool.mjs search "China A-share real-time stock price"

# 查询港股（腾讯）
node skills/yahoo-finance/scripts/query.mjs quote 0700.HK

# 查询美股（苹果）
node skills/finnhub-stock/scripts/query.mjs quote AAPL
```

## 📖 文档

完整的配置指南和使用说明，请查看：

- **[Skills 配置指南](skills/README.md)** - 详细的安装、配置和使用文档
- **[QVeris Skill](skills/qveris-official/SKILL.md)** - A股数据查询
- **[Yahoo Finance Skill](skills/yahoo-finance/SKILL.md)** - 港股数据查询
- **[Finnhub Skill](skills/finnhub-stock/SKILL.md)** - 美股数据查询

## 🔒 安全提示

- ⚠️ `.openclaw/env.json` 包含敏感信息，**不要提交到 Git**
- ✅ 分享时只分享 `env.example.json`
- ✅ 所有 API keys 都从环境变量读取

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源。

## 🙏 致谢

- [OpenClaw](https://openclaw.ai) - AI Agent 框架
- [QVeris](https://qveris.ai) - A股数据 API
- [Yahoo Finance](https://finance.yahoo.com) - 港股数据 API
- [Finnhub](https://finnhub.io) - 美股数据 API

---

<div align="center">

**⚠️ 免责声明**

本项目提供的数据仅供参考，不构成投资建议。投资有风险，入市需谨慎。

Made with ❤️ for [OpenClaw](https://openclaw.ai)

</div>
