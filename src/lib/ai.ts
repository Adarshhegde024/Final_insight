import OpenAI from "openai";

const getApiKey = () => {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  return key && key !== "dummy" ? key : "dummy";
};

const openai = new OpenAI({
  apiKey: getApiKey(),
  baseURL: "https://api.groq.com/openai/v1", 
  dangerouslyAllowBrowser: true 
});

export interface AIInsights {
  critical_issues: Array<{ issue: string, severity: string, keywords: string[] }>;
  positive_highlights: Array<{ highlight: string, keywords: string[] }>;
  recommendations: {
    product: string[];
    marketing: string[];
    operations: string[];
  };
  signals: {
    emerging_issues: string[];
    improving_features: string[];
    anomalies: string[];
  };
}

export const generateInsightsFromAI = async (sampleReviews: string[]): Promise<AIInsights> => {
  if (openai.apiKey === "dummy") {
    console.warn("No Groq API key found. Falling back to simulated AI Insights.");
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      critical_issues: [
        { issue: "Significant recurring complaints about battery drainage on latest update", severity: "high", keywords: ["battery", "drain", "power"] },
        { issue: "User interface navigation feels overly complex for new users", severity: "medium", keywords: ["UI", "interface", "navigation", "complex"] }
      ],
      positive_highlights: [
        { highlight: "Customers frequently praise the rapid customer support response times", keywords: ["support", "response", "agent", "fast"] },
        { highlight: "Overall build quality and premium feel is highly rated", keywords: ["build", "quality", "premium", "sturdy"] }
      ],
      recommendations: {
        product: ["Investigate power consumption on firmware v2.1", "Simplify the main navigation dashboard"],
        marketing: ["Highlight the premium materials used in recent marketing campaigns"],
        operations: ["Maintain current staffing levels for the high-performing support desk"]
      },
      signals: {
        emerging_issues: ["Slight uptick in shipping delay complaints in the EU block"],
        improving_features: ["Recent UI tweaks to the checkout flow have reduced drop-off"],
        anomalies: ["Unusually high concentration of perfect reviews on weekends"]
      }
    };
  }

  const prompt = `
    You are an expert customer experience analyst. I am providing you with a random sample of customer reviews from a recent dataset.
    Your job is to read these reviews contextually and extract key themes, issues, and signals natively. Do not make up general assumptions; base your insights on the text provided.
    
    IMPORTANT: For 'critical_issues' and 'positive_highlights', you must also provide a 'keywords' array. This should be 3 to 6 single-word lowercase semantic keywords that closely correlate to the issue/highlight, which we will use to scan a 50,000 document database accurately.

    Return your response strictly as a JSON object that matches this exact structure:
    {
      "critical_issues": [ { "issue": "Specific pain point", "severity": "high" or "critical", "keywords": ["word1", "word2"] } ],
      "positive_highlights": [ { "highlight": "Specific beloved feature", "keywords": ["word1", "word2"] } ],
      "recommendations": {
        "product": ["Actionable product change"],
        "marketing": ["Marketing strategy"],
        "operations": ["Operational change"]
      },
      "signals": {
        "emerging_issues": ["Newly developing problem not yet a crisis"],
        "improving_features": ["Feature that people are starting to love"],
        "anomalies": ["Strange or suspect patterns (e.g. possible bot spam)"]
      }
    }

    Review Sample:
    ${JSON.stringify(sampleReviews)}
  `;

  const response = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "You are a customer intelligence AI. You respond only in valid JSON." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("AI returned an empty response");
  
  return JSON.parse(content) as AIInsights;
};
