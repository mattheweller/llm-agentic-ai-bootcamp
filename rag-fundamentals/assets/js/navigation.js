// Navigation and Progress Tracking

class ProgressTracker {
  constructor() {
    this.storageKey = 'module7-progress';
    this.load();
  }

  load() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const data = JSON.parse(stored);
      this.visitedTasks = new Set(data.visitedTasks || []);
    } else {
      this.visitedTasks = new Set();
    }
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify({
      visitedTasks: Array.from(this.visitedTasks)
    }));
  }

  markTaskVisited(taskId) {
    this.visitedTasks.add(taskId);
    this.save();
    this.updateUI();
  }

  isTaskVisited(taskId) {
    return this.visitedTasks.has(taskId);
  }

  updateUI() {
    document.querySelectorAll('.task-list-item').forEach(item => {
      const link = item.querySelector('.task-list-link');
      const taskId = link.dataset.taskId;
      const status = item.querySelector('.task-status');

      if (this.isTaskVisited(taskId)) {
        status.classList.remove('not-started');
        status.classList.add('visited');
        status.textContent = '●';
      }
    });
  }
}

// Initialize progress tracker
const progressTracker = new ProgressTracker();

// Mark current task as visited
document.addEventListener('DOMContentLoaded', () => {
  const currentTaskId = document.body.dataset.taskId;
  if (currentTaskId) {
    progressTracker.markTaskVisited(currentTaskId);
  }

  // Highlight active task in sidebar
  document.querySelectorAll('.task-list-link').forEach(link => {
    if (link.dataset.taskId === currentTaskId) {
      link.classList.add('active');
    }
  });

  // Mobile hamburger menu
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');

  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
        sidebar.classList.remove('open');
        hamburger.classList.remove('active');
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    // Don't trigger if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    const prevBtn = document.querySelector('.nav-btn[href*="task-"]');
    const nextBtn = document.querySelectorAll('.nav-btn[href*="task-"]')[1];

    if (e.key === 'ArrowLeft' && prevBtn && !prevBtn.classList.contains('disabled')) {
      window.location.href = prevBtn.href;
    } else if (e.key === 'ArrowRight' && nextBtn && !nextBtn.classList.contains('disabled')) {
      window.location.href = nextBtn.href;
    }
  });
});
