'use client';

interface ActivityContentProps {
  content: string;
  className?: string;
}

export default function ActivityContent({ content, className = '' }: ActivityContentProps) {
  const processContent = (text: string) => {
    // Split by spaces to process each word
    const words = text.split(' ');
    
    return words.map((word, index) => {
      // Check for @ mentions
      if (word.startsWith('@')) {
        return (
          <span key={index} className="text-blue-600 font-medium bg-blue-50 px-1 rounded">
            {word}
          </span>
        );
      }
      
      // Check for # hashtags/projects
      if (word.startsWith('#')) {
        return (
          <span key={index} className="text-green-600 font-medium bg-green-50 px-1 rounded">
            {word}
          </span>
        );
      }
      
      // Regular word
      return <span key={index}>{word}</span>;
    }).reduce((prev, curr, index) => {
      // Add spaces between words
      return index === 0 ? [curr] : [...prev, ' ', curr];
    }, [] as React.ReactNode[]);
  };

  return (
    <div className={className}>
      {processContent(content)}
    </div>
  );
}