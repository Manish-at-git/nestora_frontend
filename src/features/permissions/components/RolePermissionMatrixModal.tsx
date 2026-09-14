import React, { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  Key,
  Shield,
  CheckCheck,
  Eye,
  RotateCcw,
  CornerDownRight,
  LayoutGrid,
  Link as LinkIcon,
  Building2,
  Globe,
  Lock,
} from "lucide-react";
import { FormModal } from "@/components/common/FormModal";
import { StatusPill } from "@/components/common/StatusPill";
import { DataTable, Column } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useGetRolePermissionsMatrixQuery,
  useUpdateRolePermissionsBulkMutation,
} from "../api/permissionsApi";
import type { RolePermissionSummary, RolePermissionMatrixItem } from "../types";

export interface RolePermissionMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: RolePermissionSummary | null;
  onSuccess?: () => void;
  readOnly?: boolean;
}

interface LocalPermissionState {
  can_create: boolean;
  can_view: boolean;
  can_update: boolean;
  can_delete: boolean;
}

export const RolePermissionMatrixModal: React.FC<RolePermissionMatrixModalProps> = ({
  isOpen,
  onClose,
  role,
  onSuccess,
  readOnly = false,
}) => {
  const roleId = role?.id || "";
  const { data: matrixData, isLoading } = useGetRolePermissionsMatrixQuery(roleId, {
    skip: !isOpen || !roleId,
  });

  const [updateBulk, { isLoading: isSaving }] = useUpdateRolePermissionsBulkMutation();

  // Local state for permissions map: { [featureId]: { can_create, can_view, can_update, can_delete } }
  const [permissionsMap, setPermissionsMap] = useState<Record<string, LocalPermissionState>>({});

  // Sync loaded data to local state
  useEffect(() => {
    if (matrixData?.features) {
      const initialMap: Record<string, LocalPermissionState> = {};
      matrixData.features.forEach((f) => {
        initialMap[f.feature_id] = {
          can_create: Boolean(Number(f.can_create)),
          can_view: Boolean(Number(f.can_view)),
          can_update: Boolean(Number(f.can_update)),
          can_delete: Boolean(Number(f.can_delete)),
        };
      });
      setPermissionsMap(initialMap);
    }
  }, [matrixData]);

  // Toggle single cell independently - does NOT alter other permissions
  const handleCellToggle = useCallback(
    (
      featureId: string,
      field: "can_create" | "can_view" | "can_update" | "can_delete"
    ) => {
      if (readOnly) return;
      setPermissionsMap((prev) => {
        const current = prev[featureId] || {
          can_create: false,
          can_view: false,
          can_update: false,
          can_delete: false,
        };
        return {
          ...prev,
          [featureId]: {
            ...current,
            [field]: !current[field],
          },
        };
      });
    },
    [readOnly]
  );

  // Toggle all actions in a single row
  const handleRowToggleAll = useCallback(
    (featureId: string) => {
      if (readOnly) return;
      setPermissionsMap((prev) => {
        const current = prev[featureId] || {
          can_create: false,
          can_view: false,
          can_update: false,
          can_delete: false,
        };
        const allActive =
          current.can_create && current.can_view && current.can_update && current.can_delete;
        const targetVal = !allActive;

        return {
          ...prev,
          [featureId]: {
            can_create: targetVal,
            can_view: targetVal,
            can_update: targetVal,
            can_delete: targetVal,
          },
        };
      });
    },
    [readOnly]
  );

  // Toggle all rows for a specific column ("can_create" | "can_view" | "can_update" | "can_delete")
  const handleColumnToggleAll = useCallback(
    (field: "can_create" | "can_view" | "can_update" | "can_delete") => {
      if (readOnly || !matrixData?.features || matrixData.features.length === 0) return;
      setPermissionsMap((prev) => {
        const features = matrixData.features;
        const allChecked = features.every((f) => Boolean(prev[f.feature_id]?.[field]));
        const targetVal = !allChecked;

        const next: Record<string, LocalPermissionState> = { ...prev };
        features.forEach((f) => {
          const current = next[f.feature_id] || {
            can_create: false,
            can_view: false,
            can_update: false,
            can_delete: false,
          };
          next[f.feature_id] = {
            ...current,
            [field]: targetVal,
          };
        });
        return next;
      });
    },
    [readOnly, matrixData]
  );

  // Toggle everything (all rows and all columns)
  const handleToggleEverything = useCallback(() => {
    if (readOnly || !matrixData?.features || matrixData.features.length === 0) return;
    setPermissionsMap((prev) => {
      const features = matrixData.features;
      const allChecked = features.every(
        (f) =>
          prev[f.feature_id]?.can_create &&
          prev[f.feature_id]?.can_view &&
          prev[f.feature_id]?.can_update &&
          prev[f.feature_id]?.can_delete
      );
      const targetVal = !allChecked;

      const next: Record<string, LocalPermissionState> = {};
      features.forEach((f) => {
        next[f.feature_id] = {
          can_create: targetVal,
          can_view: targetVal,
          can_update: targetVal,
          can_delete: targetVal,
        };
      });
      return next;
    });
  }, [readOnly, matrixData]);

  // Presets: Grant All
  const handleGrantAll = () => {
    if (readOnly || !matrixData?.features) return;
    const next: Record<string, LocalPermissionState> = {};
    matrixData.features.forEach((f) => {
      next[f.feature_id] = {
        can_create: true,
        can_view: true,
        can_update: true,
        can_delete: true,
      };
    });
    setPermissionsMap(next);
    toast.info("Full CRUD granted across all features");
  };

  // Presets: View Only
  const handleViewOnly = () => {
    if (readOnly || !matrixData?.features) return;
    const next: Record<string, LocalPermissionState> = {};
    matrixData.features.forEach((f) => {
      next[f.feature_id] = {
        can_create: false,
        can_view: true,
        can_update: false,
        can_delete: false,
      };
    });
    setPermissionsMap(next);
    toast.info("Read-only access set across all features");
  };

  // Presets: Clear All
  const handleClearAll = () => {
    if (readOnly || !matrixData?.features) return;
    const next: Record<string, LocalPermissionState> = {};
    matrixData.features.forEach((f) => {
      next[f.feature_id] = {
        can_create: false,
        can_view: false,
        can_update: false,
        can_delete: false,
      };
    });
    setPermissionsMap(next);
    toast.info("All permissions cleared");
  };

  // Total active features count in this role
  const totalGrantedCount = useMemo(() => {
    return Object.values(permissionsMap).filter(
      (p) => p.can_view || p.can_create || p.can_update || p.can_delete
    ).length;
  }, [permissionsMap]);

  // Save changes
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (!role || readOnly) return;

    const payloadPermissions = Object.entries(permissionsMap).map(([featureId, p]) => ({
      feature_id: featureId,
      can_create: p.can_create,
      can_view: p.can_view,
      can_update: p.can_update,
      can_delete: p.can_delete,
    }));

    try {
      await updateBulk({
        role_id: role.id,
        permissions: payloadPermissions,
      }).unwrap();

      toast.success(`Permissions for role "${role.name}" updated successfully!`);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.detail || err?.message || "Failed to update role permissions"
      );
    }
  };

  // Column Header Renderers with select-whole-column support
  const renderColumnHeader = useCallback(
    (
      label: string,
      field: "can_create" | "can_view" | "can_update" | "can_delete"
    ) => {
      if (readOnly) return label;

      const features = matrixData?.features || [];
      const count = features.length;
      const checkedCount = features.filter(
        (f) => Boolean(permissionsMap[f.feature_id]?.[field])
      ).length;
      const isAllChecked = count > 0 && checkedCount === count;
      const isIndeterminate = checkedCount > 0 && checkedCount < count;

      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleColumnToggleAll(field);
          }}
          className="group inline-flex items-center justify-center gap-1.5 py-1 px-2 -my-1 rounded-md text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 active:bg-blue-100/60 transition-all cursor-pointer select-none"
          title={
            isAllChecked
              ? `Clear all ${label} permissions (${checkedCount}/${count})`
              : `Select all ${label} permissions (${checkedCount}/${count})`
          }
        >
          <span>{label}</span>
          <span
            className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded text-[9px] font-bold transition-colors ${
              isAllChecked
                ? "bg-blue-600 text-white"
                : isIndeterminate
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600"
            }`}
          >
            {isAllChecked ? "✓" : isIndeterminate ? "−" : "+"}
          </span>
        </button>
      );
    },
    [readOnly, matrixData, permissionsMap, handleColumnToggleAll]
  );

  const renderRowAllHeader = useCallback(() => {
    if (readOnly) return "Row All";
    const features = matrixData?.features || [];
    const count = features.length;
    const fullRowsCount = features.filter((f) => {
      const p = permissionsMap[f.feature_id];
      return p && p.can_create && p.can_view && p.can_update && p.can_delete;
    }).length;
    const isAllFull = count > 0 && fullRowsCount === count;

    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleToggleEverything();
        }}
        className="group inline-flex items-center justify-center gap-1 py-1 px-1.5 -my-1 rounded-md text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 active:bg-blue-100/60 transition-all cursor-pointer select-none"
        title={isAllFull ? "Clear all permissions" : "Select all permissions"}
      >
        <span>Row All</span>
        <span
          className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded text-[9px] font-bold transition-colors ${
            isAllFull
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600"
          }`}
        >
          {isAllFull ? "✓" : "+"}
        </span>
      </button>
    );
  }, [readOnly, matrixData, permissionsMap, handleToggleEverything]);

  // DataTable columns definition
  const columns = useMemo<Column<RolePermissionMatrixItem>[]>(
    () => {
      const baseCols: Column<RolePermissionMatrixItem>[] = [
        {
          key: "sr_no",
          header: "Sr. No.",
          sortable: false,
          width: "56px",
          className: "text-center",
          render: (_row, index) => (
            <span className="font-medium text-slate-500 text-xs">{index + 1}</span>
          ),
        },
        {
          key: "feature_name",
          header: "Feature / Module",
          sortable: true,
          filterable: true,
          width: "240px",
          render: (row) => {
            const isChild = Boolean(row.parent_id);
            return (
              <div className="flex items-center gap-2">
                {isChild ? (
                  <CornerDownRight size={13} className="text-slate-400 shrink-0 ml-3" />
                ) : (
                  <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                    <LayoutGrid size={12} />
                  </div>
                )}
                <span
                  className={`truncate ${
                    !isChild ? "font-semibold text-slate-900" : "text-slate-700"
                  }`}
                >
                  {row.feature_name}
                </span>
              </div>
            );
          },
        },
        {
          key: "feature_code",
          header: "Code / Route",
          sortable: true,
          filterable: true,
          width: "170px",
          render: (row) => (
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[10px] text-slate-600 truncate">
                {row.feature_code}
              </span>
              {row.url && (
                <span className="text-[10px] text-slate-400 font-mono truncate flex items-center gap-1">
                  <LinkIcon size={9} />
                  {row.url}
                </span>
              )}
            </div>
          ),
        },
        {
          key: "can_create",
          header: renderColumnHeader("Create", "can_create"),
          sortable: false,
          width: "90px",
          className: "text-center",
          headerClassName: "text-center justify-center",
          render: (row) => {
            const perm = permissionsMap[row.feature_id];
            return (
              <div className="flex justify-center">
                <Checkbox
                  id={`perm-create-${row.feature_id}`}
                  checked={perm?.can_create || false}
                  disabled={readOnly}
                  onCheckedChange={
                    readOnly
                      ? undefined
                      : () => handleCellToggle(row.feature_id, "can_create")
                  }
                />
              </div>
            );
          },
        },
        {
          key: "can_view",
          header: renderColumnHeader("View", "can_view"),
          sortable: false,
          width: "90px",
          className: "text-center",
          headerClassName: "text-center justify-center",
          render: (row) => {
            const perm = permissionsMap[row.feature_id];
            return (
              <div className="flex justify-center">
                <Checkbox
                  id={`perm-view-${row.feature_id}`}
                  checked={perm?.can_view || false}
                  disabled={readOnly}
                  onCheckedChange={
                    readOnly
                      ? undefined
                      : () => handleCellToggle(row.feature_id, "can_view")
                  }
                />
              </div>
            );
          },
        },
        {
          key: "can_update",
          header: renderColumnHeader("Update", "can_update"),
          sortable: false,
          width: "90px",
          className: "text-center",
          headerClassName: "text-center justify-center",
          render: (row) => {
            const perm = permissionsMap[row.feature_id];
            return (
              <div className="flex justify-center">
                <Checkbox
                  id={`perm-update-${row.feature_id}`}
                  checked={perm?.can_update || false}
                  disabled={readOnly}
                  onCheckedChange={
                    readOnly
                      ? undefined
                      : () => handleCellToggle(row.feature_id, "can_update")
                  }
                />
              </div>
            );
          },
        },
        {
          key: "can_delete",
          header: renderColumnHeader("Delete", "can_delete"),
          sortable: false,
          width: "90px",
          className: "text-center",
          headerClassName: "text-center justify-center",
          render: (row) => {
            const perm = permissionsMap[row.feature_id];
            return (
              <div className="flex justify-center">
                <Checkbox
                  id={`perm-delete-${row.feature_id}`}
                  checked={perm?.can_delete || false}
                  disabled={readOnly}
                  onCheckedChange={
                    readOnly
                      ? undefined
                      : () => handleCellToggle(row.feature_id, "can_delete")
                  }
                />
              </div>
            );
          },
        },
      ];

      if (!readOnly) {
        baseCols.push({
          key: "actions",
          header: renderRowAllHeader(),
          sortable: false,
          width: "80px",
          className: "text-center",
          headerClassName: "text-center justify-center",
          render: (row) => {
            const perm = permissionsMap[row.feature_id];
            const isRowFull =
              perm && perm.can_create && perm.can_view && perm.can_update && perm.can_delete;
            return (
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleRowToggleAll(row.feature_id)}
                  className="h-6 w-6 p-0 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-[11px]"
                  title={isRowFull ? "Clear row" : "Select all in row"}
                >
                  {isRowFull ? "✓" : "+"}
                </Button>
              </div>
            );
          },
        });
      }

      return baseCols;
    },
    [
      permissionsMap,
      handleCellToggle,
      handleRowToggleAll,
      renderColumnHeader,
      renderRowAllHeader,
      readOnly,
    ]
  );

  if (!role) return null;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={readOnly ? "Role Permissions (View Only)" : "Role Permission Matrix"}
      subtitle={
        readOnly
          ? `View configured access and CRUD rules for "${role.name}"`
          : `Configure granular access and CRUD rules for "${role.name}"`
      }
      icon={<Key size={18} className="text-slate-800" />}
      size="5xl"
      // preventOutsideClose={!readOnly}
      // closeOnOutsideClick={readOnly}
      isForm={!readOnly}
      isSubmitting={isSaving}
      submitText={readOnly ? undefined : "Save Permissions"}
      loadingText="Saving Permissions..."
      submitVariant="default"
      onSubmit={readOnly ? undefined : handleSubmit}
      customFooter={
        readOnly ? (
          <div className="flex items-center justify-end w-full">
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : undefined
      }
      contentClassName="p-4 sm:p-5 space-y-3"
    >
      <div className="space-y-3">
        {/* Compact Role Meta Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/70">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Shield size={16} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-sm truncate">{role.name}</span>
                <span className="font-mono text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200/80">
                  {role.code}
                </span>
                <StatusPill
                  variant={role.is_active ? "success" : "neutral"}
                  shape="rounded"
                  size="xs"
                  dot={true}
                >
                  {role.is_active ? "Active" : "Inactive"}
                </StatusPill>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Scope:</span>
              {role.entity_name ? (
                <StatusPill
                  variant="neutral"
                  shape="rounded"
                  size="xs"
                  icon={<Building2 size={11} className="text-slate-500" />}
                >
                  {role.entity_name}
                </StatusPill>
              ) : (
                <StatusPill
                  variant="neutral"
                  shape="rounded"
                  size="xs"
                  icon={<Globe size={11} className="text-slate-500" />}
                >
                  Global Platform
                </StatusPill>
              )}
            </div>

            <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
              <Lock size={12} className="text-slate-400" />
              <span className="text-slate-600">
                <strong className="text-slate-900 font-semibold">{totalGrantedCount}</strong> /{" "}
                {matrixData?.features?.length || 70} Configured
              </span>
            </div>
          </div>
        </div>

        {/* Common DataTable Component with Sticky Header and No Pagination for Matrix Modal */}
        <DataTable
          data={matrixData?.features || []}
          columns={columns}
          density="compact"
          stickyHeader={true}
          enablePagination={false}
          enableGlobalFilter={false}
          enableColumnFilters={true}
          enableSorting={true}
          isLoading={isLoading}
          emptyTitle="No features found"
          emptyMessage="No features match your criteria."
        />
      </div>
    </FormModal>
  );
};

export default RolePermissionMatrixModal;



