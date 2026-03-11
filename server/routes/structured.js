import { Router } from 'express';
import OpenAI from 'openai';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const router = Router();

// Initialize OpenAI client (lazily, only when API key exists)
let openaiClient = null;
const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
};

// Zod Schemas
const GapAnalysisSchema = z.object({
  key_requirements: z.array(z.string()),
  relevant_experience: z.array(z.string()),
  gaps: z.array(z.string()),
  potential_strengths: z.array(z.string())
});

const ResumeOutputSchema = z.object({
  updated_resume: z.string().min(100),
  diff_html: z.string()
});

const CoverLetterSchema = z.object({
  cover_letter: z.string().min(200).max(2000)
});

/**
 * POST /api/structured/resume-analysis
 * Analyze resume against job description
 *
 * Request body:
 * {
 *   "resume_text": "...",
 *   "job_description_text": "..."
 * }
 */
router.post('/resume-analysis', async (req, res, next) => {
  try {
    const { resume_text, job_description_text } = req.body;

    if (!resume_text || !job_description_text) {
      return res.status(400).json({
        error: 'resume_text and job_description_text are required'
      });
    }

    const client = getOpenAIClient();

    const prompt = `Analyze this resume against the job description. Identify key requirements, relevant experience, gaps, and potential strengths.

Resume:
${resume_text}

Job Description:
${job_description_text}

Return JSON with these exact fields:
- key_requirements: array of strings (main skills/qualifications from job description)
- relevant_experience: array of strings (matching skills and experience from resume)
- gaps: array of strings (missing or weak areas in resume compared to job requirements)
- potential_strengths: array of strings (valuable skills in resume not explicitly in job description but could strengthen application)`;

    const jsonSchemaRaw = zodToJsonSchema(GapAnalysisSchema, 'gap_analysis');
    const jsonSchema = jsonSchemaRaw.definitions?.gap_analysis || jsonSchemaRaw;

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career advisor analyzing resumes against job descriptions. Provide detailed, actionable insights.'
        },
        { role: 'user', content: prompt }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'gap_analysis',
          strict: true,
          schema: jsonSchema
        }
      },
      temperature: 0.7
    });

    const content = JSON.parse(response.choices[0].message.content);
    const validated = GapAnalysisSchema.parse(content);

    res.json(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({
        error: 'Validation failed',
        details: error.errors
      });
    }
    next(error);
  }
});

/**
 * POST /api/structured/generate-resume
 * Generate tailored resume with diff tracking
 *
 * Request body:
 * {
 *   "resume_text": "...",
 *   "job_description_text": "...",
 *   "gap_analysis": { ... }
 * }
 */
router.post('/generate-resume', async (req, res, next) => {
  try {
    const { resume_text, job_description_text, gap_analysis } = req.body;

    if (!resume_text || !job_description_text || !gap_analysis) {
      return res.status(400).json({
        error: 'resume_text, job_description_text, and gap_analysis are required'
      });
    }

    const client = getOpenAIClient();

    const prompt = `You are an expert resume writer. Rewrite the resume to better match the job description and address the identified gaps.

Original Resume:
${resume_text}

Target Job Description:
${job_description_text}

Gap Analysis:
${JSON.stringify(gap_analysis, null, 2)}

Instructions:
1. Rewrite the entire resume to match the job description
2. Address the gaps identified in the analysis by:
   - Adding missing skills and technologies from the job description
   - Reframing experience to highlight relevant accomplishments
   - Strengthening sections identified as weak
   - Using keywords from the job description
3. Quantify achievements with metrics where possible
4. Use strong action verbs
5. Maintain professional formatting

Return JSON with:
- updated_resume: The final rewritten resume as plain text with markdown formatting
- diff_html: HTML version showing changes with inline color coding:
  * Additions or new content: <span style="color:green">new text</span>
  * Removed content: <span style="color:red;text-decoration:line-through">old text</span>
  * Unchanged content: plain text (no markup)

Make the diff_html readable by preserving line breaks and formatting.`;

    const jsonSchemaRaw = zodToJsonSchema(ResumeOutputSchema, 'resume_output');
    const jsonSchema = jsonSchemaRaw.definitions?.resume_output || jsonSchemaRaw;

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer specializing in ATS optimization and career positioning.'
        },
        { role: 'user', content: prompt }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'resume_output',
          strict: true,
          schema: jsonSchema
        }
      },
      temperature: 0.7,
      max_tokens: 2500
    });

    const content = JSON.parse(response.choices[0].message.content);
    const validated = ResumeOutputSchema.parse(content);

    res.json(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({
        error: 'Validation failed',
        details: error.errors
      });
    }
    next(error);
  }
});

/**
 * POST /api/structured/generate-cover-letter
 * Generate cover letter with tone control
 *
 * Request body:
 * {
 *   "updated_resume": "...",
 *   "job_description_text": "...",
 *   "tone": "professional" | "enthusiastic" | "startup-friendly"
 * }
 */
router.post('/generate-cover-letter', async (req, res, next) => {
  try {
    const { updated_resume, job_description_text, tone = 'professional' } = req.body;

    if (!updated_resume || !job_description_text) {
      return res.status(400).json({
        error: 'updated_resume and job_description_text are required'
      });
    }

    const client = getOpenAIClient();

    const toneGuidance = {
      professional: 'formal and corporate-appropriate, emphasizing qualifications and experience',
      enthusiastic: 'energetic and passionate while remaining professional, showing genuine interest',
      'startup-friendly': 'slightly informal but polished, emphasizing adaptability and innovation'
    };

    const prompt = `Write a compelling cover letter based on the resume and job description.

Resume:
${updated_resume}

Job Description:
${job_description_text}

Tone: ${tone} (${toneGuidance[tone] || toneGuidance.professional})

Requirements:
- Address generically (e.g., "Dear Hiring Manager")
- 3-4 paragraphs maximum
- Highlight key achievements and experiences from the resume
- Align with responsibilities and qualifications in the job description
- Express enthusiasm and fit for the role
- End with a confident and polite closing statement
- Match the specified tone throughout

Return JSON with:
- cover_letter: Complete cover letter text`;

    const jsonSchemaRaw = zodToJsonSchema(CoverLetterSchema, 'cover_letter');
    const jsonSchema = jsonSchemaRaw.definitions?.cover_letter || jsonSchemaRaw;

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a professional career coach and expert cover letter writer.'
        },
        { role: 'user', content: prompt }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'cover_letter',
          strict: true,
          schema: jsonSchema
        }
      },
      temperature: 0.7,
      max_tokens: 1500
    });

    const content = JSON.parse(response.choices[0].message.content);
    const validated = CoverLetterSchema.parse(content);

    res.json(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({
        error: 'Validation failed',
        details: error.errors
      });
    }
    next(error);
  }
});

/**
 * POST /api/structured/recipe
 * Generate a recipe with guaranteed structured output
 *
 * Request body:
 * {
 *   "recipe_request": "chocolate chip cookies"
 * }
 */
router.post('/recipe', async (req, res, next) => {
  try {
    const { recipe_request } = req.body;

    if (!recipe_request) {
      return res.status(400).json({
        error: 'recipe_request is required'
      });
    }

    const client = getOpenAIClient();

    const RecipeSchema = z.object({
      name: z.string(),
      cuisine: z.string(),
      difficulty: z.enum(['easy', 'medium', 'hard']),
      prep_time_minutes: z.number().int().positive(),
      ingredients: z.array(z.string()).min(3),
      instructions: z.array(z.string()).min(3)
    });

    // Convert Zod schema to JSON Schema - extract from definitions if wrapped
    const jsonSchemaRaw = zodToJsonSchema(RecipeSchema, 'recipe');
    const jsonSchema = jsonSchemaRaw.definitions?.recipe || jsonSchemaRaw;

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful cooking assistant. Provide detailed, accurate recipes with clear instructions.'
        },
        {
          role: 'user',
          content: `Give me a recipe for ${recipe_request}. Include the recipe name, cuisine type, difficulty level (easy/medium/hard), prep time in minutes, list of ingredients, and step-by-step instructions.`
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'recipe',
          strict: true,
          schema: jsonSchema
        }
      },
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = JSON.parse(response.choices[0].message.content);
    const validated = RecipeSchema.parse(content);

    res.json(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({
        error: 'Validation failed',
        details: error.errors
      });
    }
    next(error);
  }
});

export default router;
