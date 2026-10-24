const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// Native JSON schema object fully supported by Gemini Structured Outputs
const interviewReportSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description:
        "The concise title of the job role based on the job description, e.g., 'Java Full Stack Developer'",
    },
    matchScore: {
      type: "number",
      description:
        "A score between 0 and 100 indicating how well the candidate's profile matches the job description",
    },
    technicalQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string", description: "The technical question" },
          intention: {
            type: "string",
            description: "Interviewer intention behind asking",
          },
          answer: {
            type: "string",
            description: "How to answer and key points to cover",
          },
        },
        required: ["question", "intention", "answer"],
      },
      description: "Technical interview questions",
    },
    behavioralQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string", description: "The behavioral question" },
          intention: {
            type: "string",
            description: "Interviewer intention behind asking",
          },
          answer: {
            type: "string",
            description: "How to answer using the STAR method",
          },
        },
        required: ["question", "intention", "answer"],
      },
      description: "Behavioral interview questions",
    },
    skillGap: {
      type: "array",
      items: {
        type: "object",
        properties: {
          skill: {
            type: "string",
            description: "The skill the candidate is lacking",
          },
          severity: {
            type: "string",
            enum: ["low", "medium", "high"],
            description: "Severity of the skill gap",
          },
        },
        required: ["skill", "severity"],
      },
      description: "List of skill gaps",
    },
    preparationPlan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "number", description: "Day number starting from 1" },
          focus: { type: "string", description: "Main focus for this day" },
          tasks: {
            type: "array",
            items: { type: "string" },
            description: "List of tasks to complete",
          },
        },
        required: ["day", "focus", "tasks"],
      },
      description: "Day-by-day preparation plan",
    },
  },
  required: [
    "title",
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGap",
    "preparationPlan",
  ],
};

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `You are an expert technical interviewer. Analyze the candidate resume and job description, and output a JSON object containing EXACTLY these keys: title, matchScore, technicalQuestions, behavioralQuestions, skillGap, and preparationPlan. 

  Resume: ${resume}
  Self Description: ${selfDescription}
  Job Description: ${jobDescription}`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: interviewReportSchema,
    },
  });

  return response.parsed ?? JSON.parse(response.text || "{}");
}

async function generatePdfFromHtml(html) {
    if (!html || typeof html !== "string") {
        throw new Error("No HTML content provided for PDF generation.");
    }

    const launchArgs = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process'
    ];

    const options = {
        headless: true,
        args: launchArgs
    };

    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
        options.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    }

    const browser = await puppeteer.launch(options);
    try {
        const page = await browser.newPage();

        await page.setContent(html, { 
            waitUntil: "domcontentloaded", 
            timeout: 60000 
        });

        const pdfBuffer = await page.pdf({ 
            format: "A4", 
            printBackground: true,
            margin: {
              top: "20mm",
              bottom: "20mm",
              left: "15mm",
              right: "15mm"
            } 
        });

        return pdfBuffer;
    } finally {
        await browser.close();
    }
}

const resumePdfSchema = {
    type: "object",
    properties: {
        html: {
            type: "string",
            description: "The HTML content of the resume which can be converted to PDF using any library like puppeteer",
        },
    },
    required: ["html"],
};

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate a resume for the candidate with the following details:
                  Resume: ${resume}
                  Self Description: ${selfDescription}
                  Job Description: ${jobDescription}

                  the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                  The resume should be tailored for the given job description and should highlight the candidate's strengths and relevent experience, The HTML content should be well-formatted and structured, making it easy to read and visible peeling.
                  The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                  you can highlight the content using some color or different font styles but the overall design should be simple and professional.
                  The content should be ATS friendly, i.e it should be easily parsable bt ATS systems without losing important information.
                  The resume should not be so lengthy, it should be ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevent information that can increase the candidate's chance of getting an interview call for the given job description.
    `;

    const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumePdfSchema,
        },
    });

    const jsonContent = response.parsed ?? JSON.parse(response.text || "{}");
    const html = jsonContent?.html || (typeof jsonContent === 'string' ? jsonContent : null);

    if (!html) {
        throw new Error("AI failed to generate valid HTML for the resume.");
    }

    const pdfBuffer = await generatePdfFromHtml(html);
    return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };
