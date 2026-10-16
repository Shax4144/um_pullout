import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";

import StatusToggle from "../../../components/StatusToggle";
import TableWrapper from "../../../components/tables/TableWrapper";

const AccountTitleTable = ({
  data,
  isFetching,
  isError,
  error,
  status,
  onStatusChange,
  page,
  onPageChange,
  pageSize,
  onPageSizeChange,
  search,
  onSearchChange,
}) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground">
            {row.getValue("code") || "—"}
          </p>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground">
            {row.getValue("name") || "—"}
          </p>
        ),
      },
      {
        accessorKey: "account_type_name",
        header: "Account Type Name",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground">
            {row.getValue("account_type_name") || "—"}
          </p>
        ),
      },
      {
        accessorKey: "account_group_name",
        header: "Account Group Name",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground">
            {row.getValue("account_group_name") || "—"}
          </p>
        ),
      },
      {
        accessorKey: "account_sub_group_name",
        header: "Account Sub Group Name",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground">
            {row.getValue("account_sub_group_name") || "—"}
          </p>
        ),
      },
      {
        accessorKey: "financial_statement_name",
        header: "Financial Statement Name",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground">
            {row.getValue("financial_statement_name") || "—"}
          </p>
        ),
      },
      {
        accessorKey: "normal_balance_name",
        header: "Normal Balance Name",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground">
            {row.getValue("normal_balance_name") || "—"}
          </p>
        ),
      },
      {
        accessorKey: "allocation_name",
        header: "Allocation Name",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground capitalize">
            {row.getValue("allocation_name") || "—"}
          </p>
        ),
      },
      {
        accessorKey: "account_unit_name",
        header: "Account Unit Name",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground capitalize">
            {row.getValue("account_unit_name") || "—"}
          </p>
        ),
      },
      {
        accessorKey: "charge",
        header: "Charge",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground capitalize">
            {row.getValue("charge") || "—"}
          </p>
        ),
      },
    ],
    [],
  );

  return (
    <TableWrapper
      columns={columns}
      data={data?.data ?? []}
      paginationData={data}
      isFetching={isFetching}
      isError={isError}
      error={error}
      searchKey="name"
      searchValue={search}
      onSearchChange={onSearchChange}
      page={page}
      onPageChange={onPageChange}
      pageSize={pageSize}
      onPageSizeChange={onPageSizeChange}
      filterSlot={
        <StatusToggle
          value={status}
          onChange={onStatusChange}
          options={[]}
        />
      }
    />
  );
};

export default AccountTitleTable;