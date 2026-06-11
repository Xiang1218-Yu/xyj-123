import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FileText,
  ArrowLeft,
  Save,
  Send,
  Eye,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '@/store';
import { ContractTypeLabel, type ContractType } from '@/shared/types';
import PageHeader from '@/components/PageHeader';
import { cn } from '@/lib/utils';

export default function ContractForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const {
    contractTemplates,
    pets,
    owners,
    addContract,
    updateContract,
    getContractById,
    generateContractNo,
    fillTemplateVariables,
    sendContractForSignature
  } = useAppStore();

  const existingContract = id ? getContractById(id) : null;

  const [templateId, setTemplateId] = useState(existingContract?.templateId || '');
  const [type, setType] = useState<ContractType>(existingContract?.type || 'cremation');
  const [title, setTitle] = useState(existingContract?.title || '');
  const [petId, setPetId] = useState(existingContract?.petId || '');
  const [ownerId, setOwnerId] = useState(existingContract?.ownerId || '');
  const [totalAmount, setTotalAmount] = useState(existingContract?.totalAmount || 0);
  const [variables, setVariables] = useState<Record<string, string>>({});

  const selectedTemplate = useMemo(
    () => contractTemplates.find((t) => t.id === templateId),
    [contractTemplates, templateId]
  );

  const selectedPet = useMemo(() => pets.find((p) => p.id === petId), [pets, petId]);
  const selectedOwner = useMemo(() => owners.find((o) => o.id === ownerId), [owners, ownerId]);

  useEffect(() => {
    if (selectedTemplate) {
      const vars: Record<string, string> = {};
      selectedTemplate.variables.forEach((v) => {
        vars[v.key] = v.defaultValue || '';
      });
      vars.contractNo = generateContractNo();
      if (selectedOwner) {
        vars.ownerName = selectedOwner.name;
        vars.ownerPhone = selectedOwner.phone;
        vars.ownerAddress = selectedOwner.address || '';
      }
      if (selectedPet) {
        vars.petName = selectedPet.name;
        vars.petBreed = selectedPet.breed;
        vars.petAge = selectedPet.age;
        vars.petGender = selectedPet.gender === 'male' ? '公' : '母';
      }
      if (totalAmount > 0) {
        vars.totalAmount = String(totalAmount);
      }
      setVariables(vars);
      if (!title && selectedTemplate) {
        setTitle(selectedTemplate.name.replace('（标准版）', ''));
      }
    }
  }, [selectedTemplate, selectedOwner, selectedPet]);

  const activeTemplates = useMemo(
    () => contractTemplates.filter((t) => t.isActive && t.type === type),
    [contractTemplates, type]
  );

  const previewContent = useMemo(() => {
    if (!selectedTemplate) return '';
    return fillTemplateVariables(selectedTemplate.content, variables);
  }, [selectedTemplate, variables, fillTemplateVariables]);

  const handleSave = () => {
    if (!templateId) {
      alert('请选择合同模板');
      return;
    }
    if (!title || !petId || !ownerId) {
      alert('请填写合同标题、关联宠物和客户信息');
      return;
    }

    if (isEdit && existingContract) {
      updateContract(existingContract.id, {
        templateId,
        type,
        title,
        petId,
        ownerId,
        totalAmount,
        content: previewContent
      });
      navigate(`/contracts/${existingContract.id}`);
    } else {
      const contractNo = variables.contractNo || generateContractNo();
      const newContract = addContract({
        contractNo,
        templateId,
        type,
        title,
        content: previewContent,
        petId,
        ownerId,
        status: 'draft',
        totalAmount
      });
      navigate(`/contracts/${newContract.id}`);
    }
  };

  const handleSaveAndSend = () => {
    if (!templateId || !title || !petId || !ownerId) {
      alert('请填写完整合同信息');
      return;
    }
    const contractNo = variables.contractNo || generateContractNo();
    const newContract = addContract({
      contractNo,
      templateId,
      type,
      title,
      content: previewContent,
      petId,
      ownerId,
      status: 'pending',
      totalAmount
    });
    sendContractForSignature(newContract.id, '管理员');
    navigate(`/contracts/${newContract.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? '编辑合同' : '新建合同'}
        description="选择合同模板，填写服务信息生成电子合同"
        icon={FileText}
        actions={
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-text hover:bg-neutral-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回列表
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card border border-primary-100 overflow-hidden">
            <div className="p-6 border-b border-primary-100 bg-gradient-to-r from-primary-50 to-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-800 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-primary-900">基本信息</h3>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-text mb-2">
                    合同类型 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value as ContractType);
                      setTemplateId('');
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white"
                  >
                    <option value="cremation">火化服务合同</option>
                    <option value="ceremony">告别仪式合同</option>
                    <option value="comprehensive">综合服务合同</option>
                    <option value="urn-storage">骨灰存放合同</option>
                    <option value="transport">接送服务合同</option>
                    <option value="other">其他服务合同</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-text mb-2">
                    选择模板 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={templateId}
                    onChange={(e) => setTemplateId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white"
                  >
                    <option value="">请选择模板</option>
                    {activeTemplates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} (v{t.version})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-text mb-2">
                  合同标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="如：豆豆火化服务合同"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-text mb-2">
                    关联客户 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white"
                  >
                    <option value="">请选择客户</option>
                    {owners.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} - {o.phone}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-text mb-2">
                    关联宠物 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={petId}
                    onChange={(e) => setPetId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white"
                  >
                    <option value="">请选择宠物</option>
                    {pets
                      .filter((p) => !ownerId || p.ownerId === ownerId)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}（{p.breed}）
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-text mb-2">
                  合同总金额（元）
                </label>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTotalAmount(val);
                    setVariables((prev) => ({ ...prev, totalAmount: String(val) }));
                  }}
                  min={0}
                  step={100}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {selectedTemplate && (
            <div className="bg-white rounded-2xl shadow-card border border-primary-100 overflow-hidden">
              <div className="p-6 border-b border-primary-100 bg-gradient-to-r from-amber-50 to-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-primary-900">
                    合同变量（自动填充到模板）
                  </h3>
                </div>
                <p className="text-sm text-neutral-muted mt-1">
                  模板：{selectedTemplate.name}，共 {selectedTemplate.variables.length} 个变量
                </p>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {selectedTemplate.variables.map((v) => (
                  <div key={v.key}>
                    <label className="block text-sm font-medium text-neutral-text mb-1.5">
                      {v.label}
                      {v.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={variables[v.key] || ''}
                      onChange={(e) =>
                        setVariables((prev) => ({ ...prev, [v.key]: e.target.value }))
                      }
                      placeholder={`请输入${v.label}`}
                      className={cn(
                        'w-full px-3.5 py-2 rounded-lg border text-sm focus:ring-2 outline-none transition-all',
                        v.key === 'contractNo'
                          ? 'bg-neutral-50 border-neutral-200 text-neutral-muted'
                          : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-100'
                      )}
                      readOnly={v.key === 'contractNo'}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-card border border-primary-100 p-6">
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border-2 border-primary-800 text-primary-800 hover:bg-primary-50 transition-colors font-semibold"
              >
                <Save className="w-5 h-5" />
                保存为草稿
              </button>
              <button
                onClick={handleSaveAndSend}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-800 text-white hover:bg-primary-900 transition-colors font-semibold shadow-md"
              >
                <Send className="w-5 h-5" />
                保存并发送签署
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-primary-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-primary-100 bg-gradient-to-r from-blue-50 to-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-primary-900">合同预览</h3>
            </div>
            <span className="text-xs text-neutral-muted px-3 py-1 rounded-full bg-blue-100 text-blue-700">
              {ContractTypeLabel[type]}
            </span>
          </div>
          <div className="flex-1 p-8 max-h-[calc(100vh-280px)] overflow-y-auto bg-white/50">
            {selectedTemplate ? (
              <div className="bg-white border-2 border-dashed border-primary-200 rounded-xl p-8 shadow-inner">
                <pre className="whitespace-pre-wrap font-serif text-sm leading-7 text-neutral-text">
                  {previewContent || '请填写合同变量后预览内容'}
                </pre>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-neutral-muted py-20">
                <FileText className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg">请先选择合同模板</p>
                <p className="text-sm mt-2">选择模板后可在此预览合同完整内容</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
