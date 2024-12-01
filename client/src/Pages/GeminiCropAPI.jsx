import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyC1VHRr_zn58ak6HUnyLKV1S5Hnsv4OTG4"; // Replace with your actual Google API key

const genAI = new GoogleGenerativeAI(API_KEY);

const extractResponse = (response) => {
  if (response.candidates && response.candidates.length > 0) {
    const candidate = response.candidates[0];
    if (candidate.content && candidate.content.parts) {
      return candidate.content.parts.map((part) => part.text).join("");  // This should return the crop recommendations string
    } else {
      return candidate.content || "";
    }
  }
  if (response.promptFeedback) {
    throw new Error(`Text not available. ${response.promptFeedback}`);
  }
  return null;  // Return null if no valid response
};

const GetCropReccomendations = async () => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Strictly  provide me with 5 crops based on belgaum's data in json format like this example: 
  [
    "Crop1",
    "Crop2",
    "Crop3",
    "Crop4",
    "Crop5"
  ] 
  and please do not include redgrams in crops and do not add any comments or extra information only provide me the json response`;

  try {
    const result = await model.generateContent(prompt);
    const response = extractResponse(result.response);
    return response;  // This will return the actual JSON formatted string of crops
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;  // Re-throw error to be handled upstream
  }
};


const GetDiseaseInfo = async (predicted_label) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Generate a JSON object containing the following details for the plant disease "${predicted_label}":
1. "name" (the name of the disease),
2. "description" (a brief explanation of the disease, its causes, and symptoms),
3. "steps" (an ordered list of stepwise instructions to manage or cure the disease).
Ensure the JSON object follows this structure:

{
  "name": "<Disease Name>",
  "description": "<Brief explanation>",
  "steps": [
    "<Step 1>",
    "<Step 2>",
    ...
  ]
}
Only return the JSON object without any additional text or commentary.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = extractResponse(result.response);
    return response;  // This will return the actual JSON formatted string of crops
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;  // Re-throw error to be handled upstream
  }
};

export { GetCropReccomendations, GetDiseaseInfo };
