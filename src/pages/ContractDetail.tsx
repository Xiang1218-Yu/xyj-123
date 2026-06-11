import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FileText,
  ArrowLeft,
  Edit3,
  Send,
  Archive,
  User,
  Building2,
  Clock,
  CheckCircle2,
  Circle,
  XCircle,
  AlertCircle,
  PawPrint,
  Calendar,
  Hash,
  Download,
  PenLine
} from 'lucide-react';
import { useAppStore } from '@/store';
import {
  ContractTypeLabel,
  ContractStatusLabel,
  SignatoryRoleLabel,
  ContractTimelineActionLabel,
  type ContractStatus,
  type SignatoryRole
} from '@/shared/types';
import PageHeader from '@/components/PageHeader';
import SignaturePad from '@/components/SignaturePad';
import { cn } from '@/lib/utils';

const statusIcons: Record<ContractStatus, typeof Circle> = {
  draft: Circle,
  pending: Clock,
  signed: CheckCircle2,
  archived: Archive,
  cancelled: XCircle
};

const statusColors: Record<ContractStatus, string> = {
  draft: 'bg-neutral-100 text-neutral-text border-neutral-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  signed: 'bg-green-50 text-green-700 border-green-200',
  archived: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200'
};

const timelineIconBg: Record<string, string> = {
  created: 'bg-purple-100 text-purple-600',
  updated: 'bg-blue-100 text-blue-600',
  sent_for_signature: 'bg-amber-100 text-amber-600',
  signed: 'bg-green-100 text-green-600',
  all_signed: 'bg-emerald-100 text-emerald-600',
  archived: 'bg-indigo-100 text-indigo-600',
  cancelled: 'bg-red-100 text-red-600',
  viewed: 'bg-neutral-100 text-neutral-600'
};

export default function ContractDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    getContractById,
    getOwnerById,
    getPetById,
    getContractTemplateById,
    getSignaturesByContractId,
    getTimelineByContractId,
    sendContractForSignature,
    addContractSignature,
    autoArchiveContract,
    fillTemplateVariables
  } = useAppStore();

  const contract = id ? getContractById(id) : undefined;
  const owner = contract?.ownerId ? getOwnerById(contract.ownerId) : undefined;
  const pet = contract?.petId ? getPetById(contract.petId) : undefined;
  const template = contract?.templateId ? getContractTemplateById(contract.templateId) : undefined;
  const signatures = contract ? getSignaturesByContractId(contract.id) : [];
  const timeline = contract ? getTimelineByContractId(contract.id) : [];

  const [showSignPad, setShowSignPad] = useState(false);
  const [currentSignRole, setCurrentSignRole] = useState<SignatoryRole>('customer');

  const displayContent = useMemo(() => {
    if (!contract || !template) return '';
    if (contract.content) return contract.content;
    const vars: Record<string, string> = {
      contractNo: contract.contractNo,
      ownerName: owner?.name || '',
      ownerPhone: owner?.phone || '',
      ownerAddress: owner?.address || '',
      petName: pet?.name || '',
      petBreed: pet?.breed || '',
      petAge: pet?.age || '',
      petGender: pet?.gender === 'male' ? '公' : '母',
      totalAmount: String(contract.totalAmount)
    };
    return fillTemplateVariables(template.content, vars);
  }, [contract, template, owner, pet, fillTemplateVariables]);

  const hasCustomerSigned = useMemo(
    () => signatures.some((s) => s.signatoryRole === 'customer'),
    [signatures]
  );
  const hasCompanySigned = useMemo(
    () => signatures.some((s) => s.signatoryRole === 'company'),
    [signatures]
  );

  const handleStartSign = (role: SignatoryRole) => {
    setCurrentSignRole(role);
    setShowSignPad(true);
  };

  const handleSaveSignature = (signatureData: string) => {
    if (!contract) return;
    const signatoryName =
      currentSignRole === 'customer'
        ? owner?.name || '客户'
        : currentSignRole === 'company'
        ? '永恒宠物纪念服务中心'
        : '见证人';
    addContractSignature({
      contractId: contract.id,
      signatoryName,
      signatoryRole: currentSignRole,
      signatureData,
      ipAddress: '127.0.0.1'
    });
    setShowSignPad(false);
  };

  const handleSendSignature = () => {
    if (!contract) return;
    sendContractForSignature(contract.id, '管理员');
  };

  const handleArchive = () => {
    if (!contract) return;
    if (confirm('确认将此合同归档？归档后将无法修改。')) {
      autoArchiveContract(contract.id, '管理员手动归档');
    }
  };

  const handleDownloadPDF = () => {
    if (!contract) return;
    const content = `合同编号：${contract.contractNo}\n\n${displayContent}\n\n\n--- 签名信息 ---\n${signatures.map((s) => `${SignatoryRoleLabel[s.signatoryRole]}：${s.signatoryName}，签署时间：${new Date(s.signedAt).toLocaleString('zh-CN')}`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contract.contractNo}-${contract.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (!contract) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="合同详情"
          description="查看合同详情、签署状态和时间线"
          icon={FileText}
          actions={
            <button
              onClick={() => navigate('/contracts')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-text hover:bg-neutral-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </button>
          }
        />
        <div className="bg-white rounded-2xl shadow-card border border-primary-100 p-16 text-center">
          <AlertCircle className="w-16 h-16 text-neutral-muted mx-auto mb-4" />
          <p className="text-lg text-neutral-text">合同不存在或已被删除</p>
        </div>
      </div>
    );
  }

  const StatusIcon = statusIcons[contract.status];

  return (
    <div className="space-y-6">
      <PageHeader
        title="合同详情"
        description={`${contract.title} - ${contract.contractNo}`}
        icon={FileText}
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/contracts')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-text hover:bg-neutral-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </button>
            {contract.status === 'draft' && (
              <button
                onClick={() => navigate(`/contracts/${contract.id}/edit`)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary-300 text-primary-800 hover:bg-primary-50 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                编辑合同
              </button>
            )}
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-text hover:bg-neutral-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              下载合同
            </button>
            {contract.status === 'signed' && (
              <button
                onClick={handleArchive}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md"
              >
                <Archive className="w-4 h-4" />
                归档合同
              </button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-card border border-primary-100 overflow-hidden">
            <div className="p-6 border-b border-primary-100 bg-gradient-to-r from-primary-50 via-white to-amber-50">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-primary-900">{contract.title}</h2>
                    <span className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border',
                      statusColors[contract.status]
                    )}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {ContractStatusLabel[contract.status]}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Hash className="w-4 h-4" />
                      {contract.contractNo}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      {ContractTypeLabel[contract.type]}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      创建于 {formatDate(contract.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-muted">合同总金额</p>
                  <p className="text-3xl font-bold text-primary-900 mt-1">
                    ¥{contract.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border-b border-primary-50 bg-white">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-50/50">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary-700" />
                </div>
                <div>
                  <p className="text-xs text-neutral-muted mb-1">客户信息</p>
                  <p className="font-semibold text-primary-900">{owner?.name || '-'}</p>
                  <p className="text-sm text-neutral-muted mt-0.5">{owner?.phone || '-'}</p>
                  {owner?.address && (
                    <p className="text-xs text-neutral-muted mt-1">{owner.address}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/50">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <PawPrint className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-xs text-neutral-muted mb-1">宠物信息</p>
                  <p className="font-semibold text-primary-900">{pet?.name || '-'}</p>
                  <p className="text-sm text-neutral-muted mt-0.5">
                    {pet?.breed || '-'} · {pet?.age || '-'} · {pet?.gender === 'male' ? '公' : '母'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 max-h-[500px] overflow-y-auto bg-gradient-to-b from-white to-primary-50/20">
              <div className="bg-white border-2 border-primary-100 rounded-xl p-8 shadow-sm">
                <pre className="whitespace-pre-wrap font-serif text-[15px] leading-8 text-neutral-text">
                  {displayContent || '（暂无合同内容）'}
                </pre>
              </div>
            </div>
          </div>

          {!showSignPad ? (
            <div className="bg-white rounded-2xl shadow-card border border-primary-100 overflow-hidden">
              <div className="p-6 border-b border-primary-100 bg-gradient-to-r from-green-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                      <PenLine className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-primary-900">签署区</h3>
                  </div>
                  {contract.status === 'draft' && (
                    <button
                      onClick={handleSendSignature}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors text-sm font-medium shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                      发送签署
                    </button>
                  )}
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={cn(
                  'p-6 rounded-xl border-2 transition-all',
                  hasCompanySigned
                    ? 'border-green-200 bg-green-50/50'
                    : 'border-dashed border-neutral-200 bg-neutral-50/30'
                )}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Building2 className={cn('w-5 h-5', hasCompanySigned ? 'text-green-600' : 'text-neutral-muted')} />
                      <span className="font-semibold text-primary-900">公司代表签署</span>
                    </div>
                    {hasCompanySigned ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-neutral-muted" />
                    )}
                  </div>
                  {hasCompanySigned ? (
                    <div>
                      <div className="bg-white rounded-lg p-4 border border-green-200 mb-3">
                        <img
                          src={signatures.find((s) => s.signatoryRole === 'company')?.signatureData}
                          alt="公司签名"
                          className="h-16 max-w-full object-contain mx-auto"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        {!signatures.find((s) => s.signatoryRole === 'company')?.signatureData?.startsWith('data:image') && (
                          <div className="h-16 flex items-center justify-center text-green-700 font-serif text-xl italic">
                            永恒宠物纪念服务中心（公章）
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-neutral-muted text-center">
                        {signatures.find((s) => s.signatoryRole === 'company')?.signatoryName}
                        <br />
                        签署于 {formatDate(signatures.find((s) => s.signatoryRole === 'company')?.signedAt || '')}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartSign('company')}
                      disabled={contract.status === 'archived' || contract.status === 'cancelled' || contract.status === 'draft'}
                      className="w-full py-8 rounded-xl border-2 border-dashed border-primary-300 text-primary-700 hover:bg-primary-50 hover:border-primary-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                    >
                      <PenLine className="w-6 h-6 mx-auto mb-2" />
                      点击签署
                    </button>
                  )}
                </div>

                <div className={cn(
                  'p-6 rounded-xl border-2 transition-all',
                  hasCustomerSigned
                    ? 'border-green-200 bg-green-50/50'
                    : 'border-dashed border-neutral-200 bg-neutral-50/30'
                )}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <User className={cn('w-5 h-5', hasCustomerSigned ? 'text-green-600' : 'text-neutral-muted')} />
                      <span className="font-semibold text-primary-900">客户签署</span>
                    </div>
                    {hasCustomerSigned ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-neutral-muted" />
                    )}
                  </div>
                  {hasCustomerSigned ? (
                    <div>
                      <div className="bg-white rounded-lg p-4 border border-green-200 mb-3">
                        <img
                          src={signatures.find((s) => s.signatoryRole === 'customer')?.signatureData}
                          alt="客户签名"
                          className="h-16 max-w-full object-contain mx-auto"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        {!signatures.find((s) => s.signatoryRole === 'customer')?.signatureData?.startsWith('data:image') && (
                          <div className="h-16 flex items-center justify-center text-green-700 font-serif text-xl italic">
                            {owner?.name || '客户'}（签名）
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-neutral-muted text-center">
                        {signatures.find((s) => s.signatoryRole === 'customer')?.signatoryName}
                        <br />
                        签署于 {formatDate(signatures.find((s) => s.signatoryRole === 'customer')?.signedAt || '')}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartSign('customer')}
                      disabled={contract.status === 'archived' || contract.status === 'cancelled' || contract.status === 'draft'}
                      className="w-full py-8 rounded-xl border-2 border-dashed border-primary-300 text-primary-700 hover:bg-primary-50 hover:border-primary-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                    >
                      <PenLine className="w-6 h-6 mx-auto mb-2" />
                      点击签署
                    </button>
                  )}
                </div>
              </div>

              {(contract.status === 'signed' || contract.status === 'archived') && (
                <div className="p-4 border-t border-primary-100 bg-green-50/50 text-center">
                  <p className="inline-flex items-center gap-2 text-green-700 font-medium">
                    <CheckCircle2 className="w-5 h-5" />
                    合同已完成全部签署，{contract.status === 'archived' ? '已归档' : '待归档'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <SignaturePad
              signatoryName={
                currentSignRole === 'customer'
                  ? owner?.name || '客户'
                  : currentSignRole === 'company'
                  ? '永恒宠物纪念服务中心'
                  : '见证人'
              }
              signatoryRoleLabel={SignatoryRoleLabel[currentSignRole]}
              onSave={handleSaveSignature}
              onCancel={() => setShowSignPad(false)}
            />
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card border border-primary-100 overflow-hidden sticky top-6">
            <div className="p-6 border-b border-primary-100 bg-gradient-to-r from-purple-50 to-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-primary-900">状态时间线</h3>
              </div>
            </div>
            <div className="p-6 max-h-[560px] overflow-y-auto">
              {timeline.length === 0 ? (
                <div className="text-center py-8 text-neutral-muted">
                  暂无操作记录
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary-200 via-purple-200 to-green-200" />
                  <div className="space-y-6">
                    {[...timeline].reverse().map((entry, idx) => (
                      <div key={entry.id} className="relative pl-12">
                        <div className={cn(
                          'absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center shadow-sm border-2 border-white',
                          timelineIconBg[entry.action] || 'bg-neutral-100 text-neutral-600'
                        )}>
                          <span className="font-bold text-xs">
                            {timeline.length - idx}
                          </span>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-primary-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="font-semibold text-sm text-primary-900">
                              {ContractTimelineActionLabel[entry.action]}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-text mb-2">{entry.description}</p>
                          <div className="flex items-center justify-between text-xs text-neutral-muted">
                            <span className="inline-flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {entry.operator}
                            </span>
                            <span>{formatDate(entry.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
