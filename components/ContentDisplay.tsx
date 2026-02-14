
import React, { useState, useMemo } from 'react';
import type { MCQ, StudyResource } from '../types';
import { LoadingSpinner, LinkIcon, CheckIcon, XIcon, ClipboardIcon } from './Icons';

interface ContentDisplayProps {
  isLoading: boolean;
  error: string | null;
  content: string | MCQ[] | { summary: string, links: StudyResource[] } | null;
  contentType: 'notes' | 'mcq' | 'resources' | 'summary';
  topic: string | null;
  scrollProgress: number;
}

// A simple component to render markdown-like text with attractive styling
const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
    const [copiedStates, setCopiedStates] = useState<Record<number, boolean>>({});

    const handleCopy = (content: string, index: number) => {
      navigator.clipboard.writeText(content);
      setCopiedStates(prev => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [index]: false }));
      }, 2000);
    };

    const parsedElements = useMemo(() => {
        const elements: { type: string; content: string | string[]; lang?: string; indent?: number; alt?: string, src?: string }[] = [];
        const lines = text.split('\n');
        let inCodeBlock = false;
        let codeBlockContent: string[] = [];
        let codeLang = '';

        for (const line of lines) {
            const imageMatch = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);

            if (line.trim().startsWith('```')) {
                if (inCodeBlock) {
                    elements.push({ type: 'code', content: codeBlockContent.join('\n'), lang: codeLang });
                    codeBlockContent = [];
                    codeLang = '';
                } else {
                    codeLang = line.trim().substring(3) || '';
                }
                inCodeBlock = !inCodeBlock;
            } else if (inCodeBlock) {
                codeBlockContent.push(line);
            } else if (imageMatch) {
                elements.push({ type: 'image', content: '', alt: imageMatch[1], src: imageMatch[2] });
            } else if (line.startsWith('# ')) {
                elements.push({ type: 'h1', content: line.substring(2) });
            } else if (line.startsWith('## ')) {
                elements.push({ type: 'h2', content: line.substring(3) });
            } else if (line.startsWith('### ')) {
                elements.push({ type: 'h3', content: line.substring(4) });
            } else if (line.trim().match(/^(---|___|\*\*\*)$/)) {
                elements.push({ type: 'hr', content: '' });
            } else if (line.trim().startsWith('> ')) {
                elements.push({ type: 'blockquote', content: line.trim().substring(2) });
            } else if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                const indentMatch = line.match(/^(\s*)/);
                const indent = indentMatch ? Math.floor(indentMatch[1].length / 2) : 0;
                elements.push({ type: 'li', content: line.trim().substring(2), indent });
            } else if (line.trim() !== '') {
                elements.push({ type: 'p', content: line });
            } else if (elements.length > 0 && elements[elements.length - 1].type !== 'br') {
                elements.push({ type: 'br', content: '' });
            }
        }
        
        if (inCodeBlock && codeBlockContent.length > 0) {
           elements.push({ type: 'code', content: codeBlockContent.join('\n'), lang: codeLang });
        }
        return elements;
    }, [text]);

    const renderLine = (line: string) => {
        const parts = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('`') && part.endsWith('`')) {
                return <code key={index} className="bg-black/20 px-1.5 py-0.5 rounded-md font-mono text-sm mx-1 border border-white/10">{part.slice(1, -1)}</code>;
            }
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="leading-relaxed space-y-4">
            {parsedElements.map((el, index) => {
                switch (el.type) {
                    case 'h1': return <h1 key={index} className="text-3xl font-extrabold mt-6 pb-2">{renderLine(el.content as string)}</h1>;
                    case 'h2': return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 pb-2 border-b-2 border-white/10">{renderLine(el.content as string)}</h2>;
                    case 'h3': return <h3 key={index} className="text-xl font-semibold mt-6 mb-2">{renderLine(el.content as string)}</h3>;
                    case 'li': return <li key={index} className="list-disc marker:text-indigo-400" style={{ marginLeft: `${(el.indent || 0) * 1.5 + 1.25}rem` }}>{renderLine(el.content as string)}</li>;
                    case 'p': return <p key={index}>{renderLine(el.content as string)}</p>;
                    case 'blockquote': return <blockquote key={index} className="border-l-4 border-indigo-500/70 pl-4 italic my-4">{renderLine(el.content as string)}</blockquote>;
                    case 'hr': return <hr key={index} className="border-white/10 my-6" />;
                    case 'image':
                        return (
                            <div key={index} className="my-6 flex justify-center">
                                <figure>
                                    <img src={el.src} alt={el.alt} className="rounded-lg shadow-lg max-w-full h-auto border-2 border-white/10 bg-black/20" />
                                    {el.alt && <figcaption className="text-center text-sm text-gray-400 mt-2 italic">{el.alt}</figcaption>}
                                </figure>
                            </div>
                        );
                    case 'code':
                        return (
                          <div key={index} className="bg-black/30 rounded-lg my-4 border border-white/10">
                            <div className="flex justify-between items-center px-4 py-2 bg-black/20 border-b border-white/10">
                                <span className="text-xs font-semibold text-gray-300 uppercase">{el.lang || 'Code Block'}</span>
                                <button onClick={() => handleCopy(el.content as string, index)} className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white transition-colors">
                                    <ClipboardIcon className="h-3.5 w-3.5" />
                                    {copiedStates[index] ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <pre className="p-4 overflow-x-auto">
                                <code className="font-mono text-sm whitespace-pre-wrap">{el.content}</code>
                            </pre>
                          </div>
                        );
                    case 'br': return <div key={index} className="h-4"></div>;
                    default: return null;
                }
            })}
        </div>
    );
};


const MCQItem: React.FC<{ mcq: MCQ, index: number }> = ({ mcq, index }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);

    const getOptionClass = (option: string) => {
        if (!showAnswer) {
            return selectedOption === option ? 'bg-indigo-600/80 ring-2 ring-indigo-400 text-white' : 'bg-black/30 hover:bg-white/20 text-gray-300';
        }
        if (option === mcq.answer) {
            return 'bg-green-500/30 text-green-300 ring-2 ring-green-500';
        }
        if (option === selectedOption && option !== mcq.answer) {
            return 'bg-red-500/30 text-red-300 ring-2 ring-red-500';
        }
        return 'bg-black/30 opacity-60 text-gray-400';
    };

    const getOptionIcon = (option: string) => {
        if (!showAnswer) return null;
        if (option === mcq.answer) return <CheckIcon className="h-5 w-5 text-green-400" />;
        if (option === selectedOption) return <XIcon className="h-5 w-5 text-red-400" />;
        return null;
    }

    return (
        <div className="bg-black/30 p-5 rounded-lg border border-gray-700 transition-all duration-300">
            <p className="font-semibold mb-4 text-white">Q{index + 1}: {mcq.question}</p>
            <div className="space-y-3">
                {mcq.options.map((option, i) => (
                    <button
                        key={i}
                        onClick={() => !showAnswer && setSelectedOption(option)}
                        disabled={showAnswer}
                        className={`w-full text-left px-4 py-3 rounded-md transition-all duration-200 flex justify-between items-center ${getOptionClass(option)}`}
                    >
                        <span>{option}</span>
                        {getOptionIcon(option)}
                    </button>
                ))}
            </div>
            {showAnswer && mcq.explanation && (
                <div className="mt-4 p-4 bg-black/20 border-l-4 border-indigo-500 rounded-r-md animate-fade-in">
                    <p className="font-semibold text-gray-100 mb-1">Explanation</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{mcq.explanation}</p>
                </div>
            )}
            <div className="mt-4 pt-4 border-t border-white/10 text-right">
                <button
                    onClick={() => setShowAnswer(true)}
                    disabled={!selectedOption || showAnswer}
                    className="px-4 py-2 text-sm font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Check Answer
                </button>
            </div>
        </div>
    );
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ isLoading, error, content, contentType, topic, scrollProgress }) => {
  const getLoadingMessage = () => {
    switch (contentType) {
      case 'mcq': return 'your MCQs';
      case 'notes': return 'your study notes';
      case 'resources': return 'relevant resources';
      case 'summary': return 'a quick summary';
      default: return 'content';
    }
  };

  const getTitle = () => {
    switch (contentType) {
      case 'mcq': return `Multiple Choice Questions`;
      case 'notes': return `Study Notes`;
      case 'resources': return `Web Resources`;
      case 'summary': return `Quick Revision Summary`;
      default: return `Content`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-black/30 rounded-xl border-2 border-dashed border-gray-600 min-h-[300px]">
        <LoadingSpinner />
        <p className="mt-4 text-gray-300 font-medium text-center">Crafting {getLoadingMessage()} for <span className="font-bold text-indigo-400">"{topic}"</span>...</p>
        <p className="text-sm text-gray-400 mt-1">This might take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/40 border border-red-600/50 text-red-200 rounded-lg">
        <h3 className="font-bold text-lg mb-2">An Error Occurred</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  return (
     <div className="relative">
        {(contentType === 'notes' || contentType === 'summary') && (
            <div className="sticky top-0 z-10 p-2 bg-gray-800/80 backdrop-blur-sm -mx-4 sm:-mx-6 lg:-mx-8">
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-1.5 bg-indigo-500 rounded-full transition-transform duration-150 ease-linear shadow-[0_0_10px_#6366f1]"
                        style={{ transform: `translateX(-${100 - scrollProgress}%)` }}
                    />
                </div>
            </div>
        )}
        <div className="pt-4">
          <h2 className="text-3xl font-extrabold mb-2 text-white">
            {getTitle()}
          </h2>
          <p className="text-indigo-300 font-semibold mb-6 pb-4 border-b border-white/10">{topic}</p>
          
          {(contentType === 'notes' || contentType === 'summary') && typeof content === 'string' ? (
            <div className="prose-styles">
              <MarkdownRenderer text={content} />
            </div>
          ) : null}

          {contentType === 'mcq' && Array.isArray(content) ? (
              <div className="space-y-6">
                  {content.map((mcq, index) => (
                      <MCQItem key={index} mcq={mcq} index={index} />
                  ))}
              </div>
          ) : null}

          {contentType === 'resources' && typeof content === 'object' && !Array.isArray(content) && content !== null && (
            <div>
              <div className="mb-8 prose-styles">
                  <MarkdownRenderer text={(content as { summary: string }).summary} />
              </div>
              {(content as { links: StudyResource[] }).links.length > 0 && (
                <>
                  <h3 className="text-xl font-bold mt-6 mb-4 border-t border-white/10 pt-6 text-white">Sourced Links</h3>
                  <ul className="space-y-3">
                    {(content as { links: StudyResource[] }).links.map((link, index) => (
                      <li key={index}>
                        <a href={link.uri} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-lg bg-black/30 border border-gray-700 hover:bg-white/10 hover:border-indigo-500/50 transition-all duration-200 group">
                          <div className="flex items-center gap-3">
                              <LinkIcon className="h-5 w-5 text-gray-400 flex-shrink-0 group-hover:text-indigo-400 transition-colors"/>
                              <span className="font-semibold text-indigo-300 truncate">{link.title}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 ml-8 truncate">{link.uri}</p>
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
     </div>
  );
};

export default ContentDisplay;
