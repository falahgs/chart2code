import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

const API_KEY = process.env.GEMINI_API_KEY as string;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const TARGET_WIDTH = 800;
const QUALITY = 80;

const objectDetectionPrompt = `Analyze this image and provide detailed object detection results in JSON format. For each detected object, provide precise bounding box coordinates (x, y, width, height) relative to the image dimensions:

{
  "detectedObjects": [
    {
      "object": "name of object",
      "confidence": "confidence score (high/medium/low)",
      "location": {
        "x": number (left position),
        "y": number (top position),
        "width": number (width of box),
        "height": number (height of box)
      },
      "attributes": ["color", "size", "other relevant attributes"]
    }
  ],
  "sceneDescription": "overall scene description",
  "visualContext": {
    "lighting": "lighting conditions",
    "environment": "environment type",
    "composition": "composition details"
  },
  "technicalDetails": {
    "imageQuality": "quality assessment",
    "colorProfile": "color profile details",
    "dominantColors": ["color1", "color2", "etc"]
  }
}

Ensure coordinates are provided as numbers relative to the image dimensions.`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    if (image.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: 'Image size must be less than 5MB' },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const processedImage = await sharp(buffer)
      .resize(TARGET_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: QUALITY })
      .toBuffer();

    const base64Image = processedImage.toString('base64');

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: image.type,
        },
      },
      objectDetectionPrompt,
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
    console.error('Error analyzing image:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 