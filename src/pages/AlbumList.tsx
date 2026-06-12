import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Images, Plus, PawPrint, User, Trash2, Edit2 } from 'lucide-react';
import { useAppStore } from '@/store';
import PageHeader from '@/components/PageHeader';
import { SearchInput, Empty } from '@/components/ui';

export default function AlbumList() {
  const { albums, pets, owners, photos, deleteAlbum } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const getPetById = (petId: string) => pets.find((p) => p.id === petId);
  const getOwnerById = (ownerId: string) => owners.find((o) => o.id === ownerId);
  const getPhotoCount = (albumId: string) => photos.filter((p) => p.albumId === albumId).length;

  const filteredAlbums = useMemo(() => {
    if (!searchQuery.trim()) return albums;
    const query = searchQuery.toLowerCase();
    return albums.filter((album) => {
      const pet = pets.find((p) => p.id === album.petId);
      const owner = owners.find((o) => o.id === album.ownerId);
      return (
        album.title.toLowerCase().includes(query) ||
        (album.description?.toLowerCase().includes(query) ?? false) ||
        (pet?.name.toLowerCase().includes(query) ?? false) ||
        (owner?.name.toLowerCase().includes(query) ?? false)
      );
    });
  }, [albums, searchQuery, pets, owners]);

  const handleDelete = (albumId: string) => {
    deleteAlbum(albumId);
    setDeleteConfirmId(null);
  };

  return (
    <div>
      <PageHeader
        title="纪念相册"
        description="管理宠物的纪念相册，珍藏美好回忆"
        actions={
          <Link to="/albums/new" className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            新建相册
          </Link>
        }
      />

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
          <input
            type="text"
            placeholder="搜索相册名称、宠物或主人..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {filteredAlbums.length === 0 ? (
        <div className="card text-center py-16">
          <Images className="w-16 h-16 mx-auto text-primary-300 mb-4" />
          <p className="text-neutral-muted text-lg">
            {searchQuery ? '未找到匹配的相册' : '暂无纪念相册'}
          </p>
          {!searchQuery && (
            <Link to="/albums/new" className="btn-primary mt-6">
              <Plus className="w-4 h-4 mr-2" />
              创建第一个相册
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album) => {
            const pet = getPetById(album.petId);
            const owner = getOwnerById(album.ownerId);
            const photoCount = getPhotoCount(album.id);
            const defaultCover = pet?.photoUrl;

            return (
              <div
                key={album.id}
                className="card cursor-pointer hover:shadow-lg transition-all duration-200 group overflow-hidden p-0"
              >
                <Link to={`/albums/${album.id}`} className="block">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={album.coverPhotoUrl || defaultCover}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="font-serif text-xl font-semibold text-white mb-1 line-clamp-1">
                        {album.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-white/80">
                        <span className="flex items-center gap-1">
                          <Images className="w-3.5 h-3.5" />
                          {photoCount} 张照片
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="p-4">
                  {album.description && (
                    <p className="text-sm text-neutral-muted mb-3 line-clamp-2">
                      {album.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    {pet && (
                      <div className="flex items-center text-sm text-neutral-text">
                        <PawPrint className="w-4 h-4 mr-1.5 text-primary-400" />
                        <span>{pet.name}</span>
                        <span className="text-primary-400 mx-1.5">·</span>
                        <span className="text-neutral-muted">{pet.breed}</span>
                      </div>
                    )}
                    {owner && (
                      <div className="flex items-center text-sm text-neutral-text">
                        <User className="w-4 h-4 mr-1.5 text-primary-400" />
                        <span>{owner.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-primary-100">
                    {deleteConfirmId === album.id ? (
                      <>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-3 py-1.5 text-sm text-neutral-muted hover:text-neutral-text transition-colors"
                        >
                          取消
                        </button>
                        <button
                          onClick={() => handleDelete(album.id)}
                          className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          确认删除
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to={`/albums/${album.id}/edit`}
                          className="p-2 text-neutral-muted hover:text-primary-800 hover:bg-primary-50 rounded-lg transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(album.id);
                          }}
                          className="p-2 text-neutral-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
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
