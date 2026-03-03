// Module Navigator - Accordion Navigation Logic

class ModuleNavigator {
  constructor() {
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.autoExpandActiveModule();
    this.highlightActiveTask();
    this.setupMobileMenu();
    this.setupKeyboardNavigation();
  }

  attachEventListeners() {
    document.querySelectorAll('.module-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleModule(toggle.dataset.module);
      });
    });
  }

  toggleModule(moduleId) {
    const toggle = document.querySelector(`.module-toggle[data-module="${moduleId}"]`);
    const taskList = document.querySelector(`.task-list[data-module="${moduleId}"]`);

    if (!toggle || !taskList) return;

    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
      this.collapseModule(toggle, taskList);
    } else {
      this.collapseAll();
      this.expandModule(toggle, taskList);
    }
  }

  expandModule(toggle, taskList) {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.classList.add('active');
    taskList.classList.add('expanded');
  }

  collapseModule(toggle, taskList) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('active');
    taskList.classList.remove('expanded');
  }

  collapseAll() {
    document.querySelectorAll('.module-toggle').forEach(t => {
      t.setAttribute('aria-expanded', 'false');
      t.classList.remove('active');
    });
    document.querySelectorAll('.task-list').forEach(list => {
      list.classList.remove('expanded');
    });
  }

  autoExpandActiveModule() {
    const path = window.location.pathname;
    const modulePatterns = {
      '/rag-fundamentals/': 'rag-fundamentals',
      '/pydantic-ai-assistants/': 'pydantic-ai-assistants',
      '/fine-tuning-lora/': 'fine-tuning-lora',
      '/agents-autogen/': 'agents-autogen',
      '/agents-langgraph/': 'agents-langgraph',
      '/agents-crewai/': 'agents-crewai',
      '/agents-n8n-workflows/': 'agents-n8n-workflows',
      '/mcp-servers/': 'mcp-servers'
    };

    for (const [pattern, moduleId] of Object.entries(modulePatterns)) {
      if (path.includes(pattern)) {
        const toggle = document.querySelector(`.module-toggle[data-module="${moduleId}"]`);
        const taskList = document.querySelector(`.task-list[data-module="${moduleId}"]`);
        if (toggle && taskList) {
          this.expandModule(toggle, taskList);
        }
        break;
      }
    }
  }

  highlightActiveTask() {
    const currentTaskId = document.body.dataset.taskId;
    const currentModuleId = document.body.dataset.moduleId;

    if (currentTaskId) {
      document.querySelectorAll('.task-list-link').forEach(link => {
        if (link.dataset.taskId === currentTaskId) {
          link.classList.add('active');
        }
      });
    }
  }

  setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');

    if (hamburger && sidebar) {
      hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
        hamburger.classList.toggle('active');
      });

      document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
          sidebar.classList.remove('open');
          hamburger.classList.remove('active');
        }
      });

      sidebar.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const navBtns = document.querySelectorAll('.nav-btn[href*="task-"]');
      const prevBtn = navBtns[0];
      const nextBtn = navBtns[1];

      if (e.key === 'ArrowLeft' && prevBtn && !prevBtn.classList.contains('disabled')) {
        window.location.href = prevBtn.href;
      } else if (e.key === 'ArrowRight' && nextBtn && !nextBtn.classList.contains('disabled')) {
        window.location.href = nextBtn.href;
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ModuleNavigator();
});
