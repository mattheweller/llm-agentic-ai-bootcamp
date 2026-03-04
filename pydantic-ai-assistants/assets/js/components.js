/**
 * UI Components for Resume AI Assistant
 * Reusable rendering functions for displaying analysis results
 */

/**
 * Display gap analysis in organized sections
 * @param {Object} analysis - Gap analysis object with key_requirements, relevant_experience, gaps, potential_strengths
 * @returns {string} HTML string
 */
function renderGapAnalysis(analysis) {
  return `
    <div class="gap-analysis-container">
      <div class="section">
        <h3>🎯 Key Requirements from Job Description</h3>
        <ul>${analysis.key_requirements.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
      </div>
      <div class="section">
        <h3>✅ Relevant Experience in Resume</h3>
        <ul>${analysis.relevant_experience.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
      </div>
      <div class="section alert">
        <h3>⚠️ Gaps to Address</h3>
        <ul>${analysis.gaps.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
      </div>
      <div class="section success">
        <h3>💪 Potential Strengths</h3>
        <ul>${analysis.potential_strengths.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
      </div>
    </div>
  `;
}

/**
 * Display resume diff with color coding
 * @param {string} diffHtml - HTML string with inline color-coded changes
 * @returns {string} HTML string
 */
function renderDiffView(diffHtml) {
  return `
    <div class="diff-container">
      <div class="diff-legend">
        <span class="legend-item">
          <span style="color:green;font-weight:bold">■</span> Additions/Changes
        </span>
        <span class="legend-item">
          <span style="color:red;font-weight:bold">■</span> Deletions
        </span>
      </div>
      <div class="diff-content">
        ${diffHtml}
      </div>
    </div>
  `;
}

/**
 * Format cover letter with proper spacing and actions
 * @param {string} coverLetter - Cover letter text
 * @returns {string} HTML string
 */
function renderCoverLetter(coverLetter) {
  // Split by double newlines to get paragraphs
  const paragraphs = coverLetter.split('\n\n').filter(p => p.trim());

  return `
    <div class="cover-letter-container">
      <div class="cover-letter-content">
        ${paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('')}
      </div>
      <div class="cover-letter-actions">
        <button onclick="copyToClipboard(${JSON.stringify(coverLetter).replace(/"/g, '&quot;')})">
          📋 Copy to Clipboard
        </button>
        <button onclick="downloadText('cover-letter.txt', ${JSON.stringify(coverLetter).replace(/"/g, '&quot;')})">
          💾 Download
        </button>
      </div>
    </div>
  `;
}

/**
 * Progress stepper for pipeline visualization
 * @param {number} currentStep - Current step index (0, 1, or 2)
 * @returns {string} HTML string
 */
function createProgressStepper(currentStep) {
  const steps = ['Analysis', 'Resume', 'Cover Letter'];
  return `
    <div class="progress-stepper">
      ${steps.map((step, index) => `
        <div class="step ${index < currentStep ? 'complete' : ''} ${index === currentStep ? 'active' : ''}">
          <div class="step-number">${index + 1}</div>
          <div class="step-label">${step}</div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('✅ Copied to clipboard!');
  }).catch(err => {
    console.error('Copy failed:', err);
    alert('❌ Failed to copy. Please try again.');
  });
}

/**
 * Download text as a file
 * @param {string} filename - Filename for download
 * @param {string} text - Text content
 */
function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Show loading spinner in an element
 * @param {string} elementId - ID of element to show spinner in
 */
function showLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem; padding: 2rem;">
        <div class="loading-spinner"></div>
        <span>Processing... This may take a moment.</span>
      </div>
    `;
  }
}

/**
 * Show error message in an element
 * @param {string} elementId - ID of element to show error in
 * @param {string} message - Error message
 */
function showError(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `
      <div class="demo-output error">
        <strong>❌ Error:</strong> ${escapeHtml(message)}
      </div>
    `;
  }
}

/**
 * Show success message in an element
 * @param {string} elementId - ID of element to show success in
 * @param {string} message - Success message
 */
function showSuccess(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `
      <div class="demo-output success">
        <strong>✅ Success:</strong> ${escapeHtml(message)}
      </div>
    `;
  }
}

// Make functions globally available
window.renderGapAnalysis = renderGapAnalysis;
window.renderDiffView = renderDiffView;
window.renderCoverLetter = renderCoverLetter;
window.createProgressStepper = createProgressStepper;
window.copyToClipboard = copyToClipboard;
window.downloadText = downloadText;
window.showLoading = showLoading;
window.showError = showError;
window.showSuccess = showSuccess;
