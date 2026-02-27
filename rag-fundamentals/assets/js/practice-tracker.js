// Practice Opportunity Tracking

class PracticeTracker {
  constructor() {
    this.storageKey = 'module7-practice';
    this.load();
  }

  load() {
    const stored = localStorage.getItem(this.storageKey);
    this.completed = stored ? JSON.parse(stored) : {};
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.completed));
  }

  toggle(practiceId) {
    this.completed[practiceId] = !this.completed[practiceId];
    this.save();
    return this.completed[practiceId];
  }

  isCompleted(practiceId) {
    return this.completed[practiceId] || false;
  }
}

const practiceTracker = new PracticeTracker();

document.addEventListener('DOMContentLoaded', () => {
  // Initialize checkboxes
  document.querySelectorAll('.practice-checkbox').forEach(checkbox => {
    const practiceId = checkbox.dataset.practiceId;

    // Set initial state
    checkbox.checked = practiceTracker.isCompleted(practiceId);

    // Add change listener
    checkbox.addEventListener('change', () => {
      practiceTracker.toggle(practiceId);
    });
  });
});
