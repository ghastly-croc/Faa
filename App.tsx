
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { SYLLABUS, SyllabusSection } from './constants/syllabus';
import { generateStudyMaterial } from './services/geminiService';
import type { MCQ, StudyResource } from './types';
import Sidebar from './components/Sidebar';
import ContentDisplay from './components/ContentDisplay';
import TopicPill from './components/TopicPill';
import { BrainCircuitIcon, GraduationCapIcon } from './components/Icons';

type ContentType = 'notes' | 'mcq' | 'resources' | 'summary';

const App: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<SyllabusSection>(SYLLABUS[0]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [contentType, setContentType] = useState<ContentType>('notes');
  const [generatedContent, setGeneratedContent] = useState<string | MCQ[] | { summary: string, links: StudyResource[] } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});
  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({});
  const [currentScrollProgress, setCurrentScrollProgress] = useState(0);

  const mainContentRef = useRef<HTMLElement>(null);
  const scrollSaveTimeout = useRef<number | null>(null);

  useEffect(() => {
    try {
      const storedCompletedTopics = localStorage.getItem('completedTopics');
      if (storedCompletedTopics) {
        setCompletedTopics(JSON.parse(storedCompletedTopics));
      }
      const storedScrollPositions = localStorage.getItem('scrollPositions');
      if (storedScrollPositions) {
        setScrollPositions(JSON.parse(storedScrollPositions));
      }
    } catch (e) {
      console.error("Failed to parse data from localStorage", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('scrollPositions', JSON.stringify(scrollPositions));
  }, [scrollPositions]);


  const handleToggleCompletion = (topic: string) => {
    const newCompletedTopics = { ...completedTopics, [topic]: !completedTopics[topic] };
    setCompletedTopics(newCompletedTopics);
    localStorage.setItem('completedTopics', JSON.stringify(newCompletedTopics));
  };

  const handleGenerateContent = useCallback(async (topic: string, type: ContentType) => {
    setSelectedTopic(topic);
    setContentType(type);
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    setCurrentScrollProgress(0);

    try {
      const result = await generateStudyMaterial(topic, type);
      if (type === 'mcq') {
        const cleanedJsonString = result.text.replace(/```json|```/g, '').trim();
        try {
          const parsedMcqs: MCQ[] = JSON.parse(cleanedJsonString);
          setGeneratedContent(parsedMcqs);
        } catch (parseError) {
          console.error('Failed to parse MCQs:', parseError);
          setError('Failed to parse generated content. The AI response was not in the expected format.');
        }
      } else if (type === 'resources') {
        setGeneratedContent({ summary: result.text, links: result.resources || [] });
      } else {
        setGeneratedContent(result.text);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while generating content. Please try again.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleScroll = useCallback((event: React.UIEvent<HTMLElement>) => {
    const target = event.currentTarget;
    const scrollableHeight = target.scrollHeight - target.clientHeight;
    
    if (scrollableHeight <= 0) {
      setCurrentScrollProgress(0);
      return;
    }

    const progress = (target.scrollTop / scrollableHeight) * 100;
    setCurrentScrollProgress(progress);

    if (scrollSaveTimeout.current) {
      clearTimeout(scrollSaveTimeout.current);
    }

    scrollSaveTimeout.current = window.setTimeout(() => {
      if (selectedTopic && (contentType === 'notes' || contentType === 'summary')) {
        const key = `${selectedTopic}-${contentType}`;
        setScrollPositions(prev => ({ ...prev, [key]: progress }));
      }
    }, 500);
  }, [selectedTopic, contentType]);

  useEffect(() => {
    const mainEl = mainContentRef.current;
    if (!mainEl) return;

    if (generatedContent && selectedTopic && (contentType === 'notes' || contentType === 'summary')) {
      const key = `${selectedTopic}-${contentType}`;
      const savedProgress = scrollPositions[key];

      const scrollToPosition = () => {
        const scrollableHeight = mainEl.scrollHeight - mainEl.clientHeight;
        if (scrollableHeight > 0) {
          if (savedProgress !== undefined) {
            mainEl.scrollTop = (savedProgress / 100) * scrollableHeight;
          } else {
            mainEl.scrollTop = 0;
          }
        }
      };

      const timeoutId = setTimeout(scrollToPosition, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [generatedContent, selectedTopic, contentType]);

  const currentTopics = useMemo(() => {
    return SYLLABUS.find(section => section.title === selectedSection.title)?.topics || [];
  }, [selectedSection]);

  const showContent = (isLoading || error || generatedContent) && selectedTopic;

  return (
    <div className="flex flex-col md:flex-row h-screen font-sans text-gray-200 p-4 gap-4">
      <Sidebar
        sections={SYLLABUS}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        completedTopics={completedTopics}
      />
      <main ref={mainContentRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 backdrop-blur-2xl bg-gray-800/60 rounded-2xl border border-gray-700/80 shadow-2xl shadow-black/30">
            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{selectedSection.title}</h1>
              <p className="text-gray-300 mt-2 text-lg">Choose a topic to kickstart your AI-powered study session.</p>
            </header>
            
            <div className="space-y-6">
              {currentTopics.map((topic) => (
                <div key={topic.title}>
                  <h3 className="text-lg font-semibold text-indigo-300 mb-3 tracking-wide">{topic.title}</h3>
                  <div className="flex flex-wrap gap-3">
                    {topic.subTopics.length > 0 ? (
                      topic.subTopics.map((subTopic) => (
                        <TopicPill 
                          key={subTopic} 
                          topic={subTopic}
                          isSelected={subTopic === selectedTopic}
                          isCompleted={!!completedTopics[subTopic]}
                          onGenerate={handleGenerateContent}
                          onToggleCompletion={handleToggleCompletion}
                        />
                      ))
                    ) : (
                       <TopicPill 
                          key={topic.title} 
                          topic={topic.title}
                          isSelected={topic.title === selectedTopic}
                          isCompleted={!!completedTopics[topic.title]}
                          onGenerate={handleGenerateContent}
                          onToggleCompletion={handleToggleCompletion}
                        />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              { showContent ? (
                <div key={selectedTopic + contentType} className="animate-fade-in">
                  <ContentDisplay
                      isLoading={isLoading}
                      error={error}
                      content={generatedContent}
                      contentType={contentType}
                      topic={selectedTopic}
                      scrollProgress={currentScrollProgress}
                  />
                </div>
              ) : (
                <div className="hidden md:flex flex-col items-center justify-center text-center text-gray-400 p-8 mt-10 border-2 border-dashed border-gray-600/80 rounded-xl bg-black/20">
                    <GraduationCapIcon className="w-16 h-16 text-indigo-400 opacity-80" />
                  <p className="mt-4 text-lg font-semibold text-gray-200">Your AI Study Partner</p>
                  <p className="max-w-md text-gray-400">Select a topic and an action to begin your personalized learning journey.</p>
                </div>
              )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;