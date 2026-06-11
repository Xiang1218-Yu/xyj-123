import { StoryNode, StoryNodeTypeLabel, StoryNodeTypeColor } from '@/shared/types';

interface TimelineProps {
  nodes: StoryNode[];
  compact?: boolean;
}

export default function Timeline({ nodes, compact = false }: TimelineProps) {
  const sortedNodes = [...nodes].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="relative">
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-400 via-green-400 via-blue-400 to-slate-400" />
      
      <div className="space-y-8">
        {sortedNodes.map((node, index) => (
          <div
            key={node.id}
            className={`relative flex flex-col md:flex-row ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'} pl-12 md:pl-0`}>
              <div
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  compact ? 'p-3' : 'p-6'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium text-white rounded-full ${StoryNodeTypeColor[node.type]}`}
                  >
                    {StoryNodeTypeLabel[node.type]}
                  </span>
                  <span className="text-sm text-slate-500">{node.date}</span>
                </div>
                
                {!compact && node.imageUrl && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img
                      src={node.imageUrl}
                      alt={node.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                
                <h3 className={`font-bold text-slate-800 mb-2 ${compact ? 'text-sm' : 'text-xl'}`}>
                  {node.title}
                </h3>
                
                <p className={`text-slate-600 ${compact ? 'text-xs line-clamp-2' : 'leading-relaxed'}`}>
                  {node.content}
                </p>
              </div>
            </div>

            <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <div
                className={`w-8 h-8 rounded-full border-4 border-white shadow-md ${StoryNodeTypeColor[node.type]} ${
                  compact ? 'w-5 h-5' : ''
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
