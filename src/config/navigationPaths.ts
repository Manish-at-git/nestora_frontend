/**
 * Centralized Navigation Key to Semantic URL Path Mappings
 */
export const NAV_KEY_TO_PATH: Record<string, string> = {
  overview: "/dashboard",
  wallet: "/wallet",
  service_request: "/service-requests",
  board_task: "/board-tasks",
  meetings: "/meetings",
  committees: "/committees",
  election: "/election",
  socials: "/socials",
  socials_announcement: "/announcements",
  socials_events: "/events",
  socials_polls: "/polls",
  socials_board_member: "/board-members",
  socials_committee_member: "/committee-members",
  visitors: "/visitors",
  visitors_preapproved: "/visitors/preapproved",
  deliveries: "/deliveries",
  marketplace: "/marketplace",
  amenities: "/amenities",
  document: "/documents",
  financials: "/financials",
  financials_balance_sheet: "/financials/balance-sheet",
  financials_income_statement: "/financials/income-statement",
  financials_delinquency_report: "/financials/delinquency-report",
  financials_prepaid_report: "/financials/prepaid-report",
  financials_vendor_aging: "/financials/vendor-aging",
  financials_invoice: "/financials/invoices",
  financials_bank_transaction: "/financials/bank-transactions",
  financials_bank_statement: "/financials/bank-statements",
  financials_other_report: "/financials/other-reports",
  budget: "/budget",
  chart_of_account: "/chart-of-accounts",
  bank: "/bank",
  unit_documents: "/unit-documents",
  email_activity: "/email-activity",
  inspection: "/inspection",
  // Admin & Super Admin routes
  associations: "/associations",
  onboard: "/onboard",
  entity_types: "/entity-types",
  entities: "/entities",
  roles: "/roles",
  features: "/features",
  permissions: "/permissions",
  subscription_plans: "/subscriptions",
  employees: "/employees",
  users: "/users",
  vendors: "/vendors",
  // Security routes
  visitor_management: "/visitor-management",
  vm_new: "/visitor-management/new",
  vm_preapproved: "/visitor-management/preapproved",
  vm_checkin: "/visitor-management/checkin",
  vm_checkout: "/visitor-management/checkout",
  vm_history: "/visitor-management/history",
  delivery: "/delivery",
  delivery_new: "/delivery/new",
  delivery_active: "/delivery/active",
  delivery_history: "/delivery/history",
  vehicles: "/vehicles",
  staff: "/staff",
  incidents: "/incidents",
};

/**
 * Reverse lookup mapping from URL pathname to navigation tab key
 */
export const PATH_TO_NAV_KEY: Record<string, string> = {
  "/dashboard": "overview",
  "/wallet": "wallet",
  "/service-requests": "service_request",
  "/service_request": "service_request",
  "/board-tasks": "board_task",
  "/board_task": "board_task",
  "/meetings": "meetings",
  "/committees": "committees",
  "/election": "election",
  "/socials": "socials",
  "/announcements": "socials_announcement",
  "/socials/announcements": "socials_announcement",
  "/socials_announcement": "socials_announcement",
  "/events": "socials_events",
  "/socials/events": "socials_events",
  "/socials_events": "socials_events",
  "/polls": "socials_polls",
  "/socials/polls": "socials_polls",
  "/socials_polls": "socials_polls",
  "/board-members": "socials_board_member",
  "/socials/board-members": "socials_board_member",
  "/socials_board_member": "socials_board_member",
  "/committee-members": "socials_committee_member",
  "/socials/committee-members": "socials_committee_member",
  "/socials_committee_member": "socials_committee_member",
  "/visitors": "visitors",
  "/visitors/preapproved": "visitors_preapproved",
  "/visitors_preapproved": "visitors_preapproved",
  "/deliveries": "deliveries",
  "/marketplace": "marketplace",
  "/amenities": "amenities",
  "/documents": "document",
  "/document": "document",
  "/financials": "financials",
  "/financials/balance-sheet": "financials_balance_sheet",
  "/financials/income-statement": "financials_income_statement",
  "/financials/delinquency-report": "financials_delinquency_report",
  "/financials/prepaid-report": "financials_prepaid_report",
  "/financials/vendor-aging": "financials_vendor_aging",
  "/financials/invoices": "financials_invoice",
  "/financials/bank-transactions": "financials_bank_transaction",
  "/financials/bank-statements": "financials_bank_statement",
  "/financials/other-reports": "financials_other_report",
  "/budget": "budget",
  "/chart-of-accounts": "chart_of_account",
  "/chart_of_account": "chart_of_account",
  "/bank": "bank",
  "/unit-documents": "unit_documents",
  "/unit_documents": "unit_documents",
  "/email-activity": "email_activity",
  "/email_activity": "email_activity",
  "/inspection": "inspection",
  "/associations": "associations",
  "/onboard": "onboard",
  "/entity-types": "entity_types",
  "/entity_types": "entity_types",
  "/entities": "entities",
  "/roles": "roles",
  "/features": "features",
  "/permissions": "permissions",
  "/subscriptions": "subscription_plans",
  "/subscription_plans": "subscription_plans",
  "/employees": "employees",
  "/users": "users",
  "/vendors": "vendors",
  "/visitor-management": "visitor_management",
  "/visitor-management/new": "vm_new",
  "/visitor-management/preapproved": "vm_preapproved",
  "/visitor-management/checkin": "vm_checkin",
  "/visitor-management/checkout": "vm_checkout",
  "/visitor-management/history": "vm_history",
  "/delivery": "delivery",
  "/delivery/new": "delivery_new",
  "/delivery/active": "delivery_active",
  "/delivery/history": "delivery_history",
  "/vehicles": "vehicles",
  "/staff": "staff",
  "/incidents": "incidents",
  // Legacy role overview paths
  "/admin": "associations",
  "/super-admin": "overview",
  "/board-dashboard": "overview",
  "/homeowner-dashboard": "overview",
  "/tenant-dashboard": "overview",
  "/committee-dashboard": "overview",
  "/security-dashboard": "overview",
  "/accountant-dashboard": "overview",
};

/**
 * Returns the URL path for a given nav key and role
 */
export const getPathForNavKey = (key: string, role?: string): string => {
  if (key === "overview") {
    const roleLower = role?.toLowerCase() || "";
    if (roleLower === "admin") return "/admin";
    if (roleLower === "super admin") return "/super-admin";
    return "/dashboard";
  }
  return NAV_KEY_TO_PATH[key] || `/${key.replace(/_/g, "-")}`;
};

/**
 * Resolves the active tab key from a given pathname
 */
export const getNavKeyFromPath = (pathname: string, defaultKey: string = "overview"): string => {
  // Direct match
  if (PATH_TO_NAV_KEY[pathname]) {
    return PATH_TO_NAV_KEY[pathname];
  }

  // Trim trailing slashes
  const cleanPath = pathname.replace(/\/+$/, "");
  if (PATH_TO_NAV_KEY[cleanPath]) {
    return PATH_TO_NAV_KEY[cleanPath];
  }

  // Handle role dashboard tab subroutes (e.g. /dashboard/:tab or /homeowner-dashboard/:tab)
  const segments = cleanPath.split("/").filter(Boolean);
  if (segments.length >= 2) {
    const lastSegment = segments[segments.length - 1];
    if (PATH_TO_NAV_KEY[`/${lastSegment}`]) {
      return PATH_TO_NAV_KEY[`/${lastSegment}`];
    }
    return lastSegment;
  }

  return defaultKey;
};

