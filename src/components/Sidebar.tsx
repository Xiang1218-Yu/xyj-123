import { NavLink } from "react-router-dom";
import {
  House,
  PawPrint,
  HeartHandshake,
  Flame,
  Archive,
  CalendarCheck,
  Bell,
  Package,
  Images,
  Users,
  Calendar,
  ClipboardCheck,
  BarChart3,
  BookOpen,
  FileSignature,
  ScrollText,
  ShoppingBag,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "仪表盘", icon: House },
  { to: "/breeds", label: "品种知识库", icon: BookOpen },
  { to: "/pets", label: "宠物档案", icon: PawPrint },
  { to: "/albums", label: "纪念相册", icon: Images },
  { to: "/life-stories", label: "生命故事", icon: ScrollText },
  { to: "/packages", label: "套餐管理", icon: Package },
  { to: "/contracts", label: "电子合同", icon: FileSignature },
  { to: "/ceremonies", label: "告别仪式", icon: HeartHandshake },
  { to: "/cremations", label: "火化管理", icon: Flame },
  { to: "/urns", label: "骨灰存放", icon: Archive },
  { to: "/memorial-shop", label: "祭祀用品商城", icon: ShoppingBag },
  { to: "/memorial-orders", label: "用品订单", icon: ClipboardList },
  { to: "/appointments", label: "主人预约", icon: CalendarCheck },
  { to: "/reminders", label: "纪念日提醒", icon: Bell },
  { to: "/employees", label: "员工信息", icon: Users },
  { to: "/shifts", label: "排班日历", icon: Calendar },
  { to: "/leaves", label: "请假审批", icon: ClipboardCheck },
  { to: "/attendance", label: "出勤统计", icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-primary-200 shadow-card flex flex-col">
      <div className="h-20 flex items-center justify-center border-b border-primary-100 px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-800 flex items-center justify-center">
            <PawPrint className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-primary-900">宠物纪念</h1>
            <p className="text-xs text-neutral-muted">永恒的回忆</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary-800 text-white shadow-md"
                  : "text-neutral-text hover:bg-primary-50 hover:text-primary-800"
              )
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-primary-100">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-50">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
            <PawPrint className="w-4 h-4 text-primary-900" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary-900">管理员</p>
            <p className="text-xs text-neutral-muted">admin@petmemorial.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
