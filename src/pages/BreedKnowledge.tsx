import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Star,
  PawPrint,
  Cat,
  Bird,
  Rabbit,
  Turtle,
  Sparkles,
  SlidersHorizontal,
  Heart,
  Clock,
  MapPin,
  Filter,
  X,
  FileText,
  Tag,
  User,
  LayoutGrid,
  List,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '@/store';
import PageHeader from '@/components/PageHeader';
import { PetCategoryLabel, ArticleTypeLabel, type PetCategory, type BreedArticle } from '@/shared/types';

type ViewMode = 'breeds' | 'articles';

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

const allCategories: (PetCategory | 'all' | 'favorites')[] = [
  'all',
  'favorites',
  'dog',
  'cat',
  'rabbit',
  'bird',
  'hamster',
  'reptile',
  'other'
];

const articleTypeOptions: (BreedArticle['articleType'] | 'all')[] = [
  'all',
  'care',
  'health',
  'training',
  'diet',
  'behavior',
  'history',
  'other'
];

function renderMarkdownPreview(content: string, maxLength = 200) {
  const plainText = content.replace(/##\s?/g, '').replace(/-\s?/g, '• ');
  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength) + '...';
}

export default function BreedKnowledge() {
  const {
    petBreeds,
    favoriteBreeds,
    breedArticles,
    toggleFavoriteBreed,
    getPetBreedById
  } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<PetCategory | 'all' | 'favorites'>('all');
  const [activeArticleType, setActiveArticleType] = useState<BreedArticle['articleType'] | 'all'>('all');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('breeds');

  const favoriteIds = useMemo(
    () => new Set(favoriteBreeds.map((f) => f.breedId)),
    [favoriteBreeds]
  );

  const categoryBreedCount = useMemo(() => {
    const counts: Record<string, number> = { all: petBreeds.length, favorites: favoriteIds.size };
    petBreeds.forEach((b) => {
      counts[b.category] = (counts[b.category] ?? 0) + 1;
    });
    return counts;
  }, [petBreeds, favoriteIds]);

  const articleTypeCount = useMemo(() => {
    const counts: Record<string, number> = { all: breedArticles.length };
    breedArticles.forEach((a) => {
      counts[a.articleType] = (counts[a.articleType] ?? 0) + 1;
    });
    return counts;
  }, [breedArticles]);

  const filteredBreeds = useMemo(() => {
    let breeds = petBreeds;

    if (activeCategory === 'favorites') {
      breeds = breeds.filter((b) => favoriteIds.has(b.id));
    } else if (activeCategory !== 'all') {
      breeds = breeds.filter((b) => b.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      breeds = breeds.filter(
        (b) =>
          b.name.toLowerCase().includes(query) ||
          (b.englishName?.toLowerCase().includes(query) ?? false) ||
          (b.origin?.toLowerCase().includes(query) ?? false) ||
          b.personality?.some((p) => p.toLowerCase().includes(query))
      );
    }

    return breeds;
  }, [petBreeds, activeCategory, searchQuery, favoriteIds]);

  const filteredArticles = useMemo(() => {
    let articles = breedArticles;

    if (activeCategory === 'favorites') {
      articles = articles.filter((a) => favoriteIds.has(a.breedId));
    } else if (activeCategory !== 'all') {
      articles = articles.filter((a) => {
        const breed = getPetBreedById(a.breedId);
        return breed?.category === activeCategory;
      });
    }

    if (activeArticleType !== 'all') {
      articles = articles.filter((a) => a.articleType === activeArticleType);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          (a.summary?.toLowerCase().includes(query) ?? false) ||
          a.content.toLowerCase().includes(query) ||
          (a.author?.toLowerCase().includes(query) ?? false)
      );
    }

    return articles.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [breedArticles, activeCategory, activeArticleType, searchQuery, favoriteIds, getPetBreedById]);

  const getArticleCount = (breedId: string) =>
    breedArticles.filter((a) => a.breedId === breedId).length;

  const getCategoryLabel = (cat: PetCategory | 'all' | 'favorites') => {
    if (cat === 'all') return '全部品种';
    if (cat === 'favorites') return '我的收藏';
    return PetCategoryLabel[cat];
  };

  const getArticleTypeLabel = (t: BreedArticle['articleType'] | 'all') => {
    if (t === 'all') return '全部类型';
    return ArticleTypeLabel[t];
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  return (
    <div className="relative">
      <PageHeader
        title="宠物品种知识库"
        description="全面了解各类宠物品种的特征、习性与养护知识"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-primary-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode('breeds')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'breeds'
                    ? 'bg-primary-800 text-white shadow-sm'
                    : 'text-primary-700 hover:bg-primary-50'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                品种
              </button>
              <button
                onClick={() => setViewMode('articles')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'articles'
                    ? 'bg-primary-800 text-white shadow-sm'
                    : 'text-primary-700 hover:bg-primary-50'
                }`}
              >
                <List className="w-4 h-4" />
                文章
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  viewMode === 'articles' ? 'bg-white/20' : 'bg-primary-100'
                }`}>
                  {breedArticles.length}
                </span>
              </button>
            </div>
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors ${
                showFilterPanel
                  ? 'bg-primary-800 border-primary-800 text-white'
                  : 'border-primary-200 text-primary-700 bg-white hover:bg-primary-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              筛选
            </button>
          </div>
        }
      />

      <div className="mb-6 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
          <input
            type="text"
            placeholder={
              viewMode === 'breeds'
                ? '搜索品种名称、英文名、产地或性格关键词...'
                : '搜索文章标题、内容、作者...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-muted hover:text-primary-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-neutral-muted">
          <BookOpen className="w-4 h-4" />
          <span>
            共{' '}
            <span className="font-semibold text-primary-700">
              {viewMode === 'breeds' ? filteredBreeds.length : filteredArticles.length}
            </span>{' '}
            个{viewMode === 'breeds' ? '品种' : '文章'}
            {activeCategory !== 'all' && ` · ${getCategoryLabel(activeCategory)}`}
          </span>
        </div>
      </div>

      {showFilterPanel && (
        <div className="mb-6 card p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary-600" />
              <span className="font-medium text-primary-900">分类筛选</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setActiveArticleType('all');
                }}
                className="text-xs text-primary-600 hover:text-primary-800 underline"
              >
                重置筛选
              </button>
              <button
                onClick={() => setShowFilterPanel(false)}
                className="p-1 text-neutral-muted hover:text-primary-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-sm text-neutral-muted mb-3">品种分类</p>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => {
                const Icon =
                  cat === 'all'
                    ? BookOpen
                    : cat === 'favorites'
                      ? Star
                      : categoryIcons[cat as PetCategory];
                const isActive = activeCategory === cat;
                const count = categoryBreedCount[cat] ?? 0;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary-800 text-white shadow-md'
                        : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {getCategoryLabel(cat)}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20' : 'bg-white text-primary-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {viewMode === 'articles' && (
            <div>
              <p className="text-sm text-neutral-muted mb-3">文章类型</p>
              <div className="flex flex-wrap gap-2">
                {articleTypeOptions.map((t) => {
                  const isActive = activeArticleType === t;
                  const count = articleTypeCount[t] ?? 0;
                  return (
                    <button
                      key={t}
                      onClick={() => setActiveArticleType(t)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary-800 text-white shadow-md'
                          : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                      }`}
                    >
                      {getArticleTypeLabel(t)}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20' : 'bg-white text-primary-600'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {viewMode === 'breeds'
          ? allCategories.map((cat) => {
              const Icon =
                cat === 'all'
                  ? BookOpen
                  : cat === 'favorites'
                    ? Star
                    : categoryIcons[cat as PetCategory];
              const isActive = activeCategory === cat;
              const count = categoryBreedCount[cat] ?? 0;
              if (count === 0 && cat !== 'all' && cat !== 'favorites') return null;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary-800 text-white shadow-sm'
                      : 'bg-white border border-primary-200 text-primary-700 hover:bg-primary-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {getCategoryLabel(cat)}
                  <span className={`text-xs ${isActive ? 'text-white/70' : 'text-neutral-muted'}`}>
                    {count}
                  </span>
                </button>
              );
            })
          : articleTypeOptions.map((t) => {
              const isActive = activeArticleType === t;
              const count = articleTypeCount[t] ?? 0;
              if (count === 0 && t !== 'all') return null;
              return (
                <button
                  key={t}
                  onClick={() => setActiveArticleType(t)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary-800 text-white shadow-sm'
                      : 'bg-white border border-primary-200 text-primary-700 hover:bg-primary-50'
                  }`}
                >
                  {getArticleTypeLabel(t)}
                  <span className={`text-xs ${isActive ? 'text-white/70' : 'text-neutral-muted'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
      </div>

      {viewMode === 'breeds' ? (
        filteredBreeds.length === 0 ? (
          <div className="card text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto text-primary-300 mb-4" />
            <p className="text-neutral-muted text-lg mb-2">
              {searchQuery ? '未找到匹配的品种' : activeCategory === 'favorites' ? '暂无收藏的品种' : '暂无品种数据'}
            </p>
            {activeCategory === 'favorites' && !searchQuery && (
              <p className="text-sm text-neutral-muted mb-4">
                点击品种卡片上的
                <Heart className="w-4 h-4 inline mx-1 text-rose-500 fill-rose-500" />
                图标收藏喜欢的品种吧
              </p>
            )}
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="btn-primary mt-2">
                清除搜索
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredBreeds.map((breed) => {
              const isFavorited = favoriteIds.has(breed.id);
              const articleCount = getArticleCount(breed.id);
              const CategoryIcon = categoryIcons[breed.category];
              return (
                <div
                  key={breed.id}
                  className={`card group cursor-pointer transition-all duration-300 relative overflow-hidden ${
                    isFavorited
                      ? 'ring-2 ring-rose-400 shadow-lg shadow-rose-100/50'
                      : 'hover:shadow-card-hover'
                  }`}
                >
                  {isFavorited && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400" />
                  )}

                  <Link to={`/breeds/${breed.id}`} className="block">
                    <div className="relative h-44 -mx-6 -mt-6 mb-4 overflow-hidden">
                      {breed.coverImage ? (
                        <img
                          src={breed.coverImage}
                          alt={breed.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-100">
                          <CategoryIcon className="w-16 h-16 text-primary-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      <div className="absolute top-3 left-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[breed.category]} backdrop-blur-sm`}
                        >
                          <CategoryIcon className="w-3 h-3" />
                          {PetCategoryLabel[breed.category]}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavoriteBreed(breed.id);
                        }}
                        className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isFavorited
                            ? 'bg-rose-500 text-white shadow-md scale-110'
                            : 'bg-white/90 text-neutral-muted hover:bg-white hover:text-rose-500 backdrop-blur-sm'
                        }`}
                        title={isFavorited ? '取消收藏' : '收藏品种'}
                      >
                        <Heart className={`w-4 h-4 transition-all ${isFavorited ? 'fill-current' : ''}`} />
                      </button>

                      {breed.englishName && (
                        <div className="absolute bottom-3 left-4 right-4">
                          <p className="text-white/80 text-xs mb-1">{breed.englishName}</p>
                          <h3 className="font-serif text-xl font-bold text-white drop-shadow-sm">
                            {breed.name}
                          </h3>
                        </div>
                      )}
                    </div>

                    {!breed.englishName && (
                      <h3 className="font-serif text-xl font-semibold text-primary-900 mb-3">
                        {breed.name}
                      </h3>
                    )}

                    <div className="space-y-2 mb-4">
                      {breed.origin && (
                        <div className="flex items-center gap-2 text-sm text-neutral-muted">
                          <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0" />
                          <span>原产：{breed.origin}</span>
                        </div>
                      )}
                      {breed.lifespan && (
                        <div className="flex items-center gap-2 text-sm text-neutral-muted">
                          <Clock className="w-4 h-4 text-primary-400 flex-shrink-0" />
                          <span>寿命：{breed.lifespan}</span>
                        </div>
                      )}
                    </div>

                    {breed.personality && breed.personality.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {breed.personality.slice(0, 4).map((trait) => (
                          <span
                            key={trait}
                            className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700"
                          >
                            {trait}
                          </span>
                        ))}
                        {breed.personality.length > 4 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-muted">
                            +{breed.personality.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>

                  <div className="pt-3 border-t border-primary-100 -mx-6 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-muted">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{articleCount} 篇知识文章</span>
                    </div>
                    <Link
                      to={`/breeds/${breed.id}`}
                      className="text-xs font-medium text-primary-600 hover:text-primary-800 flex items-center gap-0.5 group/link"
                    >
                      查看详情
                      <span className="transition-transform group-hover/link:translate-x-0.5">→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : filteredArticles.length === 0 ? (
        <div className="card text-center py-16">
          <FileText className="w-16 h-16 mx-auto text-primary-300 mb-4" />
          <p className="text-neutral-muted text-lg mb-2">
            {searchQuery ? '未找到匹配的文章' : '暂无知识文章'}
          </p>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="btn-primary mt-2">
              清除搜索
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredArticles.map((article) => {
            const breed = getPetBreedById(article.breedId);
            const CategoryIcon = breed ? categoryIcons[breed.category] : PawPrint;
            const isFavorited = breed ? favoriteIds.has(breed.id) : false;

            return (
              <div
                key={article.id}
                className={`card hover:shadow-card-hover transition-all duration-200 group overflow-hidden ${
                  isFavorited ? 'ring-1 ring-rose-200' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {article.coverImage && (
                    <div className="sm:w-48 sm:h-36 flex-shrink-0 rounded-xl overflow-hidden bg-primary-100 -mx-2 sm:mx-0 -mt-2 sm:mt-0">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${articleTypeColors[article.articleType]}`}
                      >
                        <Tag className="w-3 h-3" />
                        {ArticleTypeLabel[article.articleType]}
                      </span>
                      {breed && (
                        <Link
                          to={`/breeds/${breed.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[breed.category]} hover:opacity-80 transition-opacity`}
                        >
                          <CategoryIcon className="w-3 h-3" />
                          {breed.name}
                        </Link>
                      )}
                      {isFavorited && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-600">
                          <Heart className="w-3 h-3 fill-current" />
                          已收藏品种
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/breeds/${article.breedId}`}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/breeds/${article.breedId}#article-${article.id}`;
                      }}
                      className="block"
                    >
                      <h3 className="font-serif text-lg font-semibold text-primary-900 mb-1.5 group-hover:text-primary-700 transition-colors line-clamp-1">
                        {article.title}
                      </h3>

                      {article.summary && (
                        <p className="text-sm text-neutral-text mb-2 line-clamp-1">
                          {article.summary}
                        </p>
                      )}

                      <p className="text-sm text-neutral-muted line-clamp-2 mb-3">
                        {renderMarkdownPreview(article.content, 150)}
                      </p>
                    </Link>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-neutral-muted">
                        {article.author && (
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {article.author}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(article.createdAt)}
                        </span>
                      </div>
                      <Link
                        to={`/breeds/${article.breedId}`}
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/breeds/${article.breedId}#article-${article.id}`;
                        }}
                        className="text-xs font-medium text-primary-600 hover:text-primary-800 flex items-center gap-1 group/link"
                      >
                        查看全文
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
