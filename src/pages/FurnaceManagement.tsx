import { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  Thermometer,
  Clock,
  Wrench,
  Sparkles,
  ArrowRight,
  Calendar,
  User,
  Settings,
  Activity,
  AlertCircle,
  ChevronRight,
  Play,
  Pause,
  SkipForward
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';
import type {
  Furnace,
  FurnaceMaintenance,
  FurnaceCremationProcess,
  CremationProcessStage
} from '@/shared/types';
import {
  FurnaceStatusLabel,
  FurnaceStatusColor,
  MaintenanceTypeLabel,
  CremationProcessStageLabel,
  CremationProcessStageColor
} from '@/shared/types';

type TabType = 'overview' | 'maintenance' | 'process';

const maintenanceTypeMap: Record<FurnaceMaintenance['type'], { label: string; className: string }> = {
  cleaning: { label: '清洁', className: 'bg-blue-100 text-blue-700' },
  inspection: { label: '检修', className: 'bg-yellow-100 text-yellow-700' },
  repair: { label: '维修', className: 'bg-red-100 text-red-700' },
  'parts-replacement': { label: '零件更换', className: 'bg-purple-100 text-purple-700' }
};

const stageOrder: CremationProcessStage[] = ['idle', 'loading', 'heating', 'constant', 'cooling', 'unloading'];

function TemperatureChart({ data, maxTemp }: { data: { time: string; temperature: number }[]; maxTemp: number }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-neutral-muted">
        <AlertCircle className="w-5 h-5 mr-2" />
        暂无温度数据
      </div>
    );
  }

  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const yMax = Math.max(maxTemp, ...data.map(d => d.temperature)) + 50;
  const yMin = 0;

  const points = data.map((d, i) => {
    const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.temperature - yMin) / (yMax - yMin)) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    return `${acc} L ${p.x} ${p.y}`;
  }, '');

  const yTicks = [0, Math.round(yMax * 0.25), Math.round(yMax * 0.5), Math.round(yMax * 0.75), yMax];

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height} className="min-w-full">
        {yTicks.map((tick, i) => {
          const y = padding.top + chartHeight - ((tick - yMin) / (yMax - yMin)) * chartHeight;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#e5e7eb"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-neutral-muted"
              >
                {tick}°C
              </text>
            </g>
          );
        })}

        <path
          d={pathD}
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <defs>
          <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${pathD} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`}
          fill="url(#tempGradient)"
        />

        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3" fill="#f97316" stroke="white" strokeWidth="2" />
            <text
              x={p.x}
              y={height - padding.bottom + 18}
              textAnchor="middle"
              className="text-xs fill-neutral-muted"
            >
              {p.time}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function FurnaceManagement() {
  const furnaces = useAppStore(state => state.furnaces);
  const furnaceMaintenances = useAppStore(state => state.furnaceMaintenances);
  const furnaceProcesses = useAppStore(state => state.furnaceProcesses);
  const pets = useAppStore(state => state.pets);
  const employees = useAppStore(state => state.employees);

  const addFurnace = useAppStore(state => state.addFurnace);
  const updateFurnace = useAppStore(state => state.updateFurnace);
  const deleteFurnace = useAppStore(state => state.deleteFurnace);

  const addFurnaceMaintenance = useAppStore(state => state.addFurnaceMaintenance);
  const updateFurnaceMaintenance = useAppStore(state => state.updateFurnaceMaintenance);
  const deleteFurnaceMaintenance = useAppStore(state => state.deleteFurnaceMaintenance);
  const getMaintenancesByFurnaceId = useAppStore(state => state.getMaintenancesByFurnaceId);

  const addFurnaceProcess = useAppStore(state => state.addFurnaceProcess);
  const updateFurnaceProcess = useAppStore(state => state.updateFurnaceProcess);
  const deleteFurnaceProcess = useAppStore(state => state.deleteFurnaceProcess);
  const getActiveProcessByFurnaceId = useAppStore(state => state.getActiveProcessByFurnaceId);
  const advanceProcessStage = useAppStore(state => state.advanceProcessStage);
  const addTemperaturePoint = useAppStore(state => state.addTemperaturePoint);

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedFurnaceId, setSelectedFurnaceId] = useState<string | null>(furnaces[0]?.id || null);

  const [showFurnaceModal, setShowFurnaceModal] = useState(false);
  const [editingFurnaceId, setEditingFurnaceId] = useState<string | null>(null);
  const [furnaceForm, setFurnaceForm] = useState({
    name: '',
    model: '',
    manufacturer: '',
    installDate: '',
    maxTemperature: 1200,
    status: 'idle' as Furnace['status'],
    totalUsageHours: 0,
    lastMaintenanceDate: '',
    nextMaintenanceDate: '',
    notes: ''
  });

  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [editingMaintenanceId, setEditingMaintenanceId] = useState<string | null>(null);
  const [maintenanceForm, setMaintenanceForm] = useState({
    type: 'cleaning' as FurnaceMaintenance['type'],
    title: '',
    description: '',
    performedBy: '',
    performedAt: '',
    nextDueDate: '',
    cost: 0,
    partsUsed: ''
  });

  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processForm, setProcessForm] = useState({
    furnaceId: '',
    petName: '',
    targetTemperature: 900,
    operator: '',
    notes: ''
  });

  useEffect(() => {
    if (!selectedFurnaceId && furnaces.length > 0) {
      setSelectedFurnaceId(furnaces[0].id);
    }
  }, [furnaces, selectedFurnaceId]);

  useEffect(() => {
    const interval = setInterval(() => {
      furnaces.forEach(furnace => {
        const activeProcess = getActiveProcessByFurnaceId(furnace.id);
        if (activeProcess && (activeProcess.stage === 'heating' || activeProcess.stage === 'constant' || activeProcess.stage === 'cooling')) {
          let newTemp = furnace.currentTemperature;
          if (activeProcess.stage === 'heating') {
            newTemp = Math.min(furnace.currentTemperature + Math.random() * 30 + 10, activeProcess.targetTemperature);
          } else if (activeProcess.stage === 'constant') {
            newTemp = activeProcess.targetTemperature + (Math.random() * 20 - 10);
          } else if (activeProcess.stage === 'cooling') {
            newTemp = Math.max(furnace.currentTemperature - Math.random() * 40 - 20, 25);
          }
          const now = new Date();
          const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          addTemperaturePoint(activeProcess.id, { time: timeStr, temperature: Math.round(newTemp) });
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [furnaces, getActiveProcessByFurnaceId, addTemperaturePoint]);

  const selectedFurnace = furnaces.find(f => f.id === selectedFurnaceId);
  const selectedMaintenances = selectedFurnaceId ? getMaintenancesByFurnaceId(selectedFurnaceId) : [];
  const selectedActiveProcess = selectedFurnaceId ? getActiveProcessByFurnaceId(selectedFurnaceId) : null;
  const selectedAllProcesses = selectedFurnaceId
    ? furnaceProcesses.filter(p => p.furnaceId === selectedFurnaceId)
    : [];

  const operatorOptions = employees.filter(e => e.role === 'cremation-operator' || e.role === 'manager');

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const openAddFurnaceModal = () => {
    setEditingFurnaceId(null);
    setFurnaceForm({
      name: '',
      model: '',
      manufacturer: '',
      installDate: '',
      maxTemperature: 1200,
      status: 'idle',
      totalUsageHours: 0,
      lastMaintenanceDate: '',
      nextMaintenanceDate: '',
      notes: ''
    });
    setShowFurnaceModal(true);
  };

  const openEditFurnaceModal = (furnace: Furnace) => {
    setEditingFurnaceId(furnace.id);
    setFurnaceForm({
      name: furnace.name,
      model: furnace.model,
      manufacturer: furnace.manufacturer,
      installDate: furnace.installDate,
      maxTemperature: furnace.maxTemperature,
      status: furnace.status,
      totalUsageHours: furnace.totalUsageHours,
      lastMaintenanceDate: furnace.lastMaintenanceDate || '',
      nextMaintenanceDate: furnace.nextMaintenanceDate || '',
      notes: furnace.notes || ''
    });
    setShowFurnaceModal(true);
  };

  const handleFurnaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!furnaceForm.name || !furnaceForm.model || !furnaceForm.manufacturer) {
      alert('请填写必填项');
      return;
    }
    if (editingFurnaceId) {
      updateFurnace(editingFurnaceId, {
        ...furnaceForm,
        currentTemperature: selectedFurnace?.currentTemperature || 25
      });
    } else {
      addFurnace({
        ...furnaceForm,
        currentTemperature: 25
      });
    }
    setShowFurnaceModal(false);
  };

  const handleDeleteFurnace = (id: string) => {
    if (confirm('确定要删除此火化炉吗？相关的维护记录和流程记录也将被删除。')) {
      deleteFurnace(id);
      if (selectedFurnaceId === id) {
        setSelectedFurnaceId(null);
      }
    }
  };

  const openAddMaintenanceModal = () => {
    if (!selectedFurnaceId) return;
    setEditingMaintenanceId(null);
    setMaintenanceForm({
      type: 'cleaning',
      title: '',
      description: '',
      performedBy: '',
      performedAt: new Date().toISOString().slice(0, 16),
      nextDueDate: '',
      cost: 0,
      partsUsed: ''
    });
    setShowMaintenanceModal(true);
  };

  const openEditMaintenanceModal = (maintenance: FurnaceMaintenance) => {
    setEditingMaintenanceId(maintenance.id);
    setMaintenanceForm({
      type: maintenance.type,
      title: maintenance.title,
      description: maintenance.description,
      performedBy: maintenance.performedBy,
      performedAt: maintenance.performedAt.slice(0, 16),
      nextDueDate: maintenance.nextDueDate || '',
      cost: maintenance.cost || 0,
      partsUsed: maintenance.partsUsed || ''
    });
    setShowMaintenanceModal(true);
  };

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFurnaceId || !maintenanceForm.title || !maintenanceForm.performedBy || !maintenanceForm.performedAt) {
      alert('请填写必填项');
      return;
    }
    const data = {
      furnaceId: selectedFurnaceId,
      ...maintenanceForm,
      performedAt: maintenanceForm.performedAt + ':00Z'
    };
    if (editingMaintenanceId) {
      updateFurnaceMaintenance(editingMaintenanceId, data);
    } else {
      addFurnaceMaintenance(data);
    }
    setShowMaintenanceModal(false);
  };

  const handleDeleteMaintenance = (id: string) => {
    if (confirm('确定要删除此维护记录吗？')) {
      deleteFurnaceMaintenance(id);
    }
  };

  const openProcessModal = () => {
    if (!selectedFurnaceId) return;
    setProcessForm({
      furnaceId: selectedFurnaceId,
      petName: '',
      targetTemperature: 900,
      operator: '',
      notes: ''
    });
    setShowProcessModal(true);
  };

  const handleProcessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!processForm.petName) {
      alert('请填写宠物名称');
      return;
    }
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    addFurnaceProcess({
      furnaceId: processForm.furnaceId,
      petName: processForm.petName,
      stage: 'idle',
      targetTemperature: processForm.targetTemperature,
      temperatureHistory: [{ time: timeStr, temperature: selectedFurnace?.currentTemperature || 25 }],
      operator: processForm.operator,
      notes: processForm.notes
    });
    setShowProcessModal(false);
  };

  const handleAdvanceStage = (processId: string) => {
    advanceProcessStage(processId);
    const process = furnaceProcesses.find(p => p.id === processId);
    if (process) {
      const nextIndex = stageOrder.indexOf(process.stage);
      const nextStage = stageOrder[nextIndex];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (nextStage === 'loading') {
        addTemperaturePoint(processId, { time: timeStr, temperature: 25 });
      }
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 100) return 'text-blue-600';
    if (temp < 400) return 'text-green-600';
    if (temp < 700) return 'text-yellow-600';
    if (temp < 1000) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStageIndex = (stage: CremationProcessStage) => stageOrder.indexOf(stage);

  return (
    <div>
      <PageHeader
        title="火化炉管理"
        description="火化炉设备管理、温度监控、维护记录与火化流程跟踪"
        actions={
          activeTab === 'overview' ? (
            <button className="btn-primary" onClick={openAddFurnaceModal}>
              <Plus className="w-4 h-4 mr-2" />
              添加火化炉
            </button>
          ) : activeTab === 'maintenance' ? (
            <button
              className="btn-primary"
              onClick={openAddMaintenanceModal}
              disabled={!selectedFurnaceId}
            >
              <Plus className="w-4 h-4 mr-2" />
              新增维护记录
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={openProcessModal}
              disabled={!selectedFurnaceId || selectedFurnace?.status !== 'idle'}
            >
              <Play className="w-4 h-4 mr-2" />
              开始火化流程
            </button>
          )
        }
      />

      <div className="mb-6">
        <div className="flex gap-2 mb-6">
          <button
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'overview'
                ? 'bg-primary-800 text-white'
                : 'bg-white text-neutral-text hover:bg-primary-50'
            )}
            onClick={() => setActiveTab('overview')}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            设备管理
          </button>
          <button
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'maintenance'
                ? 'bg-primary-800 text-white'
                : 'bg-white text-neutral-text hover:bg-primary-50'
            )}
            onClick={() => setActiveTab('maintenance')}
          >
            <Wrench className="w-4 h-4 inline mr-2" />
            维护记录
          </button>
          <button
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'process'
                ? 'bg-primary-800 text-white'
                : 'bg-white text-neutral-text hover:bg-primary-50'
            )}
            onClick={() => setActiveTab('process')}
          >
            <Activity className="w-4 h-4 inline mr-2" />
            火化流程
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {furnaces.map(furnace => {
            const activeProcess = getActiveProcessByFurnaceId(furnace.id);
            return (
              <div
                key={furnace.id}
                onClick={() => setSelectedFurnaceId(furnace.id)}
                className={cn(
                  'card cursor-pointer transition-all hover:shadow-lg',
                  selectedFurnaceId === furnace.id && 'ring-2 ring-primary-500'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-primary-800">{furnace.name}</h3>
                    <p className="text-xs text-neutral-muted">{furnace.model}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn('w-3 h-3 rounded-full', FurnaceStatusColor[furnace.status])} />
                    <span className="text-xs font-medium text-neutral-text">
                      {FurnaceStatusLabel[furnace.status]}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Thermometer className="w-4 h-4 text-orange-500" />
                      <span className="text-xs text-neutral-muted">当前温度</span>
                    </div>
                    <span className={cn('text-lg font-bold', getTemperatureColor(furnace.currentTemperature))}>
                      {furnace.currentTemperature}°C
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-xs text-neutral-muted">累计使用</span>
                    </div>
                    <span className="text-sm font-medium text-neutral-text">
                      {furnace.totalUsageHours} 小时
                    </span>
                  </div>

                  {activeProcess && (
                    <div className="mt-3 p-2 rounded-lg bg-orange-50 border border-orange-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-neutral-muted">当前流程</span>
                        <span className={cn(
                          'w-2 h-2 rounded-full animate-pulse',
                          CremationProcessStageColor[activeProcess.stage]
                        )} />
                      </div>
                      <p className="text-sm font-medium text-primary-800">
                        {activeProcess.petName} · {CremationProcessStageLabel[activeProcess.stage]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {!selectedFurnace ? (
          <div className="card text-center py-12">
            <Flame className="w-12 h-12 mx-auto text-neutral-muted mb-3" />
            <p className="text-neutral-muted">请选择一个火化炉查看详情</p>
          </div>
        ) : activeTab === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-serif text-lg font-semibold text-primary-800 mb-4 flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-orange-500" />
                温度监控
              </h3>
              <div className="mb-4">
                <div className="flex items-end gap-4 mb-4">
                  <div>
                    <p className="text-xs text-neutral-muted mb-1">当前温度</p>
                    <p className={cn('text-4xl font-bold', getTemperatureColor(selectedFurnace.currentTemperature))}>
                      {selectedFurnace.currentTemperature}°C
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-muted mb-1">最高温度</p>
                    <p className="text-xl font-semibold text-primary-800">
                      {selectedFurnace.maxTemperature}°C
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-neutral-muted mb-1">温度状态</p>
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                      selectedFurnace.currentTemperature < 50
                        ? 'bg-blue-100 text-blue-700'
                        : selectedFurnace.currentTemperature > selectedFurnace.maxTemperature * 0.9
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                    )}>
                      {selectedFurnace.currentTemperature < 50 ? '低温安全' :
                       selectedFurnace.currentTemperature > selectedFurnace.maxTemperature * 0.9 ? '高温警告' : '正常范围'}
                    </span>
                  </div>
                </div>

                <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all duration-500 rounded-full',
                      selectedFurnace.currentTemperature < 50
                        ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                        : selectedFurnace.currentTemperature > selectedFurnace.maxTemperature * 0.9
                          ? 'bg-gradient-to-r from-orange-500 to-red-500'
                          : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                    )}
                    style={{ width: `${Math.min((selectedFurnace.currentTemperature / selectedFurnace.maxTemperature) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <h4 className="font-medium text-primary-800 mb-3 text-sm">温度曲线（最近记录）</h4>
              <TemperatureChart
                data={selectedActiveProcess?.temperatureHistory || []}
                maxTemp={selectedFurnace.maxTemperature}
              />
            </div>

            <div className="space-y-6">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-semibold text-primary-800 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary-600" />
                    设备信息
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 rounded-lg text-primary-600 hover:bg-primary-100 transition-colors"
                      onClick={() => openEditFurnaceModal(selectedFurnace)}
                      title="编辑"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      onClick={() => handleDeleteFurnace(selectedFurnace.id)}
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-muted mb-1">设备名称</p>
                    <p className="text-sm font-medium text-neutral-text">{selectedFurnace.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-muted mb-1">设备型号</p>
                    <p className="text-sm font-medium text-neutral-text">{selectedFurnace.model}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-muted mb-1">生产厂商</p>
                    <p className="text-sm font-medium text-neutral-text">{selectedFurnace.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-muted mb-1">安装日期</p>
                    <p className="text-sm font-medium text-neutral-text">{formatDate(selectedFurnace.installDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-muted mb-1">设备状态</p>
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      selectedFurnace.status === 'idle' && 'bg-green-100 text-green-700',
                      selectedFurnace.status === 'running' && 'bg-orange-100 text-orange-700',
                      selectedFurnace.status === 'maintenance' && 'bg-yellow-100 text-yellow-700',
                      selectedFurnace.status === 'cleaning' && 'bg-blue-100 text-blue-700',
                      selectedFurnace.status === 'offline' && 'bg-gray-100 text-gray-700'
                    )}>
                      {FurnaceStatusLabel[selectedFurnace.status]}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-muted mb-1">累计使用时长</p>
                    <p className="text-sm font-medium text-neutral-text">{selectedFurnace.totalUsageHours} 小时</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-muted mb-1">上次维护</p>
                    <p className="text-sm font-medium text-neutral-text">{formatDate(selectedFurnace.lastMaintenanceDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-muted mb-1">下次维护</p>
                    <p className="text-sm font-medium text-neutral-text">{formatDate(selectedFurnace.nextMaintenanceDate)}</p>
                  </div>
                </div>

                {selectedFurnace.notes && (
                  <div className="mt-4 pt-4 border-t border-primary-100">
                    <p className="text-xs text-neutral-muted mb-1">备注</p>
                    <p className="text-sm text-neutral-text">{selectedFurnace.notes}</p>
                  </div>
                )}
              </div>

              <div className="card">
                <h3 className="font-serif text-lg font-semibold text-primary-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  火化炉列表
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-primary-100">
                        <th className="text-left px-3 py-2 text-xs font-medium text-neutral-muted">名称</th>
                        <th className="text-left px-3 py-2 text-xs font-medium text-neutral-muted">状态</th>
                        <th className="text-left px-3 py-2 text-xs font-medium text-neutral-muted">温度</th>
                        <th className="text-right px-3 py-2 text-xs font-medium text-neutral-muted">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {furnaces.map(furnace => (
                        <tr
                          key={furnace.id}
                          className={cn(
                            'border-b border-primary-50 hover:bg-primary-50/30 transition-colors cursor-pointer',
                            selectedFurnaceId === furnace.id && 'bg-primary-50'
                          )}
                          onClick={() => setSelectedFurnaceId(furnace.id)}
                        >
                          <td className="px-3 py-3">
                            <p className="text-sm font-medium text-primary-800">{furnace.name}</p>
                            <p className="text-xs text-neutral-muted">{furnace.model}</p>
                          </td>
                          <td className="px-3 py-3">
                            <span className={cn(
                              'inline-flex items-center gap-1.5 text-xs',
                              furnace.status === 'idle' && 'text-green-700',
                              furnace.status === 'running' && 'text-orange-700',
                              furnace.status === 'maintenance' && 'text-yellow-700',
                              furnace.status === 'cleaning' && 'text-blue-700',
                              furnace.status === 'offline' && 'text-gray-700'
                            )}>
                              <span className={cn('w-2 h-2 rounded-full', FurnaceStatusColor[furnace.status])} />
                              {FurnaceStatusLabel[furnace.status]}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <span className={cn('text-sm font-medium', getTemperatureColor(furnace.currentTemperature))}>
                              {furnace.currentTemperature}°C
                            </span>
                          </td>
                          <td className="px-3 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-100 transition-colors"
                                onClick={(e) => { e.stopPropagation(); openEditFurnaceModal(furnace); }}
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                onClick={(e) => { e.stopPropagation(); handleDeleteFurnace(furnace.id); }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
          </div>
        ) : activeTab === 'maintenance' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="card">
                <h3 className="font-serif text-lg font-semibold text-primary-800 mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-yellow-600" />
                  {selectedFurnace.name} - 维护记录
                  <span className="text-sm font-normal text-neutral-muted ml-2">
                    共 {selectedMaintenances.length} 条
                  </span>
                </h3>

                {selectedMaintenances.length === 0 ? (
                  <div className="text-center py-12">
                    <Wrench className="w-12 h-12 mx-auto text-neutral-muted mb-3" />
                    <p className="text-neutral-muted">暂无维护记录</p>
                    <p className="text-xs text-neutral-muted mt-1">点击右上角按钮添加第一条记录</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedMaintenances.map(maintenance => (
                      <div
                        key={maintenance.id}
                        className="p-4 rounded-xl border border-primary-100 bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={cn(
                                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                maintenanceTypeMap[maintenance.type].className
                              )}>
                                {maintenanceTypeMap[maintenance.type].label}
                              </span>
                              <h4 className="font-semibold text-primary-800">{maintenance.title}</h4>
                            </div>
                            <p className="text-sm text-neutral-text mb-2">{maintenance.description}</p>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-muted">
                              <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5" />
                                {maintenance.performedBy}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDateTime(maintenance.performedAt)}
                              </span>
                              {maintenance.cost != null && maintenance.cost > 0 && (
                                <span className="flex items-center gap-1">
                                  💰 ¥{maintenance.cost}
                                </span>
                              )}
                              {maintenance.nextDueDate && (
                                <span className="flex items-center gap-1 text-yellow-600">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  下次：{formatDate(maintenance.nextDueDate)}
                                </span>
                              )}
                            </div>
                            {maintenance.partsUsed && (
                              <div className="mt-2 text-xs text-neutral-muted">
                                <span className="font-medium">更换配件：</span>
                                {maintenance.partsUsed}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 ml-4">
                            <button
                              className="p-2 rounded-lg text-primary-600 hover:bg-primary-100 transition-colors"
                              onClick={() => openEditMaintenanceModal(maintenance)}
                              title="编辑"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                              onClick={() => handleDeleteMaintenance(maintenance.id)}
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
              </div>
            </div>

            <div>
              <div className="card">
                <h3 className="font-serif text-lg font-semibold text-primary-800 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary-600" />
                  维护统计
                </h3>

                <div className="space-y-4">
                  {(['cleaning', 'inspection', 'repair', 'parts-replacement'] as const).map(type => {
                    const count = selectedMaintenances.filter(m => m.type === type).length;
                    const totalCost = selectedMaintenances
                      .filter(m => m.type === type)
                      .reduce((sum, m) => sum + (m.cost || 0), 0);
                    return (
                      <div
                        key={type}
                        className="p-3 rounded-lg bg-neutral-50"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                            maintenanceTypeMap[type].className
                          )}>
                            {maintenanceTypeMap[type].label}
                          </span>
                          <span className="text-xs text-neutral-muted">{count} 次</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-neutral-muted">累计费用</span>
                          <span className="text-sm font-semibold text-primary-800">¥{totalCost}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-primary-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-neutral-text">总维护次数</span>
                    <span className="text-lg font-bold text-primary-800">{selectedMaintenances.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-text">总维护费用</span>
                    <span className="text-lg font-bold text-accent">
                      ¥{selectedMaintenances.reduce((sum, m) => sum + (m.cost || 0), 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {selectedActiveProcess ? (
                <div className="card mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-primary-800 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-orange-500" />
                        正在进行 - {selectedActiveProcess.petName}
                      </h3>
                      <p className="text-xs text-neutral-muted mt-1">
                        操作员：{selectedActiveProcess.operator || '未指定'} · 目标温度：{selectedActiveProcess.targetTemperature}°C
                      </p>
                    </div>
                    <span className={cn(
                      'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium',
                      'bg-orange-100 text-orange-700'
                    )}>
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                      {CremationProcessStageLabel[selectedActiveProcess.stage]}
                    </span>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-neutral-text mb-3">流程进度</h4>
                    <div className="flex items-center">
                      {stageOrder.slice(1).map((stage, index) => {
                        const currentIdx = getStageIndex(selectedActiveProcess.stage);
                        const stageIdx = index + 1;
                        const isCompleted = stageIdx < currentIdx;
                        const isCurrent = stageIdx === currentIdx;
                        return (
                          <div key={stage} className="flex-1 flex items-center">
                            <div className="flex flex-col items-center">
                              <div className={cn(
                                'w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                                isCompleted && 'bg-green-500 text-white',
                                isCurrent && cn('text-white ring-4 ring-orange-200', CremationProcessStageColor[stage]),
                                !isCompleted && !isCurrent && 'bg-neutral-100 text-neutral-muted'
                              )}>
                                {isCompleted ? <Check className="w-5 h-5" /> : stageIdx}
                              </div>
                              <span className={cn(
                                'text-xs mt-2 font-medium whitespace-nowrap',
                                isCurrent ? 'text-primary-800' : isCompleted ? 'text-green-700' : 'text-neutral-muted'
                              )}>
                                {CremationProcessStageLabel[stage]}
                              </span>
                            </div>
                            {index < stageOrder.length - 2 && (
                              <div className={cn(
                                'flex-1 h-1 mx-2 rounded-full',
                                isCompleted ? 'bg-green-500' : 'bg-neutral-100'
                              )} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-blue-50">
                      <p className="text-xs text-blue-600 mb-1">入炉时间</p>
                      <p className="text-sm font-medium text-neutral-text">{formatDateTime(selectedActiveProcess.loadingTime)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-orange-50">
                      <p className="text-xs text-orange-600 mb-1">开始升温</p>
                      <p className="text-sm font-medium text-neutral-text">{formatDateTime(selectedActiveProcess.heatingTime)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-red-50">
                      <p className="text-xs text-red-600 mb-1">恒温开始</p>
                      <p className="text-sm font-medium text-neutral-text">{formatDateTime(selectedActiveProcess.constantStartTime)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-cyan-50">
                      <p className="text-xs text-cyan-600 mb-1">开始降温</p>
                      <p className="text-sm font-medium text-neutral-text">{formatDateTime(selectedActiveProcess.coolingStartTime)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-50">
                      <p className="text-xs text-green-600 mb-1">出炉时间</p>
                      <p className="text-sm font-medium text-neutral-text">{formatDateTime(selectedActiveProcess.unloadingTime)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-primary-50">
                      <p className="text-xs text-primary-600 mb-1">完成时间</p>
                      <p className="text-sm font-medium text-neutral-text">{formatDateTime(selectedActiveProcess.completedTime)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100">
                    <div>
                      <p className="text-xs text-neutral-muted mb-1">当前温度</p>
                      <p className={cn('text-3xl font-bold', getTemperatureColor(selectedFurnace.currentTemperature))}>
                        {selectedFurnace.currentTemperature}°C
                      </p>
                    </div>
                    <div className="flex-1 mx-4">
                      <TemperatureChart
                        data={selectedActiveProcess.temperatureHistory}
                        maxTemp={selectedFurnace.maxTemperature}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      {selectedActiveProcess.stage !== 'unloading' && (
                        <button
                          className="btn-primary whitespace-nowrap"
                          onClick={() => handleAdvanceStage(selectedActiveProcess.id)}
                        >
                          <SkipForward className="w-4 h-4 mr-2" />
                          进入下一阶段
                        </button>
                      )}
                      <button
                        className="btn-secondary whitespace-nowrap"
                        onClick={() => {
                          if (confirm('确定要删除此流程记录吗？')) {
                            deleteFurnaceProcess(selectedActiveProcess.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        取消流程
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card mb-6">
                  <div className="text-center py-8">
                    <Play className="w-12 h-12 mx-auto text-neutral-muted mb-3" />
                    <p className="text-neutral-muted mb-4">当前没有进行中的火化流程</p>
                    <button
                      className="btn-primary"
                      onClick={openProcessModal}
                      disabled={selectedFurnace.status !== 'idle'}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      开始新的火化流程
                    </button>
                    {selectedFurnace.status !== 'idle' && (
                      <p className="text-xs text-yellow-600 mt-2">
                        当前火化炉状态为「{FurnaceStatusLabel[selectedFurnace.status]}」，无法开始新流程
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="card">
                <h3 className="font-serif text-lg font-semibold text-primary-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary-600" />
                  历史流程记录
                  <span className="text-sm font-normal text-neutral-muted ml-2">
                    共 {selectedAllProcesses.length} 条
                  </span>
                </h3>

                {selectedAllProcesses.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 mx-auto text-neutral-muted mb-3" />
                    <p className="text-neutral-muted">暂无历史记录</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-primary-100">
                          <th className="text-left px-4 py-3 text-xs font-medium text-neutral-muted">宠物名称</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-neutral-muted">状态</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-neutral-muted">目标温度</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-neutral-muted">操作员</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-neutral-muted">创建时间</th>
                          <th className="text-right px-4 py-3 text-xs font-medium text-neutral-muted">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAllProcesses
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .map(process => (
                            <tr
                              key={process.id}
                              className="border-b border-primary-50 hover:bg-primary-50/30 transition-colors"
                            >
                              <td className="px-4 py-3">
                                <p className="text-sm font-medium text-primary-800">{process.petName}</p>
                              </td>
                              <td className="px-4 py-3">
                                <span className={cn(
                                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                                  process.stage === 'unloading' || process.completedTime
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-orange-100 text-orange-700'
                                )}>
                                  <span className={cn('w-1.5 h-1.5 rounded-full', CremationProcessStageColor[process.stage])} />
                                  {CremationProcessStageLabel[process.stage]}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-neutral-text">{process.targetTemperature}°C</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-neutral-text">{process.operator || '-'}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-neutral-text">{formatDateTime(process.createdAt)}</span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                  onClick={() => {
                                    if (confirm('确定要删除此记录吗？')) {
                                      deleteFurnaceProcess(process.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="card">
                <h3 className="font-serif text-lg font-semibold text-primary-800 mb-4 flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-orange-500" />
                  阶段温度参考
                </h3>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm font-medium text-blue-800">入炉阶段</span>
                    </div>
                    <p className="text-xs text-blue-600">常温（~25°C），将宠物遗体放入炉膛</p>
                  </div>

                  <div className="p-3 rounded-lg bg-orange-50 border border-orange-100">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                      <span className="text-sm font-medium text-orange-800">升温阶段</span>
                    </div>
                    <p className="text-xs text-orange-600">逐步升温至目标温度（约45-60分钟）</p>
                  </div>

                  <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-sm font-medium text-red-800">恒温阶段</span>
                    </div>
                    <p className="text-xs text-red-600">保持目标温度（800-1000°C），充分火化</p>
                  </div>

                  <div className="p-3 rounded-lg bg-cyan-50 border border-cyan-100">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-cyan-500" />
                      <span className="text-sm font-medium text-cyan-800">降温阶段</span>
                    </div>
                    <p className="text-xs text-cyan-600">自然降温至安全温度（约60-90分钟）</p>
                  </div>

                  <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm font-medium text-green-800">出炉阶段</span>
                    </div>
                    <p className="text-xs text-green-600">温度低于100°C，取出骨灰冷却</p>
                  </div>
                </div>

                {selectedActiveProcess?.notes && (
                  <div className="mt-4 pt-4 border-t border-primary-100">
                    <p className="text-xs text-neutral-muted mb-1">流程备注</p>
                    <p className="text-sm text-neutral-text">{selectedActiveProcess.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {showFurnaceModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-semibold text-primary-800">
                {editingFurnaceId ? '编辑火化炉' : '添加火化炉'}
              </h3>
              <button
                className="p-2 rounded-lg text-neutral-muted hover:bg-primary-100 transition-colors"
                onClick={() => setShowFurnaceModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleFurnaceSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">设备名称 *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={furnaceForm.name}
                    onChange={(e) => setFurnaceForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="如：1号火化炉"
                    required
                  />
                </div>
                <div>
                  <label className="label-text">设备型号 *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={furnaceForm.model}
                    onChange={(e) => setFurnaceForm(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="如：PET-CR-2000A"
                    required
                  />
                </div>
                <div>
                  <label className="label-text">生产厂商 *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={furnaceForm.manufacturer}
                    onChange={(e) => setFurnaceForm(prev => ({ ...prev, manufacturer: e.target.value }))}
                    placeholder="设备生产厂家"
                    required
                  />
                </div>
                <div>
                  <label className="label-text">安装日期</label>
                  <input
                    type="date"
                    className="input-field"
                    value={furnaceForm.installDate}
                    onChange={(e) => setFurnaceForm(prev => ({ ...prev, installDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label-text">最高温度 (°C)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={furnaceForm.maxTemperature}
                    onChange={(e) => setFurnaceForm(prev => ({ ...prev, maxTemperature: Number(e.target.value) }))}
                    min={500}
                    max={2000}
                  />
                </div>
                <div>
                  <label className="label-text">设备状态</label>
                  <select
                    className="input-field"
                    value={furnaceForm.status}
                    onChange={(e) => setFurnaceForm(prev => ({ ...prev, status: e.target.value as Furnace['status'] }))}
                  >
                    {Object.entries(FurnaceStatusLabel).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-text">累计使用 (小时)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={furnaceForm.totalUsageHours}
                    onChange={(e) => setFurnaceForm(prev => ({ ...prev, totalUsageHours: Number(e.target.value) }))}
                    min={0}
                  />
                </div>
                <div>
                  <label className="label-text">下次维护日期</label>
                  <input
                    type="date"
                    className="input-field"
                    value={furnaceForm.nextMaintenanceDate}
                    onChange={(e) => setFurnaceForm(prev => ({ ...prev, nextMaintenanceDate: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="label-text">备注说明</label>
                <textarea
                  className="input-field min-h-[80px]"
                  value={furnaceForm.notes}
                  onChange={(e) => setFurnaceForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="设备相关备注信息..."
                />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  {editingFurnaceId ? '保存修改' : '添加设备'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowFurnaceModal(false)}
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMaintenanceModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-semibold text-primary-800">
                {editingMaintenanceId ? '编辑维护记录' : '新增维护记录'}
              </h3>
              <button
                className="p-2 rounded-lg text-neutral-muted hover:bg-primary-100 transition-colors"
                onClick={() => setShowMaintenanceModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">维护类型 *</label>
                  <select
                    className="input-field"
                    value={maintenanceForm.type}
                    onChange={(e) => setMaintenanceForm(prev => ({ ...prev, type: e.target.value as FurnaceMaintenance['type'] }))}
                  >
                    {Object.entries(MaintenanceTypeLabel).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-text">费用 (元)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={maintenanceForm.cost}
                    onChange={(e) => setMaintenanceForm(prev => ({ ...prev, cost: Number(e.target.value) }))}
                    min={0}
                  />
                </div>
              </div>
              <div>
                <label className="label-text">标题 *</label>
                <input
                  type="text"
                  className="input-field"
                  value={maintenanceForm.title}
                  onChange={(e) => setMaintenanceForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="如：炉膛深度清洁"
                  required
                />
              </div>
              <div>
                <label className="label-text">详细描述 *</label>
                <textarea
                  className="input-field min-h-[100px]"
                  value={maintenanceForm.description}
                  onChange={(e) => setMaintenanceForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="请详细描述维护内容..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">维护人员 *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={maintenanceForm.performedBy}
                    onChange={(e) => setMaintenanceForm(prev => ({ ...prev, performedBy: e.target.value }))}
                    placeholder="如：设备科-王工"
                    required
                  />
                </div>
                <div>
                  <label className="label-text">维护时间 *</label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={maintenanceForm.performedAt}
                    onChange={(e) => setMaintenanceForm(prev => ({ ...prev, performedAt: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="label-text">下次维护日期</label>
                  <input
                    type="date"
                    className="input-field"
                    value={maintenanceForm.nextDueDate}
                    onChange={(e) => setMaintenanceForm(prev => ({ ...prev, nextDueDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label-text">更换配件</label>
                  <input
                    type="text"
                    className="input-field"
                    value={maintenanceForm.partsUsed}
                    onChange={(e) => setMaintenanceForm(prev => ({ ...prev, partsUsed: e.target.value }))}
                    placeholder="如：过滤棉x2, 温度传感器x1"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  {editingMaintenanceId ? '保存修改' : '添加记录'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowMaintenanceModal(false)}
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProcessModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-semibold text-primary-800">
                开始火化流程
              </h3>
              <button
                className="p-2 rounded-lg text-neutral-muted hover:bg-primary-100 transition-colors"
                onClick={() => setShowProcessModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleProcessSubmit} className="space-y-4">
              <div>
                <label className="label-text">选择火化炉</label>
                <select
                  className="input-field"
                  value={processForm.furnaceId}
                  onChange={(e) => setProcessForm(prev => ({ ...prev, furnaceId: e.target.value }))}
                  disabled
                >
                  {furnaces.filter(f => f.status === 'idle').map(furnace => (
                    <option key={furnace.id} value={furnace.id}>
                      {furnace.name} ({furnace.model})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-text">宠物名称 *</label>
                <input
                  type="text"
                  className="input-field"
                  value={processForm.petName}
                  onChange={(e) => setProcessForm(prev => ({ ...prev, petName: e.target.value }))}
                  placeholder="请输入宠物名称"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">目标温度 (°C)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={processForm.targetTemperature}
                    onChange={(e) => setProcessForm(prev => ({ ...prev, targetTemperature: Number(e.target.value) }))}
                    min={600}
                    max={1200}
                  />
                </div>
                <div>
                  <label className="label-text">操作员</label>
                  <select
                    className="input-field"
                    value={processForm.operator}
                    onChange={(e) => setProcessForm(prev => ({ ...prev, operator: e.target.value }))}
                  >
                    <option value="">请选择操作员</option>
                    {operatorOptions.map(emp => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="label-text">备注说明</label>
                <textarea
                  className="input-field min-h-[80px]"
                  value={processForm.notes}
                  onChange={(e) => setProcessForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="如：宠物体重、特殊要求等..."
                />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  开始流程
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowProcessModal(false)}
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}