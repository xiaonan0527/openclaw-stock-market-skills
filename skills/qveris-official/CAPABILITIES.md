# QVeris Official - 功能清单

## 核心能力

QVeris 是一个搜索和执行引擎，聚合了数千种工具和 API，涵盖以下领域：

### 1. 金融市场数据 📊

#### 股票市场
- **美股**: 实时报价、历史数据、公司财报、分析师评级
- **A 股**: 同花顺（THS）实时行情、历史数据、技术指标、公司基本面
- **港股**: 实时报价、历史数据
- **全球股票**: 支持多个交易所

#### 加密货币
- 实时价格、24小时涨跌幅
- 市值排名、交易量
- DeFi 协议 TVL 数据
- NFT 市场数据
- 链上交易分析

#### 其他金融产品
- 外汇汇率（实时）
- 期货价格
- ETF 数据
- 商品价格（黄金、白银等）

#### 经济指标
- GDP 增长率
- 通胀率（CPI、PPI）
- 失业率
- 贸易平衡数据

### 2. 公司与财务数据 💼

- 公司财报（收入、净利润、EPS）
- SEC 文件
- 财务报表
- 公司基本信息
- 行业分类

### 3. 新闻与社交媒体 📰

- 实时新闻头条
- 行业新闻订阅
- 分类新闻
- Twitter/X 趋势话题
- 社交媒体分析
- 用户互动指标

### 4. AI 能力 🤖

#### 图像处理
- AI 图像生成（文本转图像）
- 图像编辑
- OCR 文字识别

#### 视频处理
- AI 视频生成
- 视频转录
- 视频摘要

#### 音频处理
- 文本转语音（TTS）
- 语音识别
- 音频转录

#### 文档处理
- PDF 文本提取
- 文档解析
- 内容转换

#### 翻译
- 多语言翻译
- 实时翻译服务

#### AI 模型
- LLM 推理
- 文本嵌入生成
- 情感分析

### 5. 地理位置服务 🗺️

- 地理编码（地址转坐标）
- 逆地理编码（坐标转地址）
- 步行/驾车导航
- POI 搜索
- 卫星图像

### 6. 学术与研究 📚

- 学术论文搜索
- 专利数据库
- 临床试验注册
- 数据集发现
- PubMed 生物医学文献搜索

### 7. 天气与气候 🌤️

- 天气预报
- 空气质量指数（AQI）
- 历史气候数据
- 卫星天气图像

### 8. 医疗健康 🏥

- 药物信息数据库
- 健康统计
- 医疗状况数据
- 临床试验信息

---

## A 股专用工具

### 1. 同花顺（THS）实时行情
- **Tool ID**: `ths_ifind.real_time_quotation.v1`
- **功能**: 查询 A 股实时报价
- **参数**: 
  - `codes`: 股票代码（如 "300033.SZ,600030.SH"）
  - `indicators`: 可选指标
- **成功率**: 100%

### 2. 同花顺历史行情
- **Tool ID**: `ths_ifind.quotation.v1`
- **功能**: 查询历史和实时行情数据
- **参数**:
  - `codes`: 股票代码
  - `startdate`: 开始日期
  - `enddate`: 结束日期
  - `indicators`: 指标
  - `interval`: 时间间隔

### 3. A 股股票表现
- **Tool ID**: `mcp_ths_stock.get_stock_perfomance.v1`
- **功能**: 日频历史行情、技术指标、技术形态
- **支持**: 开高低收、成交量、收益率、技术指标

### 4. A 股股票基本信息
- **Tool ID**: `mcp_ths_stock.get_stock_info.v1`
- **功能**: 股票基本资料、上市公司信息、行业分类

---

## 使用最佳实践

### 搜索查询技巧

1. **用英文搜索**（获得最佳结果）
2. **按能力搜索，而非参数**
   - ✅ "China A-share real-time stock price data"
   - ❌ "get 600519 price"

3. **越具体越好**
   - ✅ "China A-share real-time stock market data API"
   - ⭕ "stock market API"

4. **多次尝试不同措辞**

### 工具选择标准

1. **成功率** (`success_rate`) - 优先选择 100% 成功率的工具
2. **平均执行时间** (`avg_execution_time_ms`) - 越快越好
3. **参数匹配度** - 确保必需参数可以提供
4. **功能完整性** - 选择功能最全面的工具

### 已知工具记录

为了优化 token 使用和避免重复搜索，记录常用工具：

#### A 股实时行情
```json
{
  "tool_id": "ths_ifind.real_time_quotation.v1",
  "name": "iFinD 同花顺实时行情",
  "required_params": ["codes"],
  "optional_params": ["indicators"],
  "example": {"codes": "300033.SZ,600030.SH"},
  "success_rate": "100%",
  "avg_time": "0.0ms"
}
```

#### 美股实时报价
```json
{
  "tool_id": "finnhub.quote.retrieve.v1.f72cf5ef",
  "name": "Quote",
  "required_params": ["symbol"],
  "example": {"symbol": "AAPL"},
  "success_rate": "100%",
  "avg_time": "4.7ms"
}
```

---

## 注意事项

1. **API 限制**: 根据 QVeris 订阅计划
2. **数据延迟**: 部分数据可能有延迟
3. **搜索语言**: 使用英文获得最佳结果
4. **工具可用性**: 定期刷新工具列表
5. **参数格式**: 严格按照工具要求的格式传递参数

---

## 相关文档

- [QVeris 官网](https://qveris.ai)
- [GitHub](https://github.com/QVerisAI/open-qveris-skills)
- [SKILL.md](./SKILL.md) - 完整文档
