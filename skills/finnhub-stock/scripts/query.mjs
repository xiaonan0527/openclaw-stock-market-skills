#!/usr/bin/env node

/**
 * Finnhub Stock Query Script
 * 使用 Finnhub API 查询股票信息
 * 支持 CLI 和模块导入两种使用方式
 */

import https from 'https';
import { fileURLToPath } from 'url';

// 从环境变量读取 API key
const API_KEY = process.env.FINNHUB_API_KEY;
if (!API_KEY) {
  throw new Error('FINNHUB_API_KEY environment variable is not set');
}

const BASE_URL = 'https://finnhub.io/api/v1';

/**
 * 发送 HTTP GET 请求
 */
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * 查询实时股票价格（仅返回数据，不打印）
 */
export async function fetchQuote(symbol) {
  const url = `${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`;
  return await httpsGet(url);
}

/**
 * 查询公司基本面（仅返回数据，不打印）
 */
export async function fetchProfile(symbol) {
  const url = `${BASE_URL}/stock/profile2?symbol=${symbol}&token=${API_KEY}`;
  return await httpsGet(url);
}

/**
 * 获取分析师推荐（仅返回数据，不打印）
 */
export async function fetchRecommendation(symbol) {
  const url = `${BASE_URL}/stock/recommendation?symbol=${symbol}&token=${API_KEY}`;
  return await httpsGet(url);
}

/**
 * 获取新闻（仅返回数据，不打印）
 */
export async function fetchNews(symbol, days = 7) {
  const to = new Date().toISOString().split('T')[0];
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const url = `${BASE_URL}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${API_KEY}`;
  return await httpsGet(url);
}

/**
 * 获取目标价（仅返回数据，不打印）
 */
export async function fetchPriceTarget(symbol) {
  const url = `${BASE_URL}/stock/price-target?symbol=${symbol}&token=${API_KEY}`;
  return await httpsGet(url);
}

/**
 * 获取盈利预测（仅返回数据，不打印）
 */
export async function fetchEarnings(symbol) {
  const url = `${BASE_URL}/stock/earnings?symbol=${symbol}&token=${API_KEY}`;
  return await httpsGet(url);
}

/**
 * 获取K线数据（仅返回数据，不打印）
 */
export async function fetchCandle(symbol, resolution = 'D', days = 30) {
  const to = Math.floor(Date.now() / 1000);
  const from = to - (days * 24 * 60 * 60);
  const url = `${BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${API_KEY}`;
  return await httpsGet(url);
}

/**
 * 搜索股票（仅返回数据，不打印）
 */
export async function fetchSearch(query) {
  const url = `${BASE_URL}/search?q=${encodeURIComponent(query)}&token=${API_KEY}`;
  return await httpsGet(url);
}

/**
 * 获取财务报表（仅返回数据，不打印）
 */
export async function fetchFinancials(symbol) {
  const url = `${BASE_URL}/stock/financials?symbol=${symbol}&statement=ic&freq=annual&token=${API_KEY}`;
  return await httpsGet(url);
}

// ============ CLI 功能（带打印输出） ============

/**
 * 查询实时股票价格（CLI版本，带打印）
 */
async function getQuote(symbol) {
  const data = await fetchQuote(symbol);
  
  console.log(`\n📈 ${symbol} 实时报价:\n`);
  console.log(`当前价格: $${data.c}`);
  console.log(`开盘价:   $${data.o}`);
  console.log(`最高价:   $${data.h}`);
  console.log(`最低价:   $${data.l}`);
  console.log(`前收盘:   $${data.pc}`);
  console.log(`涨跌额:   $${(data.c - data.pc).toFixed(2)}`);
  console.log(`涨跌幅:   ${((data.c - data.pc) / data.pc * 100).toFixed(2)}%`);
  console.log(`时间戳:   ${new Date(data.t * 1000).toLocaleString()}`);
  
  return data;
}

/**
 * 查询公司基本面（CLI版本，带打印）
 */
async function getProfile(symbol) {
  const data = await fetchProfile(symbol);
  
  console.log(`\n🏢 ${symbol} 公司信息:\n`);
  console.log(`公司名称: ${data.name}`);
  console.log(`行业:     ${data.finnhubIndustry || 'N/A'}`);
  console.log(`国家:     ${data.country}`);
  console.log(`货币:     ${data.currency}`);
  console.log(`交易所:   ${data.exchange}`);
  console.log(`IPO日期:  ${data.ipo}`);
  console.log(`市值:     $${(data.marketCapitalization / 1000).toFixed(2)}B`);
  console.log(`流通股:   ${(data.shareOutstanding / 1000000).toFixed(2)}M`);
  console.log(`网站:     ${data.weburl}`);
  console.log(`Logo:     ${data.logo}`);
  
  return data;
}

/**
 * 获取K线数据（CLI版本，带打印）
 */
async function getCandle(symbol, resolution = 'D', days = 30) {
  const data = await fetchCandle(symbol, resolution, days);
  
  if (data.s === 'no_data') {
    console.log(`\n❌ ${symbol} 没有K线数据`);
    return null;
  }
  
  console.log(`\n📊 ${symbol} K线数据 (最近${days}天, ${resolution}):\n`);
  console.log(`数据点数: ${data.c.length}`);
  
  // 显示最近5个数据点
  const count = Math.min(5, data.c.length);
  console.log(`\n最近${count}个交易日:`);
  for (let i = data.c.length - count; i < data.c.length; i++) {
    const date = new Date(data.t[i] * 1000).toLocaleDateString();
    console.log(`${date}: 开$${data.o[i]} 高$${data.h[i]} 低$${data.l[i]} 收$${data.c[i]} 量${data.v[i]}`);
  }
  
  return data;
}

/**
 * 搜索股票（CLI版本，带打印）
 */
async function searchSymbol(query) {
  const data = await fetchSearch(query);
  
  console.log(`\n🔍 搜索结果: "${query}"\n`);
  
  if (data.count === 0) {
    console.log('未找到匹配的股票');
    return data;
  }
  
  console.log(`找到 ${data.count} 个结果:\n`);
  data.result.slice(0, 10).forEach((item, i) => {
    console.log(`${i + 1}. ${item.symbol} - ${item.description} (${item.type})`);
  });
  
  return data;
}

/**
 * 获取财务报表（CLI版本，带打印）
 */
async function getFinancials(symbol) {
  const data = await fetchFinancials(symbol);
  
  console.log(`\n💰 ${symbol} 财务报表 (年度):\n`);
  
  if (!data.financials || data.financials.length === 0) {
    console.log('暂无财务数据');
    return data;
  }
  
  // 显示最近一年的数据
  const latest = data.financials[0];
  console.log(`报告期: ${latest.period}`);
  console.log(`\n收入报表:`);
  console.log(`总收入:   $${(latest.revenue / 1000000).toFixed(2)}M`);
  console.log(`净利润:   $${(latest.netIncome / 1000000).toFixed(2)}M`);
  console.log(`毛利润:   $${(latest.grossProfit / 1000000).toFixed(2)}M`);
  console.log(`EPS:      $${latest.eps}`);
  
  return data;
}

/**
 * 获取新闻（CLI版本，带打印）
 */
async function getNews(symbol) {
  const data = await fetchNews(symbol);
  
  console.log(`\n📰 ${symbol} 最近新闻 (最近7天):\n`);
  
  if (data.length === 0) {
    console.log('暂无新闻');
    return data;
  }
  
  data.slice(0, 5).forEach((item, i) => {
    const date = new Date(item.datetime * 1000).toLocaleDateString();
    console.log(`${i + 1}. [${date}] ${item.headline}`);
    console.log(`   来源: ${item.source}`);
    console.log(`   链接: ${item.url}\n`);
  });
  
  return data;
}

/**
 * 获取分析师推荐趋势（CLI版本，带打印）
 */
async function getRecommendation(symbol) {
  const data = await fetchRecommendation(symbol);
  
  console.log(`\n⭐ ${symbol} 分析师推荐趋势:\n`);
  
  if (!data || data.length === 0) {
    console.log('暂无分析师推荐数据');
    return data;
  }
  
  // 显示最近3个月的数据
  data.slice(0, 3).forEach((item) => {
    console.log(`\n${item.period}:`);
    console.log(`  强力买入: ${item.strongBuy}`);
    console.log(`  买入:     ${item.buy}`);
    console.log(`  持有:     ${item.hold}`);
    console.log(`  卖出:     ${item.sell}`);
    console.log(`  强力卖出: ${item.strongSell}`);
    
    const total = item.strongBuy + item.buy + item.hold + item.sell + item.strongSell;
    const bullish = item.strongBuy + item.buy;
    const bearish = item.sell + item.strongSell;
    const sentiment = bullish > bearish ? '看涨' : bearish > bullish ? '看跌' : '中性';
    console.log(`  总计:     ${total} 位分析师`);
    console.log(`  情绪:     ${sentiment} (${bullish}看涨 vs ${bearish}看跌)`);
  });
  
  return data;
}

/**
 * 获取目标价（CLI版本，带打印）
 */
async function getPriceTarget(symbol) {
  const data = await fetchPriceTarget(symbol);
  
  console.log(`\n🎯 ${symbol} 分析师目标价:\n`);
  
  if (!data || !data.targetHigh) {
    console.log('暂无目标价数据');
    return data;
  }
  
  console.log(`目标价 (最高): $${data.targetHigh}`);
  console.log(`目标价 (平均): $${data.targetMean}`);
  console.log(`目标价 (中位): $${data.targetMedian}`);
  console.log(`目标价 (最低): $${data.targetLow}`);
  console.log(`分析师数量:    ${data.numberOfAnalysts}`);
  console.log(`更新时间:      ${data.lastUpdated}`);
  
  // 获取当前价格进行对比
  const quote = await fetchQuote(symbol);
  
  if (quote && quote.c) {
    const currentPrice = quote.c;
    const upside = ((data.targetMean - currentPrice) / currentPrice * 100).toFixed(2);
    console.log(`\n当前价格:      $${currentPrice}`);
    console.log(`上涨空间:      ${upside}% (基于平均目标价)`);
  }
  
  return data;
}

/**
 * 获取盈利预测（CLI版本，带打印）
 */
async function getEarningsEstimate(symbol) {
  const data = await fetchEarnings(symbol);
  
  console.log(`\n💼 ${symbol} 盈利预测:\n`);
  
  if (!data || data.length === 0) {
    console.log('暂无盈利预测数据');
    return data;
  }
  
  // 显示最近4个季度的数据
  data.slice(0, 4).forEach((item) => {
    console.log(`\n${item.period}:`);
    console.log(`  实际EPS:   ${item.actual !== null ? '$' + item.actual : 'N/A'}`);
    console.log(`  预期EPS:   ${item.estimate !== null ? '$' + item.estimate : 'N/A'}`);
    
    if (item.actual !== null && item.estimate !== null) {
      const surprise = item.actual - item.estimate;
      const surprisePercent = (surprise / item.estimate * 100).toFixed(2);
      console.log(`  超预期:    $${surprise.toFixed(2)} (${surprisePercent}%)`);
    }
  });
  
  return data;
}

/**
 * 获取综合分析师评级（整合多个数据）
 */
async function getAnalystRating(symbol) {
  console.log(`\n📊 ${symbol} 综合分析师评级\n`);
  console.log('='.repeat(60));
  
  try {
    // 1. 推荐趋势
    await getRecommendation(symbol);
    console.log('\n' + '-'.repeat(60));
    
    // 2. 目标价
    await getPriceTarget(symbol);
    console.log('\n' + '-'.repeat(60));
    
    // 3. 盈利预测
    await getEarningsEstimate(symbol);
    console.log('\n' + '='.repeat(60));
    
  } catch (error) {
    console.error(`获取分析师评级时出错: ${error.message}`);
  }
}

/**
 * 主函数（仅在 CLI 模式下执行）
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Finnhub Stock Query Tool

用法:
  node query.mjs <command> <symbol> [options]

命令:
  quote <symbol>              查询实时股票价格
  profile <symbol>            查询公司基本面
  candle <symbol>             获取K线数据
  search <query>              搜索股票
  financials <symbol>         查询财务报表
  news <symbol>               获取新闻
  recommendation <symbol>     查询分析师推荐趋势
  target <symbol>             查询分析师目标价
  earnings <symbol>           查询盈利预测
  rating <symbol>             查询综合分析师评级（推荐+目标价+盈利）

选项:
  --resolution <res>          K线分辨率 (1, 5, 15, 30, 60, D, W, M)
  --days <n>                  获取最近N天的数据

示例:
  node query.mjs quote AAPL
  node query.mjs profile TSLA
  node query.mjs candle AAPL --resolution D --days 30
  node query.mjs search Apple
  node query.mjs financials MSFT
  node query.mjs news AAPL
  node query.mjs rating AAPL              # 综合分析师评级
  node query.mjs recommendation TSLA      # 分析师推荐
  node query.mjs target MSFT              # 目标价
  node query.mjs earnings GOOGL           # 盈利预测
    `);
    process.exit(0);
  }
  
  const command = args[0];
  const symbol = args[1];
  
  // 解析选项
  const options = {};
  for (let i = 2; i < args.length; i += 2) {
    if (args[i].startsWith('--')) {
      options[args[i].substring(2)] = args[i + 1];
    }
  }
  
  try {
    switch (command) {
      case 'quote':
        await getQuote(symbol);
        break;
      case 'profile':
        await getProfile(symbol);
        break;
      case 'candle':
        await getCandle(symbol, options.resolution || 'D', parseInt(options.days) || 30);
        break;
      case 'search':
        await searchSymbol(symbol);
        break;
      case 'financials':
        await getFinancials(symbol);
        break;
      case 'news':
        await getNews(symbol);
        break;
      case 'recommendation':
        await getRecommendation(symbol);
        break;
      case 'target':
        await getPriceTarget(symbol);
        break;
      case 'earnings':
        await getEarningsEstimate(symbol);
        break;
      case 'rating':
        await getAnalystRating(symbol);
        break;
      default:
        console.error(`未知命令: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ 错误: ${error.message}`);
    process.exit(1);
  }
}

// 仅在直接运行时执行 main()，作为模块导入时不执行
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
