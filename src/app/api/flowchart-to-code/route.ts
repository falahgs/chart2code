import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Please upload an image file" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");
    const mimeType = file.type;

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Prompt for flowchart to Python code conversion
    const prompt = `Analyze this flowchart image and convert it into Python code. Follow these steps:
    1. Identify all flowchart elements (start/end, processes, decisions, inputs/outputs)
    2. Map flowchart elements to appropriate Python constructs
    3. Generate clean, well-structured Python code
    4. Include comments explaining each part of the code
    5. Ensure proper indentation and Python syntax

    If the image does not contain a flowchart, respond with "No flowchart detected"`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();

    if (text.toLowerCase().includes("no flowchart detected")) {
      return NextResponse.json(
        { 
          error: "The uploaded image doesn't contain a recognizable flowchart. Please upload an image with a clear flowchart."
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ code: text });
  } catch (error) {
    console.error("Error converting flowchart:", error);
    return NextResponse.json(
      { error: "Failed to convert flowchart. Please try again." },
      { status: 500 }
    );
  }
} 