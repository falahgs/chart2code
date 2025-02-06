import { Document, Paragraph, TextRun, HeadingLevel, Packer, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

const removeMarkdown = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold **text**
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic *text*
    .replace(/`(.*?)`/g, '$1')       // Remove code `text`
    .replace(/~~(.*?)~~/g, '$1')     // Remove strikethrough ~~text~~
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links [text](url)
    .replace(/#{1,6}\s/g, '')        // Remove heading markers
    .trim();
};

const processTextWithBold = (text: string): TextRun[] => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map(part => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return new TextRun({
        text: part.slice(2, -2),
        bold: true,
        size: 24,
      });
    }
    return new TextRun({
      text: part,
      size: 24,
    });
  });
};

export const generateWordDocument = async (
  videoName: string,
  content: string,
  isArabic = false
) => {
  const sections = content.split('\n').reduce((acc, line) => {
    if (line.startsWith('# ')) {
      // Main header
      acc.push({
        type: 'h1',
        content: removeMarkdown(line.replace('# ', ''))
      });
    } else if (line.startsWith('## ')) {
      // Sub header
      acc.push({
        type: 'h2',
        content: removeMarkdown(line.replace('## ', ''))
      });
    } else if (line.trim() === '') {
      // Empty line
      acc.push({
        type: 'empty',
        content: ''
      });
    } else {
      // Regular paragraph
      acc.push({
        type: 'paragraph',
        content: line
      });
    }
    return acc;
  }, [] as Array<{ type: string; content: string }>);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 2000,
              right: 2000,
              bottom: 2000,
              left: 2000
            }
          }
        },
        children: [
          new Paragraph({
            text: isArabic ? `تحليل الفيديو: ${videoName}` : `Video Analysis: ${videoName}`,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            bidirectional: isArabic,
            alignment: isArabic ? AlignmentType.RIGHT : AlignmentType.LEFT,
          }),
          ...sections.map(section => {
            const paragraph = new Paragraph({
              children: processTextWithBold(section.content),
              spacing: { before: 100, after: 100 },
              bidirectional: isArabic,
              alignment: isArabic ? AlignmentType.RIGHT : AlignmentType.LEFT,
            });
            return paragraph;
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${videoName.replace(/\.[^/.]+$/, '')}_analysis.docx`);
}; 