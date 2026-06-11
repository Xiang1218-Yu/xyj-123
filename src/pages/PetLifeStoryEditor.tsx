import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import PageHeader from '@/components/PageHeader';
import Timeline from '@/components/Timeline';
import MobilePreview from '@/components/MobilePreview';
import { StoryNode, StoryNodeType, StoryNodeTypeLabel, StoryNodeTypeColor, PetLifeStory } from '@/shared/types';
import { ArrowLeft, Plus, GripVertical, Trash2, Eye, Smartphone, Save, Image, X } from 'lucide-react';

export default function PetLifeStoryEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';

  const {
    pets,
    getPetLifeStoryById,
    addPetLifeStory,
    updatePetLifeStory,
    addStoryNode,
    updateStoryNode,
    deleteStoryNode,
    reorderStoryNodes
  } = useAppStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [petId, setPetId] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [nodes, setNodes] = useState<StoryNode[]>([]);
  const [editingNode, setEditingNode] = useState<StoryNode | null>(null);
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [draggedNode, setDraggedNode] = useState<StoryNode | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [nodeTitle, setNodeTitle] = useState('');
  const [nodeContent, setNodeContent] = useState('');
  const [nodeDate, setNodeDate] = useState('');
  const [nodeType, setNodeType] = useState<StoryNodeType>('memory');
  const [nodeImageUrl, setNodeImageUrl] = useState('');

  useEffect(() => {
    if (isEdit) {
      const story = getPetLifeStoryById(id);
      if (story) {
        setTitle(story.title);
        setDescription(story.description);
        setCoverImage(story.coverImage || '');
        setPetId(story.petId);
        setIsPublished(story.isPublished);
        setNodes([...story.nodes].sort((a, b) => a.sortOrder - b.sortOrder));
      }
    }
  }, [isEdit, id, getPetLifeStoryById]);

  const handleSave = () => {
    if (!title.trim()) {
      alert('请输入故事标题');
      return;
    }
    if (!petId) {
      alert('请选择关联的宠物');
      return;
    }

    const pet = pets.find((p) => p.id === petId);
    if (!pet) {
      alert('请选择有效的宠物');
      return;
    }

    const storyData = {
      title: title.trim(),
      description: description.trim(),
      coverImage: coverImage.trim() || undefined,
      petId,
      ownerId: pet.ownerId,
      isPublished,
      nodes
    };

    if (isEdit) {
      updatePetLifeStory(id, storyData);
    } else {
      const newStory = addPetLifeStory(storyData);
      nodes.forEach((node) => {
        addStoryNode(newStory.id, {
          title: node.title,
          content: node.content,
          date: node.date,
          type: node.type,
          imageUrl: node.imageUrl,
          sortOrder: node.sortOrder
        });
      });
    }

    navigate('/life-stories');
  };

  const handleAddNode = () => {
    setEditingNode(null);
    setNodeTitle('');
    setNodeContent('');
    setNodeDate('');
    setNodeType('memory');
    setNodeImageUrl('');
    setShowNodeForm(true);
  };

  const handleEditNode = (node: StoryNode) => {
    setEditingNode(node);
    setNodeTitle(node.title);
    setNodeContent(node.content);
    setNodeDate(node.date);
    setNodeType(node.type);
    setNodeImageUrl(node.imageUrl || '');
    setShowNodeForm(true);
  };

  const handleSaveNode = () => {
    if (!nodeTitle.trim()) {
      alert('请输入节点标题');
      return;
    }
    if (!nodeDate) {
      alert('请选择日期');
      return;
    }

    if (editingNode) {
      const updatedNodes = nodes.map((n) =>
        n.id === editingNode.id
          ? {
              ...n,
              title: nodeTitle.trim(),
              content: nodeContent.trim(),
              date: nodeDate,
              type: nodeType,
              imageUrl: nodeImageUrl.trim() || undefined
            }
          : n
      );
      setNodes(updatedNodes);
      if (isEdit) {
        updateStoryNode(id, editingNode.id, {
          title: nodeTitle.trim(),
          content: nodeContent.trim(),
          date: nodeDate,
          type: nodeType,
          imageUrl: nodeImageUrl.trim() || undefined
        });
      }
    } else {
      const newNode: StoryNode = {
        id: `temp-${Date.now()}`,
        storyId: isEdit ? id : '',
        title: nodeTitle.trim(),
        content: nodeContent.trim(),
        date: nodeDate,
        type: nodeType,
        imageUrl: nodeImageUrl.trim() || undefined,
        sortOrder: nodes.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const updatedNodes = [...nodes, newNode];
      setNodes(updatedNodes);
      if (isEdit) {
        addStoryNode(id, {
          title: nodeTitle.trim(),
          content: nodeContent.trim(),
          date: nodeDate,
          type: nodeType,
          imageUrl: nodeImageUrl.trim() || undefined,
          sortOrder: nodes.length
        });
      }
    }

    setShowNodeForm(false);
    setEditingNode(null);
  };

  const handleDeleteNode = (nodeId: string) => {
    if (window.confirm('确定要删除这个时间节点吗？')) {
      const updatedNodes = nodes
        .filter((n) => n.id !== nodeId)
        .map((n, index) => ({ ...n, sortOrder: index }));
      setNodes(updatedNodes);
      if (isEdit) {
        deleteStoryNode(id, nodeId);
      }
    }
  };

  const handleDragStart = (node: StoryNode) => {
    setDraggedNode(node);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!draggedNode) return;

    const dragIndex = nodes.findIndex((n) => n.id === draggedNode.id);
    if (dragIndex === dropIndex) return;

    const updatedNodes = [...nodes];
    const [removed] = updatedNodes.splice(dragIndex, 1);
    updatedNodes.splice(dropIndex, 0, removed);

    const reorderedNodes = updatedNodes.map((n, index) => ({
      ...n,
      sortOrder: index
    }));

    setNodes(reorderedNodes);
    if (isEdit) {
      reorderStoryNodes(id, reorderedNodes);
    }

    setDraggedNode(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedNode(null);
    setDragOverIndex(null);
  };

  const previewStory: PetLifeStory = {
    id: id || 'preview',
    petId,
    ownerId: pets.find((p) => p.id === petId)?.ownerId || '',
    title,
    description,
    coverImage: coverImage || undefined,
    isPublished,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? '编辑生命故事' : '创建生命故事'}
        description={isEdit ? '编辑宠物的生命记忆时间线' : '为离世的宠物创建专属的生命记忆时间线'}
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/life-stories')}
              className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回
            </button>
            <button
              onClick={() => setShowMobilePreview(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              手机预览
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showPreview
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Eye className="w-4 h-4" />
              {showPreview ? '隐藏预览' : '实时预览'}
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              保存
            </button>
          </div>
        }
      />

      <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">基本信息</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  故事标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如：豆豆的金色岁月"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  关联宠物 <span className="text-red-500">*</span>
                </label>
                <select
                  value={petId}
                  onChange={(e) => setPetId(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">请选择宠物</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name}（{pet.breed}）
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  故事简介
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="用几句话描述这个故事..."
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  封面图片 URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {coverImage && (
                    <button
                      onClick={() => setCoverImage('')}
                      className="px-3 py-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {coverImage && (
                  <div className="mt-2 rounded-lg overflow-hidden h-32">
                    <img
                      src={coverImage}
                      alt="封面预览"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                />
                <label htmlFor="isPublished" className="text-sm text-slate-700">
                  发布故事（发布后其他人可以查看）
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">
                时间节点
                <span className="ml-2 text-sm font-normal text-slate-500">
                  ({nodes.length} 个节点)
                </span>
              </h2>
              <button
                onClick={handleAddNode}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                添加节点
              </button>
            </div>

            {nodes.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>还没有时间节点</p>
                <p className="text-sm">点击上方按钮添加第一个节点</p>
              </div>
            ) : (
              <div className="space-y-3">
                {nodes.map((node, index) => (
                  <div
                    key={node.id}
                    draggable
                    onDragStart={() => handleDragStart(node)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-start gap-3 p-4 bg-slate-50 rounded-lg border-2 transition-all cursor-move ${
                      dragOverIndex === index
                        ? 'border-indigo-400 bg-indigo-50'
                        : 'border-transparent hover:border-slate-200'
                    } ${draggedNode?.id === node.id ? 'opacity-50' : ''}`}
                  >
                    <div className="pt-1 text-slate-400 hover:text-slate-600">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full mt-1.5 flex-shrink-0 ${StoryNodeTypeColor[node.type]}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium px-2 py-0.5 bg-slate-200 text-slate-700 rounded">
                          {StoryNodeTypeLabel[node.type]}
                        </span>
                        <span className="text-xs text-slate-500">{node.date}</span>
                      </div>
                      <h3 className="font-medium text-slate-800 truncate">{node.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2">{node.content}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditNode(node)}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNode(node.id)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {showPreview && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">实时预览</h2>
            </div>
            <div className="p-6 h-[calc(100vh-280px)] overflow-y-auto">
              {title && (
                <>
                  <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="text-5xl">🐾</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
                      {petId && (
                        <p className="text-sm text-slate-200">
                          纪念 {pets.find((p) => p.id === petId)?.name || '宠物'}
                        </p>
                      )}
                    </div>
                  </div>
                  {description && (
                    <p className="text-slate-600 mb-6 leading-relaxed">{description}</p>
                  )}
                  <h2 className="text-xl font-bold text-slate-800 mb-4">生命时间线</h2>
                  {nodes.length > 0 ? (
                    <Timeline nodes={nodes} />
                  ) : (
                    <div className="text-center py-12 text-slate-400">
                      <p>添加时间节点后预览效果将显示在这里</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {showNodeForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">
                {editingNode ? '编辑时间节点' : '添加时间节点'}
              </h2>
              <button
                onClick={() => setShowNodeForm(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  节点标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nodeTitle}
                  onChange={(e) => setNodeTitle(e.target.value)}
                  placeholder="例如：第一次来到我家"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  节点类型 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(StoryNodeTypeLabel) as StoryNodeType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setNodeType(type)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        nodeType === type
                          ? `${StoryNodeTypeColor[type]} text-white`
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {StoryNodeTypeLabel[type]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  日期 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={nodeDate}
                  onChange={(e) => setNodeDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  图片 URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nodeImageUrl}
                    onChange={(e) => setNodeImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {nodeImageUrl && (
                    <button
                      onClick={() => setNodeImageUrl('')}
                      className="px-3 py-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {nodeImageUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden h-32">
                    <img
                      src={nodeImageUrl}
                      alt="节点图片预览"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  详细内容
                </label>
                <textarea
                  value={nodeContent}
                  onChange={(e) => setNodeContent(e.target.value)}
                  placeholder="记录这段珍贵的回忆..."
                  rows={5}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowNodeForm(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveNode}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      <MobilePreview
        story={previewStory}
        isOpen={showMobilePreview}
        onClose={() => setShowMobilePreview(false)}
      />
    </div>
  );
}
