import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Bell, Building, Wallet } from "lucide-react";
import { NavItem } from "@/types/navigation";
import { getNavItemsForAccount } from "@/config/navigation";
import { UpgradePlanModal } from "@/components/common/UpgradePlanModal";
import { Select } from "@/components/ui/select";
import { Sidebar } from "@/components/sidebar";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setActiveAssociationId } from "@/app/uiSlice";
import { useGetAdminAssociationsQuery } from "@/services/api/associationsApi";
import { usePermission } from "@/hooks/usePermission";
import {
  cn,
  isHomeowner,
  isTenant,
  isCommitteeMember,
  isBoardMember,
} from "@/lib/utils";

export interface RoleLayoutProps {
  title?: string;
  roleTitle?: string;
  description?: string;
  navItems?: NavItem[];
  activeTab?: string;
  onTabChange?: (tabKey: string) => void;
  headerControls?: React.ReactNode;
  children?: React.ReactNode;
  associationAllowedFeatures?: string[];
}

export const RoleLayout: React.FC<RoleLayoutProps> = ({
  title,
  roleTitle,
  description,
  navItems,
  activeTab,
  onTabChange,
  headerControls,
  children,
  associationAllowedFeatures,
}) => {
  const { account, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const activeAssociationId = useAppSelector((state) => state.ui.activeAssociationId);
  const [upgradeModalFeature, setUpgradeModalFeature] = useState<string | null>(null);

  const isAdmin = account?.role === "Admin";

  // Fetch admin associations if Admin
  const { data: adminAssociations = [] } = useGetAdminAssociationsQuery(undefined, {
    skip: !isAdmin,
  });

  const pageHeader = useAppSelector((state) => state.ui.pageHeader);

  const getRoleHeaderInfo = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "homeowner":
        return {
          title: "Homeowner Dashboard",
          description: "Access your community features and manage your unit.",
        };
      case "tenant":
        return {
          title: "Tenant Portal",
          description: "Access your rental unit amenities, maintenance, and announcements.",
        };
      case "board member":
        return {
          title: "Board Member Portal",
          description: "Manage association governance, members, and approvals.",
        };
      case "security":
        return {
          title: "Security Gatehouse",
          description: "Visitor approvals, entry logs, and patrol monitoring.",
        };
      case "accountant":
        return {
          title: "Financial Center",
          description: "Manage ledger, payments, invoices, and accounting.",
        };
      case "admin":
        return {
          title: "Association Administrator",
          description: "Manage associations and community operations.",
        };
      case "super admin":
        return {
          title: "RBAC Management",
          description: "Configure roles, features, and permissions.",
        };
      default:
        return {
          title: "Community Dashboard",
          description: "Welcome to your residential management portal.",
        };
    }
  };

  const getHeaderInfo = () => {
    if (pageHeader?.title) {
      return {
        title: pageHeader.title,
        description: pageHeader.description,
      };
    }
    if (roleTitle || title) {
      return {
        title: roleTitle || title,
        description: description,
      };
    }

    const path = location.pathname;
    const roleLower = account?.role?.toLowerCase();

    if (path === "/super-admin" || (path === "/overview" && roleLower === "super admin")) {
      return {
        title: "RBAC Management",
        description: "Configure roles, features, and permissions.",
      };
    }
    if (path === "/entity-types") {
      return {
        title: "Entity Types",
        description: "Configure and manage entity classification types.",
      };
    }
    if (path === "/entities") {
      return {
        title: "Entities",
        description: "Manage client and partner organizations.",
      };
    }
    if (path === "/roles") {
      return {
        title: "Roles",
        description: "Configure system roles and permission sets.",
      };
    }
    if (path === "/features") {
      return {
        title: "Features",
        description: "Configure feature modules and platform capabilities.",
      };
    }
    if (path === "/permissions") {
      return {
        title: "Permissions",
        description: "Configure role-based access permissions.",
      };
    }
    if (path === "/subscriptions") {
      return {
        title: "Subscription Plans",
        description: "Configure subscription tiers, quotas, and pricing.",
      };
    }
    if (path === "/associations") {
      return {
        title: "Associations Directory",
        description: "Super admin master association management, provisioning, and status control.",
      };
    }
    if (path === "/bank") {
      return {
        title: "Bank Accounts",
        description: "Manage bank accounts, deposits, and financial reconciliation.",
      };
    }
    if (path === "/financials") {
      return {
        title: "Financials Management",
        description: "Chart of Accounts, journal vouchers, and audit reporting.",
      };
    }
    if (path === "/employees") {
      return {
        title: "Employees Directory",
        description: "Manage internal staff, administrators, and coordinators.",
      };
    }
    if (path === "/users") {
      return {
        title: "Users Management",
        description: "User directory, role assignment, and security status.",
      };
    }
    if (path === "/vendors") {
      return {
        title: "Vendors",
        description: "Manage approved contractors, service agencies, technicians, and vendor onboarding.",
      };
    }
    if (path === "/wallet") {
      return {
        title: "Resident Wallet & Dues",
        description: "Manage your digital wallet balance, payment methods, assessment dues, and transaction statements.",
      };
    }

    return getRoleHeaderInfo(account?.role);
  };

  const headerInfo = getHeaderInfo();
  const displayTitle = headerInfo.title;
  const displayDescription = headerInfo.description;

  const { canView: canViewWallet } = usePermission("wallet");
  const isResidentOrMember =
    isHomeowner(account?.role) ||
    isTenant(account?.role) ||
    isCommitteeMember(account?.role) ||
    isBoardMember(account?.role);

  const showNavbarWallet = isResidentOrMember && canViewWallet;

  useEffect(() => {
    if (account?.role === "Admin") {
      if (account.subscription_status === "Expired") {
        navigate("/subscription-expired");
      }
    }
  }, [account, navigate]);

  const displayName = profile?.name || account?.name || account?.email?.split("@")[0] || "User";

  const authorizedNavItems = getNavItemsForAccount(
    account,
    navItems,
    associationAllowedFeatures
  );

  const isDashboardOverview =
    location.pathname === "/super-admin" ||
    location.pathname === "/dashboard" ||
    location.pathname === "/overview";

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Modular Collapsible Sidebar */}
      <Sidebar
        navItems={authorizedNavItems}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onUpgradeModalOpen={(feature) => setUpgradeModalFeature(feature)}
      />

      {/* Main Content Area */}
      <main
        className={cn(
          "flex-1 flex flex-col p-6 lg:p-8 min-h-screen transition-all duration-300 ease-in-out w-full",
          sidebarCollapsed ? "lg:ml-28 ml-0" : "lg:ml-72 ml-0"
        )}
      >
        {/* Header Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-serif text-slate-800 tracking-tight">{displayTitle}</h1>
              {displayDescription && <p className="text-slate-500 text-sm mt-1">{displayDescription}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Global Association Select for Admin ONLY */}
            {isAdmin && (
              <div className="w-52 sm:w-64">
                <Select
                  icon={<Building size={15} />}
                  options={adminAssociations}
                  value={activeAssociationId || "ALL"}
                  onChange={(e) => dispatch(setActiveAssociationId(e.target.value))}
                  showAllOption
                  allOptionLabel="All Managed Associations"
                  size="sm"
                />
              </div>
            )}

            {account?.role === "Security" && (
              <button className="p-2 rounded-full hover:bg-slate-100 relative text-slate-600 transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
            )}

            {headerControls ? (
              headerControls
            ) : null}

            {showNavbarWallet && (
              <button
                type="button"
                onClick={() => navigate("/wallet")}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer select-none text-slate-600 hover:text-slate-900 hover:bg-white"
                )}
                title="My Wallet & Dues"
                aria-label="My Wallet"
              >
                <Wallet size={18} />
              </button>
            )}

            <div
              className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-display text-sm font-semibold cursor-pointer hover:ring-2 hover:ring-slate-300 transition-all shadow-xs shrink-0 select-none"
              onClick={() => navigate("/profile")}
              title="My Profile"
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        {isDashboardOverview ? (
          <div className="flex-1 w-full">{children || <Outlet key={location.pathname} />}</div>
        ) : (
          <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs overflow-hidden w-full">
            {children || <Outlet key={location.pathname} />}
          </div>
        )}
      </main>

      {/* Upgrade Plan Modal */}
      <UpgradePlanModal
        isOpen={!!upgradeModalFeature}
        onClose={() => setUpgradeModalFeature(null)}
        featureName={upgradeModalFeature}
      />
    </div>
  );
};

export default RoleLayout;
