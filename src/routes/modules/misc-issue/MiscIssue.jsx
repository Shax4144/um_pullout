import { useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ArchiveRestore, Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import MiscIssueDialog from "./dialog/MiscIssueDialog";
import Confirm from "../../../components/ActionConfirm";
import DeleteConfirm from "../../../components/DeleteConfirm";
import { toast } from "@/components/ui/toast";

import { useSelectedRow } from "../../../context/SelectedRowProvider";

import {
  useFetchMiscIssuesQuery,
  useLazyFetchMiscIssueByIdQuery,
  usePostMiscIssueMutation,
  useUpdateMiscIssueMutation,
  useArchiveMiscIssueMutation,
} from "../../../api/modules/misc-issue.api";

import MiscIssueTable from "./MiscIssueTable";

const MiscIssue = () => {
  // ================================================================
  // TABLE STATE
  // ================================================================
  const userDetails = useSelector((state) => state.user);
  const tagWarehouseName = userDetails?.warehouse?.name;
  const tagWarehouseId = userDetails?.warehouse_id ?? userDetails?.warehouse?.id;
  
  const [status, setStatus] = useState("active");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const isPending = status === "pending";
  const isArchived = status === "archived";

  // ================================================================
  // SEARCH DEBOUNCE
  // ================================================================

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const normalizedSearch = search.trim();

      setDebouncedSearch(normalizedSearch);
      setPage(1);
    }, 400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [search]);

  // ================================================================
  // FETCH MISC RECEIPTS
  // ================================================================

  const {
    data: miscIssuesData,
    isFetching: isFetchingIssues,
    isError: isIssuesError,
    error: issuesError,
  } = useFetchMiscIssuesQuery(
    {
      status: isArchived ? 0 : 1,
      page,
      per_page: pageSize,
      search: debouncedSearch || undefined,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  // ================================================================
  // FETCH MISC RECEIPTS
  // ================================================================
  //
  // const [
  //   fetchBatchNumber,
  //   {
  //     isFetching: isFetchingBatchNumber,
  //   },
  // ] = useLazyFetchReceivingQuery();

  // const handleBatchLookup = useCallback(
  //   async (batchNo) => {
  //     const normalizedBatchNo = batchNo.trim();

  //     if (!normalizedBatchNo) {
  //       throw new Error("Please enter a batch number.");
  //     }

  //     // Fetch the receiving record using the entered batch number.
  //     const response = await fetchBatchNumber({
  //       search: normalizedBatchNo,
  //       pagination: "none",
  //     }).unwrap();

  //     return response;
  //   },
  //   [fetchBatchNumber],
  // );

  // ================================================================
  // DERIVED TABLE DATA
  // ================================================================
  const tableData = useMemo(() => {
    return miscIssuesData;
  });
  const tableIsFetching = isFetchingIssues;
  const tableIsError = isIssuesError;
  const tableError = issuesError;

  // ================================================================
  // MUTATIONS
  // ================================================================

  const [createMiscIssue, { isLoading: isCreating }] =
    usePostMiscIssueMutation();

  const [updateMiscIssue, { isLoading: isUpdating }] =
    useUpdateMiscIssueMutation();

  const [archiveMiscIssue, { isLoading: isArchiving }] =
    useArchiveMiscIssueMutation();

  const isMutationLoading = isCreating || isUpdating || isArchiving;

  // ================================================================
  // DIALOG STATE
  // ================================================================

  const [openCreate, setOpenCreate] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [openRestore, setOpenRestore] = useState(false);

  const [mode, setMode] = useState("create");

  const { selectedRow, setSelectedRow, clearSelectedRow } = useSelectedRow();

  // ================================================================
  // STATUS
  // ================================================================

  const statusMeta = useMemo(() => {
    const meta = {
      active: {
        label: "Active",
        description:
          "Manage miscellaneous issues and record items issued outside the standard issuance process.",
      },

      archived: {
        label: "Archived",
        description: "View and restore archived miscellaneous issues.",
      },
    };

    return meta[status] ?? meta.active;
  }, [status]);

  // ================================================================
  // CREATE
  // ================================================================

  const handleOpenCreate = useCallback(() => {
    if (isMutationLoading) {
      return;
    }

    clearSelectedRow();
    setMode("create");
    setOpenCreate(true);
  }, [clearSelectedRow, isMutationLoading]);

  // ================================================================
  // EDIT USER
  // ================================================================

  const handleOpenEdit = useCallback(
    (role) => {
      if (isMutationLoading) {
        return;
      }

      setSelectedRow(role);
      setMode("edit");
      setOpenCreate(true);
    },
    [setSelectedRow, isMutationLoading],
  );

  // ================================================================
  // ARCHIVE
  // ================================================================

  const handleOpenArchive = useCallback(
    (role) => {
      if (isMutationLoading) {
        return;
      }

      setSelectedRow(role);
      setOpenArchive(true);
    },
    [setSelectedRow, isMutationLoading],
  );

  // ================================================================
  // RESTORE
  // ================================================================

  const handleOpenRestore = useCallback(
    (user) => {
      if (isMutationLoading) {
        return;
      }

      setSelectedRow(user);
      setOpenRestore(true);
    },
    [setSelectedRow, isMutationLoading],
  );

  // ================================================================
  // STATUS CHANGE
  // ================================================================

  const handleStatusChange = useCallback(
    (nextStatus) => {
      if (nextStatus === status) {
        return;
      }

      setStatus(nextStatus);
      setPage(1);
    },
    [status],
  );

  // ================================================================
  // PAGE SIZE CHANGE
  // ================================================================

  const handlePageSizeChange = useCallback(
    (nextPageSize) => {
      if (nextPageSize === pageSize) {
        return;
      }

      setPageSize(nextPageSize);
      setPage(1);
    },
    [pageSize],
  );

  // ================================================================
  // SEARCH CHANGE
  // ================================================================

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
  }, []);

  // ================================================================
  // CLOSE CREATE / EDIT DIALOG
  // ================================================================

  const handleCloseCreate = useCallback(() => {
    if (isCreating || isUpdating) {
      return;
    }

    setOpenCreate(false);
    setMode("create");
    clearSelectedRow();
  }, [isCreating, isUpdating, clearSelectedRow]);

  // ================================================================
  // CREATE / UPDATE
  // ================================================================

  const handleCreateOrUpdate = useCallback(
    async (userData) => {
      if (isCreating || isUpdating) {
        return;
      }

      try {
        if (selectedRow && mode === "edit") {
          const response = await updateMiscIssue({
            id: selectedRow.id,
            ...userData,
          }).unwrap();

          toast.add({
            type: "success",
            title: "Miscellaneous issue updated",
            description:
              response?.message ??
              "The miscellaneous issue has been updated successfully.",
          });
        } else {
          const response = await createMiscIssue(userData).unwrap();

          toast.add({
            type: "success",
            title: "Miscellaneous issue created",
            description:
              response?.message ??
              "The miscellaneous issue has been created successfully.",
          });
        }

        setOpenCreate(false);
        setMode("create");
        clearSelectedRow();
        setPage(1);
      } catch (error) {
        const message =
          error?.data?.message ??
          error?.data?.errors?.[0]?.detail ??
          "An error occurred while processing the miscellaneous issue.";

        toast.add({
          type: "error",
          title: "Unable to save miscellaneous issue",
          description: message,
        });

        console.error("Failed to create/update miscellaneous issue:", error);
      }
    },
    [
      isCreating,
      isUpdating,
      selectedRow,
      mode,
      updateMiscIssue,
      createMiscIssue,
      clearSelectedRow,
    ],
  );

  // ================================================================
  // CLOSE ARCHIVE
  // ================================================================

  const handleCloseArchive = useCallback(() => {
    if (isArchiving) {
      return;
    }

    setOpenArchive(false);
    clearSelectedRow();
  }, [isArchiving, clearSelectedRow]);

  // ================================================================
  // ARCHIVE USER
  // ================================================================

  const handleConfirmArchive = useCallback(async () => {
    if (!selectedRow || isArchiving) {
      return;
    }

    try {
      const response = await archiveMiscIssue(selectedRow.id).unwrap();

      toast.add({
        type: "success",
        title: "Miscellaneous issue archived",
        description:
          response?.message ??
          "The miscellaneous issue has been archived successfully.",
      });

      setOpenArchive(false);
      clearSelectedRow();
    } catch (error) {
      const message =
        error?.data?.message ??
        error?.data?.errors?.[0]?.detail ??
        "An error occurred while archiving the miscellaneous issue.";

      toast.add({
        type: "error",
        title: "Unable to archive miscellaneous issue",
        description: message,
      });

      console.error("Failed to archive miscellaneous issue:", error);
    }
  }, [selectedRow, isArchiving, archiveMiscIssue, clearSelectedRow]);

  // ================================================================
  // CLOSE RESTORE
  // ================================================================

  const handleCloseRestore = useCallback(() => {
    if (isArchiving) {
      return;
    }

    setOpenRestore(false);
    clearSelectedRow();
  }, [isArchiving, clearSelectedRow]);

  // ================================================================
  // RESTORE USER
  // ================================================================

  const handleConfirmRestore = useCallback(async () => {
    if (!selectedRow || isArchiving) {
      return;
    }

    try {
      /*
       * Preserved your existing archive mutation here.
       *
       * If your backend has a dedicated restore mutation,
       * replace this call with that mutation instead.
       */
      const response = await archiveMiscIssue(selectedRow.id).unwrap();

      toast.add({
        type: "success",
        title: "Miscellaneous issue restored",
        description:
          response?.message ??
          "The miscellaneous issue has been restored successfully.",
      });

      setOpenRestore(false);
      clearSelectedRow();
    } catch (error) {
      const message =
        error?.data?.message ??
        error?.data?.errors?.[0]?.detail ??
        "An error occurred while restoring the miscellaneous issue.";

      toast.add({
        type: "error",
        title: "Unable to restore miscellaneous issue",
        description: message,
      });

      console.error("Failed to restore miscellaneous issue:", error);
    }
  }, [selectedRow, isArchiving, archiveMiscIssue, clearSelectedRow]);

  // ================================================================
  // KEEP PAGINATION VALID
  //
  // Example:
  // User is on page 5 and archives the last remaining user
  // on page 5. After refetch, page 5 no longer exists.
  // Automatically move back to the last valid page.
  // ================================================================

  useEffect(() => {
    const lastPage = tableData?.last_page;

    if (!lastPage || tableIsFetching || page <= 1) {
      return;
    }

    if (page > lastPage) {
      setPage(lastPage);
    }
  }, [tableData?.last_page, tableIsFetching, page]);

  // ================================================================
  // DISPLAY COUNT
  // ================================================================

  const totalRows = tableData?.total ?? 0;

  return (
    <div
      className="
        flex
        h-full
        min-h-0
        flex-col
        gap-5
      "
    >
      {/* ============================================================
          PAGE HEADER
      ============================================================ */}
      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        {/* Title */}
        <div className="min-w-0">
          {/* <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Roles
            </h1>

            <Badge
              variant="secondary"
              className="
                rounded-full
                px-2
                py-0.5
                text-xs
                font-medium
              "
            >
              {statusMeta.label}
            </Badge>
          </div>*/}

          <p className="text-sm text-muted-foreground">
            {statusMeta.description}
          </p>
        </div>

        {/* Action */}
        <Button
          type="button"
          onClick={handleOpenCreate}
          disabled={isMutationLoading}
          className="
            h-10
            w-full
            cursor-pointer
            gap-2
            font-semibold
            sm:w-auto
            sm:min-w-32
          "
        >
          <Plus className="h-4 w-4" />
          Add Issue
        </Button>
      </div>

      {/* ============================================================
          TABLE
      ============================================================ */}
      <div
        className="
          min-h-0
          flex-1
        "
      >
        <MiscIssueTable
          data={tableData}
          isFetching={tableIsFetching}
          isError={tableIsError}
          error={tableError}
          status={status}
          onStatusChange={handleStatusChange}
          onEdit={handleOpenEdit}
          onArchive={handleOpenArchive}
          onRestore={handleOpenRestore}
          page={page}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          search={search}
          onSearchChange={handleSearchChange}
        />
      </div>

      {/* ============================================================
          CREATE / EDIT / PENDING DIALOG
      ============================================================ */}
      <MiscIssueDialog
        open={openCreate}
        onClose={handleCloseCreate}
        onConfirm={handleCreateOrUpdate}
        isLoading={isCreating || isUpdating}
        mode={mode}
        selectedRow={selectedRow}
        tagWarehouseName={tagWarehouseName}
        tagWarehouseId={tagWarehouseId}
      />

      {/* ============================================================
          ARCHIVE CONFIRMATION
      ============================================================ */}
      <DeleteConfirm
        open={openArchive}
        onClose={handleCloseArchive}
        onConfirm={handleConfirmArchive}
        isLoading={isArchiving}
      />

      {/* ============================================================
          RESTORE CONFIRMATION
      ============================================================ */}
      <Confirm
        open={openRestore}
        onClose={handleCloseRestore}
        onConfirm={handleConfirmRestore}
        isLoading={isArchiving}
      />
    </div>
  );
};

export default MiscIssue;
