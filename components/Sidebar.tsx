
import React from 'react';
import type { SyllabusSection } from '../constants/syllabus';
import { GraduationCapIcon } from './Icons';

interface SidebarProps {
  sections: SyllabusSection[];
  selectedSection: SyllabusSection;
  setSelectedSection: (section: SyllabusSection) => void;
  completedTopics: Record<string, boolean>;
}

const Sidebar: React.FC<SidebarProps> = ({ sections, selectedSection, setSelectedSection, completedTopics }) => {
  return (
    <aside className="w-full md:w-64 lg:w-72 backdrop-blur-2xl bg-gray-800/60 rounded-2xl border border-gray-700/80 p-4 md:p-6 flex-shrink-0 flex flex-col shadow-2xl shadow-black/30">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-600/80 p-2 rounded-lg shadow-lg shadow-indigo-600/30">
          <GraduationCapIcon className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-wide">FAA Syllabus</h2>
      </div>
      <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto -mx-4 px-4 md:-mx-6 md:px-6">
        {sections.map((section) => {
          const allSubTopics = section.topics.flatMap(topic => topic.subTopics.length > 0 ? topic.subTopics : [topic.title]);
          const completedCount = allSubTopics.filter(subTopic => completedTopics[subTopic]).length;
          const totalCount = allSubTopics.length;
          const isSelected = selectedSection.title === section.title;

          return (
            <button
              key={section.title}
              onClick={() => setSelectedSection(section)}
              className={`relative w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex-shrink-0 md:flex-shrink-1 flex justify-between items-center group ${
                isSelected
                  ? 'bg-indigo-500/50 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="truncate pr-2">{section.title}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-mono transition-colors ${
                isSelected
                  ? 'bg-indigo-400/80 text-white'
                  : 'bg-black/30 text-gray-300 group-hover:bg-black/40 group-hover:text-gray-200'
              }`}>
                {completedCount}/{totalCount}
              </span>
              {isSelected && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-indigo-400 rounded-r-full shadow-[0_0_10px_#818cf8]"></div>}
            </button>
          )
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
