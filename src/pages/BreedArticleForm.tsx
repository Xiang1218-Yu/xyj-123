import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  FileText,
  Tag,
  User,
  Image,
  Type,
  AlignLeft,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Info,
  LucideIcon
} from 'lucide-react';
import { useAppStore } from '@/store';
import {
  ArticleTypeLabel,
  type BreedArticle
} from '@/shared/types';

const articleTypes: BreedArticle['articleType'][] = [
  'care',
  'health',
  'training',
  'diet',
  'behavior',
  'history',
  'other'
];

interface InputFieldProps {
  icon: LucideIcon;
  label: string;
  field: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  rows?: number;
  multiline?: boolean;
  value: string;
  error?: string;
  inputId?: string;
  onChange: (field: string, value: string) => void;
}

function InputField({
  icon: Icon,
  label,
  field,
  type = 'text',
  placeholder,
  required,
  rows,
  multiline = false,
  value,
  error,
  inputId,
  onChange
}: InputFieldProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(field, e.target.value);
  };

  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-primary-900 mb-2">
        <Icon className="w-4 h-4 text-primary-600" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {multiline ? (
        <textarea
          id={inputId}
          rows={rows ?? 4}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className={`input-field resize-none font-mono text-sm leading-relaxed ${
            error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
          }`}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className={`input-field ${
            error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
          }`}
        />
      )}
      {error && (
        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}

type FormData = {
  title: string;
  summary: string;
  content: string;
  author: string;
  articleType: BreedArticle['articleType'];
  coverImage: string;
};

export default function BreedArticleForm() {
  const { id, articleId } = useParams<{ id: string; articleId?: string }>();
  const navigate = useNavigate();
  const {
    getPetBreedById,
    getBreedArticleById,
    addBreedArticle,
    updateBreedArticle
  } = useAppStore();

  const isEditing = !!articleId;
  const breed = id ? getPetBreedById(id) : undefined;
  const existingArticle = articleId ? getBreedArticleById(articleId) : undefined;

  const [formData, setFormData] = useState<FormData>({
    title: '',
    summary: '',
    content: '',
    author: '',
    articleType: 'care',
    coverImage: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (existingArticle) {
      setFormData({
        title: existingArticle.title,
        summary: existingArticle.summary ?? '',
        content: existingArticle.content,
        author: existingArticle.author ?? '',
        articleType: existingArticle.articleType,
        coverImage: existingArticle.coverImage ?? ''
      });
    }
  }, [existingArticle]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = '请输入文章标题';
    if (!formData.content.trim()) newErrors.content = '请输入文章内容';
    if (formData.title.trim().length < 2) newErrors.title = '标题至少需要2个字符';
    if (formData.content.trim().length < 10) newErrors.content = '文章内容至少需要10个字符';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !id || !breed) return;

    try {
      if (isEditing && articleId) {
        updateBreedArticle(articleId, formData);
      } else {
        addBreedArticle({
          ...formData,
          breedId: id
        });
      }
      setShowSuccess(true);
      setTimeout(() => {
        navigate(`/breeds/${id}`);
      }, 800);
    } catch (err) {
      console.error('保存文章失败:', err);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const insertMarkdown = (prefix: string, placeholder = '') => {
    const textarea = document.getElementById('content-input') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = formData.content.substring(0, start);
    const selected = formData.content.substring(start, end) || placeholder;
    const after = formData.content.substring(end);
    const newValue = before + prefix + selected + after;
    handleChange('content', newValue);
    setTimeout(() => {
      textarea.focus();
      const pos = before.length + prefix.length + selected.length;
      textarea.setSelectionRange(pos, pos);
    }, 0);
  };

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

  if (isEditing && !existingArticle) {
    return (
      <div>
        <Link to={`/breeds/${id}`} className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 mb-6">
          <ArrowLeft className="w-4 h-4" />
          返回品种详情
        </Link>
        <div className="card text-center py-16">
          <AlertCircle className="w-16 h-16 mx-auto text-primary-300 mb-4" />
          <p className="text-neutral-muted text-lg">文章不存在或已被删除</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to={`/breeds/${id}`} className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" />
          返回「{breed.name}」详情
        </Link>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-primary-100">
            <div>
              <div className="flex items-center gap-2 text-sm text-neutral-muted mb-1.5">
                <BookOpen className="w-4 h-4" />
                品种知识库 / {breed.name}
              </div>
              <h1 className="font-serif text-2xl font-bold text-primary-900">
                {isEditing ? '编辑知识文章' : '新增知识文章'}
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
              <FileText className="w-3.5 h-3.5" />
              支持 Markdown 格式
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <InputField
                  icon={Type}
                  label="文章标题"
                  field="title"
                  placeholder="例如：金毛寻回犬日常护理全指南"
                  required
                  value={formData.title}
                  error={errors.title}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <InputField
                  icon={AlignLeft}
                  label="文章摘要"
                  field="summary"
                  placeholder="简要描述文章内容，会显示在文章卡片和阅读页顶部（可选）"
                  multiline
                  rows={2}
                  value={formData.summary}
                  error={errors.summary}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-primary-900 mb-2">
                  <Tag className="w-4 h-4 text-primary-600" />
                  文章类型
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {articleTypes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleChange('articleType', t)}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        formData.articleType === t
                          ? 'bg-primary-800 text-white shadow-sm'
                          : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                      }`}
                    >
                      {ArticleTypeLabel[t]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <InputField
                  icon={User}
                  label="作者"
                  field="author"
                  placeholder="例如：宠物医师-李医生（可选）"
                  value={formData.author}
                  error={errors.author}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <InputField
                  icon={Image}
                  label="封面图片 URL"
                  field="coverImage"
                  placeholder="粘贴图片链接（可选，会显示在文章卡片和阅读页顶部）"
                  value={formData.coverImage}
                  error={errors.coverImage}
                  onChange={handleChange}
                />
                {formData.coverImage && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-primary-100 max-h-48 bg-primary-50">
                    <img
                      src={formData.coverImage}
                      alt="封面预览"
                      className="w-full h-full object-cover max-h-48"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-primary-900">
                    <FileText className="w-4 h-4 text-primary-600" />
                    正文内容
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => insertMarkdown('## ', '章节标题')}
                      className="px-2 py-1 text-xs rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors font-medium"
                      title="插入二级标题"
                    >
                      标题
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('- ', '列表项')}
                      className="px-2 py-1 text-xs rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors font-medium"
                      title="插入列表项"
                    >
                      列表
                    </button>
                    <div className="flex items-center gap-1 ml-2 px-2 py-1 text-xs text-neutral-muted bg-primary-50/50 rounded-lg">
                      <Info className="w-3.5 h-3.5" />
                      {formData.content.length} 字
                    </div>
                  </div>
                </div>
                <InputField
                  icon={FileText}
                  label=""
                  field="content"
                  placeholder={`用 Markdown 格式撰写文章内容...\n\n示例：\n## 章节标题\n\n这是一段正文内容。\n\n- 要点一\n- 要点二\n- 要点三`}
                  multiline
                  rows={16}
                  required
                  inputId="content-input"
                  value={formData.content}
                  error={errors.content}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-primary-100 -mx-6 px-6">
              <Link
                to={`/breeds/${id}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-neutral-text bg-white border border-primary-200 hover:bg-primary-50 transition-colors"
              >
                取消
              </Link>
              <div className="flex items-center gap-3">
                {showSuccess && (
                  <span className="flex items-center gap-1.5 text-sm text-green-600 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    保存成功！
                  </span>
                )}
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium bg-primary-800 text-white hover:bg-primary-900 shadow-md hover:shadow-lg transition-all"
                >
                  <Save className="w-4 h-4" />
                  {isEditing ? '保存修改' : '发布文章'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
