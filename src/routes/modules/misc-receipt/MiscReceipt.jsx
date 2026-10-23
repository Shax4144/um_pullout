import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArchiveRestore,
  Plus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import MiscReceiptDialog from "./dialog/MiscReceiptDialog";
import Confirm from "../../../components/Confirm";
import DeleteConfirm from "../../../components/DeleteConfirm";
import { toast } from "@/components/ui/toast";

import { useSelectedRow } from "../../../context/SelectedRowProvider";

import {
  useFetchMiscReceiptsQuery,
  usePostMiscReceiptMutation,
  useUpdateMiscReceiptMutation,
  useArchiveMiscReceiptMutation,
} from "../../../api/modules/misc-receipt.api"

import { useLazyFetchReceivingQuery } from "../../../api/modules/receiving.api"

import MiscReceiptTable from "./MiscReceiptTable";

const MiscReceipt= () => {
  // ================================================================
  // TABLE STATE
  // ================================================================

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
    data: miscReceiptsData,
    isFetching: isFetchingMiscReceipts,
    isError: isMiscReceiptsError,
    error: miscReceiptsError,
  } = useFetchMiscReceiptsQuery(
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
  const [
    fetchBatchNumber,
    {
      isFetching: isFetchingBatchNumber,
    },
  ] = useLazyFetchReceivingQuery();


  const handleBatchLookup = useCallback(
    async (batchNo) => {
      const normalizedBatchNo = batchNo.trim();
  
      if (!normalizedBatchNo) {
        throw new Error("Please enter a batch number.");
      }
  
      // Fetch the receiving record using the entered batch number.
      const response = await fetchBatchNumber({
        search: normalizedBatchNo,
        pagination: "none",
      }).unwrap();
  
      return response;
    },
    [fetchBatchNumber],
  );

  // ================================================================
  // DERIVED TABLE DATA
  // ================================================================
  const tableData = useMemo(() => {
    return miscReceiptsData;
  });
  const tableIsFetching = isFetchingMiscReceipts
  const tableIsError = isMiscReceiptsError;
  const tableError = miscReceiptsError;
  
  // ================================================================
  // MUTATIONS
  // ================================================================

  const [
    createMiscReceipt,
    { isLoading: isCreating },
  ] = usePostMiscReceiptMutation();

  const [
    updateMiscReceipt,
    { isLoading: isUpdating },
  ] = useUpdateMiscReceiptMutation();

  const [
    archiveMiscReceipt,
    { isLoading: isArchiving },
  ] = useArchiveMiscReceiptMutation();

  const isMutationLoading =
    isCreating ||
    isUpdating ||
    isArchiving;

  // ================================================================
  // DIALOG STATE
  // ================================================================

  const [openCreate, setOpenCreate] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [openRestore, setOpenRestore] = useState(false);

  const [mode, setMode] = useState("create");

  const {
    selectedRow,
    setSelectedRow,
    clearSelectedRow,
  } = useSelectedRow();

  // ================================================================
  // STATUS
  // ================================================================

  const statusMeta = useMemo(() => {
    const meta = {
      active: {
        label: "Active",
        description:
           "Manage receiving records and track received items.",
      },

      archived: {
        label: "Archived",
        description:
          "View and restore archived receiving records.",
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
  }, [
    clearSelectedRow,
    isMutationLoading,
  ]);

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
    [
      setSelectedRow,
      isMutationLoading,
    ],
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
    [
      setSelectedRow,
      isMutationLoading,
    ],
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
    [
      setSelectedRow,
      isMutationLoading,
    ],
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

  const handleSearchChange = useCallback(
    (value) => {
      setSearch(value);
    },
    [],
  );

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
  }, [
    isCreating,
    isUpdating,
    clearSelectedRow,
  ]);

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
          const response =
            await updateMiscReceipt({
              id: selectedRow.id,
              ...userData,
            }).unwrap();

          toast.add({
            type: "success",
            title: "Miscellaneous receipt updated",
            description: response?.message ??
              "The miscellaneous receipt has been updated successfully.",
          });
        } else {
          const response =
            await createMiscReceipt(userData).unwrap();

          toast.add({
            type: "success",
            title: "Miscellaneous receipt created",
            description: response?.message ??
              "The miscellaneous receipt has been created successfully.",
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
          "An error occurred while processing the miscellaneous receipt.";

        toast.add({
          type: "error",
          title: "Unable to save miscellaneous receipt",
          description: message,
        });

        console.error(
          "Failed to create/update miscellaneous receipt:",
          error,
        );
      }
    },
    [
      isCreating,
      isUpdating,
      selectedRow,
      mode,
      updateMiscReceipt,
      createMiscReceipt,
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
  }, [
    isArchiving,
    clearSelectedRow,
  ]);

  // ================================================================
  // ARCHIVE USER
  // ================================================================

  const handleConfirmArchive = useCallback(
    async () => {
      if (!selectedRow || isArchiving) {
        return;
      }

      try {
        const response =
          await archiveMiscReceipt(
            selectedRow.id,
          ).unwrap();

          toast.add({
            type: "success",
            title: "Miscellaneous receipt archived",
            description: response?.message ??
              "The miscellaneous receipt has been archived successfully.",
          });

        setOpenArchive(false);
        clearSelectedRow();
      } catch (error) {
        const message =
          error?.data?.message ??
          error?.data?.errors?.[0]?.detail ??
          "An error occurred while archiving the miscellaneous receipt.";

        toast.add({
          type: "error",
          title: "Unable to archive miscellaneous receipt",
          description: message,
        });

        console.error(
          "Failed to archive miscellaneous receipt:",
          error,
        );
      }
    },
    [
      selectedRow,
      isArchiving,
      archiveMiscReceipt,
      clearSelectedRow,
    ],
  );

  // ================================================================
  // CLOSE RESTORE
  // ================================================================

  const handleCloseRestore = useCallback(() => {
    if (isArchiving) {
      return;
    }

    setOpenRestore(false);
    clearSelectedRow();
  }, [
    isArchiving,
    clearSelectedRow,
  ]);

  // ================================================================
  // RESTORE USER
  // ================================================================

  const handleConfirmRestore = useCallback(
    async () => {
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
        const response =
          await archiveMiscReceipt(
            selectedRow.id,
          ).unwrap();

        toast.add({
          type: "success",
          title: "Miscellaneous receipt restored",
          description: response?.message ??
            "The miscellaneous receipt has been restored successfully.",
        });

        setOpenRestore(false);
        clearSelectedRow();
      } catch (error) {
        const message =
          error?.data?.message ??
          error?.data?.errors?.[0]?.detail ??
          "An error occurred while restoring the miscellaneous receipt.";

        toast.add({
          type: "error",
          title: "Unable to restore miscellaneous receipt",
          description: message,
        });

        console.error(
          "Failed to restore miscellaneous receipt:",
          error,
        );
      }
    },
    [
      selectedRow,
      isArchiving,
      archiveMiscReceipt,
      clearSelectedRow,
    ],
  );

  // ================================================================
  // KEEP PAGINATION VALID
  //
  // Example:
  // User is on page 5 and archives the last remaining user
  // on page 5. After refetch, page 5 no longer exists.
  // Automatically move back to the last valid page.
  // ================================================================

  useEffect(() => {
    const lastPage =
      tableData?.last_page;

    if (
      !lastPage ||
      tableIsFetching ||
      page <= 1
    ) {
      return;
    }

    if (page > lastPage) {
      setPage(lastPage);
    }
  }, [
    tableData?.last_page,
    tableIsFetching,
    page,
  ]);

  // ================================================================
  // DISPLAY COUNT
  // ================================================================

  const totalRows =
    tableData?.total ??
    0;

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
          Add Receipt
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
        <MiscReceiptTable
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
      <MiscReceiptDialog
        open={openCreate}
        onClose={handleCloseCreate}
        onConfirm={handleCreateOrUpdate}
        isLoading={isCreating || isUpdating}
        mode={mode}
        selectedRow={selectedRow}
        // onBatchLookup={handleBatchLookup}
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

export default MiscReceipt;
