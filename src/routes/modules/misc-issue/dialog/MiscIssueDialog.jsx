import { useEffect, useState } from "react";
import { FileOutput, Save, Loader2 } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

import Datepicker from "../../../../components/Datepicker";
import AccountTitlesDropdown from "@/components/dropdowns/AccountTitlesDropdown";
import { useLazyFetchStockOnHandQuery } from "../../../../api/modules/stock-on-hand.api";

const DESCRIPTION_TYPE = [
  { label: "Adjustment", value: "adjustment" },
  { label: "Return", value: "return" },
  { label: "Ending Balance", value: "ending-balance" },
];

const createEmptyItem = (stock = {}) => {
  // Sort oldest record first.
  const records = [...(stock.records ?? [])].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at),
  );

  // Collect unique account title IDs in creation order.
  const accountTitleOptions = [
    ...new Map(
      records
        .filter((record) => record.account_title_id != null)
        .map((record) => [
          String(record.account_title_id),
          { id: String(record.account_title_id) },
        ]),
    ).values(),
  ];

  return {
    item_id: String(stock.item_id ?? ""),
    inventory_id: String(stock.inventory_id ?? ""),
    item_code: stock.item_code ?? "",
    item_name: stock.item_name ?? "",
    uom: stock.uom ?? "",
    uom_id: String(stock.uom_id ?? ""),
    account_title_id: accountTitleOptions[0]?.id ?? "",
    account_title_options: accountTitleOptions,
    quantity: "",
    soh: Number(stock.remaining_stock ?? 0),
    selected: false,
  };
};

const createEmptyForm = () => ({
  date: new Date(),
  description: "",
  remarks: "",
  items: [],
});

const normalizeDate = (date) => {
  if (!date) return new Date();

  const parsed = date instanceof Date ? date : parseISO(date);
  return isValid(parsed) ? parsed : new Date();
};

const MiscIssueDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading,
  selectedRow,
  tagWarehouseName,
  tagWarehouseId,
}) => {
  const isEditMode = Boolean(selectedRow?.id);

  const [formData, setFormData] = useState(createEmptyForm);

  // =======================================
  // LAZY FETCH STOCK ON HAND
  // =======================================

  const [
    fetchStockOnHand,
    { data: sohData, isFetching: isFetchingSoh, isError: isSohError },
  ] = useLazyFetchStockOnHandQuery();

  // Prefill an existing move order for view mode.
  useEffect(() => {
    if (!open) return;

    if (!selectedRow) {
      setFormData(createEmptyForm());
      return;
    }

    const inventories =
      selectedRow.miscellaneous_issue ??
      selectedRow.miscellaneous_inventory ??
      selectedRow.inventories ??
      selectedRow.inventory ??
      selectedRow.items ??
      [];

    setFormData({
      date: normalizeDate(selectedRow.date),
      description:
        DESCRIPTION_TYPE.find(
          (type) =>
            type.value === selectedRow.transaction_type ||
            type.label.toLowerCase() ===
              selectedRow.transaction_type?.toLowerCase(),
        )?.value ?? "",
      remarks: selectedRow.remarks ?? "",
      items: inventories.map((inventory) => ({
        item_id: String(inventory.item?.id ?? inventory.item_id ?? ""),
        item_code:
          inventory.item?.code ?? inventory.item_code ?? inventory.code ?? "",
        item_name:
          inventory.item?.name ?? inventory.item_name ?? inventory.name ?? "",
        uom:
          inventory.uom?.symbol ?? inventory.uom?.name ?? inventory.uom ?? "",
        uom_id: String(inventory.uom?.id ?? inventory.uom_id ?? ""),
        account_title_id: String(
          inventory.account_title?.id ?? inventory.account_title_id ?? "",
        ),
        quantity:
          Number(inventory.quantity ?? 0) % 1 === 0
            ? String(Number(inventory.quantity ?? 0))
            : Number(inventory.quantity ?? 0).toFixed(2),
        soh: Number(inventory.remaining_stock ?? inventory.soh ?? 0),
        selected: true,
      })),
    });
  }, [open, selectedRow]);

  // Populate the form from stock on hand for a new move order.
  // Do not use the nested records property.
  // Fetch stock-on-hand items when opening a new Move Order dialog
  useEffect(() => {
    if (open && !isEditMode) {
      fetchStockOnHand({ pagination: "none" }, true);
    }
  }, [open, isEditMode, fetchStockOnHand]);

  const stockOnHand = sohData?.data ?? [];

  useEffect(() => {
    if (!open || isEditMode || !sohData?.data) return;

    setFormData((current) => {
      const existingItems = new Map(
        current.items.map((item) => [String(item.item_id), item]),
      );

      return {
        ...current,
        items: stockOnHand.map((stock) => {
          const id = String(stock.item_id);
          const existing = existingItems.get(id);
          const stockItem = createEmptyItem(stock);

          const existingAccountTitleIsValid =
            stockItem.account_title_options.some(
              (option) =>
                option.id === String(existing?.account_title_id ?? ""),
            );

          return {
            ...stockItem,
            selected: existing?.selected ?? false,
            account_title_id: existingAccountTitleIsValid
              ? String(existing.account_title_id)
              : stockItem.account_title_id,
            quantity: existing?.quantity ?? "",
          };
        }),
      };
    });
  }, [open, isEditMode, stockOnHand]);

  const handleDetailChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSelectItem = (itemId, checked) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        String(item.item_id) === String(itemId)
          ? {
              ...item,
              selected: checked,
              quantity: checked ? item.quantity : "",
            }
          : item,
      ),
    }));
  };

  const handleSelectAll = (checked) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => ({
        ...item,
        selected: checked,
        quantity: checked ? item.quantity : "",
      })),
    }));
  };

  const handleQuantityChange = (index, value) => {
    if (value !== "" && !/^\d+$/.test(value)) return;

    setFormData((current) => ({
      ...current,
      items: current.items.map((item, i) => {
        if (i !== index) return item;

        if (value !== "" && Number(value) > item.soh) {
          return item;
        }

        return { ...item, quantity: value };
      }),
    }));
  };

  const handleAccountTitleChange = (index, accountTitleId) => {
    setFormData((current) => ({
      ...current,
      items: current.items.map((item, i) =>
        i === index ? { ...item, account_title_id: accountTitleId } : item,
      ),
    }));
  };

  const isAllSelected =
    formData.items.length > 0 && formData.items.every((item) => item.selected);

  const isSomeSelected =
    formData.items.some((item) => item.selected) && !isAllSelected;

  const selectedItems = formData.items.filter((item) => item.selected);

  const hasInvalidInventory = selectedItems.some(
    (item) =>
      !Number.isInteger(Number(item.item_id)) ||
      Number(item.item_id) <= 0 ||
      !Number.isInteger(Number(item.uom_id)) ||
      Number(item.uom_id) <= 0 ||
      !Number.isInteger(Number(item.account_title_id)) ||
      Number(item.account_title_id) <= 0 ||
      item.quantity === "" ||
      !/^\d+$/.test(String(item.quantity)) ||
      Number(item.quantity) <= 0 ||
      Number(item.quantity) > item.soh,
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    if (selectedItems.length === 0 || hasInvalidInventory) return;

    const issue_inventory = selectedItems.map((item) => ({
      item_id: Number(item.item_id),
      inventory_id: Number(item.inventory_id),
      uom_id: Number(item.uom_id),
      account_title_id: Number(item.account_title_id),
      quantity: Number(item.quantity),
    }));

    onConfirm({
      warehouse_id: tagWarehouseId,
      date: format(formData.date, "yyyy-MM-dd"),
      transaction_type: formData.description.trim(),
      remarks: formData.remarks.trim(),
      miscellaneous_issue: issue_inventory,
    });
  };

  const canSubmit =
    !isLoading &&
    selectedItems.length > 0 &&
    !hasInvalidInventory &&
    formData.description.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileOutput className="size-5" />
            </div>

            <div>
              <DialogTitle>
                {isEditMode
                  ? "View Miscellaneous Issue"
                  : "Miscellaneous Issue"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? "Review the items, their assigned account titles, and quantities in this miscellaneous issue."
                  : "Select items to issue, then specify their account titles and quantities."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <form
          id="issue-form"
          onSubmit={handleSubmit}
          className="grid gap-6 py-2"
        >
          <section className="grid gap-4">
            <h3 className="text-sm font-semibold">Issue Details</h3>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label>Transaction Date</Label>
                <Datepicker
                  variant="outline"
                  value={formData.date}
                  onChange={(date) =>
                    date &&
                    setFormData((current) => ({
                      ...current,
                      date,
                    }))
                  }
                  placeholder="Select move order date"
                  maxDate={new Date()}
                  disabled={isLoading || isEditMode}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="warehouse">Warehouse</Label>
                <Input
                  id="warehouse"
                  name="warehouse"
                  value={tagWarehouseName}
                  onChange={handleDetailChange}
                  placeholder="Enter warehouse"
                  disabled
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Transaction Type</Label>

                <Select
                  value={formData.description}
                  onValueChange={(value) =>
                    setFormData((current) => ({
                      ...current,
                      description: value,
                    }))
                  }
                  disabled={isLoading || isEditMode}
                >
                  <SelectTrigger id="description" className="w-full">
                    <SelectValue placeholder="Select type">
                      {
                        DESCRIPTION_TYPE.find(
                          (type) => type.value === formData.description,
                        )?.label
                      }
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {DESCRIPTION_TYPE.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="remarks">Remarks</Label>
                <span className="text-xs text-muted-foreground">
                  {formData.remarks.length}/250
                </span>
              </div>
              <Textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleDetailChange}
                placeholder="Enter additional remarks (optional)"
                maxLength={250}
                rows={3}
                disabled={isLoading || isEditMode}
              />
            </div>
          </section>

          <Separator />

          <section className="grid gap-4">
            <div>
              <h3 className="text-sm font-semibold">Items</h3>
              <p className="text-sm text-muted-foreground">
                {isEditMode
                  ? "Review the items included in this issue."
                  : "Select the items you want to issue."}
              </p>
            </div>

            {isSohError && !isEditMode && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                Unable to load stock on hand.
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => fetchStockOnHand({ pagination: "none" })}
                >
                  Retry
                </Button>
              </div>
            )}

            {isFetchingSoh && !isEditMode && (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading stock on hand...
              </div>
            )}

            {(!isFetchingSoh || isEditMode) && (
              <div className="w-full overflow-x-auto rounded-md shadow-lg">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      {!isEditMode && (
                        <TableHead className="w-10 text-center">
                          <Checkbox
                            checked={isAllSelected}
                            data-state={
                              isAllSelected
                                ? "checked"
                                : isSomeSelected
                                  ? "indeterminate"
                                  : "unchecked"
                            }
                            onCheckedChange={(checked) =>
                              handleSelectAll(checked === true)
                            }
                            disabled={
                              isLoading ||
                              isEditMode ||
                              formData.items.length === 0
                            }
                            aria-label="Select all items"
                          />
                        </TableHead>
                      )}

                      <TableHead className="min-w-28 text-center">
                        Item Code
                      </TableHead>
                      <TableHead className="min-w-40 text-center">
                        Item Name
                      </TableHead>
                      <TableHead className="min-w-24 text-center">
                        UOM
                      </TableHead>

                      {!isEditMode && (
                        <TableHead className="min-w-20 text-center">
                          SOH
                        </TableHead>
                      )}

                      <TableHead className="min-w-40 text-center">Account Title</TableHead>
                      <TableHead className="min-w-36 text-center">
                        Quantity
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {formData.items.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No stock-on-hand items found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      formData.items.map((item, index) => (
                        <TableRow key={item.item_id || index}>
                          {!isEditMode && (
                            <TableCell className="text-center">
                              <Checkbox
                                checked={item.selected}
                                onCheckedChange={(checked) =>
                                  handleSelectItem(
                                    item.item_id,
                                    checked === true,
                                  )
                                }
                                disabled={isLoading || isEditMode}
                                aria-label={`Select ${item.item_name || item.item_code}`}
                              />
                            </TableCell>
                          )}

                          <TableCell className="font-medium text-center">
                            {item.item_code || "—"}
                          </TableCell>

                          <TableCell className="text-center">
                            {item.item_name || "—"}
                          </TableCell>

                          <TableCell className="text-center">
                            {item.uom || "—"}
                          </TableCell>

                          {!isEditMode && (
                            <TableCell className="text-center tabular-nums">
                              {item.soh}
                            </TableCell>
                          )}

                          <TableCell>
                            <AccountTitlesDropdown
                              value={item.account_title_id}
                              onChange={(accountTitleId) =>
                                handleAccountTitleChange(index, accountTitleId)
                              }
                              // allowedIds={item.account_title_options.map(
                              //   (option) => option.id,
                              // )}
                              open={open}
                              isLoading={isLoading}
                              disabled={
                                isLoading || isEditMode || !item.selected
                              }
                            />
                          </TableCell>

                          <TableCell className="text-center">
                            <Input
                              type="number"
                              min="1"
                              max={item.soh}
                              step="1"
                              inputMode="numeric"
                              value={item.quantity}
                              onChange={(event) =>
                                handleQuantityChange(index, event.target.value)
                              }
                              placeholder="0"
                              disabled={
                                isLoading || isEditMode || !item.selected
                              }
                              className="max-w-18 hide-arrow text-center"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </section>
        </form>

        <Separator />

        <DialogFooter>
          {isEditMode ? (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Close
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="issue-form"
                disabled={!canSubmit}
              >
                <Save className="mr-2 size-4" />
                {isLoading ? "Saving..." : "Issue"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MiscIssueDialog;
