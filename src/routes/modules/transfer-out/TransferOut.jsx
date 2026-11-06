import { useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

import TransferOutDialog from "./dialog/TransferOutDialog";
import { useSelectedRow } from "../../../context/SelectedRowProvider";

import {
  useFetchTransferItemsQuery,
  useLazyFetchTransferItemByIdQuery,
  useCreateTranferItemMutation,
} from "../../../api/modules/transfers.api";

import { useFetchUserAccountsQuery } from "../../../api/user-management/user-accounts/user-account.api";

import TransferOutTable from "./TransferOutTable";

const TransferOut = () => {
  // ================================================================
  // TABLE STATE
  // ================================================================

  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const currentUser = useSelector((state) => state.user);

  // ================================================================
  // DIALOG STATE
  // ================================================================

  const [openDialog, setOpenDialog] = useState(false);
  const [mode, setMode] = useState("create");

  const { selectedRow, setSelectedRow, clearSelectedRow } = useSelectedRow();

  // ================================================================
  // MUTATIONS
  // ================================================================

  const [createTransferItem, { isLoading: isCreating }] =
    useCreateTranferItemMutation();

  // ================================================================
  // SEARCH DEBOUNCE
  // ================================================================

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [search]);

  // ================================================================
  // FETCH TRANSFER ITEMS
  // ================================================================

  const {
    data: transferItemsData,
    isFetching: isFetchingTransferItems,
    isError: isTransferItemsError,
    error: transferItemsError,
  } = useFetchTransferItemsQuery(
    {
      status,
      direction: "outgoing",
      page,
      per_page: pageSize,
      search: debouncedSearch || undefined,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  // ================================================================
  // FETCH ITEM BY ID
  // ================================================================

  const [fetchTransferItemById, { isFetching: isFetchingTransferItemDetails }] =
    useLazyFetchTransferItemByIdQuery();

  // ================================================================
  // FETCH RECIPIENTS
  // ================================================================

  const {
    data: usersData,
    isFetching: isFetchingUsers,
    isError: isUsersError,
    error: usersError,
  } = useFetchUserAccountsQuery(
    {
      status: 1,
      pagination: "none",
    },
    { refetchOnMountOrArgChange: true },
  );
  
  const recipientOptions = usersData?.data.filter((user) => user.id !== currentUser?.id);

  // ================================================================
  // DERIVED TABLE DATA
  // ================================================================

  const tableData = transferItemsData;

  // ================================================================
  // STATUS
  // ================================================================

  const statusMeta = useMemo(() => {
    const meta = {
      pending: {
        label: "Pending",
        description: "Manage your pending outgoing transfers.",
      },
      accepted: {
        label: "Accepted",
        description: "View accepted outgoing transfers.",
      },
      rejected: {
        label: "Rejected",
        description: "View rejected outgoing transfers.",
      },
    };

    return meta[status] ?? meta.pending;
  }, [status]);

  // ================================================================
  // OPEN CREATE DIALOG
  // ================================================================

  const handleOpenCreate = useCallback(() => {
    if (isCreating) return;

    clearSelectedRow();
    setMode("create");
    setOpenDialog(true);
  }, [isCreating, clearSelectedRow]);

  // ================================================================
  // OPEN VIEW DIALOG
  // ================================================================

  const handleOpenView = useCallback(
    async (item) => {
      if (isCreating || isFetchingTransferItemDetails) return;

      try {
        const response = await fetchTransferItemById(item.id).unwrap();
        const itemDetails = response?.data ?? response;

        setSelectedRow(itemDetails);
        setMode("view");
        setOpenDialog(true);
      } catch (error) {
        const message =
          error?.data?.message ?? "Unable to retrieve the transfer details.";

        toast.add({
          type: "error",
          title: "Unable to load transfer",
          description: message,
        });

        console.error("Failed to fetch transfer:", error);
      }
    },
    [
      isCreating,
      isFetchingTransferItemDetails,
      fetchTransferItemById,
      setSelectedRow,
    ],
  );

  // ================================================================
  // CLOSE DIALOG
  // ================================================================

  const handleCloseDialog = useCallback(() => {
    if (isCreating || isFetchingTransferItemDetails) return;

    setOpenDialog(false);
    setMode("create");
    clearSelectedRow();
  }, [isCreating, isFetchingTransferItemDetails, clearSelectedRow]);

  // ================================================================
  // CREATE TRANSFER
  // ================================================================

  const handleCreateTransfer = useCallback(
    async (payload) => {
      if (isCreating) return;

      try {
        const response = await createTransferItem(payload).unwrap();

        toast.add({
          type: "success",
          title: "Transfer created",
          description:
            response?.message ??
            "The outgoing transfer has been created successfully.",
        });

        setOpenDialog(false);
        setMode("create");
        clearSelectedRow();
      } catch (error) {
        const message =
          error?.data?.message ??
          error?.data?.errors?.[0]?.detail ??
          "An error occurred while creating the transfer.";

        toast.add({
          type: "error",
          title: "Unable to create transfer",
          description: message,
        });

        console.error("Failed to create transfer:", error);
      }
    },
    [isCreating, createTransferItem, clearSelectedRow],
  );

  // ================================================================
  // STATUS CHANGE
  // ================================================================

  const handleStatusChange = useCallback(
    (nextStatus) => {
      if (nextStatus === status) return;

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
      if (nextPageSize === pageSize) return;

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
  // KEEP PAGINATION VALID
  // ================================================================

  useEffect(() => {
    const lastPage = tableData?.last_page;

    if (!lastPage || isFetchingTransferItems || page <= 1) {
      return;
    }

    if (page > lastPage) {
      setPage(lastPage);
    }
  }, [tableData?.last_page, isFetchingTransferItems, page]);

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">
            {statusMeta.description}
          </p>
        </div>

        <Button
          type="button"
          onClick={handleOpenCreate}
          disabled={isCreating}
          className="h-10 w-full cursor-pointer gap-2 font-semibold sm:w-auto sm:min-w-32"
        >
          <Plus className="size-5" />
          Transfer Item
        </Button>
      </div>

      {/* TABLE */}
      <div className="min-h-0 flex-1">
        <TransferOutTable
          data={tableData}
          isFetching={isFetchingTransferItems}
          isError={isTransferItemsError}
          error={transferItemsError}
          status={status}
          onStatusChange={handleStatusChange}
          onView={handleOpenView}
          page={page}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          search={search}
          onSearchChange={handleSearchChange}
        />
      </div>

      {/* CREATE / VIEW DIALOG */}
      <TransferOutDialog
        open={openDialog}
        onClose={handleCloseDialog}
        mode={mode}
        selectedRow={selectedRow}
        onConfirm={handleCreateTransfer}
        isLoading={isCreating}
        recipients={recipientOptions}
      />
    </div>
  );
};

export default TransferOut;
