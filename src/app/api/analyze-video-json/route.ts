import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager, FileState } from '@google/generative-ai/server';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const API_KEY = process.env.GEMINI_API_KEY as string;

const jsonPrompt = `Analyze this video and provide a detailed structured analysis in JSON format:

{
  "videoMetadata": {
    "mainTopic": "",
    "duration": "",
    "quality": "",
    "format": ""
  },
  "contentAnalysis": {
    "keyThemes": [],
    "mainPoints": [],
    "visualElements": [],
    "timestamps": []
  },
  "technicalDetails": {
    "visualQuality": "",
    "audioQuality": "",
    "productionElements": [],
    "technicalIssues": []
  },
  "detectedEntities": {
    "people": [],
    "objects": [],
    "text": [],
    "actions": []
  },
  "dataExtraction": {
    "statistics": [],
    "metrics": [],
    "keyFindings": []
  }
}

Please ensure the output is valid JSON and includes detailed information for each category.`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempFilePath = join(tmpdir(), `upload-${Date.now()}-${file.name}`);
    await writeFile(tempFilePath, buffer);

    const fileManager = new GoogleAIFileManager(API_KEY);
    const uploadResponse = await fileManager.uploadFile(tempFilePath, {
      mimeType: file.type,
      displayName: file.name,
    });

    let processedFile = await fileManager.getFile(uploadResponse.file.name);
    let attempts = 0;
    const maxAttempts = 30;

    while (processedFile.state === FileState.PROCESSING && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      processedFile = await fileManager.getFile(uploadResponse.file.name);
      attempts++;
    }

    if (processedFile.state === FileState.FAILED || attempts >= maxAttempts) {
      throw new Error('Video processing failed');
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: processedFile.mimeType,
          fileUri: processedFile.uri,
        },
      },
      jsonPrompt,
    ]);

    const response = await result.response;
    const text = response.text();

    // Clean and parse JSON response
    try {
      // Remove markdown code blocks
      let jsonString = text.replace(/```json/g, '').replace(/```/g, '');
      
      // Find the first { and last }
      const startIndex = jsonString.indexOf('{');
      const endIndex = jsonString.lastIndexOf('}');
      
      if (startIndex === -1 || endIndex === -1) {
        throw new Error('No valid JSON found in response');
      }

      // Extract just the JSON part
      jsonString = jsonString.slice(startIndex, endIndex + 1);
      
      // Clean up trailing commas
      jsonString = jsonString
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas before } or ]
        .replace(/,(\s*,)/g, ','); // Remove double commas
      
      const jsonData = JSON.parse(jsonString);

      return NextResponse.json({ analysis: jsonData });
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.log('Raw response:', text);
      return NextResponse.json(
        { 
          error: 'Failed to parse analysis results',
          details: 'Invalid response format'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error processing video:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process video',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 