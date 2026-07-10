import { Bell, ChevronDown, ShieldCheck, LucideIcon } from "lucide-react";

type DashboardTopbarProps = {
  breadcrumb: string[];
  userName?: string;
  userRole?: string;
  userIcon?: LucideIcon;
};

export default function DashboardTopbar({
  breadcrumb,
  userName = "Admin User",
  userRole = "Hospital Administrator",
  userIcon: UserIcon = ShieldCheck,
}: DashboardTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-150 bg-white/90 px-6 backdrop-blur">
      <nav className="flex items-center gap-1.5 text-sm">
        {breadcrumb.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-navy-300">/</span>}
            <span
              className={
                i === breadcrumb.length - 1
                  ? "font-medium text-navy-900"
                  : "text-navy-300"
              }
            >
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="focus-ring relative rounded-full p-2 text-navy-400 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-seal-500 ring-2 ring-white" />
        </button>

        <div className="h-8 w-px bg-slate-150" />

        <button
          type="button"
          className="focus-ring flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-2 hover:bg-slate-100"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-clinical-100 text-clinical-700">
            <UserIcon size={16} />
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-medium leading-tight text-navy-800">
              {userName}
            </span>
            <span className="block text-[11px] leading-tight text-navy-300">
              {userRole}
            </span>
          </span>
          <ChevronDown size={15} className="text-navy-300" />
        </button>
      </div>
    </header>
  );
}
