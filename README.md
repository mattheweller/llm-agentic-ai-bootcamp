# LLM and Agentic AI Bootcamp

Educational materials for mastering Large Language Models and AI Agent development. This repository contains 8 comprehensive topics covering everything from RAG fundamentals to advanced multi-agent systems and deployment patterns.

## 📚 Topics

### 1. [RAG Fundamentals](rag-fundamentals/)
**Focus:** Retrieval-Augmented Generation & LangChain

Learn the foundations of RAG architecture, vector embeddings, and document retrieval systems using LangChain.

**Key Technologies:** `langchain`, `langchain-openai`, document loaders, vector stores, embeddings

**Interactive Format:** HTML-based learning with 9 progressive tasks, practice opportunities, and visual diagrams

**Files:**
- [Interactive Website](rag-fundamentals/index.html) - Start here for guided learning
- [Data Asset](rag-fundamentals/assets/data/eleven_madison_park_data.txt) - Restaurant data for RAG examples

---

### 2. [Pydantic AI Assistants](pydantic-ai-assistants/)
**Focus:** Structured AI Outputs with Pydantic

Build type-safe AI assistants using Pydantic for validation and structured data extraction from LLMs.

**Key Technologies:** Pydantic validation, OpenAI/Gemini integration

**Format:** Jupyter notebook + presentation

**Files:**
- `presentation.pptx` - Lecture slides
- `resume-ai-assistant.ipynb` - Build an AI resume assistant with OpenAI and Gemini

---

### 3. [Fine-Tuning with LoRA](fine-tuning-lora/)
**Focus:** Parameter-Efficient Fine-Tuning

Master fine-tuning open-source LLMs using PEFT (Parameter-Efficient Fine-Tuning) and LoRA adapters.

**Key Technologies:** PyTorch, Transformers, PEFT/LoRA, bitsandbytes, TRL

**Format:** Jupyter notebook + presentation (requires GPU - use Google Colab)

**Files:**
- `presentation.pptx` - Lecture slides
- `fine-tuning-peft-lora.ipynb` - Complete fine-tuning tutorial with sentiment analysis
- `models/sentiment_finetuned_adapter_epoch_4.zip` - Pre-trained LoRA adapter (174 MB)

---

### 4. [Agents: AutoGen](agents-autogen/)
**Focus:** Multi-Agent Conversations with AutoGen

Build interactive multi-model AI agent teams that collaborate through conversational handoffs.

**Key Technologies:** `autogen`, multi-agent teams, conversational AI

**Format:** Jupyter notebook + presentation

**Files:**
- `presentation.pptx` - Lecture slides
- `multi-model-agent-teams.ipynb` - Build interactive agent teams

---

### 5. [Agents: LangGraph](agents-langgraph/)
**Focus:** State Machine Workflows for Agents

Design and implement agentic workflows using LangGraph's state machine architecture.

**Key Technologies:** `langgraph`, state machines, workflow orchestration

**Format:** Jupyter notebook + presentation

**Files:**
- `presentation.pptx` - Lecture slides
- `agentic-workflows.ipynb` - Travel agent use case with state management

---

### 6. [Agents: CrewAI](agents-crewai/)
**Focus:** Role-Based Agent Teams with Custom Tools

Create production-ready agent teams with role delegation, custom tools, and data science automation.

**Key Technologies:** `crewai`, custom tools, pandas, scikit-learn, XGBoost

**Format:** 2 Jupyter notebooks + 2-part presentation

**Files:**
- `presentation-part-a.pptx` - Lecture slides (Part A)
- `presentation-part-b.pptx` - Lecture slides (Part B)
- `data-science-automation.ipynb` - Automate data science workflows with CrewAI
- `predictive-analytics-ml.ipynb` - Build predictive models with agent teams
- `tools/notebookExecutor.py` - Production-ready custom tool for code execution
- `data/Supplement_Sales_Weekly.csv` - Sample dataset (4,384 rows)

---

### 7. [Agents: N8N Workflows](agents-n8n-workflows/)
**Focus:** Visual Workflow Automation with N8N

Learn progressive workflow design from simple LLM calls to complex multi-step pipelines with external integrations.

**Key Technologies:** N8N workflows (JSON), Gmail/Google Sheets integration, Tavily search

**Format:** 8 progressive N8N workflow files + presentation

**Files:**
- `presentation.pptx` - Lecture slides
- `workflows/01-basic-summarization.json` - Simple LLM call
- `workflows/02-memory-search-api.json` - Memory + Tavily search
- `workflows/03-google-sheet-integration.json` - External data integration
- `workflows/04-parsed-structured-output.json` - JSON schema validation
- `workflows/05-calendar-tools.json` - Calendar API integration
- `workflows/06-email-trigger.json` - Gmail trigger + classification
- `workflows/07-final-workflow.json` - Complete multi-step pipeline
- `workflows/practice-solution-1.json` - Practice opportunity solution

**Note:** Requires N8N instance with OAuth configured for Gmail/Google Services

---

### 8. [MCP Servers](mcp-servers/)
**Focus:** Model Context Protocol for Agent Integration

Build AI agents using the Model Context Protocol and OpenAI Agents SDK for enhanced tool use and context management.

**Key Technologies:** Model Context Protocol (MCP), `agents.mcp`, OpenAI Agents SDK

**Format:** 2 Jupyter notebooks + presentation

**Files:**
- `presentation.pptx` - Lecture slides
- `ai-tutor-mcp-agents-sdk.ipynb` - Build an AI tutor using MCP
- `mcp-server.ipynb` - MCP server implementation patterns

**Note:** Requires latest OpenAI Agents SDK

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.x** (Python 3.10+ recommended)
- **Jupyter Notebook** or **Jupyter Lab**
- **API Keys:** OpenAI API key (required for most modules)
- **GPU Access:** Google Colab recommended for fine-tuning topic

### Setup

1. **Clone or download this repository**

2. **Configure environment variables:**
   ```bash
   # Create .env file in the repository root
   echo "OPENAI_API_KEY=your_key_here" > .env
   ```

3. **Install dependencies:**
   ```bash
   # Core dependencies
   pip install langchain langchain-openai openai python-dotenv

   # Agent frameworks
   pip install autogen crewai langgraph agents

   # Data science
   pip install pandas numpy scikit-learn xgboost

   # Fine-tuning (for Colab/GPU environments)
   pip install transformers peft bitsandbytes trl
   ```

4. **Launch Jupyter:**
   ```bash
   jupyter notebook
   # or
   jupyter lab
   ```

5. **For RAG Fundamentals interactive website:**
   - Open `rag-fundamentals/index.html` directly in your browser
   - No server required - runs completely client-side

### Recommended Learning Path

1. **Start with RAG Fundamentals** - Foundation for retrieval-based systems
2. **Pydantic AI Assistants** - Learn structured outputs
3. **Choose an agent framework** - AutoGen → LangGraph → CrewAI (progressive complexity)
4. **Fine-Tuning** - Advanced topic, requires GPU
5. **N8N Workflows** - Visual workflow design (requires N8N instance)
6. **MCP Servers** - Latest protocol for agent integration

---

## 📖 Module Number Mapping

For reference, the original bootcamp module numbers:

| Original Module | New Topic Directory |
|-----------------|---------------------|
| Module 7 | `rag-fundamentals/` |
| Module 8 | `pydantic-ai-assistants/` |
| Module 9 | `fine-tuning-lora/` |
| Module 10 | `agents-autogen/` |
| Module 11 | `agents-langgraph/` |
| Module 12 | `agents-crewai/` |
| Module 13 | `agents-n8n-workflows/` |
| Module 14 | `mcp-servers/` |

---

## 🛠 Technical Architecture

For developers and contributors, see **[CLAUDE.md](CLAUDE.md)** for:
- Architecture patterns and best practices
- Custom tool development (CrewAI example)
- Multi-agent coordination patterns
- Data assets and file organization
- Development environment setup
- Common commands and utilities

---

## 📝 Notes

- Each topic directory is self-contained with its own notebooks and presentation
- Notebooks include embedded visualizations (matplotlib, seaborn)
- **Fine-tuning requires GPU:** Use Google Colab T4/V100 for `fine-tuning-lora/`
- **N8N workflows:** Must be imported into N8N platform - not executable as standalone scripts
- **MCP Servers:** Requires latest OpenAI Agents SDK

---

## 📄 License

Educational materials for the LLM and Agentic AI Bootcamp.

---

**Happy Learning! 🚀**
