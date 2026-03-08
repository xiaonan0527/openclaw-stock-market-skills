#!/usr/bin/env node

/**
 * Yahoo Finance Query Script
 * 使用 Yahoo Finance API 查询股票信息（支持港股、A股、美股等全球市场）
 * 支持 CLI 和模块导入两种使用方式
 */

import https from 'https';
import { fileURLToPath } from 'url';

const BASE_URL = 'https://query1.finance.yahoo.com';
const BASE_URL2 = 'https://query2.finance.yahoo.com';

/**
 * 发送 HTTPS GET 请求
 */
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${data.substring(0, 200)}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * 查询实时股票报价（仅返回数据，不打印）
 */
export async function fetchQuote(symbol) {
  const url = `${BASE_URL}/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
  const data = await httpsGet(url);
  
  if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
    throw new Error(`No data found for symbol: ${symbol}`);
  }
  
  const result = data.chart.result[0];
  const meta = result.meta;
  const quote = result.indicators.quote[0];
  
  return {
    symbol: meta.symbol,
    currency: meta.currency,
    exchangeName: meta.exchangeName,
    regularMarketPrice: meta.regularMarketPrice,
    regularMarketOpen: quote.open[quote.open.length - 1],
    regularMarketDayHigh: meta.regularMarketDayHigh,
    regularMarketDayLow: meta.regularMarketDayLow,
    regularMarketVolume: meta.regularMarketVolume,
    previousClose: meta.chartPreviousClose,
    regularMarketChange: meta.regularMarketPrice - meta.chartPreviousClose,
    regularMarketChangePercent: ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose * 100),
    regularMarketTime: new Date(meta.regularMarketTime * 1000)
  };
}

/**
 * 查询公司基本信息（仅返回数据，不打印）
 */
export async function fetchProfile(symbol) {
  const url = `${BASE_URL2}/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=assetProfile,summaryDetail,price`;
  const data = await httpsGet(url);
  
  if (!data.quoteSummary || !data.quoteSummary.result || data.quoteSummary.result.length === 0) {
    throw new Error(`No profile data found for symbol: ${symbol}`);
  }
  
  const result = data.quoteSummary.result[0];
  const profile = result.assetProfile || {};
  const summary = result.summaryDetail || {};
  const price = result.price || {};
  
  return {
    symbol: price.symbol,
    shortName: price.shortName,
    longName: price.longName,
    currency: price.currency,
    exchange: price.exchangeName,
    sector: profile.sector,
    industry: profile.industry,
    country: profile.country,
    website: profile.website,
    marketCap: price.marketCap?.raw,
    employees: profile.fullTimeEmployees,
    description: profile.longBusinessSummary,
    fiftyTwoWeekHigh: summary.fiftyTwoWeekHigh?.raw,
    fiftyTwoWeekLow: summary.fiftyTwoWeekLow?.raw,
    dividendYield: summary.dividendYield?.raw
  };
}

/**
 * 获取历史价格数据（仅返回数据，不打印）
 */
export async function fetchHistory(symbol, range = '1mo', interval = '1d') {
  const url = `${BASE_URL}/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${interval}&range=${range}`;
  const data = await httpsGet(url);
  
  if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
    throw new Error(`No history data found for symbol: ${symbol}`);
  }
  
  const result = data.chart.result[0];
  const timestamps = result.timestamp;
  const quote = result.indicators.quote[0];
  
  return {
    symbol: result.meta.symbol,
    timestamps,
    open: quote.open,
    high: quote.high,
    low: quote.low,
    close: quote.close,
    volume: quote.volume
  };
}

/**
 * 搜索股票（仅返回数据，不打印）
 */
export async function fetchSearch(query) {
  const url = `${BASE_URL}/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`;
  const data = await httpsGet(url);
  
  if (!data.quotes) {
    return { count: 0, quotes: [] };
  }
  
  return {
    count: data.quotes.length,
    quotes: data.quotes.map(q => ({
      symbol: q.symbol,
      shortname: q.shortname || q.longname,
      exchange: q.exchange,
      type: q.quoteType
    }))
  };
}

// ============ CLI 功能（带打印输出） ============

/**
 * 查询实时股票报价（CLI版本，带打印）
 */
async function getQuote(symbol) {
  const data = await fetchQuote(symbol);
  
  console.log(`\n📈 ${data.symbol} 实时报价:\n`);
  console.log(`交易所:   ${data.exchangeName}`);
  console.log(`货币:     ${data.currency}`);
  console.log(`当前价格: ${data.currency} ${data.regularMarketPrice.toFixed(2)}`);
  console.log(`开盘价:   ${data.currency} ${data.regularMarketOpen?.toFixed(2) || 'N/A'}`);
  console.log(`最高价:   ${data.currency} ${data.regularMarketDayHigh.toFixed(2)}`);
  console.log(`最低价:   ${data.currency} ${data.regularMarketDayLow.toFixed(2)}`);
  console.log(`前收盘:   ${data.currency} ${data.previousClose.toFixed(2)}`);
  console.log(`涨跌额:   ${data.currency} ${data.regularMarketChange.toFixed(2)}`);
  console.log(`涨跌幅:   ${data.regularMarketChangePercent.toFixed(2)}%`);
  console.log(`成交量:   ${data.regularMarketVolume.toLocaleString()}`);
  console.log(`时间:     ${data.regularMarketTime.toLocaleString('zh-CN')}`);
  
  return data;
}

/**
 * 查询公司基本信息（CLI版本，带打印）
 */
async function getProfile(symbol) {
  const data = await fetchProfile(symbol);
  
  console.log(`\n🏢 ${data.symbol} 公司信息:\n`);
  console.log(`公司名称: ${data.longName || data.shortName}`);
  console.log(`交易所:   ${data.exchange}`);
  console.log(`货币:     ${data.currency}`);
  console.log(`行业:     ${data.sector || 'N/A'}`);
  console.log(`细分行业: ${data.industry || 'N/A'}`);
  console.log(`国家:     ${data.country || 'N/A'}`);
  console.log(`市值:     ${data.marketCap ? (data.marketCap / 1e9).toFixed(2) + 'B' : 'N/A'}`);
  console.log(`员工数:   ${data.employees?.toLocaleString() || 'N/A'}`);
  console.log(`52周最高: ${data.fiftyTwoWeekHigh?.toFixed(2) || 'N/A'}`);
  console.log(`52周最低: ${data.fiftyTwoWeekLow?.toFixed(2) || 'N/A'}`);
  console.log(`股息率:   ${data.dividendYield ? (data.dividendYield * 100).toFixed(2) + '%' : 'N/A'}`);
  console.log(`网站:     ${data.website || 'N/A'}`);
  
  if (data.description) {
    console.log(`\n公司简介:`);
    console.log(data.description.substring(0, 300) + '...');
  }
  
  return data;
}

/**
 * 获取历史价格数据（CLI版本，带打印）
 */
async function getHistory(symbol, range = '1mo', interval = '1d') {
  const data = await fetchHistory(symbol, range, interval);
  
  console.log(`\n📊 ${data.symbol} 历史数据 (${range}, ${interval}):\n`);
  console.log(`数据点数: ${data.timestamps.length}`);
  
  // 显示最近5个数据点
  const count = Math.min(5, data.timestamps.length);
  console.log(`\n最近${count}个交易日:`);
  for (let i = data.timestamps.length - count; i < data.timestamps.length; i++) {
    const date = new Date(data.timestamps[i] * 1000).toLocaleDateString('zh-CN');
    const open = data.open[i]?.toFixed(2) || 'N/A';
    const high = data.high[i]?.toFixed(2) || 'N/A';
    const low = data.low[i]?.toFixed(2) || 'N/A';
    const close = data.close[i]?.toFixed(2) || 'N/A';
    const volume = data.volume[i]?.toLocaleString() || 'N/A';
    console.log(`${date}: 开${open} 高${high} 低${low} 收${close} 量${volume}`);
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
  data.quotes.forEach((item, i) => {
    console.log(`${i + 1}. ${item.symbol} - ${item.shortname} (${item.exchange}, ${item.type})`);
  });
  
  return data;
}

/**
 * 主函数（仅在 CLI 模式下执行）
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Yahoo Finance Query Tool

用法:
  node query.mjs <command> <symbol> [options]

命令:
  quote <symbol>              查询实时股票报价
  profile <symbol>            查询公司基本信息
  history <symbol>            获取历史价格数据
  search <query>              搜索股票

选项:
  --range <range>             历史数据范围 (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
  --interval <interval>       数据间隔 (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo)

股票代码格式:
  港股: 0700.HK (腾讯), 9988.HK (阿里巴巴), 1810.HK (小米)
  A股:  000001.SS (上证), 600519.SS (茅台), 000858.SZ (五粮液)
  美股: AAPL, TSLA, MSFT

示例:
  node query.mjs quote 0700.HK           # 查询腾讯股价
  node query.mjs profile 9988.HK         # 查询阿里巴巴公司信息
  node query.mjs history 0700.HK --range 1mo --interval 1d
  node query.mjs search "Tencent"        # 搜索腾讯
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
      case 'history':
        await getHistory(symbol, options.range || '1mo', options.interval || '1d');
        break;
      case 'search':
        await searchSymbol(symbol);
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
