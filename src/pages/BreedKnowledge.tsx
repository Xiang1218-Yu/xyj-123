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
  X
} from 'lucide-react';
import { useAppStore } from '@/store';
import PageHeader from '@/components/PageHeader';
import { PetCategoryLabel, type PetCategory } from '@/shared/types';

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

export default function BreedKnowledge() {
  const { petBreeds, favoriteBreeds, breedArticles, toggleFavoriteBreed } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<PetCategory | 'all' | 'favorites'>('all');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

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

  const getArticleCount = (breedId: string) =>
    breedArticles.filter((a) => a.breedId === breedId).length;

  const getCategoryLabel = (cat: PetCategory | 'all' | 'favorites') => {
    if (cat === 'all') return '全部品种';
    if (cat === 'favorites') return '我的收藏';
    return PetCategoryLabel[cat];
  };

  return (
    <div className="relative">
      <PageHeader
        title="宠物品种知识库"
        description="全面了解各类宠物品种的特征、习性与养护知识"
        actions={
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary-200 text-primary-700 bg-white hover:bg-primary-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            筛选
          </button>
        }
      />

      <div className="mb-6 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
          <input
            type="text"
            placeholder="搜索品种名称、英文名、产地或性格关键词..."
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
            共 <span className="font-semibold text-primary-700">{filteredBreeds.length}</span> 个品种
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
            <button
              onClick={() => setActiveCategory('all')}
              className="text-xs text-primary-600 hover:text-primary-800 underline"
            >
              重置筛选
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => {
              const Icon = cat === 'all' ? BookOpen : cat === 'favorites' ? Star : categoryIcons[cat as PetCategory];
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
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {allCategories.map((cat) => {
          const Icon = cat === 'all' ? BookOpen : cat === 'favorites' ? Star : categoryIcons[cat as PetCategory];
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
        })}
      </div>

      {filteredBreeds.length === 0 ? (
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
            <button
              onClick={() => setSearchQuery('')}
              className="btn-primary mt-2"
            >
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
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          categoryColors[breed.category]
                        } backdrop-blur-sm`}
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
                      <Heart
                        className={`w-4 h-4 transition-all ${
                          isFavorited ? 'fill-current' : ''
                        }`}
                      />
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
      )}
    </div>
  );
}
