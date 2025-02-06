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

    // Enhanced prompt for chart analysis
    const prompt = `Carefully analyze this image and provide detailed insights if it contains any of the following:
    - Flowcharts
    - Tables
    - Bar charts
    - Line charts
    - Pie charts
    - Scatter plots
    - Data visualizations
    - Statistical charts

    If the image contains any type of chart or data visualization, provide:
    1. Chart type identification
    2. Data structure and organization
    3. Key insights and patterns
    4. Potential improvements or clarifications

    If the image does not contain any recognizable chart or data visualization, respond with "No chart or data visualization detected"`;

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

    if (text.toLowerCase().includes("no chart or data visualization detected")) {
      return NextResponse.json(
        { 
          error: "The uploaded image doesn't contain a recognizable chart or data visualization. Please upload an image with a clear chart or data visualization."
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ analysis: text });
  } catch (error) {
    console.error("Error analyzing chart:", error);
    return NextResponse.json(
      { error: "Failed to analyze the image. Please try again." },
      { status: 500 }
    );
  }
} 