import { useState } from 'react';
import { Archive, Calendar, Check, Plus, Eye } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { mockUrns, mockPets } from '@/data/mockData';
import type { Urn } from '@/shared/types';
import { cn } from '@/lib/utils';

const areas = ['A区', 'B区', 'C区'];
const shelves = ['第1排', '第2排', '第3排', '第4排'];
const positionsPerShelf = 10;

const statusMap: Record<Urn['status'], { label: string; className: string }> = {
  stored: { label: '已存放', className: 'bg-green-100 text-green-700' },
  retrieved: { label: '已取出', className: 'bg-gray-100 text-gray-600' }
};

interface SlotInfo {
  area: string;
  shelf: string;
  position: string;
  occupied: boolean;
  urn?: Urn;
}

export default function UrnStorage() {
  const [urns] = useState<Urn[]>(mockUrns);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);

  const getPetName = (petId: string) => {
    const pet = mockPets.find(p => p.id === petId);
    return pet?.name || '未知';
  };

  const getUrnForSlot = (area: string, shelf: string, position: string) => {
    return urns.find(u => u.area === area && u.shelf === shelf && u.position === `${position}号` && u.status === 'stored');
  };

  const generateSlots = (area: string): SlotInfo[][] => {
    return shelves.map(shelf => {
      const shelfSlots: SlotInfo[] = [];
      for (let i = 1; i <= positionsPerShelf; i++) {
        const urn = getUrnForSlot(area, shelf, i.toString());
        shelfSlots.push({
          area,
          shelf,
          position: `${i}号`,
          occupied: !!urn,
          urn
        });
      }
      return shelfSlots;
    });
  };

  const handleSlotClick = (slot: SlotInfo) => {
    setSelectedSlot(slot);
  };

  const closeModal = () => {
    setSelectedSlot(null);
  };

  const storedUrns = urns.filter(u => u.status === 'stored');

  return (
    <div>
      <PageHeader
        title="骨灰盒存放"
        description="骨灰盒位置管理与存取记录"
      />

      <div className="mb-8">
        <h2 className="font-serif text-xl font-semibold text-primary-800 mb-4">
          <Archive className="w-5 h-5 inline mr-2 text-accent" />
          存放区域视图
        </h2>
        <div className="space-y-8">
          {areas.map(area => (
            <div key={area} className="card">
              <h3 className="font-semibold text-lg text-primary-800 mb-4">{area}</h3>
              <div className="space-y-3">
                {generateSlots(area).map((shelfSlots, shelfIndex) => (
                  <div key={shelves[shelfIndex]} className="flex items-center gap-3">
                    <span className="w-16 text-sm text-neutral-muted font-medium">
                      {shelves[shelfIndex]}
                    </span>
                    <div className="flex-1 grid grid-cols-10 gap-2">
                      {shelfSlots.map((slot, posIndex) => (
                        <button
                          key={posIndex}
                          onClick={() => handleSlotClick(slot)}
                          className={cn(
                            'aspect-square rounded-lg border-2 flex items-center justify-center text-xs font-medium transition-all duration-200',
                            slot.occupied
                              ? 'bg-accent/20 border-accent text-primary-800 hover:bg-accent/30 hover:shadow-md'
                              : 'bg-white border-primary-200 text-neutral-muted hover:border-primary-400 hover:bg-primary-50'
                          )}
                        >
                          {slot.occupied ? (
                            <Archive className="w-5 h-5 text-accent" />
                          ) : (
                            <span>{posIndex + 1}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-primary-100 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-accent/20 border-2 border-accent" />
                  <span className="text-neutral-muted">已占用</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-white border-2 border-primary-200" />
                  <span className="text-neutral-muted">空闲</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl font-semibold text-primary-800 mb-4">
          <Check className="w-5 h-5 inline mr-2 text-accent" />
          已存放骨灰盒
        </h2>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-100">
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                    宠物名
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                    位置
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                    存放日期
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                    到期日期
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-muted">
                    状态
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-neutral-muted">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {storedUrns.map(urn => (
                  <tr
                    key={urn.id}
                    className="border-b border-primary-50 hover:bg-primary-50/30 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Archive className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-primary-800">
                          {getPetName(urn.petId)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-neutral-text">
                        {urn.area} - {urn.shelf} - {urn.position}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary-400" />
                        <span className="text-sm text-neutral-text">{urn.storedDate}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary-400" />
                        <span className="text-sm text-neutral-text">{urn.expiryDate}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn('status-badge', statusMap[urn.status].className)}>
                        {statusMap[urn.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 rounded-lg text-primary-600 hover:bg-primary-100 transition-colors"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedSlot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-serif text-xl font-semibold text-primary-800 mb-4">
              {selectedSlot.area} - {selectedSlot.shelf} - {selectedSlot.position}
            </h3>
            {selectedSlot.occupied && selectedSlot.urn ? (
              <div className="space-y-4">
                <div className="p-4 bg-primary-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Archive className="w-5 h-5 text-accent" />
                    <span className="font-medium text-primary-800">
                      {getPetName(selectedSlot.urn.petId)}
                    </span>
                  </div>
                  <div className="text-sm text-neutral-muted space-y-1">
                    <p>存放日期：{selectedSlot.urn.storedDate}</p>
                    <p>到期日期：{selectedSlot.urn.expiryDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="btn-primary flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    查看详情
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-neutral-muted">该位置当前空闲</p>
                <button className="btn-primary w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  登记存放
                </button>
              </div>
            )}
            <button
              className="mt-4 w-full btn-secondary"
              onClick={closeModal}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
