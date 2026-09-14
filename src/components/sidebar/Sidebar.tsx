import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { toggleSidebar } from "@/app/uiSlice";
import { NavItem, NavSubItem } from "@/types/navigation";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarFooter } from "./SidebarFooter";
import { cn } from "@/lib/utils";

export interface SidebarProps {
  navItems: NavItem[];
  activeTab?: string;
  onTabChange?: (tabKey: string) => void;
  onUpgradeModalOpen?: (featureName: string) => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  navItems,
  activeTab,
  onTabChange,
  onUpgradeModalOpen,
  className,
}) => {
  const { account, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (key: string, currentExpandedState: boolean) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [key]: !currentExpandedState,
    }));
  };

  const displayName = profile?.name || account?.name || account?.email?.split("@")[0] || "User";

  const isNavActive = (itemPath?: string, itemKey?: string): boolean => {
    if (activeTab && activeTab === itemKey) return true;
    if (!itemPath) return false;
    if (
      itemPath === "/dashboard" ||
      itemPath === "/admin" ||
      itemPath === "/super-admin" ||
      itemPath === "/security" ||
      itemPath === "/financials"
    ) {
      return location.pathname === itemPath;
    }
    return (
      location.pathname === itemPath ||
      (itemPath !== "/" && location.pathname.startsWith(`${itemPath}/`))
    );
  };

  const handleItemClick = (it: NavItem, currentlyExpanded: boolean) => {
    if (it.isLocked) {
      onUpgradeModalOpen?.(it.label);
      return;
    }
    if (it.subItems && it.subItems.length > 0) {
      if (sidebarCollapsed) {
        dispatch(toggleSidebar());
        setExpandedMenus((prev) => ({ ...prev, [it.key]: true }));
      } else {
        toggleMenu(it.key, currentlyExpanded);
      }
      return;
    }
    if (it.path) {
      navigate(it.path);
      onTabChange?.(it.key);
    } else {
      onTabChange?.(it.key);
    }
  };

  const handleSubItemClick = (sub: NavSubItem) => {
    if (sub.isLocked) {
      onUpgradeModalOpen?.(sub.label);
    } else if (sub.path) {
      navigate(sub.path);
      onTabChange?.(sub.key);
    } else {
      onTabChange?.(sub.key);
    }
  };

  return (
    <aside
      className={cn(
        "fixed top-4 bottom-4 left-4 z-50 flex flex-col rounded-3xl bg-slate-900 text-white shadow-2xl transition-all duration-300 ease-in-out border border-white/10 select-none",
        sidebarCollapsed ? "w-20 p-3" : "w-64 p-5",
        className
      )}
    >
      {/* Header */}
      <SidebarHeader
        sidebarCollapsed={sidebarCollapsed}
        onToggle={() => dispatch(toggleSidebar())}
      />

      {/* Navigation List */}
      <nav className="space-y-1.5 text-sm overflow-y-auto flex-1 min-h-0 pr-1 sidebar-scrollbar">
        {navItems.map((it) => {
          const hasChildren = Boolean(it.subItems && it.subItems.length > 0);
          const isChildActive =
            hasChildren &&
            Boolean(it.subItems!.some((sub) => isNavActive(sub.path, sub.key)));
          const isActive =
            (!hasChildren && isNavActive(it.path, it.key)) || isChildActive;
          const isExpanded =
            expandedMenus[it.key] !== undefined
              ? expandedMenus[it.key]
              : isChildActive;

          return (
            <SidebarNavItem
              key={it.key}
              item={it}
              isActive={isActive}
              isExpanded={isExpanded}
              sidebarCollapsed={sidebarCollapsed}
              isNavActive={isNavActive}
              onClick={() => handleItemClick(it, isExpanded)}
              onToggleChevron={() => toggleMenu(it.key, isExpanded)}
              onSubItemClick={handleSubItemClick}
            />
          );
        })}
      </nav>

      {/* Footer */}
      <SidebarFooter
        sidebarCollapsed={sidebarCollapsed}
        displayName={displayName}
        role={account?.role}
        onProfileClick={() => navigate("/profile")}
        onLogout={async () => {
          await logout();
          navigate("/signin");
        }}
      />
    </aside>
  );
};

export default Sidebar;
