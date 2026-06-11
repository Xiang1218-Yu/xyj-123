import { PetLifeStory } from '@/shared/types';
import Timeline from './Timeline';

interface MobilePreviewProps {
  story: PetLifeStory;
  isOpen: boolean;
  onClose: () => void;
}

export default function MobilePreview({ story, isOpen, onClose }: MobilePreviewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-slate-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        </button>

        <div className="relative w-[375px] h-[700px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-2xl z-10" />
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20" />
          
          <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="relative h-48 overflow-hidden">
                {story.coverImage ? (
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h1 className="text-xl font-bold text-white mb-1">{story.title}</h1>
                  <p className="text-sm text-slate-200 line-clamp-2">{story.description}</p>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-3">生命时间线</h2>
                  <Timeline nodes={story.nodes} compact />
                </div>

                <div className="text-center text-sm text-slate-400 py-4">
                  <p>— 永远怀念 —</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 mt-4 text-sm">手机端预览效果</p>
      </div>
    </div>
  );
}
