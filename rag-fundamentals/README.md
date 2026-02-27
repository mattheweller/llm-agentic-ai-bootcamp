# RAG Module 7: RAG & LangChain LangChain Fundamentals Interactive Website

An interactive educational website for learning Retrieval Augmented Generation (RAG) with LangChain.

## Overview

This website provides a complete, hands-on tutorial for building a question-answering AI assistant using RAG and LangChain. Students will build a Q&A system for Eleven Madison Park restaurant, learning core RAG concepts and implementation patterns.

## Features

- 📚 9 sequential tasks covering complete RAG pipeline
- 💻 Clean, annotated code examples (written fresh, not copied from buggy notebooks)
- 🎯 15+ practice opportunities with progress tracking
- 📊 Interactive SVG diagrams explaining key concepts
- 📱 Mobile-responsive design
- ✅ LocalStorage-based progress tracking
- 🎨 Clean, modern UI with syntax highlighting

## Project Structure

```
module-7-rag-langchain/
├── index.html                  # Landing page
├── assets/
│   ├── css/                   # Stylesheets
│   ├── js/                    # JavaScript for interactivity
│   ├── images/diagrams/       # SVG concept diagrams
│   └── data/                  # Restaurant data file
├── tasks/                     # 9 task HTML pages
└── README.md                  # This file
```

## Tasks Covered

1. **Project Overview** - Introduction and learning objectives
2. **Understand RAG** - What RAG is, how it works, and why it matters
3. **LangChain 101** - Framework components and architecture
4. **Setup & Data Loading** - Environment configuration and document loading
5. **Document Chunking** - Splitting text intelligently
6. **Embeddings & Vector Stores** - Semantic search fundamentals
7. **Testing Retrieval** - Validating similarity search
8. **Building RAG Chain** - Combining retrieval and generation
9. **Gradio Interface** - Deploying with a web UI

## Getting Started

### Prerequisites

- Python 3.8 or higher
- OpenAI API key
- Basic Python knowledge

### Running Locally

1. Clone or download this repository

2. Start a local web server:
   ```bash
   # Python 3
   python3 -m http.server 8000

   ```

3. Open your browser to `http://localhost:8000`

4. Start with the landing page and navigate through tasks sequentially

### For Python Code Examples

The code examples are reference implementations. To run them locally:

1. Install dependencies:
   ```bash
   pip install langchain langchain-openai openai chromadb gradio python-dotenv
   ```

2. Set up your OpenAI API key:
   ```bash
   export OPENAI_API_KEY='your-key-here'
   ```

3. Download the data file from `assets/data/eleven_madison_park_data.txt`

## Technologies Used

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **Vanilla JavaScript** - No framework dependencies
- **Prism.js** - Syntax highlighting (CDN)

### Educational Content
- **Python** - All code examples
- **LangChain** - RAG framework
- **OpenAI** - Embeddings and LLMs
- **ChromaDB** - Vector database
- **Gradio** - Web UI

## Features

### Progress Tracking
- Visited tasks are marked with blue dots (●)
- Practice checkboxes save state to localStorage
- Resume where you left off

### Interactive Code
- Copy buttons on all code blocks
- Syntax highlighting for Python and Bash
- Clear labels for reference-only code

### Mobile Responsive
- Hamburger menu for mobile navigation
- Touch-friendly button sizes
- Optimized for all screen sizes

## Browser Support

- Chrome/Edge (Chromium) ✅
- Firefox ✅
- Safari (desktop and iOS) ✅

## Development

### File Structure

- `assets/css/main.css` - Core styles and design system
- `assets/css/responsive.css` - Mobile breakpoints
- `assets/js/navigation.js` - Progress tracking and navigation
- `assets/js/code-interactions.js` - Copy button functionality
- `assets/js/practice-tracker.js` - Practice checkbox persistence

### Adding Content

Each task page follows a standard template with:
- Sidebar navigation
- Task header with number and title
- Learning objectives section
- Main content with code examples
- Practice opportunities section
- Previous/Next navigation buttons

## License

Educational content for learning purposes.

## Acknowledgments

- Based on educational materials from LLM and Agentic AI Bootcamp
- Code examples written fresh for clarity and educational value
- SVG diagrams created specifically for this project

## Support

For issues or questions about the website functionality, please refer to the individual task pages or check browser console for JavaScript errors.

## Next Steps

After completing Module 7, students will have:
- ✅ Built a complete RAG system from scratch
- ✅ Understood embeddings and vector search
- ✅ Implemented retrieval and generation pipelines
- ✅ Deployed an interactive Q&A assistant
- ✅ Learned patterns applicable to any RAG use case
