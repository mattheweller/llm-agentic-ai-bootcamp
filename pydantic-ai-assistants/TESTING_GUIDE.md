# Pydantic AI Module - Testing Guide

## Quick Start

1. **Start the Express server:**
   ```bash
   cd server
   node server.js
   ```

   You should see:
   ```
   🚀 LLM Bootcamp Server running on http://localhost:3000
   🌐 Frontend: http://localhost:3000
   📋 Health check: http://localhost:3000/health
   ```

2. **Open in browser:**
   ```
   http://localhost:3000/pydantic-ai-assistants/index.html
   ```

3. **Verify configuration:**
   - Server logs should show no errors
   - Health endpoint should return: `http://localhost:3000/health`
   - `.env` file should contain `OPENAI_API_KEY=sk-...`

---

## Task-by-Task Testing

### Task 1: Project Overview
**URL:** `/pydantic-ai-assistants/tasks/task-1-overview.html`

**Test:**
- [ ] Page loads without errors
- [ ] Code examples display correctly
- [ ] Navigation works (Previous/Next buttons)

**Expected:** Informational page with no interactive elements

---

### Task 2: Validation Intro
**URL:** `/pydantic-ai-assistants/tasks/task-2-validation-intro.html`

**Test Sequence:**

1. **Valid User Demo:**
   - Keep default values (Mira, 30, mira@gmail.com)
   - Click "✓ Validate with Zod"
   - **Expected:** Green success message with validated JSON

2. **Invalid User Demo:**
   - Click "✗ Try Invalid Data"
   - Age field changes to "not-a-number"
   - Click "✓ Validate with Zod"
   - **Expected:** Red error message: "age: Expected number, received string"

3. **Practice Code Runner:**
   - Default code creates ProductSchema
   - Click "▶ Run Code"
   - **Expected:** Console output showing valid product object

**Console Check:** No errors should appear

---

### Task 3: Structured Outputs (Recipe Demo)
**URL:** `/pydantic-ai-assistants/tasks/task-3-structured-outputs.html`

**Test Sequence:**

1. **Generate Recipe:**
   - Default prompt: "pasta carbonara"
   - Click "🍳 Generate Recipe"
   - **Expected:**
     - Button changes to "⏳ Generating..."
     - Loading message appears
     - After 5-10 seconds:
       - Recipe displays with name, cuisine, difficulty, prep time
       - At least 3 ingredients listed
       - At least 3 instructions listed
       - Green success callout: "Structured Output Success!"

2. **Try Different Recipes:**
   - Enter "chocolate chip cookies"
   - Click "🍳 Generate Recipe"
   - **Expected:** Different recipe with same structured format

3. **Error Handling:**
   - Stop the server
   - Try to generate a recipe
   - **Expected:** Error message mentioning server connection
   - Restart server and verify it works again

**Network Tab Check:**
- Request goes to: `POST /api/structured/recipe`
- Response should be valid JSON matching RecipeSchema

**Console Check:** No errors should appear

---

### Task 4: Resume Inputs
**URL:** `/pydantic-ai-assistants/tasks/task-4-resume-inputs.html`

**Test Sequence:**

1. **Load Sample Data:**
   - Click "📝 Load Sample Data"
   - **Expected:** Both textareas fill with sample resume and job description

2. **Save Inputs:**
   - Click "💾 Save Inputs"
   - **Expected:** Success message: "✅ Saved successfully!"

3. **Persistence Check:**
   - Refresh page (F5 or Cmd+R)
   - **Expected:** Data remains in textareas

4. **Clear Data:**
   - Click "🗑️ Clear All"
   - Confirm dialog
   - **Expected:** Textareas empty, localStorage cleared

5. **Custom Data:**
   - Enter your own resume and job description
   - Click "💾 Save Inputs"
   - Continue to next task

**LocalStorage Check:**
- Open DevTools > Application > LocalStorage
- Verify keys exist:
  - `pydantic_resume`
  - `pydantic_jobdesc`

**Console Check:** No errors should appear

---

### Task 5: Gap Analysis
**URL:** `/pydantic-ai-assistants/tasks/task-5-gap-analysis.html`

**Prerequisites:** Task 4 must be completed (data saved)

**Test Sequence:**

1. **Verify Sample Data:**
   - Page should show default resume and job description in textareas

2. **Run Analysis:**
   - Click "🔍 Analyze Resume"
   - **Expected:**
     - Button changes to "⏳ Analyzing..."
     - Loading spinner appears
     - Message: "Analyzing resume... This may take 10-15 seconds"
     - After 10-15 seconds, results display in 4 sections:

3. **Verify Results Structure:**
   - [ ] 🎯 Key Requirements from Job Description (multiple items)
   - [ ] ✅ Relevant Experience in Resume (multiple items)
   - [ ] ⚠️ Gaps to Address (multiple items, styled as warning)
   - [ ] 💪 Potential Strengths (multiple items, styled as success)

4. **Content Verification:**
   - Requirements should match job description keywords
   - Gaps should identify missing skills
   - Strengths should mention relevant but unmentioned skills

**LocalStorage Check:**
- New key should appear: `pydantic_gap_analysis`
- Value should be valid JSON with the 4 fields

**Network Tab Check:**
- Request: `POST /api/structured/resume-analysis`
- Response should match `GapAnalysisSchema`

**Console Check:** No errors should appear

---

### Task 6: Resume Generation
**URL:** `/pydantic-ai-assistants/tasks/task-6-resume-generation.html`

**Prerequisites:**
- Task 4 completed (resume/job description saved)
- Task 5 completed (gap analysis saved)

**Test Sequence:**

1. **Check Prerequisites:**
   - If warning appears: "Missing Inputs", go back to Tasks 4 & 5
   - **Expected:** Warning should not appear if prerequisites met

2. **Generate Resume:**
   - Click "✨ Generate Tailored Resume"
   - **Expected:**
     - Button disabled, text changes to processing
     - Loading spinner appears
     - After 15-25 seconds, results display

3. **Updated Resume Tab:**
   - Default tab should be "📄 Updated Resume"
   - **Expected:**
     - Full resume text displayed
     - Copy and Download buttons visible

4. **Diff View Tab:**
   - Click "🔍 Changes (Diff)"
   - **Expected:**
     - Legend showing green = additions, red = deletions
     - Resume text with color-coded changes:
       - Green text for new content
       - Red strikethrough for removed content

5. **Copy Resume:**
   - Click "📋 Copy to Clipboard"
   - **Expected:** Alert "✅ Resume copied to clipboard!"
   - Paste into text editor to verify

6. **Download Resume:**
   - Click "💾 Download as Text"
   - **Expected:** File downloads as "tailored-resume.txt"

**LocalStorage Check:**
- New key: `pydantic_updated_resume`

**Network Tab Check:**
- Request: `POST /api/structured/generate-resume`
- Response should have `updated_resume` and `diff_html` fields

**Console Check:** No errors should appear

---

### Task 7: Cover Letter Generation
**URL:** `/pydantic-ai-assistants/tasks/task-7-cover-letter.html`

**Prerequisites:**
- Task 4 completed (job description saved)
- Task 6 completed (updated resume saved)

**Test Sequence:**

1. **Check Prerequisites:**
   - If warning appears: "Missing Inputs", complete Tasks 4 & 6
   - **Expected:** No warning if prerequisites met

2. **Select Tone (Professional):**
   - Keep default "🎩 Professional" selected
   - Click "✍️ Generate Cover Letter"
   - **Expected:**
     - Loading state
     - After 10-15 seconds, cover letter appears
     - Tone should be formal and corporate-appropriate
     - Character count displays

3. **Copy Cover Letter:**
   - Click "📋 Copy to Clipboard"
   - **Expected:** Alert "✅ Cover letter copied to clipboard!"

4. **Download Cover Letter:**
   - Click "💾 Download as Text"
   - **Expected:** File downloads as "cover-letter.txt"

5. **Try Enthusiastic Tone:**
   - Select "⚡ Enthusiastic"
   - Click "🔄 Regenerate"
   - **Expected:**
     - New cover letter with more energetic language
     - Tone indicator shows "enthusiastic"

6. **Try Startup-Friendly Tone:**
   - Select "🚀 Startup-Friendly"
   - Click "🔄 Regenerate"
   - **Expected:**
     - Slightly informal but polished tone
     - May include casual greetings

**Network Tab Check:**
- Request: `POST /api/structured/generate-cover-letter`
- Body includes `tone` parameter
- Response has `cover_letter` field (200-2000 chars)

**Console Check:** No errors should appear

---

### Task 8: Unified Pipeline
**URL:** `/pydantic-ai-assistants/tasks/task-8-unified-pipeline.html`

**Test Sequence:**

1. **Input Data:**
   - Page should have default resume and job description
   - Select cover letter tone (default: Professional)

2. **Run Pipeline:**
   - Click "🚀 Run Complete Pipeline"
   - **Expected:**
     - Button disabled, changes to "⏳ Processing..."
     - Progress stepper appears

3. **Watch Progress:**
   - **Step 1 (active):** "Analysis" - takes 10-15 seconds
   - **Step 2 (active):** "Resume" - takes 15-25 seconds
   - **Step 3 (active):** "Cover Letter" - takes 10-15 seconds
   - **Expected:** Total time 35-55 seconds

4. **View Results:**
   - Tabs appear: Gap Analysis | Updated Resume | Diff View | Cover Letter
   - Default tab: "Gap Analysis"

5. **Navigate Tabs:**
   - Click "Updated Resume" - should show full resume
   - Click "Diff View" - should show color-coded changes
   - Click "Cover Letter" - should show generated letter

6. **Download Resume:**
   - In any tab, click "💾 Download Resume"
   - **Expected:** File downloads as "tailored-resume.txt"

7. **Error Handling Test:**
   - Clear one of the textareas
   - Click "🚀 Run Complete Pipeline"
   - **Expected:** Error message about missing fields

**Network Tab Check:**
- Should see 3 sequential requests:
  1. `POST /api/structured/resume-analysis`
  2. `POST /api/structured/generate-resume`
  3. `POST /api/structured/generate-cover-letter`

**Console Check:** No errors should appear

---

### Task 9: Advanced Features
**URL:** `/pydantic-ai-assistants/tasks/task-9-advanced.html`

**Test Sequence:**

1. **Custom Validators (Invalid):**
   - Email: "john@gmail.com" (not @company.com)
   - Password: "weak"
   - Click "Validate Custom"
   - **Expected:**
     - Email error: "Must be a company email (@company.com)"
     - Password errors listing missing requirements

2. **Custom Validators (Valid):**
   - Email: "john@company.com"
   - Password: "SecurePass123!"
   - Click "Validate Custom"
   - **Expected:** "✅ All validations passed!"

3. **safeParse Demo (Invalid):**
   - Age: "abc"
   - Click "Test safeParse"
   - **Expected:** Validation error about expected number

4. **safeParse Demo (Valid):**
   - Age: "25"
   - Click "Test safeParse"
   - **Expected:** Success with validated data object

**Console Check:** No errors should appear

---

## Common Issues & Solutions

### Issue: "OPENAI_API_KEY not configured"
**Cause:** Missing or invalid API key

**Solution:**
```bash
# Add to .env file in repository root
OPENAI_API_KEY=sk-proj-...your-key-here...
```

### Issue: "Failed to fetch" or network errors
**Cause:** Server not running

**Solution:**
```bash
cd server
node server.js
```

### Issue: Task 6/7/8 shows "Missing Inputs"
**Cause:** Previous tasks not completed

**Solution:**
1. Go to Task 4, load and save sample data
2. Go to Task 5, run analysis (for Task 6)
3. Go to Task 6, generate resume (for Task 7)

### Issue: Recipe generation fails
**Cause:** API rate limit or invalid key

**Solution:**
1. Check OpenAI API dashboard for usage
2. Verify API key has available credits
3. Wait 1 minute and retry

### Issue: Results not persisting
**Cause:** LocalStorage disabled or browser privacy mode

**Solution:**
- Use regular browser window (not incognito)
- Enable localStorage in browser settings

---

## Performance Expectations

| Task | Endpoint | Expected Time | Timeout |
|------|----------|---------------|---------|
| Task 3 - Recipe | `/api/structured/recipe` | 5-10s | 60s |
| Task 5 - Analysis | `/api/structured/resume-analysis` | 10-15s | 60s |
| Task 6 - Resume | `/api/structured/generate-resume` | 15-25s | 60s |
| Task 7 - Cover Letter | `/api/structured/generate-cover-letter` | 10-15s | 60s |
| Task 8 - Pipeline | All three | 35-55s | 180s |

---

## Success Criteria

✅ **All tests pass when:**
1. No console errors in any task
2. All API calls return 200 status
3. Loading states appear during API calls
4. Results display correctly formatted
5. LocalStorage persists data across refreshes
6. Copy/download features work
7. Error messages are clear and helpful
8. Validation works as expected (both client and server-side)

---

## Developer Notes

### API Client (`resume-client.js`)
- Base timeout: 60 seconds per request
- Includes automatic error handling
- Provides progress callbacks for pipeline

### Component Library (`components.js`)
- `renderGapAnalysis()` - Displays 4-section analysis
- `renderDiffView()` - Shows color-coded resume changes
- `renderCoverLetter()` - Formats letter with actions
- `createProgressStepper()` - Shows 3-step pipeline progress
- `copyToClipboard()` - Native clipboard API
- `downloadText()` - Creates downloadable text file

### CSS Classes
- `.loading-spinner` - Animated loading indicator
- `.demo-output.success` - Green success message
- `.demo-output.error` - Red error message
- `.callout.callout-info` - Blue info box
- `.callout.callout-warning` - Yellow warning box

### LocalStorage Keys
- `pydantic_resume` - Original resume text
- `pydantic_jobdesc` - Job description text
- `pydantic_gap_analysis` - Gap analysis JSON
- `pydantic_updated_resume` - Generated resume text

---

## Need Help?

1. Check browser console for errors
2. Check server terminal for API errors
3. Verify `.env` file has valid API key
4. Ensure all dependencies installed: `npm install` in `/server`
5. Try clearing localStorage and starting fresh
6. Verify OpenAI API key has available credits
