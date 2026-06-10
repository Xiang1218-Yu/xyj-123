import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  PawPrint,
  HeartHandshake,
  Flame,
  Archive,
  CalendarCheck,
  Bell,
  Plus,
  ChevronRight,
  Clock,
  MapPin,
  Users,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useAppStore } from '@/store';

export default function Dashboard() {
  const pets = useAppStore((state) => state.pets);
  const ceremonies = useAppStore((state) => state.ceremonies);
  const cremations = useAppStore((state) => state.cremations);
  const urns = useAppStore((state) => state.urns);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayCeremonies = ceremonies.filter(
      (c) => new Date(c.ceremonyTime).toISOString().split('T')[0] === today
    );
    const pendingCremations = cremations.filter((c) => c.status === 'pending');
    const storedUrns = urns.filter((u) => u.status === 'stored');

    return {
      petCount: pets.length,
      todayCeremonyCount: todayCeremonies.length,
      pendingCremationCount: pendingCremations.length,
      storedUrnCount: storedUrns.length,
    };
  }, [pets, ceremonies, cremations, urns]);

  const todayCeremonies = useMemo(() => {
    return [...ceremonies]
      .sort(
        (a, b) =>
          new Date(a.ceremonyTime).getTime() - new Date(b.ceremonyTime).getTime()
      )
      .slice(0, 5);
  }, [ceremonies]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-accent/20 text-primary-800',
      'in-progress': 'bg-primary-100 text-primary-800',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    const labels: Record<string, string> = {
      pending: '待举行',
      'in-progress': '进行中',
      completed: '已完成',
      cancelled: '已取消',
    };
    return (
      <span className={`status-badge ${styles[status] || styles.pending}`}>
        {labels[status] || '未知'}
      </span>
    );
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getPetName = (petId: string) => {
    const pet = pets.find((p) => p.id === petId);
    return pet?.name || '未知';
  };

  const statCards = [
    {
      label: '在管宠物数',
      value: stats.petCount,
      icon: PawPrint,
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-800',
      iconBg: 'bg-primary-100',
    },
    {
      label: '今日仪式数',
      value: stats.todayCeremonyCount,
      icon: HeartHandshake,
      bgColor: 'bg-accent/10',
      iconColor: 'text-accent-dark',
      iconBg: 'bg-accent/20',
    },
    {
      label: '待火化数',
      value: stats.pendingCremationCount,
      icon: Flame,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
    },
    {
      label: '存放骨灰盒数',
      value: stats.storedUrnCount,
      icon: Archive,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
  ];

  const quickActions = [
    {
      title: '新增宠物',
      description: '录入宠物档案信息',
      icon: Plus,
      to: '/pets/new',
      color: 'bg-primary-50 text-primary-800',
      iconBg: 'bg-primary-100',
    },
    {
      title: '安排仪式',
      description: '创建告别仪式日程',
      icon: HeartHandshake,
      to: '/ceremonies/new',
      color: 'bg-accent/10 text-accent-dark',
      iconBg: 'bg-accent/20',
    },
    {
      title: '设置提醒',
      description: '纪念日与重要事项',
      icon: Bell,
      to: '/reminders',
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      title: '查看预约',
      description: '主人远程预约列表',
      icon: CalendarCheck,
      to: '/appointments',
      color: 'bg-green-50 text-green-700',
      iconBg: 'bg-green-100',
    },
  ];

  return (
    <div>
      <PageHeader
        title="管理中心"
        description="今日概览与快捷操作"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map(({ label, value, icon: Icon, bgColor, iconColor, iconBg }) => (
          <div
            key={label}
            className={`card ${bgColor} border-0`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-muted mb-1">{label}</p>
                <p className="text-3xl font-bold font-serif text-primary-900">
                  {value}
                </p>
              </div>
              <div className={`w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center`}>
                <Icon className={`w-7 h-7 ${iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-primary-900">
                  今日日程
                </h2>
                <p className="text-sm text-neutral-muted mt-1">
                  近期告别仪式时间安排
                </p>
              </div>
              <Link
                to="/ceremonies"
                className="inline-flex items-center text-sm font-medium text-primary-800 hover:text-primary-700 transition-colors"
              >
                查看全部
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {todayCeremonies.length === 0 ? (
              <div className="text-center py-12">
                <CalendarCheck className="w-12 h-12 text-primary-300 mx-auto mb-3" />
                <p className="text-neutral-muted">暂无仪式安排</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-primary-100" />
                <div className="space-y-6">
                  {todayCeremonies.map((ceremony) => (
                    <div key={ceremony.id} className="relative flex gap-4">
                      <div className="relative z-10 w-11 h-11 rounded-full bg-white border-2 border-primary-200 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-primary-700" />
                      </div>
                      <div className="flex-1 bg-primary-50/50 rounded-xl p-4 border border-primary-100">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg font-serif font-bold text-primary-900">
                                {formatTime(ceremony.ceremonyTime)}
                              </span>
                              <span className="text-xs text-neutral-muted">
                                {formatDate(ceremony.ceremonyTime)}
                              </span>
                            </div>
                            <p className="font-medium text-primary-800">
                              {getPetName(ceremony.petId)} 的告别仪式
                            </p>
                          </div>
                          {getStatusBadge(ceremony.status)}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-neutral-muted">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            <span>{ceremony.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            <span>{ceremony.participants}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="card">
            <div className="mb-6">
              <h2 className="font-serif text-xl font-bold text-primary-900">
                快捷操作
              </h2>
              <p className="text-sm text-neutral-muted mt-1">
                常用功能快速入口
              </p>
            </div>
            <div className="space-y-3">
              {quickActions.map(({ title, description, icon: Icon, to, color, iconBg }) => (
                <Link
                  key={title}
                  to={to}
                  className="flex items-center gap-4 p-4 rounded-xl border border-primary-100 hover:border-primary-300 hover:shadow-card-hover transition-all duration-200 group"
                >
                  <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${color.split(' ')[1]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary-900 group-hover:text-primary-800">
                      {title}
                    </p>
                    <p className="text-sm text-neutral-muted truncate">
                      {description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-primary-300 group-hover:text-primary-600 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
