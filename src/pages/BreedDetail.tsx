import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  MapPin,
  Clock,
  Scale,
  Ruler,
  User,
  AlertCircle,
  Star,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  X,
  PawPrint,
  Cat,
  Bird,
  Rabbit,
  Turtle,
  Sparkles,
  Image,
  FileText,
  Tag,
  User as UserIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAppStore } from '@/store';
import {
  PetCategoryLabel,
  ArticleTypeLabel,
  type PetCategory,
  type BreedArticle
} from '@/shared/types';

const categoryIcons: Record<PetCategory, typeof PawPrint> = {
  dog: PawPrint,
  cat: Cat,
  bird: Bird,
  rabbit: Rabbit,
  hamster: Sparkles,
  reptile: Turtle,
  other: PawPrint
};

const categoryColors: Record<PetCategory, string> = {
  dog: 'bg-amber-100 text-amber-700',
  cat: 'bg-indigo-100 text-indigo-700',
  bird: 'bg-sky-100 text-sky-700',
  rabbit: 'bg-rose-100 text-rose-700',
  hamster: 'bg-orange-100 text-orange-700',
  reptile: 'bg-emerald-100 text-emerald-700',
  other: 'bg-neutral-100 text-neutral-700'
};

const articleTypeColors: Record<BreedArticle['articleType'], string> = {
  care: 'bg-teal-100 text-teal-700',
  health: 'bg-red-100 text-red-700',
  training: 'bg-blue-100 text-blue-700',
  diet: 'bg-green-100 text-green-700',
  behavior: 'bg-purple-100 text-purple-700',
  history: 'bg-amber-100 text-amber-700',
  other: 'bg-neutral-100 text-neutral-700'
};

function renderMarkdownContent(content: string) {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let currentList: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1.5 mb-4 ml-2">
          {currentList.map((item, idx) => (
            <li key={idx} className="text-neutral-text leading-relaxed">{item}</li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, idx) => {
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={idx} className="font-serif text-xl font-semibold text-primary-900 mt-6 mb-3 pb-2 border-b border-primary-100">
          {line.slice(3)}
        </h3>
      );
    } else if (line.startsWith('- ')) {
      currentList.push(line.slice(2));
    } else if (line.trim() === '') {
      flushList();
    } else {
      flushList();
      elements.push(
        <p key={idx} className="text-neutral-text leading-relaxed mb-4 whitespace-pre-wrap">
          {line}
        </p>
      );
    }
  });
  flushList();
  return elements;
}

export default function BreedDetail() {
  const { id } = useParams<{ id: string; articleId?: string }>();
  const {
    getPetBreedById,
    getBreedArticlesByBreedId,
    toggleFavoriteBreed,
    isBreedFavorited,
    deleteBreedArticle
  } = useAppStore();

  const breed = id ? getPetBreedById(id) : undefined;
  const articles = useMemo(
    () => (id ? getBreedArticlesByBreedId(id) : []),
    [id, getBreedArticlesByBreedId]
  );
  const isFavorited = id ? isBreedFavorited(id) : false;

  const [readingArticle, setReadingArticle] = useState<BreedArticle | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BreedArticle | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    appearance: true,
    personality: true,
    care: true,
    diseases: true,
    suitable: true,
    history: true
  });

  useEffect(() => {
    const anyModalOpen = readingArticle !== null || deleteTarget !== null;
    if (anyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [readingArticle, deleteTarget]);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const confirmDeleteArticle = () => {
    if (deleteTarget) {
      deleteBreedArticle(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  if (!breed) {
    return (
      <div>
        <Link to="/breeds" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 mb-6">
          <ArrowLeft className="w-4 h-4" />
          返回品种列表
        </Link>
        <div className="card text-center py-16">
          <AlertCircle className="w-16 h-16 mx-auto text-primary-300 mb-4" />
          <p className="text-neutral-muted text-lg">品种不存在或已被删除</p>
        </div>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[breed.category];

  const InfoRow = ({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value?: string }) =>
    value ? (
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4.5 h-4.5 text-primary-600" />
        </div>
        <div>
          <p className="text-xs text-neutral-muted mb-0.5">{label}</p>
          <p className="text-sm font-medium text-neutral-text">{value}</p>
        </div>
      </div>
    ) : null;

  const SectionBlock = ({
    id,
    icon: Icon,
    title,
    children
  }: {
    id: string;
    icon: typeof FileText;
    title: string;
    children: React.ReactNode;
  }) => {
    const expanded = expandedSections[id] ?? true;
    return (
      <div className="border border-primary-100 rounded-xl overflow-hidden mb-3">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between px-5 py-3.5 bg-primary-50/50 hover:bg-primary-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Icon className="w-4.5 h-4.5 text-primary-600" />
            <span className="font-medium text-primary-900">{title}</span>
          </div>
          {expanded ? (
            <ChevronUp className="w-4.5 h-4.5 text-primary-500" />
          ) : (
            <ChevronDown className="w-4.5 h-4.5 text-primary-500" />
          )}
        </button>
        {expanded && <div className="px-5 py-4">{children}</div>}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="mb-6">
        <Link to="/breeds" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" />
          返回品种知识库
        </Link>

        <div className="card relative overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-6 -mx-6 -mt-6 px-6 pt-6">
            <div className="relative lg:w-72 flex-shrink-0">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-primary-100 shadow-md">
                {breed.coverImage ? (
                  <img src={breed.coverImage} alt={breed.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <CategoryIcon className="w-20 h-20 text-primary-300" />
                  </div>
                )}
                {isFavorited && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-rose-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    已收藏
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[breed.category]}`}
                    >
                      <CategoryIcon className="w-3.5 h-3.5" />
                      {PetCategoryLabel[breed.category]}
                    </span>
                    {breed.englishName && (
                      <span className="text-sm text-neutral-muted font-mono">
                        {breed.englishName}
                      </span>
                    )}
                  </div>
                  <h1 className="font-serif text-3xl font-bold text-primary-900 mb-1">
                    {breed.name}
                  </h1>
                </div>
                <button
                  onClick={() => id && toggleFavoriteBreed(id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                    isFavorited
                      ? 'bg-rose-500 text-white shadow-md hover:bg-rose-600'
                      : 'border border-primary-200 bg-white text-primary-700 hover:bg-primary-50'
                  }`}
                >
                  <Heart className={`w-4.5 h-4.5 ${isFavorited ? 'fill-current' : ''}`} />
                  {isFavorited ? '已收藏' : '收藏品种'}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 py-4 border-y border-primary-100">
                <InfoRow icon={MapPin} label="原产地" value={breed.origin} />
                <InfoRow icon={Clock} label="寿命" value={breed.lifespan} />
                <InfoRow icon={Scale} label="体重" value={breed.weight} />
                <InfoRow icon={Ruler} label="身高" value={breed.height} />
              </div>

              {breed.personality && breed.personality.length > 0 && (
                <div className="mb-5">
                  <p className="text-sm text-neutral-muted mb-2 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-accent" />
                    性格标签
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {breed.personality.map((trait) => (
                      <span
                        key={trait}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-50 text-primary-700 border border-primary-100"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto flex items-center gap-4 text-xs text-neutral-muted pt-2">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{articles.length} 篇相关文章</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>创建于 {formatDate(breed.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="font-serif text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            品种详情
          </h2>

          <SectionBlock id="appearance" icon={Image} title="外观特征">
            <p className="text-neutral-text leading-relaxed">
              {breed.appearance || '暂无外观特征描述。'}
            </p>
          </SectionBlock>

          <SectionBlock id="care" icon={User} title="养护指南">
            <p className="text-neutral-text leading-relaxed whitespace-pre-wrap">
              {breed.careGuide || '暂无养护指南内容。'}
            </p>
          </SectionBlock>

          <SectionBlock id="diseases" icon={AlertCircle} title="常见疾病">
            {breed.commonDiseases && breed.commonDiseases.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {breed.commonDiseases.map((disease) => (
                  <span
                    key={disease}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-red-50 text-red-700 border border-red-100"
                  >
                    <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                    {disease}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-neutral-muted">暂无常见疾病记录。</p>
            )}
          </SectionBlock>

          <SectionBlock id="suitable" icon={UserIcon} title="适合人群">
            {breed.suitableFor && breed.suitableFor.length > 0 ? (
              <ul className="space-y-2">
                {breed.suitableFor.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-neutral-text">
                    <Star className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-neutral-muted">暂无适合人群信息。</p>
            )}
          </SectionBlock>

          <SectionBlock id="history" icon={BookOpen} title="品种历史">
            <p className="text-neutral-text leading-relaxed whitespace-pre-wrap">
              {breed.history || '暂无品种历史介绍。'}
            </p>
          </SectionBlock>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-bold text-primary-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-600" />
              知识文章
              <span className="text-sm font-normal text-neutral-muted">({articles.length})</span>
            </h2>
            <Link
              to={`/breeds/${breed.id}/article/new`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-primary-800 text-white hover:bg-primary-900 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              新增文章
            </Link>
          </div>

          {articles.length === 0 ? (
            <div className="card text-center py-10">
              <FileText className="w-12 h-12 mx-auto text-primary-300 mb-3" />
              <p className="text-neutral-muted text-sm mb-4">暂无相关知识文章</p>
              <Link
                to={`/breeds/${breed.id}/article/new`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-800"
              >
                <Plus className="w-4 h-4" />
                撰写第一篇文章
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="card hover:shadow-card-hover transition-all duration-200 group"
                >
                  <button
                    onClick={() => setReadingArticle(article)}
                    className="w-full text-left block"
                  >
                    <div className="flex gap-3 -mx-2">
                      {article.coverImage && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-primary-100">
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${articleTypeColors[article.articleType]}`}
                          >
                            <Tag className="w-3 h-3" />
                            {ArticleTypeLabel[article.articleType]}
                          </span>
                        </div>
                        <h3 className="font-semibold text-primary-900 mb-1 line-clamp-1 group-hover:text-primary-700 transition-colors">
                          {article.title}
                        </h3>
                        {article.summary && (
                          <p className="text-xs text-neutral-muted line-clamp-2 mb-1.5">
                            {article.summary}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-neutral-muted">
                          {article.author && (
                            <span className="flex items-center gap-1">
                              <UserIcon className="w-3 h-3" />
                              {article.author}
                            </span>
                          )}
                          <span>{formatDate(article.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-1 mt-3 pt-3 border-t border-primary-100 -mx-2">
                    <button
                      onClick={() => setReadingArticle(article)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium text-primary-700 hover:bg-primary-50 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      阅读
                    </button>
                    <Link
                      to={`/breeds/${breed.id}/article/${article.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      编辑
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(article)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setReadingArticle(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scale-in flex flex-col">
            <div className="relative h-48 bg-primary-100 flex-shrink-0">
              {readingArticle.coverImage ? (
                <img
                  src={readingArticle.coverImage}
                  alt={readingArticle.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-primary-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <button
                onClick={() => setReadingArticle(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-neutral-muted hover:text-primary-900 hover:bg-white transition-all shadow-md"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${articleTypeColors[readingArticle.articleType]}`}
                  >
                    <Tag className="w-3 h-3" />
                    {ArticleTypeLabel[readingArticle.articleType]}
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-white drop-shadow-md">
                  {readingArticle.title}
                </h2>
              </div>
            </div>

            <div className="px-6 py-4 border-b border-primary-100 flex items-center gap-4 text-sm text-neutral-muted flex-shrink-0">
              {readingArticle.author && (
                <div className="flex items-center gap-1.5">
                  <UserIcon className="w-4 h-4" />
                  <span>{readingArticle.author}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>发布于 {formatDate(readingArticle.createdAt)}</span>
              </div>
              {readingArticle.updatedAt !== readingArticle.createdAt && (
                <div className="flex items-center gap-1.5">
                  <Edit2 className="w-4 h-4" />
                  <span>更新于 {formatDate(readingArticle.updatedAt)}</span>
                </div>
              )}
            </div>

            {readingArticle.summary && (
              <div className="px-6 py-4 bg-primary-50/50 border-b border-primary-100 flex-shrink-0">
                <p className="text-sm text-primary-800 leading-relaxed italic">
                  {readingArticle.summary}
                </p>
              </div>
            )}

            <div className="px-6 py-6 overflow-y-auto flex-1">
              {renderMarkdownContent(readingArticle.content)}
            </div>

            <div className="px-6 py-4 border-t border-primary-100 bg-primary-50/50 flex items-center justify-between flex-shrink-0">
              <div className="text-xs text-neutral-muted">
                本文属于「{breed.name}」品种知识库
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/breeds/${breed.id}/article/${readingArticle.id}/edit`}
                  onClick={() => setReadingArticle(null)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-primary-700 bg-white border border-primary-200 hover:bg-primary-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  编辑文章
                </Link>
                <button
                  onClick={() => setReadingArticle(null)}
                  className="btn-primary"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-primary-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-neutral-text">
                  确认删除文章
                </h3>
              </div>
              <button
                onClick={() => setDeleteTarget(null)}
                className="p-2 text-neutral-muted hover:text-neutral-text hover:bg-primary-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-neutral-text mb-4">您确定要删除以下文章吗？此操作无法撤销。</p>
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 overflow-hidden flex-shrink-0">
                    {deleteTarget.coverImage ? (
                      <img
                        src={deleteTarget.coverImage}
                        alt={deleteTarget.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-text truncate">
                      {deleteTarget.title}
                    </p>
                    <p className="text-xs text-neutral-muted">
                      {ArticleTypeLabel[deleteTarget.articleType]} · {formatDate(deleteTarget.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-5 border-t border-primary-100 bg-primary-50/50">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-neutral-text bg-white border border-primary-200 hover:bg-primary-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmDeleteArticle}
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
