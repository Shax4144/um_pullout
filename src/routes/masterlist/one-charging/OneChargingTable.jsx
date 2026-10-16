import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";

import StatusToggle from "../../../components/StatusToggle";
import TableWrapper from "../../../components/tables/TableWrapper";

const OneChargingTable = ({
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
        accessorKey: "company_code",
        header: "Company Code",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground">
            {row.getValue("company_code") || "—"}
          </p>
        ),
      },
      {
        accessorKey: "company_name",
        header: "Company Name",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground">
            {row.getValue("company_name") || "—"}
          </p>
        ),
      },
      {
        accessorKey: "business_unit_code",
        header: "Business Unit Code",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground">
            {row.getValue("business_unit_code") || "—"}
          </p>
        ),
      },
      {
        accessorKey: "business_unit_name",
        header: "Business Unit Code",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground">
            {row.getValue("business_unit_name") || "—"}
          </p>
        ),
      },
      {
        accessorKey: "department_code",
        header: "Department",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground">
            {row.getValue("department_code") || "—"}
          </p>
        ),
      },
      {
        accessorKey: "department_name",
        header: "Department",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground">
            {row.getValue("department_name") || "—"}
          </p>
        ),
      },
      {
        accessorKey: "unit_code",
        header: "Unit Code",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground">
            {row.getValue("unit_code") || "—"}
          </p>
        ),
      },
      {
        accessorKey: "unit_name",
        header: "Unit Name",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground">
            {row.getValue("unit_name") || "—"}
          </p>
        ),
      },
      {
        accessorKey: "sub_unit_code",
        header: "Sub Unit Code",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground">
            {row.getValue("sub_unit_code") || "—"}
          </p>
        ),
      },
      {
        accessorKey: "sub_unit_name",
        header: "Sub Unit Name",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground">
            {row.getValue("sub_unit_name") || "—"}
          </p>
        ),
      },
      {
        accessorKey: "location_code",
        header: "Location Code",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground">
            {row.getValue("location_code") || "—"}
          </p>
        ),
      },
      {
        accessorKey: "location_name",
        header: "Location Name",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground">
            {row.getValue("location_name") || "—"}
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

export default OneChargingTable;