import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import 'github-markdown-css/github-markdown.css';

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-2xl font-bold my-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold my-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-bold my-2">{children}</h3>,
          p: ({ children }) => <p className="my-2 text-gray-700">{children}</p>,
          ul: ({ children }) => <ul className="list-disc ml-6 my-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal ml-6 my-2">{children}</ol>,
          li: ({ children }) => <li className="my-1">{children}</li>,
          code: ({ node, inline, className, children, ...props }: CodeProps) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus as any}
                language={match[1]}
                PreTag="div"
                className="rounded-md my-4"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-100 rounded px-1 py-0.5" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 