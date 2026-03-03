// Multi-Module Progress Tracker

class MultiModuleProgressTracker {
  constructor() {
    this.storageKey = 'bootcamp-progress';
    this.load();
    this.migrateOldProgress();
  }

  load() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        this.data = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse progress data:', e);
        this.initializeData();
      }
    } else {
      this.initializeData();
    }
  }

  initializeData() {
    this.data = {
      modules: {
        'rag-fundamentals': { visitedTasks: [], status: 'not-started' },
        'pydantic-ai-assistants': { visitedTasks: [], status: 'not-started' },
        'fine-tuning-lora': { visitedTasks: [], status: 'not-started' },
        'agents-autogen': { visitedTasks: [], status: 'not-started' },
        'agents-langgraph': { visitedTasks: [], status: 'not-started' },
        'agents-crewai': { visitedTasks: [], status: 'not-started' },
        'agents-n8n-workflows': { visitedTasks: [], status: 'not-started' },
        'mcp-servers': { visitedTasks: [], status: 'not-started' }
      }
    };
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  }

  markTaskVisited(moduleId, taskId) {
    if (!this.data.modules[moduleId]) {
      console.error(`Unknown module: ${moduleId}`);
      return;
    }

    if (!this.data.modules[moduleId].visitedTasks.includes(taskId)) {
      this.data.modules[moduleId].visitedTasks.push(taskId);
    }

    this.updateModuleStatus(moduleId);
    this.save();
    this.updateUI();
  }

  updateModuleStatus(moduleId) {
    const visitedCount = this.data.modules[moduleId].visitedTasks.length;

    const taskCounts = {
      'rag-fundamentals': 9,
      'pydantic-ai-assistants': 1,
      'fine-tuning-lora': 1,
      'agents-autogen': 1,
      'agents-langgraph': 1,
      'agents-crewai': 1,
      'agents-n8n-workflows': 1,
      'mcp-servers': 1
    };

    const totalTasks = taskCounts[moduleId] || 1;

    if (visitedCount === 0) {
      this.data.modules[moduleId].status = 'not-started';
    } else if (visitedCount >= totalTasks) {
      this.data.modules[moduleId].status = 'completed';
    } else {
      this.data.modules[moduleId].status = 'in-progress';
    }
  }

  getModuleStatus(moduleId) {
    return this.data.modules[moduleId]?.status || 'not-started';
  }

  isTaskVisited(moduleId, taskId) {
    return this.data.modules[moduleId]?.visitedTasks.includes(taskId) || false;
  }

  updateUI() {
    this.updateModuleStatusIndicators();
    this.updateTaskStatusIndicators();
    this.updateHomepageCards();
  }

  updateModuleStatusIndicators() {
    document.querySelectorAll('.module-toggle').forEach(toggle => {
      const moduleId = toggle.dataset.module;
      const status = this.getModuleStatus(moduleId);
      const statusIcon = toggle.querySelector('.module-status');

      if (statusIcon) {
        if (status === 'not-started') {
          statusIcon.textContent = '○';
        } else if (status === 'in-progress') {
          statusIcon.textContent = '●';
        } else if (status === 'completed') {
          statusIcon.textContent = '✓';
        }
      }
    });
  }

  updateTaskStatusIndicators() {
    document.querySelectorAll('.task-list-link').forEach(link => {
      const taskId = link.dataset.taskId;
      const moduleId = link.closest('.task-list')?.dataset.module;

      if (moduleId && taskId && this.isTaskVisited(moduleId, taskId)) {
        const status = link.querySelector('.task-status');
        if (status) {
          status.textContent = '●';
          status.classList.remove('not-started');
          status.classList.add('visited');
        }
      }
    });
  }

  updateHomepageCards() {
    document.querySelectorAll('.module-card').forEach(card => {
      const moduleId = card.dataset.module;
      if (!moduleId) return;

      const status = this.getModuleStatus(moduleId);
      const badge = card.querySelector('.module-status-badge');

      if (badge) {
        badge.className = `module-status-badge ${status}`;
        if (status === 'not-started') {
          badge.textContent = 'Not Started';
        } else if (status === 'in-progress') {
          badge.textContent = 'In Progress';
        } else if (status === 'completed') {
          badge.textContent = 'Completed';
        }
      }
    });
  }

  migrateOldProgress() {
    const oldData = localStorage.getItem('module7-progress');
    if (oldData) {
      try {
        const parsed = JSON.parse(oldData);
        if (parsed.visitedTasks && Array.isArray(parsed.visitedTasks)) {
          this.data.modules['rag-fundamentals'].visitedTasks = parsed.visitedTasks;
          this.updateModuleStatus('rag-fundamentals');
          this.save();
          console.log('Migrated old progress data to new format');
        }
      } catch (e) {
        console.error('Failed to migrate old progress:', e);
      }
    }
  }
}

const progressTracker = new MultiModuleProgressTracker();

document.addEventListener('DOMContentLoaded', () => {
  const currentTaskId = document.body.dataset.taskId;
  const currentModuleId = document.body.dataset.moduleId;

  if (currentModuleId && currentTaskId) {
    progressTracker.markTaskVisited(currentModuleId, currentTaskId);
  }

  progressTracker.updateUI();
});
