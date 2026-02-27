# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Educational materials for an **LLM and Agentic AI Bootcamp** covering 8 core topics in LLM and agentic AI development. Content is delivered through Jupyter notebooks paired with PowerPoint presentations, plus practical workflows and utilities. The repository uses topic-based organization for easy navigation.

## Topic Structure

| Directory | Focus | Key Technologies |
|-----------|-------|------------------|
| `rag-fundamentals/` | RAG & LangChain | langchain, langchain-openai, document loaders, vector stores |
| `pydantic-ai-assistants/` | Pydantic | Pydantic validation, OpenAI/Gemini integration |
| `fine-tuning-lora/` | Fine-Tuning | PyTorch, Transformers, PEFT/LoRA, bitsandbytes, TRL |
| `agents-autogen/` | AI Agents - AutoGen | autogen, multi-agent teams |
| `agents-langgraph/` | AI Agents - LangGraph | langgraph, state machines |
| `agents-crewai/` | AI Agents - CrewAI | crewai, custom tools, pandas, scikit-learn, XGBoost |
| `agents-n8n-workflows/` | AI Agents - N8N | N8N workflows (JSON), Gmail/Google Sheets integration |
| `mcp-servers/` | MCP Servers | Model Context Protocol, agents.mcp, OpenAI Agents SDK |

## Development Environment

**Runtime:** Python 3.x (Jupyter notebooks)

**Key Dependencies:**
- LangChain ecosystem: `langchain`, `langchain-core`, `langchain-openai`, `langchain-community`
- Agent frameworks: `autogen`, `crewai`, `langgraph`, `agents`
- LLM APIs: OpenAI, Google Generative AI
- Data science: pandas, numpy, scikit-learn, XGBoost
- UI: Gradio
- Utilities: python-dotenv, requests, httpx, asyncio

**Setup:**
1. Configure `.env` file with `OPENAI_API_KEY=your_key_here`
2. Install dependencies via pip (check individual notebook cells for specific requirements)
3. Use Google Colab for GPU-intensive tasks (fine-tuning-lora topic)
4. For N8N workflows: requires N8N instance with OAuth for Gmail/Google Services

## Working with Notebooks

**Running notebooks:**
- Start Jupyter: `jupyter notebook` or `jupyter lab`
- Notebooks are organized as numbered TASK sections with clear objectives
- Each cell should be run sequentially
- Fine-tuning topic requires GPU (use Google Colab)

**Testing notebook code:**
- Execute cells in order to verify functionality
- Check for API key configuration before running LLM calls
- `agents-crewai/data/` includes CSV data for testing: `Supplement_Sales_Weekly.csv` (4,384 rows)
- `rag-fundamentals/assets/data/` includes text data: `eleven_madison_park_data.txt`

## Architecture Patterns

### Custom Tool Development (agents-crewai)

`agents-crewai/tools/notebookExecutor.py` demonstrates a production-ready pattern for CrewAI custom tools:
- Inherits from `crewai.tools.BaseTool`
- Uses Pydantic for input validation (`NotebookCodeExecutorSchema`)
- Private namespace management via `PrivateAttr` for stateful execution
- Auto-installs dependencies via subprocess pip
- Captures stdout/stderr with `io.StringIO` and `redirect_stdout`
- Pre-populates namespace with pandas/numpy for agents

**Key pattern:** Agents can execute arbitrary Python code while maintaining shared state across tasks.

### Multi-Agent Coordination

**AutoGen (agents-autogen):** Interactive agent teams with conversational handoffs

**LangGraph (agents-langgraph):** State machine workflow for agentic applications (travel agent use case)

**CrewAI (agents-crewai):** Role-based agent teams (data scientist, analyst, engineer) with task delegation and shared tools

### N8N Workflow Progression (agents-n8n-workflows)

Progressive complexity across workflows in `agents-n8n-workflows/workflows/`:
1. `01-basic-summarization.json` - Simple LLM call
2. `02-memory-search-api.json` - Memory + Tavily search
3. `03-google-sheet-integration.json` - External data integration
4. `04-parsed-structured-output.json` - JSON schema validation
5. `05-calendar-tools.json` - Calendar API integration
6. `06-email-trigger.json` - Gmail trigger + classification
7. `07-final-workflow.json` - Complete multi-step pipeline
8. `practice-solution-1.json` - Practice opportunity solution

**Pattern:** Start simple, add capabilities incrementally (memory → search → integrations → triggers)

## Data Assets

- `agents-crewai/data/Supplement_Sales_Weekly.csv` - 4,384 rows, multiple products/categories/platforms
- `rag-fundamentals/assets/data/eleven_madison_park_data.txt` - Structured web-scraped restaurant data
- `fine-tuning-lora/models/sentiment_finetuned_adapter_epoch_4.zip` - Pre-trained LoRA adapter (174 MB)

## Common Commands

**Launch Jupyter:**
```bash
jupyter notebook
# or
jupyter lab
```

**Install notebook dependencies (example):**
```bash
pip install langchain langchain-openai openai python-dotenv
pip install crewai pandas numpy scikit-learn xgboost
pip install autogen langgraph
```

**Test custom tool (agents-crewai):**
```python
import sys
sys.path.append('agents-crewai/tools')
from notebookExecutor import NotebookCodeExecutor
import pandas as pd

# Create tool with namespace
namespace = {'pd': pd, 'data': None}
tool = NotebookCodeExecutor(namespace=namespace)

# Execute code
result = tool._run(
    code="data = pd.DataFrame({'a': [1,2,3]}); print(data)",
    required_libraries=['pandas']
)
```

## Notes

- Each topic directory is self-contained with its own notebooks and presentation
- Notebooks include embedded visualizations (matplotlib, seaborn)
- `fine-tuning-lora/` requires substantial GPU resources (use Colab T4/V100)
- N8N workflows require import into N8N platform - not executable as standalone scripts
- `mcp-servers/` requires latest OpenAI Agents SDK
