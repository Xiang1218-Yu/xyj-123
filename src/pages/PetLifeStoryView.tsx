import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import PageHeader from '@/components/PageHeader';
import Timeline from '@/components/Timeline';
import MobilePreview from '@/components/MobilePreview';
import Empty from '@/components/Empty';
import { ArrowLeft, Edit2, Smartphone, Share2 } from 'lucide-react';

export default function PetLifeStoryView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const { getPetLifeStoryById, pets, owners } = useAppStore();

  const story = id ? getPetLifeStoryById(id) : undefined;

  if (!story) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="故事不存在"
          description="未找到对应的生命故事"
          actions={
            <Link
              to="/life-stories"
              className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </Link>
          }
        />
        <Empty
          title="故事不存在"
          description="您访问的生命故事不存在或已被删除"
        />
      </div>
    );
  }

  const pet = pets.find((p) => p.id === story.petId);
  const owner = owners.find((o) => o.id === story.ownerId);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={story.title}
        description={`纪念 ${pet?.name || '宠物'} 的生命故事`}
        actions={
          <div className="flex items-center gap-3">
            <Link
              to="/life-stories"
              className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </Link>
            <button
              onClick={() => setShowMobilePreview(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              手机预览
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              分享
            </button>
            <Link
              to={`/life-stories/${story.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              编辑故事
            </Link>
          </div>
        }
      />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="relative h-64 md:h-80 overflow-hidden">
          {story.coverImage ? (
            <img
              src={story.coverImage}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-8xl">🐾</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-4 mb-4">
              {pet && (
                <img
                  src={pet.photoUrl}
                  alt={pet.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {story.title}
                </h1>
                <div className="flex items-center gap-4 text-slate-200">
                  {pet && (
                    <span className="flex items-center gap-1">
                      纪念 {pet.name}（{pet.breed}）
                    </span>
                  )}
                  {owner && (
                    <span className="flex items-center gap-1">
                      由 {owner.name} 创建
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {story.description && (
            <div className="mb-8 max-w-3xl mx-auto">
              <p className="text-lg text-slate-600 leading-relaxed text-center">
                {story.description}
              </p>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">
              生命时间线
            </h2>
            {story.nodes.length > 0 ? (
              <Timeline nodes={story.nodes} />
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>这个故事还没有时间节点</p>
                <Link
                  to={`/life-stories/${story.id}/edit`}
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  添加节点
                </Link>
              </div>
            )}
          </div>

          {pet && (
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">
                宠物信息
              </h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <img
                  src={pet.photoUrl}
                  alt={pet.name}
                  className="w-32 h-32 rounded-full object-cover shadow-lg"
                />
                <div className="text-center md:text-left">
                  <p className="text-xl font-bold text-slate-800">{pet.name}</p>
                  <p className="text-slate-600">{pet.breed}</p>
                  <p className="text-slate-500 text-sm">
                    {pet.gender === 'male' ? '男孩' : '女孩'} · {pet.age}
                  </p>
                  {pet.notes && (
                    <p className="text-slate-500 text-sm mt-2 max-w-md">
                      {pet.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 text-center text-slate-400">
            <p className="text-lg">— 永远怀念 —</p>
            <p className="text-sm mt-2">
              创建于 {new Date(story.createdAt).toLocaleDateString('zh-CN')}
              {story.updatedAt !== story.createdAt && (
                <>
                  {' · '}
                  最后更新于 {new Date(story.updatedAt).toLocaleDateString('zh-CN')}
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      <MobilePreview
        story={story}
        isOpen={showMobilePreview}
        onClose={() => setShowMobilePreview(false)}
      />
    </div>
  );
}
