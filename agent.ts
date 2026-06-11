import { OrbisClient, createOrbisTools } from "orbis-langchain";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// ── Config ──────────────────────────────────────────────────────────────────
const TASK   = process.env.AGENT_TASK   ?? "What is the current weather in New York City?";
const QUERY  = process.env.TOOL_QUERY   ?? "weather";   // keyword to find relevant APIs
const LIMIT  = Number(process.env.TOOL_LIMIT ?? "5");   // how many APIs to load

if (!process.env.WALLET_PRIVATE_KEY) throw new Error("WALLET_PRIVATE_KEY is required");
if (!process.env.OPENAI_API_KEY)     throw new Error("OPENAI_API_KEY is required");

// ── Orbis client — your wallet pays per API call in USDC on Base ─────────────
const client = new OrbisClient({
  privateKey: process.env.WALLET_PRIVATE_KEY as `0x${string}`,
});

// ── Discover tools — semantic search across 8,000+ APIs ─────────────────────
console.log(`\nSearching Orbis for tools matching: "${QUERY}"...`);
const orbisTools = await createOrbisTools(client, { query: QUERY, limit: LIMIT });
const tools = orbisTools.map(t => t.toLangChain());
console.log(`Loaded ${tools.length} tools:`, tools.map(t => t.name).join(", "), "\n");

// ── Agent ────────────────────────────────────────────────────────────────────
const llm = new ChatOpenAI({ model: "gpt-4o", temperature: 0 });

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful AI assistant with access to real-world APIs via Orbis.
Each tool call costs a small USDC micropayment — use tools purposefully.
Always cite where data came from.`,
  ],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

const agent    = await createOpenAIToolsAgent({ llm, tools, prompt });
const executor = new AgentExecutor({ agent, tools, verbose: true });

// ── Run ──────────────────────────────────────────────────────────────────────
console.log(`Task: ${TASK}\n${"─".repeat(60)}`);
const result = await executor.invoke({ input: TASK });
console.log(`\n${"─".repeat(60)}\nResult:\n${result.output}`);
