import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Check Groq API connectivity and balance
export const getBalanceGrok = async () => {
  try {
    const models = await groq.models.list();
    if (models) {
      // console.log("Free Tier Active");
      console.log("Groq is connected");
    }
  } catch (error) {
    console.error(error.message);
  }
};

// Generate Python code based on user prompt
export const generateCode = async (prompt) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are a data analyst.

Generate ONLY Python code.
Rules:
- Use pandas for analysis
- Use matplotlib/seaborn only if the user explicitly asks for a plot
- Dataframe is already loaded as 'df'
- Do NOT import os, sys, or any unsafe modules
- Do NOT explain anything
- Do NOT add markdown (no \`\`\`)
- If needed, store output in variable 'result' and print it
- If calculating correlations, use only numeric columns (df.select_dtypes(include="number")).
          `,
        },
        {
          role: "user",
          content: prompt,
        },
        {
          role: "system",
          content: `
  You are a data analyst.

  Generate ONLY simple Python code.
  Do not include any import statements.
  Assume pd, np, plt, sns, and df are already available.
  Prefer short pandas operations.
  Do not create plots unless the user explicitly asks for a visualization.
  If calculating correlations, use only numeric columns.
            `,
        },
      ],
      temperature: 0.2,
    });

    let code = response.choices[0].message.content;

    // 🔥 Clean response (very important)
    code = code.replace(/```python|```/g, "").trim();

    return code;
  } catch (error) {
    throw new Error("Groq error: " + error.message);
  }
};
