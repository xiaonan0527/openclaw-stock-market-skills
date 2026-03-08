#!/usr/bin/env node
/**
 * QVeris Tool Search & Execution
 *
 * Dual-mode: importable JS module + CLI
 *
 * Module usage:
 *   import { searchTools, executeTool, getToolsByIds } from './qveris_tool.mjs';
 *
 * CLI usage:
 *   node scripts/qveris_tool.mjs search "weather forecast"
 *   node scripts/qveris_tool.mjs execute <tool_id> --search-id <id> --params '{...}'
 */

const BASE_URL = "https://qveris.ai/api/v1";

function resolveApiKey(apiKey) {
  const key = apiKey || process.env.QVERIS_API_KEY;
  if (!key) throw new Error("QVERIS_API_KEY not set");
  return key;
}

export async function searchTools(query, limit = 10, timeoutMs = 30000, apiKey) {
  const key = resolveApiKey(apiKey);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${BASE_URL}/search`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query, limit }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function getToolsByIds(toolIds, searchId, timeoutMs = 30000, apiKey) {
  const key = resolveApiKey(apiKey);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const body = { tool_ids: toolIds };
    if (searchId) body.search_id = searchId;
    const response = await fetch(`${BASE_URL}/tools/by-ids`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function executeTool(toolId, searchId, parameters = {}, maxResponseSize = 20480, timeoutMs = 120000, apiKey) {
  const key = resolveApiKey(apiKey);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url = new URL(`${BASE_URL}/tools/execute`);
    url.searchParams.set("tool_id", toolId);
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ search_id: searchId, parameters, max_response_size: maxResponseSize }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

// ─── CLI mode (only runs when called directly) ───────────────────────────────

function displaySearchResults(result) {
  const searchId = result.search_id ?? "N/A";
  const tools = result.results ?? [];
  console.log(`\nSearch ID: ${searchId}\nFound ${result.total ?? tools.length} tools\n`);
  for (let i = 0; i < tools.length; i++) {
    const t = tools[i];
    const stats = t.stats ?? {};
    let sr = stats.success_rate ?? "N/A";
    let at = stats.avg_execution_time_ms ?? "N/A";
    if (typeof sr === "number") sr = `${Math.round(sr * 100)}%`;
    if (typeof at === "number") at = `${at.toFixed(1)}ms`;
    console.log(`[${i + 1}] ${t.name ?? "N/A"}`);
    console.log(`    ID: ${t.tool_id ?? "N/A"}`);
    console.log(`    ${(t.description ?? "").slice(0, 100)}`);
    console.log(`    Success: ${sr} | Avg Time: ${at}`);
    const params = t.params ?? [];
    const req = params.filter(p => p.required).map(p => p.name);
    if (req.length) console.log(`    Required: ${req.join(", ")}`);
    console.log();
  }
}

function displayExecutionResult(result) {
  console.log(`\n${result.success ? "Success" : "Failed"}`);
  console.log(`Time: ${result.elapsed_time_ms ?? "N/A"}ms | Cost: ${result.cost ?? 0}`);
  if (!result.success) console.log(`Error: ${result.error_message ?? "Unknown"}`);
  const data = result.result ?? {};
  if (Object.keys(data).length > 0) console.log("\nResult:\n" + JSON.stringify(data, null, 2));
}

// Only execute CLI logic when run directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help")) {
    console.log(`Usage:
  node qveris_tool.mjs search <query> [--limit N] [--json]
  node qveris_tool.mjs execute <tool_id> --search-id <id> [--params JSON] [--json]
  node qveris_tool.mjs get-by-ids <id> [...] [--json]`);
    process.exit(0);
  }

  const cmd = args[0];
  const jsonMode = args.includes("--json");
  const getArg = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null; };

  try {
    if (cmd === "search") {
      const result = await searchTools(args[1], parseInt(getArg("--limit") ?? "10"), 30000);
      jsonMode ? console.log(JSON.stringify(result, null, 2)) : displaySearchResults(result);
    } else if (cmd === "execute") {
      const sid = getArg("--search-id");
      if (!sid) { console.error("Error: --search-id required"); process.exit(1); }
      const params = JSON.parse(getArg("--params") ?? "{}");
      const result = await executeTool(args[1], sid, params, 20480, 120000);
      jsonMode ? console.log(JSON.stringify(result, null, 2)) : displayExecutionResult(result);
    } else if (cmd === "get-by-ids") {
      const ids = args.slice(1).filter(a => !a.startsWith("--"));
      const sid = getArg("--search-id");
      const result = await getToolsByIds(ids, sid, 30000);
      jsonMode ? console.log(JSON.stringify(result, null, 2)) : displaySearchResults(result);
    } else {
      console.error(`Unknown command: ${cmd}`); process.exit(1);
    }
  } catch (e) {
    console.error(`Error: ${e.message}`); process.exit(1);
  }
}
