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

import AddUserDialog from "../user/dialog/AddUserDialog";
import Confirm from "../../../components/Confirm";
import DeleteConfirm from "../../../components/DeleteConfirm";
import { toast } from "@/components/ui/toast";

import { useSelectedRow } from "../../../context/SelectedRowProvider";

// import {
//   useArchiveUserAccountMutation,
//   useFetchUserAccountsQuery,
//   usePostUserAccountMutation,
//   useUpdateUserAccountMutation,
// } from "../../../features/user-accounts/users.api";

// import { useFetchPendingRequestsQuery } from "../../../features/user-accounts/pending-requests.api";

import UserTable from "./UserTable";

const UserAccount = () => {
  // ================================================================
  // TABLE STATE
  // ================================================================

  const [status, setStatus] = useState("active");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // sample 
  const [isMutationLoading, setIsMutationLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  

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
  // FETCH ACTIVE / ARCHIVED USERS
  // ================================================================

  // const {
  //   data: userAccountsData,
  //   isFetching: isFetchingUsers,
  //   isError: isUsersError,
  //   error: usersError,
  // } = useFetchUserAccountsQuery(
  //   {
  //     status: isArchived ? 0 : 1,
  //     page,
  //     per_page: pageSize,
  //     search: debouncedSearch || undefined,
  //   },
  //   {
  //     refetchOnMountOrArgChange: true,
  //   },
  // );

  // ================================================================
  // FETCH PENDING REQUESTS
  // ================================================================

  // const {
  //   data: pendingRequestsData,
  //   isFetching: isFetchingPending,
  //   isError: isPendingError,
  //   error: pendingError,
  // } = useFetchPendingRequestsQuery(
  //   {
  //     page,
  //     per_page: pageSize,
  //     search: debouncedSearch || undefined,
  //   },
  //   {
  //     skip: !isPending,
  //     refetchOnMountOrArgChange: true,
  //   },
  // );

  // ================================================================
  // DERIVED TABLE DATA
  // ================================================================
  const tableData = [];
  const tableIsFetching = false
  const tableIsError = false;
  const tableError = null;
  // const tableData = useMemo(() => {
  //   return isPending
  //     ? pendingRequestsData
  //     : userAccountsData;
  // }, [
  //   isPending,
  //   pendingRequestsData,
  //   userAccountsData,
  // ]);

  // const tableIsFetching = isPending
  //   ? isFetchingPending
  //   : isFetchingUsers;

  // const tableIsError = isPending
  //   ? isPendingError
  //   : isUsersError;

  // const tableError = isPending
  //   ? pendingError
  //   : usersError;

  // ================================================================
  // MUTATIONS
  // ================================================================

  // const [
  //   createUserAccount,
  //   { isLoading: isCreating },
  // ] = usePostUserAccountMutation();

  // const [
  //   updateUserAccount,
  //   { isLoading: isUpdating },
  // ] = useUpdateUserAccountMutation();

  // const [
  //   archiveUserAccount,
  //   { isLoading: isArchiving },
  // ] = useArchiveUserAccountMutation();

  // const isMutationLoading =
  //   isCreating ||
  //   isUpdating ||
  //   isArchiving;

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
          "Manage active system users and their roles.",
      },

      pending: {
        label: "Pending",
        description:
          "Review and complete pending user accounts.",
      },

      archived: {
        label: "Archived",
        description:
          "View and restore archived user accounts.",
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
  // CREATE PENDING USER
  // ================================================================

  const handleOpenCreatePending = useCallback(
    (user) => {
      if (isMutationLoading) {
        return;
      }

      setSelectedRow(user);
      setMode("pending");
      setOpenCreate(true);
    },
    [
      setSelectedRow,
      isMutationLoading,
    ],
  );

  // ================================================================
  // EDIT USER
  // ================================================================

  const handleOpenEdit = useCallback(
    (user) => {
      if (isMutationLoading) {
        return;
      }

      setSelectedRow(user);
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
    (user) => {
      if (isMutationLoading) {
        return;
      }

      setSelectedRow(user);
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
            // await updateUserAccount({
            //   id: selectedRow.id,
            //   ...userData,
            // }).unwrap();

          toast.add({
            type: "success",
            title: "User updated",
            description: response?.message ??
              "The user account has been updated successfully.",
          });
        } else {
          const response =
            // await createUserAccount(userData).unwrap();

          toast.add({
            type: "success",
            title: "User created",
            description: response?.message ??
              "The user account has been created successfully.",
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
          "An error occurred while processing the user account.";

        toast.add({
          type: "error",
          title: "Unable to save user",
          description: message,
        });

        console.error(
          "Failed to create/update user:",
          error,
        );
      }
    },
    [
      isCreating,
      isUpdating,
      selectedRow,
      mode,
      // updateUserAccount,
      // createUserAccount,
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
          // await archiveUserAccount(
          //   selectedRow.id,
          // ).unwrap();

          toast.add({
            type: "success",
            title: "User archived",
            description: response?.message ??
              "The user account has been archived successfully.",
          });

        setOpenArchive(false);
        clearSelectedRow();
      } catch (error) {
        const message =
          error?.data?.message ??
          error?.data?.errors?.[0]?.detail ??
          "An error occurred while archiving the user account.";

        toast.add({
          type: "error",
          title: "Unable to archive user",
          description: message,
        });

        console.error(
          "Failed to archive user:",
          error,
        );
      }
    },
    [
      selectedRow,
      isArchiving,
      // archiveUserAccount,
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
          // await archiveUserAccount(
          //   selectedRow.id,
          // ).unwrap();

        toast.add({
          type: "success",
          title: "User restored",
          description: response?.message ??
            "The user account has been restored successfully.",
        });

        setOpenRestore(false);
        clearSelectedRow();
      } catch (error) {
        const message =
          error?.data?.message ??
          error?.data?.errors?.[0]?.detail ??
          "An error occurred while restoring the user account.";

        toast.add({
          type: "error",
          title: "Unable to restore user",
          description: message,
        });

        console.error(
          "Failed to restore user:",
          error,
        );
      }
    },
    [
      selectedRow,
      isArchiving,
      // archiveUserAccount,
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              User Accounts
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
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
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
          Create User
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
        <UserTable
          data={tableData}
          isFetching={tableIsFetching}
          isError={tableIsError}
          error={tableError}
          status={status}
          handleStatusChange={handleStatusChange}
          onEdit={handleOpenEdit}
          onArchive={handleOpenArchive}
          onRestore={handleOpenRestore}
          onCreate={handleOpenCreatePending}
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
      <AddUserDialog
        open={openCreate}
        onClose={handleCloseCreate}
        onConfirm={handleCreateOrUpdate}
        isLoading={isCreating || isUpdating}
        mode={mode}
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

export default UserAccount;
