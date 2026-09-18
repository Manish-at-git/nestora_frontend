import React from "react";
import { Navigate } from "react-router-dom";
import { RoleRedirect } from "./RoleRedirect";
import RoleLayout from "@/layouts/RoleLayout";
import {
  LoginPage,
  SignInPage,
  VerifyDetailsPage,
  CreateAccountPage,
} from "@/features/auth";
import { RoleDashboardRouter } from "./RoleDashboardRouter";
import { AnnouncementsPage } from "@/features/announcements";
import { EventsPage } from "@/features/events";
import { PollsPage } from "@/features/polls";
import { BoardMembersPage } from "@/features/board-members";
import { CommitteesPage } from "@/features/committees";
import { CommitteeMembersPage } from "@/features/committee-members";
import { WalletPage } from "@/features/wallet";
import { UserProfilePage } from "@/features/profile";
import { MeetingsPage } from "@/features/meetings";
import { ServiceRequestsPage } from "@/features/service-requests";
import { BoardTasksPage } from "@/features/board-tasks";
import { EntityTypesPage } from "@/features/entity-types";
import { EntitiesPage } from "@/features/entities";
import { RolesPage } from "@/features/roles";
import { FeaturesPage } from "@/features/features";
import { PermissionsPage } from "@/features/permissions";
import { SubscriptionsPage } from "@/features/subscriptions";
import { AssociationsPage } from "@/features/associations";
import { EmployeesPage } from "@/features/employees";
import { UsersPage } from "@/features/users";
import { VendorsPage } from "@/features/vendors";
import { BankPage } from "@/features/bank";
import { FinancialsPage } from "@/features/financials";
import { ChartOfAccountsPage } from "@/features/chart-of-accounts";
import DesignSystemPage from "@/features/design-system/DesignSystemPage";
import { ModulePlaceholder } from "@/components/common/ModulePlaceholder";
import { ElectionPage } from "@/features/election";
import { AmenitiesPage } from "@/features/amenities";
import { MarketplacePage } from "@/features/marketplace";
import { DocumentsPage } from "@/features/documents";
import { UnitDocumentsPage } from "@/features/unit-documents";
import {
  PreApprovedVisitorsPage,
  PublicVisitorPassPage,
} from "@/features/visitor-management";

export interface AppRoute {
  path: string;
  element: React.ReactNode;
  isProtected?: boolean;
  allowedRoles?: string[];
}

/**
 * Public Authentication & Marketing Routes
 */
export const publicRoutes: AppRoute[] = [
  {
    path: "/",
    element: <RoleRedirect />,
  },
  {
    path: "/login",
    element: <RoleRedirect />,
  },
  {
    path: "/signin",
    element: <SignInPage />,
  },
  {
    path: "/verify",
    element: <VerifyDetailsPage />,
  },
  {
    path: "/create-account",
    element: <CreateAccountPage />,
  },
  {
    path: "/design-system",
    element: <DesignSystemPage />,
  },
  {
    path: "/visitor-pass/:passCode",
    element: <PublicVisitorPassPage />,
  },
];

/**
 * Modern Protected Application Routes
 * Rendered inside the persistent RoleLayout shell (<Outlet />)
 */
export const protectedAppRoutes: AppRoute[] = [
  // ==========================================
  // Primary Dashboard Overview
  // ==========================================
  {
    path: "/dashboard",
    element: <RoleDashboardRouter />,
  },

  // ==========================================
  // Socials & Community Module
  // ==========================================
  {
    path: "/announcements",
    element: <AnnouncementsPage />,
  },
  {
    path: "/events",
    element: <EventsPage />,
  },
  {
    path: "/polls",
    element: <PollsPage />,
  },
  {
    path: "/board-members",
    element: <BoardMembersPage />,
  },
  {
    path: "/committee-members",
    element: <CommitteeMembersPage />,
  },
  {
    path: "/committees",
    element: <CommitteesPage />,
  },

  // ==========================================
  // Governance & Operations
  // ==========================================
  {
    path: "/meetings",
    element: <MeetingsPage />,
  },
  {
    path: "/meetings/:meetingId",
    element: <MeetingsPage />,
  },
  {
    path: "/board-tasks",
    element: <BoardTasksPage />,
  },
  {
    path: "/board-tasks/:taskId",
    element: <BoardTasksPage />,
  },
  {
    path: "/wallet",
    element: <WalletPage />,
  },
  {
    path: "/profile",
    element: <UserProfilePage />,
  },
  {
    path: "/election",
    element: (
      <ModulePlaceholder
        moduleName="Elections"
        title="Election Management"
        description="View election results, candidate information, and voting details."
      />
    ),
  },

  // ==========================================
  // Management & Placeholder Modules
  // ==========================================
  {
    path: "/service-requests",
    element: <ServiceRequestsPage />,
  },
  {
    path: "/service-requests/:requestId",
    element: <ServiceRequestsPage />,
  },
  {
    path: "/resident-documents",
    element: <DocumentsPage />,
  },
  {
    path: "/amenities",
    element: <AmenitiesPage />,
  },
  {
    path: "/marketplace",
    element: <MarketplacePage />,
  },
  {
    path: "/incident",
    element: (
      <ModulePlaceholder
        moduleName="incident"
        title="Security & Incidents"
        description="Report gate anomalies, property damage, and urgent safety concerns."
      />
    ),
  },
  {
    path: "/financials",
    element: <FinancialsPage />,
  },
  {
    path: "/accounting",
    element: (
      <ModulePlaceholder
        moduleName="accounting"
        title="General Ledger & Invoices"
        description="Manage vendor payables, resident invoices, and bank reconciliation."
      />
    ),
  },
  {
    path: "/invoices",
    element: (
      <ModulePlaceholder
        moduleName="invoices"
        title="Invoices & Billing"
        description="Generate resident dues assessments, vendor bills, and receipt vouchers."
      />
    ),
  },
  {
    path: "/inspection",
    element: (
      <ModulePlaceholder
        moduleName="inspection"
        title="Property Inspections"
        description="Schedule site inspections, log compliance violations, and track resolutions."
      />
    ),
  },

  // ==========================================
  // Admin & Management Workspace
  // ==========================================
  {
    path: "/admin",
    element: <Navigate to="/dashboard" replace />,
    allowedRoles: ["Admin", "Super admin"],
  },
  {
    path: "/admin/overview",
    element: <Navigate to="/dashboard" replace />,
    allowedRoles: ["Admin", "Super admin"],
  },
  {
    path: "/admin/associations",
    element: <Navigate to="/dashboard" replace />,
    allowedRoles: ["Admin", "Super admin"],
  },
  {
    path: "/budget",
    element: (
      <ModulePlaceholder
        moduleName="budget"
        title="Annual Budget Management"
        description="View and configure association operating budgets and capital reserves."
      />
    ),
  },
  {
    path: "/chart-of-accounts",
    element: <ChartOfAccountsPage />,
  },
  {
    path: "/bank",
    element: <BankPage />,
  },
  {
    path: "/unit-documents",
    element: <UnitDocumentsPage />,
  },
  {
    path: "/email-activity",
    element: (
      <ModulePlaceholder
        moduleName="email_activity"
        title="Email & Notification Activity"
        description="Audit sent email blasts, delivery statuses, and resident announcements."
      />
    ),
  },
  {
    path: "/onboard",
    element: (
      <ModulePlaceholder
        moduleName="onboard"
        title="Onboard Association"
        description="Multi-step wizard to provision a new association or residential property."
      />
    ),
  },

  // ==========================================
  // Super Admin Platform Controls
  // ==========================================
  {
    path: "/super-admin",
    element: <Navigate to="/dashboard" replace />,
    allowedRoles: ["Super admin"],
  },
  {
    path: "/subscriptions",
    element: <SubscriptionsPage />,
  },
  {
    path: "/associations",
    element: <AssociationsPage />,
  },
  {
    path: "/employees",
    element: <EmployeesPage />,
  },
  {
    path: "/users",
    element: <UsersPage />,
  },
  {
    path: "/vendors",
    element: <VendorsPage />,
  },
  {
    path: "/entities",
    element: <EntitiesPage />,
  },
  {
    path: "/entity-types",
    element: <EntityTypesPage />,
  },
  {
    path: "/roles",
    element: <RolesPage />,
  },
  {
    path: "/features",
    element: <FeaturesPage />,
  },
  {
    path: "/permissions",
    element: <PermissionsPage />,
  },

  // ==========================================
  // Security & Gate Operations
  // ==========================================
  {
    path: "/security",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/visitor-management",
    element: <PreApprovedVisitorsPage />,
  },
  {
    path: "/visitor-management/new",
    element: (
      <ModulePlaceholder
        moduleName="visitor_management"
        title="New Visitor Check-In"
        description="Log walk-in guests, verify OTP passes, and process gate entries."
      />
    ),
  },
  {
    path: "/visitor-management/checkin",
    element: (
      <ModulePlaceholder
        moduleName="visitor_management"
        title="Gate Check-In"
        description="Process visitor entry into premises."
      />
    ),
  },
  {
    path: "/visitor-management/checkout",
    element: (
      <ModulePlaceholder
        moduleName="visitor_management"
        title="Gate Check-Out"
        description="Process visitor departure."
      />
    ),
  },
  {
    path: "/visitor-management/history",
    element: (
      <ModulePlaceholder
        moduleName="visitor_management"
        title="Visitor Audit History"
        description="Complete historical log of all visitor movements."
      />
    ),
  },
  {
    path: "/delivery",
    element: (
      <ModulePlaceholder
        moduleName="delivery"
        title="Gate Delivery Terminal"
        description="Log delivery riders, parcel tracking numbers, and resident notifications."
      />
    ),
  },
  {
    path: "/delivery/new",
    element: (
      <ModulePlaceholder
        moduleName="delivery"
        title="Log New Delivery"
        description="Accept parcel from courier and notify resident."
      />
    ),
  },
  {
    path: "/delivery/active",
    element: (
      <ModulePlaceholder
        moduleName="delivery"
        title="Active Parcels at Gate"
        description="Parcels awaiting resident pickup."
      />
    ),
  },
  {
    path: "/delivery/history",
    element: (
      <ModulePlaceholder
        moduleName="delivery"
        title="Delivery Log History"
        description="Historical archive of delivered parcels."
      />
    ),
  },
  {
    path: "/vehicles",
    element: (
      <ModulePlaceholder
        moduleName="vehicles"
        title="Vehicle Registry"
        description="Scan license plates, manage resident parking slots, and log visitor parking."
      />
    ),
  },
  {
    path: "/staff",
    element: (
      <ModulePlaceholder
        moduleName="staff"
        title="Domestic & Gate Staff"
        description="Track security guard shift attendance and domestic staff passes."
      />
    ),
  },
  {
    path: "/incidents",
    element: (
      <ModulePlaceholder
        moduleName="incidents"
        title="Incident Reports"
        description="Record security breaches, emergency alarms, and facility damage reports."
      />
    ),
  },

  // ==========================================
  // Accounting & Financials
  // ==========================================
  {
    path: "/financials",
    element: <FinancialsPage />,
  },
  {
    path: "/financials/:report",
    element: <FinancialsPage />,
  },

  // ==========================================
  // User Profile
  // ==========================================
  {
    path: "/profile",
    element: <UserProfilePage />,
  },

  // ==========================================
  // Direct Socials Aliases
  // ==========================================
  {
    path: "/socials/announcements",
    element: <AnnouncementsPage />,
  },
  {
    path: "/socials/events",
    element: <EventsPage />,
  },
  {
    path: "/socials/polls",
    element: <PollsPage />,
  },
  {
    path: "/socials/board-members",
    element: <BoardMembersPage />,
  },
  {
    path: "/socials/committee-members",
    element: <CommitteeMembersPage />,
  },

  // ==========================================
  // Legacy URL Redirects
  // ==========================================
  {
    path: "/homeowner-dashboard",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/tenant-dashboard",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/board-dashboard",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/committee-dashboard",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/security-dashboard",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/accountant-dashboard",
    element: <Navigate to="/dashboard" replace />,
  },
];

/**
 * Centralized list for index export
 */
export const appRoutes: AppRoute[] = [
  ...publicRoutes.map((r) => ({ ...r, isProtected: false })),
  ...protectedAppRoutes.map((r) => ({ ...r, isProtected: true })),
  {
    path: "*",
    element: <Navigate to="/" replace />,
    isProtected: false,
  },
];

export default appRoutes;
