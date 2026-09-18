import React, { useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { AccessRestricted, LoadingSpinner } from "@/components/common";
import { useAuth } from "@/context/AuthContext";
import { usePageHeader } from "@/hooks/usePageHeader";
import { usePermission } from "@/hooks/usePermission";
import { isAdmin, isSuperAdmin } from "@/lib/utils";
import { useGetAdminAssociationsQuery } from "@/services/api/associationsApi";
import { useGetUnitDocumentsQuery } from "../api";
import {
  UnitDocumentFormModal,
  UnitDocumentTable,
} from "../components";
import type { UnitDocumentRecord } from "../types";

export const UnitDocumentsPage: React.FC = () => {
  const { account } = useAuth();
  const activeAssociationId = useAppSelector(
    (state) => state.ui.activeAssociationId,
  );
  const {
    canView,
    canCreate,
    isLoading: isPermissionLoading,
  } = usePermission();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] =
    useState<UnitDocumentRecord | null>(null);
  const [documentToView, setDocumentToView] =
    useState<UnitDocumentRecord | null>(null);

  usePageHeader({
    title: "Unit Documents",
    description: "Manage title deeds, insurance records, plans, and unit-specific files.",
  });

  const userIsAdmin =
    isAdmin(account?.role) || isSuperAdmin(account?.role);
  const selectedAssociationId = activeAssociationId
    ? String(activeAssociationId) === "ALL"
      ? undefined
      : String(activeAssociationId)
    : account?.association_id
      ? String(account.association_id)
      : undefined;

  const { data: associations = [] } = useGetAdminAssociationsQuery(undefined, {
    skip: !userIsAdmin,
  });
  const {
    data: documents = [],
    isLoading,
    refetch,
  } = useGetUnitDocumentsQuery(
    selectedAssociationId
      ? { associationId: selectedAssociationId }
      : undefined,
    { skip: !canView },
  );

  const openCreateModal = () => {
    setDocumentToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (document: UnitDocumentRecord) => {
    setDocumentToEdit(document);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDocumentToEdit(null);
  };

  const closeViewModal = () => {
    setDocumentToView(null);
  };

  if (isPermissionLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!canView) {
    return <AccessRestricted moduleName="Unit Documents" showAction />;
  }

  return (
    <div className="space-y-6">
      <UnitDocumentTable
        documents={documents}
        isAdmin={userIsAdmin}
        isLoading={isLoading}
        onAdd={openCreateModal}
        onView={setDocumentToView}
        onEdit={openEditModal}
        onDeleted={refetch}
      />

      {canCreate || documentToEdit ? (
        <UnitDocumentFormModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSuccess={refetch}
          documentToEdit={documentToEdit}
          associations={associations}
          selectedAssociationId={selectedAssociationId}
          isAdmin={userIsAdmin}
        />
      ) : null}

      <UnitDocumentFormModal
        isOpen={Boolean(documentToView)}
        onClose={closeViewModal}
        documentToEdit={documentToView}
        associations={associations}
        selectedAssociationId={selectedAssociationId}
        isAdmin={userIsAdmin}
        mode="view"
      />
    </div>
  );
};

export default UnitDocumentsPage;
