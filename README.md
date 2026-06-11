# Orbis LangChain Agent Template

> An AI agent with access to **8,000+ real-world APIs** via [Orbis](https://orbisapi.com). Pay per call in USDC on Base. No API key subscriptions needed.

**[→ Use this template](https://github.com/OrbisAPI/orbis-langchain-agent/generate)**

---

## What this does

1. You give the agent a task and a keyword (e.g. "weather")
2. It searches Orbis for the most relevant APIs
3. It calls them to complete the task — paying automatically in USDC via [x402](https://x402.org)
4. You see the result in the GitHub Actions log

Run it on demand from the **Actions** tab in under 60 seconds.

---

## Setup (3 steps)

### 1. Fork / use this template

Click **"Use this template"** at the top of this repo.

### 2. Add GitHub Secrets

Go to your repo → **Settings → Secrets and variables → Actions** → New repository secret:

| Secret | Value |
|--------|-------|
| `OPENAI_API_KEY` | Your OpenAI API key ([get one](https://platform.openai.com)) |
| `WALLET_PRIVATE_KEY` | A Base wallet private key — fund with ~$5 USDC ([how?](https://www.coinbase.com/how-to-buy/usdc)) |

### 3. Run it

Go to **Actions → Run Orbis Agent → Run workflow**, fill in:
- **Task**: What should the agent do? (e.g. "What's the current Bitcoin price?")
- **Tool query**: Keyword to find relevant APIs (e.g. "crypto", "weather", "finance")

Click **Run workflow** and watch the logs.

---

## Run locally

```bash
git clone https://github.com/YOUR_USERNAME/orbis-langchain-agent
cd orbis-langchain-agent
cp .env.example .env        # fill in your keys
npm install
npm run agent
```

Override the task inline:
```bash
AGENT_TASK="What is AAPL's stock price?" TOOL_QUERY="stock price" npm run agent
```

---

## Customize

Edit `agent.ts` to change the system prompt, swap the LLM, or wire in your own logic. The key parts:

```ts
// Change what APIs get loaded
const orbisTools = await createOrbisTools(client, { query: "YOUR_CATEGORY", limit: 10 });

// Change the task
const result = await executor.invoke({ input: "YOUR_TASK" });
```

Browse the full API catalog at [orbisapi.com/marketplace](https://orbisapi.com/marketplace).

---

## Costs

- API calls: **$0.001–$0.50 each** in USDC on Base (most are under $0.01)
- LLM: standard OpenAI pricing for GPT-4o
- $5 of USDC lasts hundreds to thousands of API calls

---

## Links

- [Orbis Marketplace](https://orbisapi.com/marketplace) — browse 8,000+ APIs
- [orbis-langchain on npm](https://npmjs.com/package/orbis-langchain) — the package
- [x402 protocol](https://x402.org) — how payments work

MIT License
