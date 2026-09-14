import React, { useState, useMemo } from "react";
import { usePageHeader } from "@/hooks/usePageHeader";
import { usePermission } from "@/hooks/usePermission";
import { AccessRestricted } from "@/components/common";
import {
  FileText,
  Search,
  Plus,
  UploadCloud,
  Layers,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  useGetFinancialReportsQuery,
  useGetGlobalCOAQuery,
} from "../api/financialsApi";
import { useGetAssociationsQuery } from "@/features/associations/api";
import {
  FinancialReportsTable,
  PublishReportModal,
  COATable,
  UploadCOAModal,
} from "../components";

export const FinancialsPage: React.FC = () => {
  const { canView, canCreate, isLoading: isPermLoading } = usePermission();

  usePageHeader({
    title: "Financials",
    description:
      "Published association balance sheets, audited statements, and standardized global chart of accounts",
  });

  const [activeTab, setActiveTab] = useState<"statements" | "coa">("statements");

  // Financial Reports query & state
  const { data: reports = [], isLoading: isLoadingReports } = useGetFinancialReportsQuery(undefined, {
    skip: !canView,
  });
  const [reportSearchQuery, setReportSearchQuery] = useState("");
  const [selectedAssocFilter, setSelectedAssocFilter] = useState("all");
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Global COA query & state
  const { data: coa = [], isLoading: isLoadingCOA } = useGetGlobalCOAQuery(undefined, {
    skip: !canView,
  });
  const [coaSearchQuery, setCOASearchQuery] = useState("");
  const [isUploadCOAModalOpen, setIsUploadCOAModalOpen] = useState(false);

  const { data: associations = [] } = useGetAssociationsQuery(undefined, {
    skip: !canView,
  });

  // Filtered reports
  const filteredReports = useMemo(() => {
    const q = reportSearchQuery.toLowerCase().trim();
    return reports.filter((r) => {
      const title = (r.title || "").toLowerCase();
      const type = (r.report_type || "").toLowerCase();
      const assoc = (r.association_name || "").toLowerCase();
      const month = (r.published_month || "").toLowerCase();

      const matchesSearch =
        !q ||
        title.includes(q) ||
        type.includes(q) ||
        assoc.includes(q) ||
        month.includes(q);

      const matchesAssoc =
        selectedAssocFilter === "all" || r.association_id === selectedAssocFilter;

      return matchesSearch && matchesAssoc;
    });
  }, [reports, reportSearchQuery, selectedAssocFilter]);

  // Filtered COA
  const filteredCOA = useMemo(() => {
    const q = coaSearchQuery.toLowerCase().trim();
    return coa.filter((c) => {
      const code = (c.gl_code || "").toLowerCase();
      const name = (c.gl_name || "").toLowerCase();
      const struct = (c.structure || "").toLowerCase();
      const group = (c.grouping || "").toLowerCase();

      return (
        !q ||
        code.includes(q) ||
        name.includes(q) ||
        struct.includes(q) ||
        group.includes(q)
      );
    });
  }, [coa, coaSearchQuery]);

  const assocFilterOptions = useMemo(() => [
    { value: "all", label: "All Associations" },
    ...associations.map((a) => ({
      value: a.id,
      label: a.name,
    })),
  ], [associations]);

  if (!isPermLoading && !canView) {
    return <AccessRestricted moduleName="Financials" showAction />;
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => setActiveTab(val as "statements" | "coa")}
      className="space-y-6"
    >
      {/* Tab Switcher */}
      <div className="border-b border-slate-200/80 pb-3">
        <TabsList className="h-11 rounded-2xl bg-slate-100 p-1">
          <TabsTrigger
            value="statements"
            className="rounded-xl text-xs font-semibold px-4 py-2 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Financial Statements</span>
          </TabsTrigger>
          <TabsTrigger
            value="coa"
            className="rounded-xl text-xs font-semibold px-4 py-2 flex items-center gap-2"
          >
            <Layers className="w-4 h-4" />
            <span>Chart of Accounts</span>
          </TabsTrigger>
        </TabsList>
      </div>

      {/* TAB 1: Financial Statements */}
      <TabsContent value="statements" className="space-y-6 mt-0">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3">
            <div className="flex-1 max-w-md">
              <Input
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                type="text"
                value={reportSearchQuery}
                onChange={(e) => setReportSearchQuery(e.target.value)}
                placeholder="Search by title, report type, period..."
                className="h-10 rounded-xl"
              />
            </div>

            <div className="w-56">
              <Select
                icon={<Building className="w-3.5 h-3.5" />}
                size="sm"
                value={selectedAssocFilter}
                onChange={(e) => setSelectedAssocFilter(e.target.value)}
                options={assocFilterOptions}
              />
            </div>
          </div>

          {canCreate && (
            <Button
              onClick={() => setIsPublishModalOpen(true)}
              className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm shadow-indigo-100 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Statement</span>
            </Button>
          )}
        </div>

        {/* Main Content */}
        <FinancialReportsTable
          reports={filteredReports}
          isLoading={isLoadingReports}
        />

        {isPublishModalOpen && (
          <PublishReportModal
            isOpen={isPublishModalOpen}
            onClose={() => setIsPublishModalOpen(false)}
          />
        )}
      </TabsContent>

      {/* TAB 2: Standard Chart of Accounts */}
      <TabsContent value="coa" className="space-y-6 mt-0">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <Input
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              type="text"
              value={coaSearchQuery}
              onChange={(e) => setCOASearchQuery(e.target.value)}
              placeholder="Search ledger codes, account names, structure..."
              className="h-10 rounded-xl"
            />
          </div>

          {canCreate && (
            <Button
              onClick={() => setIsUploadCOAModalOpen(true)}
              className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm shadow-indigo-100 flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Import Ledger Excel</span>
            </Button>
          )}
        </div>

        {/* Main Content */}
        <COATable
          accounts={filteredCOA}
          isLoading={isLoadingCOA}
        />

        {isUploadCOAModalOpen && (
          <UploadCOAModal
            isOpen={isUploadCOAModalOpen}
            onClose={() => setIsUploadCOAModalOpen(false)}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default FinancialsPage;

