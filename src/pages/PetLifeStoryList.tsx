import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store';
import PageHeader from '@/components/PageHeader';
import Empty from '@/components/Empty';
import { Search, Plus, Eye, Edit2, Trash2, Smartphone } from 'lucide-react';
import MobilePreview from '@/components/MobilePreview';
import { PetLifeStory } from '@/shared/types';

export default function PetLifeStoryList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [previewStory, setPreviewStory] = useState<PetLifeStory | null>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const { petLifeStories, pets, searchPetLifeStories, deletePetLifeStory } = useAppStore();

  const displayStories = searchQuery.trim()
    ? searchPetLifeStories(searchQuery.trim())
    : petLifeStories;

  const getPetName = (petId: string) => {
    return pets.find((p) => p.id === petId)?.name || '未知宠物';
  };

  const getPetPhoto = (petId: string) => {
    return pets.find((p) => p.id === petId)?.photoUrl;
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个生命故事吗？删除后无法恢复。')) {
      deletePetLifeStory(id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="宠物生命故事"
        description="为离世的宠物创建专属的生命记忆时间线，珍藏每一段美好回忆"
        actions={
          <Link
            to="/life-stories/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            创建新故事
          </Link>
        }
      />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="按宠物名搜索故事..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {displayStories.length === 0 ? (
        <Empty
          title="暂无生命故事"
          description="点击上方按钮，为您的爱宠创建第一个生命故事"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayStories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              <div className="relative h-48 overflow-hidden">
                {story.coverImage ? (
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-5xl">🐾</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      story.isPublished
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-500 text-white'
                    }`}
                  >
                    {story.isPublished ? '已发布' : '草稿'}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={getPetPhoto(story.petId) || 'https://via.placeholder.com/40'}
                      alt={getPetName(story.petId)}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white"
                    />
                    <span className="text-white font-medium">
                      {getPetName(story.petId)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white line-clamp-1">
                    {story.title}
                  </h3>
                </div>
              </div>

              <div className="p-4">
                <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                  {story.description}
                </p>
                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <span>{story.nodes.length} 个时间节点</span>
                  <span>
                    创建于 {new Date(story.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/life-stories/${story.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    阅读
                  </Link>
                  <Link
                    to={`/life-stories/${story.id}/edit`}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    编辑
                  </Link>
                  <button
                    onClick={() => {
                      setPreviewStory(story);
                      setShowMobilePreview(true);
                    }}
                    className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors"
                    title="手机端预览"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {previewStory && (
        <MobilePreview
          story={previewStory}
          isOpen={showMobilePreview}
          onClose={() => setShowMobilePreview(false)}
        />
      )}
    </div>
  );
}
