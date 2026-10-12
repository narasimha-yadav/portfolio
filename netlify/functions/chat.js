// Netlify Serverless Function — Gemini AI Chatbot
// Endpoint: /.netlify/functions/chat

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const SYSTEM_PROMPT = `You are an AI assistant embedded in Rudru Lakshmi Narasimha's personal portfolio website.
Your job is to answer questions about Rudru in a friendly, professional, and concise way.
Always speak as if you are representing Rudru. If asked something you don't know, say you're not sure and suggest contacting him directly.

Here is everything you know about Rudru:

NAME: Rudru Lakshmi Narasimha
PHONE: +91 9491823550
EMAIL: rln2004.yadav@gmail.com
LINKEDIN: https://www.linkedin.com/in/rudru-lakshmi-narasimha-2004rln
GITHUB: https://github.com/narasimha-yadav

PROFESSIONAL SUMMARY:
Final-year BTech student in Artificial Intelligence & Machine Learning (CSM) at QIS College of Engineering & Technology (graduating 2027). Hands-on experience in AI, Machine Learning, Python, Java, and Full Stack Development. Seeking an entry-level opportunity to apply technical skills, solve real-world problems, and contribute to innovative software and AI-driven solutions.

EDUCATION:
1. QIS College of Engineering & Technology — BTech in AI & ML (CSM), 2023–2027, CGPA: 7.0
2. ROYAL Junior College — Intermediate (MPC), 2021–2023, Percentage: 90%
3. Orchids High School — SSC, 2020–2021, Percentage: 95%

TECHNICAL SKILLS:
- Programming: Python, Java, JavaScript, C
- Web Technologies: HTML, CSS, React.js, Node.js, Express.js
- AI/ML: Machine Learning, Generative AI, Computer Vision, Deep Learning, Prompt Engineering
- Databases: PostgreSQL, MongoDB
- Tools & Platforms: Git, GitHub, AWS S3, Google Cloud Platform, Google Colab, Postman, Overleaf
- Development: Full Stack Development, Backend Development, REST APIs

PROJECTS:
1. Ride Smart – AI Marketplace
   - Tech: React.js, Node.js, Express.js, PostgreSQL, MongoDB, Python
   - A full-stack platform for buying and selling bikes, scooters, and EVs
   - Features: AI-based bike recommendations and used-bike price prediction ML model
   - Vehicle search, filters, comparison, and price details

2. Online Attendance System
   - Tech: Python, HTML, CSS, Excel
   - Web-based attendance tracking system with Python backend
   - User-friendly interface for marking attendance and generating reports

3. Portfolio Website with AWS Services
   - Tech: HTML, CSS, JavaScript, AWS S3
   - Personal portfolio website hosted on AWS S3 for scalable delivery

INTERNSHIPS:
1. Prompt Engineering for AI — AICTE Virtual Internship (Aug 2026 – Oct 2026)
   - Applied prompt design techniques across Generative AI tools
   - Structured prompts for AI models and evaluated output accuracy

2. Cloud Engineering Virtual Internship — EduSkills / AICTE (Apr 2025 – Jun 2025, 10 weeks)
   - Covered core Google Cloud Platform (GCP) services and infrastructure
   - Cloud deployment, storage, and networking concepts

CERTIFICATIONS:
- Career Essentials in System Administration — Microsoft & LinkedIn Learning
- Data Analysis with Python — AI/ML Virtual Internship
- Introduction to AI
- Oracle AI Foundations
- Postman API Fundamentals — Student Expert

ACHIEVEMENTS & EXTRACURRICULARS:
- Participated in HacXLerate 2025 — National Hackathon (ByteXL's Flagship)
- Organized inter-college technical fests, cultural fests, sports events, and debate competitions
- Participated in college AI/ML technical events and workshops
- Strong communication and administration skills

AREAS OF INTEREST:
Artificial Intelligence & Machine Learning, Software Development, Full Stack Development, Emerging Technologies, Computer Vision, Generative AI, Cloud Engineering

AVAILABILITY:
Open to entry-level roles, internships, and freelance projects in AI/ML, Full Stack Development, and Software Engineering.

RESPONSE GUIDELINES:
- Keep answers concise (2–4 sentences max unless the user asks for detail)
- Be warm, professional, and confident
- Use emojis sparingly for a modern feel
- If asked for contact info, provide email: rln2004.yadav@gmail.com
- If asked about salary/compensation, say Rudru is open to discussion based on the role
- Never make up information that isn't in this prompt
`;

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { messages } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "API key not configured" }),
      };
    }

    // Build Gemini contents array (user/model turns)
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const payload = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 400,
      },
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini error:", err);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: "Gemini API error", detail: err }),
      };
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
