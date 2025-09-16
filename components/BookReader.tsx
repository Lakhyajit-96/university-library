"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  Bookmark, 
  X,
  Menu,
  Home,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import BookCover from "./BookCover";

// Enhanced Markdown renderer component with theme-based styling
const MarkdownRenderer: React.FC<{ content: string; bookTheme: string; fontSize: number; lineHeight: number }> = ({ content, bookTheme, fontSize, lineHeight }) => {
  const getThemeColors = (theme: string) => {
    const themes = {
      'javascript': {
        primary: 'bg-yellow-50 border-yellow-200',
        secondary: 'bg-yellow-100',
        accent: 'text-yellow-800',
        code: 'bg-yellow-900 text-yellow-100',
        header: 'border-yellow-300 text-yellow-900'
      },
      'python': {
        primary: 'bg-blue-50 border-blue-200',
        secondary: 'bg-blue-100',
        accent: 'text-blue-800',
        code: 'bg-blue-900 text-blue-100',
        header: 'border-blue-300 text-blue-900'
      },
      'assembly': {
        primary: 'bg-gray-50 border-gray-200',
        secondary: 'bg-gray-100',
        accent: 'text-gray-800',
        code: 'bg-gray-900 text-gray-100',
        header: 'border-gray-300 text-gray-900'
      },
      'react': {
        primary: 'bg-cyan-50 border-cyan-200',
        secondary: 'bg-cyan-100',
        accent: 'text-cyan-800',
        code: 'bg-cyan-900 text-cyan-100',
        header: 'border-cyan-300 text-cyan-900'
      },
      'database': {
        primary: 'bg-indigo-50 border-indigo-200',
        secondary: 'bg-indigo-100',
        accent: 'text-indigo-800',
        code: 'bg-indigo-900 text-indigo-100',
        header: 'border-indigo-300 text-indigo-900'
      },
      'system-design': {
        primary: 'bg-purple-50 border-purple-200',
        secondary: 'bg-purple-100',
        accent: 'text-purple-800',
        code: 'bg-purple-900 text-purple-100',
        header: 'border-purple-300 text-purple-900'
      },
      'machine-learning': {
        primary: 'bg-green-50 border-green-200',
        secondary: 'bg-green-100',
        accent: 'text-green-800',
        code: 'bg-green-900 text-green-100',
        header: 'border-green-300 text-green-900'
      },
      'default': {
        primary: 'bg-slate-50 border-slate-200',
        secondary: 'bg-slate-100',
        accent: 'text-slate-800',
        code: 'bg-slate-900 text-slate-100',
        header: 'border-slate-300 text-slate-900'
      }
    };
    return themes[theme as keyof typeof themes] || themes.default;
  };

  const colors = getThemeColors(bookTheme);

  const renderMarkdown = (text: string) => {
    if (!text) return '';
    
    let html = text
      // Code blocks with theme colors
      .replace(/```(\w+)?\n([\s\S]*?)```/g, `<pre class="${colors.primary} border ${colors.code} p-6 rounded-xl overflow-x-auto my-8 shadow-lg"><code class="text-sm font-mono">$2</code></pre>`)
      .replace(/```([\s\S]*?)```/g, `<pre class="${colors.primary} border ${colors.code} p-6 rounded-xl overflow-x-auto my-8 shadow-lg"><code class="text-sm font-mono">$1</code></pre>`)
      
      // Headers with theme colors and icons
      .replace(/^### (.*$)/gim, `<h3 class="text-xl font-bold mt-10 mb-6 ${colors.accent} border-b ${colors.header} pb-3 flex items-center gap-3"><span class="text-2xl">📖</span>$1</h3>`)
      .replace(/^## (.*$)/gim, `<h2 class="text-2xl font-bold mt-12 mb-8 ${colors.accent} border-b-2 ${colors.header} pb-4 flex items-center gap-3"><span class="text-3xl">📚</span>$1</h2>`)
      .replace(/^# (.*$)/gim, `<h1 class="text-4xl font-bold mt-16 mb-10 ${colors.accent} border-b-4 ${colors.header} pb-6 flex items-center gap-4"><span class="text-5xl">🎯</span>$1</h1>`)
      
      // Inline code with theme colors
      .replace(/`([^`]+)`/g, `<code class="${colors.secondary} px-3 py-1 rounded-lg text-sm font-mono ${colors.accent} border">$1</code>`)
      
      // Bold text with accent color
      .replace(/\*\*(.*?)\*\*/g, `<strong class="font-bold ${colors.accent}">$1</strong>`)
      
      // Italic text
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-600">$1</em>')
      
      // Numbered lists with icons
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-8 mb-3 flex items-start gap-3"><span class="text-lg">🔢</span><span>$1</span></li>')
      
      // Bullet lists with icons
      .replace(/^\* (.*$)/gim, '<li class="ml-8 mb-3 flex items-start gap-3"><span class="text-lg">✨</span><span>$1</span></li>')
      
      // Special content blocks
      .replace(/^> (.*$)/gim, `<div class="${colors.primary} border-l-4 ${colors.header} p-4 my-6 rounded-r-lg shadow-sm"><p class="italic ${colors.accent}">💡 $1</p></div>`)
      
      // Line breaks
      .replace(/\n\n/g, '</p><p class="mb-8 leading-relaxed text-gray-700">')
      .replace(/\n/g, '<br>');
    
    // Wrap lists properly
    html = html.replace(/(<li class="ml-8 mb-3 flex items-start gap-3"><span class="text-lg">🔢<\/span><span>.*<\/span><\/li>)/g, '<ol class="mb-8 space-y-2">$1</ol>');
    html = html.replace(/(<li class="ml-8 mb-3 flex items-start gap-3"><span class="text-lg">✨<\/span><span>.*<\/span><\/li>)/g, '<ul class="mb-8 space-y-2">$1</ul>');
    
    return html;
  };

  const htmlContent = renderMarkdown(content);
  
  return (
    <div 
      className="book-content max-w-none"
      style={{
        fontSize: `${fontSize}px !important`,
        lineHeight: `${lineHeight} !important`,
        color: '#374151',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      } as React.CSSProperties}
      dangerouslySetInnerHTML={{ __html: `<div class="space-y-6">${htmlContent}</div>` }}
    />
  );
};

interface BookReaderProps {
  book: {
    id: string;
    title: string;
    author: string;
    content: string;
    coverUrl: string;
    coverColor: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onProgressUpdate?: (progress: number) => void;
}

const BookReader: React.FC<BookReaderProps> = ({ 
  book, 
  isOpen, 
  onClose, 
  onProgressUpdate 
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [showSettings, setShowSettings] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);

  // Determine book theme based on title and genre
  const getBookTheme = (title: string, genre: string) => {
    const titleLower = title.toLowerCase();
    const genreLower = genre.toLowerCase();
    
    if (titleLower.includes('javascript') || titleLower.includes('js')) return 'javascript';
    if (titleLower.includes('python')) return 'python';
    if (titleLower.includes('assembly') || titleLower.includes('assembly language')) return 'assembly';
    if (titleLower.includes('react')) return 'react';
    if (titleLower.includes('database') || titleLower.includes('sql')) return 'database';
    if (titleLower.includes('system design') || titleLower.includes('architecture')) return 'system-design';
    if (titleLower.includes('machine learning') || titleLower.includes('ml') || titleLower.includes('ai')) return 'machine-learning';
    if (titleLower.includes('node') || titleLower.includes('nodejs')) return 'javascript';
    if (titleLower.includes('css') || titleLower.includes('html')) return 'react';
    
    // Fallback to genre
    if (genreLower.includes('programming')) return 'javascript';
    if (genreLower.includes('web development')) return 'react';
    if (genreLower.includes('computer science')) return 'system-design';
    if (genreLower.includes('database')) return 'database';
    if (genreLower.includes('machine learning')) return 'machine-learning';
    
    return 'default';
  };

  const bookTheme = getBookTheme(book.title, 'programming');

  // Extract the path from the full ImageKit URL for BookCover component
  const coverImagePath = book.coverUrl?.startsWith('https://ik.imagekit.io/lclakhyajit') 
    ? book.coverUrl.replace('https://ik.imagekit.io/lclakhyajit', '')
    : book.coverUrl;

  // Parse content into chapters and pages
  const parseContent = (content: string) => {
    if (!content) return { chapters: [], totalPages: 0 };
    
    // Split content into chapters
    const chapterMatches = content.match(/# Chapter \d+: (.*)/g);
    if (!chapterMatches || chapterMatches.length === 0) {
      // If no chapters found, treat entire content as one chapter
      return {
        chapters: [{
          title: "Content",
          content: content
        }],
        totalPages: 1
      };
    }
    
    const chapters = content.split(/# Chapter \d+:/).map((chapter, index) => {
      if (index === 0) return null; // Skip the title part
      
      // Extract chapter title from the match
      const titleMatch = chapterMatches[index - 1];
      const title = titleMatch ? titleMatch.replace(/# Chapter \d+: /, '') : `Chapter ${index}`;
      
      return {
        title: title.trim(),
        content: chapter.trim()
      };
    }).filter(Boolean);
    
    return { chapters, totalPages: chapters.length };
  };

  const { chapters, totalPages } = parseContent(book.content || '');
  const currentChapter = chapters[currentPage] || chapters[0];

  // Update reading progress
  useEffect(() => {
    const progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;
    setReadingProgress(progress);
    onProgressUpdate?.(progress);
  }, [currentPage, totalPages, onProgressUpdate]);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const toggleBookmark = () => {
    if (bookmarks.includes(currentPage)) {
      setBookmarks(bookmarks.filter(page => page !== currentPage));
    } else {
      setBookmarks([...bookmarks, currentPage]);
    }
  };

  const goToBookmark = (page: number) => {
    setCurrentPage(page);
    setShowTableOfContents(false);
  };

  const goToChapter = (chapterIndex: number) => {
    setCurrentPage(chapterIndex);
    setShowTableOfContents(false);
    
    // Scroll to top of content
    const contentElement = document.querySelector('.book-reader-content');
    if (contentElement) {
      contentElement.scrollTop = 0;
    }
  };

  const resetReader = () => {
    setCurrentPage(0);
    setReadingProgress(0);
    setBookmarks([]);
    
    // Scroll to top of content
    const contentElement = document.querySelector('.book-reader-content');
    if (contentElement) {
      contentElement.scrollTop = 0;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="h-screen w-full bg-gradient-to-br from-gray-50 to-white text-gray-900 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
        style={{ overflow: 'hidden' }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.15)_1px,_transparent_0)] bg-[length:20px_20px]"></div>
        </div>
        
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm relative z-10">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTableOfContents(!showTableOfContents)}
            >
              <Menu className="w-4 h-4 mr-2" />
              Contents
            </Button>
            
            <div className="text-sm text-gray-600">
              {book.title} by {book.author}
            </div>
          </div>

          <div className="flex items-center gap-2 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBookmark}
              data-bookmark-button
              className={cn(
                "hover:bg-yellow-100 hover:text-yellow-800 transition-colors cursor-pointer",
                bookmarks.includes(currentPage) && "bg-yellow-100 text-yellow-800"
              )}
            >
              <Bookmark className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              data-settings-button
              className="hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={resetReader}
              data-reset-button
              className="hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 transition-all duration-500 rounded-full relative"
            style={{ width: `${readingProgress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-1">
          {Math.round(readingProgress)}% Complete
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Table of Contents Sidebar */}
          {showTableOfContents && (
            <div
              className="border-r bg-gray-50 w-80"
              onClick={(e) => e.stopPropagation()}
              style={{ zIndex: 1000 }}
            >
              <div className="p-4">
                <h3 className="font-semibold mb-4">Table of Contents</h3>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 mb-2">
                    Progress: {Math.round(readingProgress)}%
                  </div>
                  
                  {bookmarks.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                        <span className="text-lg">🔖</span>
                        Bookmarks
                      </h4>
                      <div className="space-y-2">
                        {bookmarks.map((page, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              goToBookmark(page);
                            }}
                            className="block w-full text-left text-sm py-2 px-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-800 transition-colors duration-200 flex items-center gap-2 cursor-pointer"
                          >
                            <span className="text-yellow-600">🔖</span>
                            <span className="flex-1">{chapters[page]?.title || `Chapter ${page + 1}`}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <span className="text-lg">📖</span>
                      Chapters
                    </h4>
                    <div className="space-y-2">
                      {chapters.map((chapter, i) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            goToChapter(i);
                          }}
                          className={cn(
                            "block w-full text-left text-sm py-3 px-3 rounded-lg transition-all duration-200 flex items-center gap-3 cursor-pointer",
                            currentPage === i 
                              ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 shadow-sm border border-blue-200" 
                              : "hover:bg-gray-50 hover:shadow-sm hover:border hover:border-gray-200"
                          )}
                        >
                          <span className="text-lg">
                            {i === 0 ? "🚀" : i === chapters.length - 1 ? "🏁" : "📄"}
                          </span>
                          <span className="flex-1">{chapter?.title || `Chapter ${i + 1}`}</span>
                          {bookmarks.includes(i) && (
                            <span className="text-yellow-500">🔖</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Panel */}
          {showSettings && (
            <div
              className="border-l bg-gray-50 w-64"
              style={{ zIndex: 1000 }}
            >
              <div className="p-4">
                <h3 className="font-semibold mb-4">Reading Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Font Size: {fontSize}px
                    </label>
                    <div className="flex gap-2 mb-2">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setFontSize(Math.max(12, fontSize - 2));
                        }}
                        className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 bg-gray-100 rounded text-sm">
                        {fontSize}px
                      </span>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setFontSize(Math.min(24, fontSize + 2));
                        }}
                        className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={fontSize}
                      onChange={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFontSize(Number(e.target.value));
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>12px</span>
                      <span>24px</span>
                    </div>
                    <div 
                      className="mt-2 p-2 bg-gray-100 rounded text-sm"
                      style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
                    >
                      Preview: This text uses the current font size and line height settings.
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Line Height: {lineHeight}
                    </label>
                    <div className="flex gap-2 mb-2">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setLineHeight(Math.max(1.2, lineHeight - 0.1));
                        }}
                        className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 bg-gray-100 rounded text-sm">
                        {lineHeight}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setLineHeight(Math.min(2.0, lineHeight + 0.1));
                        }}
                        className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <input
                      type="range"
                      min="1.2"
                      max="2.0"
                      step="0.1"
                      value={lineHeight}
                      onChange={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setLineHeight(Number(e.target.value));
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1.2</span>
                      <span>2.0</span>
                    </div>
                    <div 
                      className="mt-2 p-2 bg-gray-100 rounded text-sm"
                      style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
                    >
                      Line Height Preview:<br/>
                      This is line one.<br/>
                      This is line two.<br/>
                      This is line three.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Reading Area */}
          <div className="flex-1 overflow-y-auto scrollbar-thin book-reader-content">
            {/* Page Content */}
            <div className="p-8">
              <div 
                className="max-w-5xl mx-auto"
                style={{ 
                  fontSize: `${fontSize}px`, 
                  lineHeight: lineHeight,
                  minHeight: 'calc(100vh + 200px)'
                }}
              >
                {currentChapter ? (
                  <div className="relative">
                    {/* Book Header with Cover */}
                    <div className="mb-12 text-center">
                      <div className="inline-block relative">
                        <BookCover
                          variant="regular"
                          className="book-3d-effect"
                          coverColor={book.coverColor}
                          coverImage={coverImagePath}
                        />
                      </div>
                      
                      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        {book.title}
                      </h1>
                      <p className="text-xl text-gray-600 mb-2">by {book.author}</p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Programming
                      </div>
                    </div>

                    {/* Chapter Content */}
                    <div className="relative pb-20">
                      <div className="absolute -left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
                      <MarkdownRenderer 
                        content={currentChapter.content} 
                        bookTheme={bookTheme}
                        fontSize={fontSize}
                        lineHeight={lineHeight}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-20">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Content Available</h3>
                    <p>This book doesn't have any content to display.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Navigation */}
            <div className="flex items-center justify-between p-6 border-t bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg relative z-10">
              <Button
                variant="outline"
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-md disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="text-center">
                <div className="text-sm font-medium text-gray-700">
                  Chapter {currentPage + 1} of {totalPages}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {chapters[currentPage]?.title || 'Content'}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
                className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-md disabled:opacity-50"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookReader;