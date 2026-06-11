import { ReactNode, ComponentType } from "react";
import { LucideProps } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  icon?: ComponentType<LucideProps>;
}

export default function PageHeader({ title, description, actions, icon: Icon }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center shadow-lg shadow-primary-200 flex-shrink-0">
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary-900 mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-neutral-muted">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
