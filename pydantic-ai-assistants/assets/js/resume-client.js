/**
 * Resume API Client
 * Extends the base LLMAPIClient with resume-specific methods
 */

class ResumeAPIClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.defaultTimeout = 60000; // 60 seconds for longer LLM operations
  }

  /**
   * Generic fetch wrapper with error handling
   */
  async _fetch(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.defaultTimeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeout);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - operation took too long');
      }
      throw error;
    }
  }

  /**
   * Analyze resume against job description
   * @param {string} resumeText - Full resume text
   * @param {string} jobDescriptionText - Full job description text
   * @returns {Promise<Object>} Gap analysis with key_requirements, relevant_experience, gaps, potential_strengths
   */
  async analyzeResume(resumeText, jobDescriptionText) {
    return await this._fetch('/api/structured/resume-analysis', {
      method: 'POST',
      body: JSON.stringify({
        resume_text: resumeText,
        job_description_text: jobDescriptionText
      })
    });
  }

  /**
   * Generate tailored resume with diff highlighting
   * @param {string} resumeText - Original resume text
   * @param {string} jobDescriptionText - Target job description
   * @param {Object} gapAnalysis - Gap analysis object from analyzeResume()
   * @returns {Promise<Object>} Resume output with updated_resume and diff_html
   */
  async generateResume(resumeText, jobDescriptionText, gapAnalysis) {
    return await this._fetch('/api/structured/generate-resume', {
      method: 'POST',
      body: JSON.stringify({
        resume_text: resumeText,
        job_description_text: jobDescriptionText,
        gap_analysis: gapAnalysis
      })
    });
  }

  /**
   * Generate cover letter
   * @param {string} updatedResume - Tailored resume text
   * @param {string} jobDescriptionText - Target job description
   * @param {string} tone - Tone of cover letter (professional, enthusiastic, startup-friendly)
   * @returns {Promise<Object>} Cover letter output with cover_letter field
   */
  async generateCoverLetter(updatedResume, jobDescriptionText, tone = 'professional') {
    return await this._fetch('/api/structured/generate-cover-letter', {
      method: 'POST',
      body: JSON.stringify({
        updated_resume: updatedResume,
        job_description_text: jobDescriptionText,
        tone: tone
      })
    });
  }

  /**
   * Run complete resume pipeline
   * Orchestrates gap analysis, resume generation, and cover letter creation
   * @param {string} resumeText - Original resume text
   * @param {string} jobDescriptionText - Target job description
   * @param {string} tone - Tone for cover letter
   * @param {Function} progressCallback - Optional callback for progress updates (stepIndex, stepName)
   * @returns {Promise<Object>} Complete results with gap_analysis, resume, cover_letter
   */
  async runResumeRocket(resumeText, jobDescriptionText, tone = 'professional', progressCallback = null) {
    try {
      // Step 1: Gap Analysis
      if (progressCallback) progressCallback(0, 'Analyzing resume...');
      const gapAnalysis = await this.analyzeResume(resumeText, jobDescriptionText);

      // Step 2: Generate Resume
      if (progressCallback) progressCallback(1, 'Generating tailored resume...');
      const resume = await this.generateResume(resumeText, jobDescriptionText, gapAnalysis);

      // Step 3: Generate Cover Letter
      if (progressCallback) progressCallback(2, 'Creating cover letter...');
      const coverLetter = await this.generateCoverLetter(resume.updated_resume, jobDescriptionText, tone);

      return {
        gap_analysis: gapAnalysis,
        resume: resume,
        cover_letter: coverLetter
      };
    } catch (error) {
      throw new Error(`Resume Rocket failed: ${error.message}`);
    }
  }
}

// Make globally available
window.ResumeAPIClient = ResumeAPIClient;
