import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface MarkdownMessageProps {
  content: string;
}

export default function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
        // Headings
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mt-6 mb-4 text-white border-b border-white/20 pb-2">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold mt-5 mb-3 text-white">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold mt-4 mb-2 text-white">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-base font-semibold mt-3 mb-2 text-white">
            {children}
          </h4>
        ),

        // Paragraphs
        p: ({ children }) => (
          <p className="mb-3 text-white leading-relaxed last:mb-0">
            {children}
          </p>
        ),

        // Lists
        ul: ({ children }) => (
          <ul className="mb-3 ml-4 space-y-1 list-disc list-inside text-white">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-3 ml-4 space-y-1 list-decimal list-inside text-white">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-white leading-relaxed">
            {children}
          </li>
        ),

        // Code
        code: ({ inline, className, children, ...props }: any) => {
          return inline ? (
            <code
              className="px-1.5 py-0.5 rounded bg-white/10 text-white/90 font-mono text-sm border border-white/20"
              {...props}
            >
              {children}
            </code>
          ) : (
            <code
              className={`${className} block text-sm`}
              {...props}
            >
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="mb-3 p-4 rounded-lg bg-black/30 overflow-x-auto border border-white/10">
            {children}
          </pre>
        ),

        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="mb-3 pl-4 border-l-4 border-white/30 italic text-white/80">
            {children}
          </blockquote>
        ),

        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 underline transition-colors"
          >
            {children}
          </a>
        ),

        // Tables
        table: ({ children }) => (
          <div className="mb-3 overflow-x-auto">
            <table className="min-w-full border border-white/20 rounded-lg overflow-hidden">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-white/10">
            {children}
          </thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-white/10">
            {children}
          </tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-white/5 transition-colors">
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left text-white font-semibold border-r border-white/10 last:border-r-0">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 text-white border-r border-white/10 last:border-r-0">
            {children}
          </td>
        ),

        // Horizontal Rule
        hr: () => (
          <hr className="my-4 border-t border-white/20" />
        ),

        // Strong and Emphasis
        strong: ({ children }) => (
          <strong className="font-bold text-white">
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em className="italic text-white/90">
            {children}
          </em>
        ),

        // Delete (strikethrough)
        del: ({ children }) => (
          <del className="line-through text-white/70">
            {children}
          </del>
        ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
