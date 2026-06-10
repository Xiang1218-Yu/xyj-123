import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Plus, Search, User } from 'lucide-react';
import { useAppStore } from '@/store';
import PageHeader from '@/components/PageHeader';

export default function PetList() {
  const { pets, owners } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const getOwnerById = (ownerId: string) =>
    owners.find((o) => o.id === ownerId);

  const filteredPets = useMemo(() => {
    if (!searchQuery.trim()) return pets;
    const query = searchQuery.toLowerCase();
    return pets.filter((pet) => {
      const owner = getOwnerById(pet.ownerId);
      return (
        pet.name.toLowerCase().includes(query) ||
        pet.breed.toLowerCase().includes(query) ||
        (owner?.name.toLowerCase().includes(query) ?? false)
      );
    });
  }, [pets, searchQuery, owners]);

  return (
    <div>
      <PageHeader
        title="宠物档案"
        description="管理所有宠物的基本信息"
        actions={
          <Link to="/pets/new" className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            新增宠物
          </Link>
        }
      />

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
          <input
            type="text"
            placeholder="搜索宠物名、品种或主人姓名..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {filteredPets.length === 0 ? (
        <div className="card text-center py-16">
          <PawPrint className="w-16 h-16 mx-auto text-primary-300 mb-4" />
          <p className="text-neutral-muted text-lg">
            {searchQuery ? '未找到匹配的宠物' : '暂无宠物档案'}
          </p>
          {!searchQuery && (
            <Link to="/pets/new" className="btn-primary mt-6">
              <Plus className="w-4 h-4 mr-2" />
              添加第一只宠物
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPets.map((pet) => {
            const owner = getOwnerById(pet.ownerId);
            return (
              <Link
                key={pet.id}
                to={`/pets/${pet.id}`}
                className="card cursor-pointer hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <img
                      src={pet.photoUrl}
                      alt={pet.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary-100 group-hover:border-accent transition-colors duration-200"
                    />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-800 rounded-full flex items-center justify-center border-2 border-white">
                      <PawPrint className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-primary-900 mb-1">
                    {pet.name}
                  </h3>
                  <p className="text-sm text-neutral-muted mb-2">{pet.breed}</p>
                  <p className="text-sm text-primary-600 mb-3">{pet.age}</p>
                  <div className="flex items-center text-sm text-neutral-text">
                    <User className="w-4 h-4 mr-1.5 text-primary-400" />
                    <span>{owner?.name ?? '未知主人'}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
