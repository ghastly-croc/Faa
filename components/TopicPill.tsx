
import React from 'react';
import { FileTextIcon, HelpCircleIcon, LinkIcon, CircleIcon, CheckCircleIcon, ZapIcon } from './Icons';

interface TopicPillProps {
  topic: string;
  isSelected: boolean;
  isCompleted: boolean;
  onGenerate: (topic: string, type: 'notes' | 'mcq' | 'resources' | 'summary') => void;
  onToggleCompletion: (topic: string) => void;
}

const TopicPill: React.FC<TopicPillProps> = ({ topic, isSelected, isCompleted, onGenerate, onToggleCompletion }) => {
  return (
    <div className={`relative group flex items-center bg-gray-900/60 border border-gray-700 rounded-full text-sm font-medium text-gray-200 shadow-sm transition-all duration-200 ${isSelected ? 'border-indigo-500/80 ring-2 ring-indigo-500/50' : 'hover:border-gray-600'}`}>
      <button 
        onClick={() => onToggleCompletion(topic)}
        title={isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
        className="p-2 pl-3 group/toggle-btn flex items-center gap-1 hover:bg-white/10 rounded-l-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      >
        {isCompleted ? <CheckCircleIcon className="h-4 w-4 text-green-400 group-hover/toggle-btn:text-green-300" /> : <CircleIcon className="h-4 w-4 text-gray-500 group-hover/toggle-btn:text-gray-300" />}
      </button>

      <span className={`px-4 py-2 border-l border-r border-gray-700 transition-colors ${isSelected ? 'text-indigo-300' : ''} ${isCompleted ? 'line-through text-gray-500' : ''}`}>{topic}</span>
      
      <div className="flex items-center">
        <button
          onClick={() => onGenerate(topic, 'notes')}
          title="Generate Notes"
          className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <FileTextIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => onGenerate(topic, 'mcq')}
          title="Generate MCQs"
          className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <HelpCircleIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => onGenerate(topic, 'summary')}
          title="Generate Quick Summary"
          className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <ZapIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => onGenerate(topic, 'resources')}
          title="Find Resources"
          className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-r-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TopicPill;
