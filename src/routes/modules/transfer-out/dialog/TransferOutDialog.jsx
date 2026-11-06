import { useEffect, useCallback, useState } from "react";
import { ArrowUpFromLine, Save, Loader2, MoveUpRight } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useLazyFetchStockOnHandQuery } from "../../../../api/modules/stock-on-hand.api";
import Dropdown from "@/components/Dropdown";

const createEmptyForm = () => ({
  transferred_to: "",
  remarks: "",
  items: [],
});

const getInventoryId = (stock) =>
  stock.inventory_id ?? stock.inventory?.id ?? "";

const getAccountTitle = (stock) =>
  stock.account_title?.name ??
  stock.account_title_name ??
  stock.records?.[0]?.account_title?.name ??
  stock.records?.[0]?.account_title_name ??
  stock.account_title_id ??
  "—";

const getItemDetails = (stock) => ({
  inventory_id: String(getInventoryId(stock)),
  item_code: stock.item_code ?? stock.item?.code ?? stock.code ?? "",
  item_name: stock.item_name ?? stock.item?.name ?? stock.name ?? "",
  uom: stock.uom_symbol ?? stock.uom?.symbol ?? stock.uom ?? "—",
  account_title: getAccountTitle(stock),
  quantity: "",
  soh: Number(stock.remaining_stock ?? stock.soh ?? 0),
  selected: false,
});

const formatQuantity = (value) => {
  const quantity = Number(value ?? 0);

  return Number.isInteger(quantity) ? String(quantity) : quantity.toFixed(3);
};

const TransferOutDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,
  selectedRow,
  mode,
  recipients = [],
}) => {
  const isViewMode = mode === "view" || (!mode && Boolean(selectedRow?.id));

  const [formData, setFormData] = useState(createEmptyForm);

  const [
    fetchStockOnHand,
    {
      data: sohData,
      isFetching: isFetchingSoh,
      isError: isSohError,
      error: sohError,
    },
  ] = useLazyFetchStockOnHandQuery();

  const loadStockOnHand = useCallback(
    async (isActive = () => true) => {
      try {
        const response = await fetchStockOnHand({
          pagination: "none",
        }).unwrap();

        if (!isActive()) return;

        const stockOnHand = response?.data ?? [];

        setFormData((current) => ({
          ...current,
          items: stockOnHand.map((stock) => getItemDetails(stock)),
        }));
      } catch {
        if (!isActive()) return;

        setFormData((current) => ({
          ...current,
          items: [],
        }));
      }
    },
    [fetchStockOnHand],
  );

  const isNotFound = sohError?.status === 404;

  // Initialize form when opening the dialog.
  useEffect(() => {
    if (!open) return;

    if (isViewMode && selectedRow) {
      const transferItems = (selectedRow.items ?? []).map((item) => {
        const inventory = item.inventory ?? {};

        return {
          inventory_id: String(item.inventory_id ?? inventory.id ?? ""),
          item_code:
            inventory.item?.code ??
            inventory.item_code ??
            inventory.stock_id ??
            "",
          item_name: inventory.item?.name ?? inventory.item_name ?? "—",
          uom: inventory.uom?.symbol ?? inventory.uom?.name ?? "—",
          account_title:
            inventory.account_title?.name ??
            inventory.account_title_name ??
            inventory.account_title_id ??
            "—",
          quantity: formatQuantity(item.quantity),
          soh: Number(inventory.remaining_stock ?? 0),
          selected: true,
        };
      });

      setFormData({
        transferred_to: String(
          selectedRow.transferred_to ?? selectedRow.recipient?.id ?? "",
        ),
        remarks: selectedRow.remarks ?? "",
        items: transferItems,
      });
    } else {
      setFormData(createEmptyForm());
    }
  }, [open, isViewMode, selectedRow]);

  // Populate all stock-on-hand rows when creating.
  useEffect(() => {
    if (!open || isViewMode) return;

    let isActive = true;

    setFormData(createEmptyForm());

    loadStockOnHand(() => isActive);

    return () => {
      isActive = false;
    };
  }, [open, isViewMode, loadStockOnHand]);

  const handleDetailChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSelectItem = (inventoryId, checked) => {
    setFormData((current) => ({
      ...current,
      items: current.items.map((item) =>
        String(item.inventory_id) === String(inventoryId)
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
    setFormData((current) => ({
      ...current,
      items: current.items.map((item) => ({
        ...item,
        selected: checked,
        quantity: checked ? item.quantity : "",
      })),
    }));
  };

  const handleQuantityChange = (inventoryId, value) => {
    // Allow up to 3 decimal places.
    if (value !== "" && !/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }

    setFormData((current) => ({
      ...current,
      items: current.items.map((item) => {
        if (String(item.inventory_id) !== String(inventoryId)) {
          return item;
        }

        if (value !== "" && Number(value) > item.soh) {
          return item;
        }

        return {
          ...item,
          quantity: value,
        };
      }),
    }));
  };

  const selectedItems = formData.items.filter((item) => item.selected);

  const isAllSelected =
    formData.items.length > 0 && formData.items.every((item) => item.selected);

  const isSomeSelected =
    formData.items.some((item) => item.selected) && !isAllSelected;

  const hasInvalidItems = selectedItems.some(
    (item) =>
      !Number.isInteger(Number(item.inventory_id)) ||
      Number(item.inventory_id) <= 0 ||
      item.quantity === "" ||
      !Number.isFinite(Number(item.quantity)) ||
      Number(item.quantity) <= 0 ||
      Number(item.quantity) > item.soh,
  );

  const canSubmit =
    !isLoading &&
    Boolean(formData.transferred_to) &&
    selectedItems.length > 0 &&
    !hasInvalidItems;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!canSubmit) return;

    const payload = {
      transferred_to: Number(formData.transferred_to),
      remarks: formData.remarks.trim(),
      items: selectedItems.map((item) => ({
        inventory_id: Number(item.inventory_id),
        quantity: Number(item.quantity).toFixed(3),
      })),
    };

    onConfirm(payload);
  };

  const recipientName = selectedRow?.recipient
    ? `${selectedRow.recipient.first_name ?? ""} ${
        selectedRow.recipient.last_name ?? ""
      }`.trim()
    : "—";

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ArrowUpFromLine className="size-5" />
            </div>

            <div>
              <DialogTitle>
                {isViewMode ? "View Transfer Out" : "Create Transfer Out"}
              </DialogTitle>

              <DialogDescription>
                {isViewMode
                  ? "Review the recipient, remarks, and transferred items."
                  : "Select the stock-on-hand items you want to transfer and specify their quantities."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <form
          id="transfer-out-form"
          onSubmit={handleSubmit}
          className="grid gap-6 py-2"
        >
          {/* Transfer Details */}
          <section className="grid gap-4">
            <h3 className="text-sm font-semibold">Transfer Details</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="transferred_to">Transfer To</Label>

                {isViewMode ? (
                  <Input value={recipientName} disabled />
                ) : (
                  <Dropdown
                    data={recipients}
                    value={formData.transferred_to}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        transferred_to: value,
                      }))
                    }
                    isLoading={isLoading}
                    placeholder="Select recipient"
                  />
                )}
              </div>

              {isViewMode && (
                <div className="grid gap-2">
                  <Label>Transfer Status</Label>
                  <Input
                    value={selectedRow?.status ?? "—"}
                    disabled
                    className="capitalize"
                  />
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="remarks">Remarks</Label>

                {!isViewMode && (
                  <span className="text-xs text-muted-foreground">
                    {formData.remarks.length}/250
                  </span>
                )}
              </div>

              <Textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleDetailChange}
                placeholder="Enter additional remarks (optional)"
                maxLength={250}
                rows={3}
                disabled={isLoading || isViewMode}
              />
            </div>

            {isViewMode && selectedRow?.status === "rejected" && (
              <div className="grid gap-2">
                <span className="text-xs text-muted-foreground">
                  Rejection Reason
                </span>
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                  {selectedRow.rejection_reason ??
                    "No rejection reason provided."}
                </div>
              </div>
            )}
          </section>

          <Separator />

          {/* Items */}
          <section className="grid gap-4">
            <div>
              <h3 className="text-sm font-semibold">Items</h3>
              <p className="text-sm text-muted-foreground">
                {isViewMode
                  ? "Items included in this transfer."
                  : "Select the items you want to transfer, then specify their quantities."}
              </p>
            </div>

            {!isViewMode && isSohError && !isNotFound && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                Unable to load stock on hand.
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => loadStockOnHand()}
                  disabled={isFetchingSoh}
                >
                  Retry
                </Button>
              </div>
            )}

            {!isViewMode && isFetchingSoh && (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading stock on hand...
              </div>
            )}

            {(isViewMode || !isFetchingSoh) && (
              <div className="w-full overflow-x-auto rounded-md border shadow-md">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      {!isViewMode && (
                        <TableHead className="w-10 text-center">
                          <Checkbox
                            checked={
                              isAllSelected
                                ? true
                                : isSomeSelected
                                  ? "indeterminate"
                                  : false
                            }
                            onCheckedChange={(checked) =>
                              handleSelectAll(checked === true)
                            }
                            disabled={isLoading || formData.items.length === 0}
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

                      <TableHead className="max-w-18 text-center">
                        UOM
                      </TableHead>

                      <TableHead className="min-w-40 text-center">
                        Account Title
                      </TableHead>

                      {!isViewMode && (
                        <TableHead className="max-w-18 text-center">
                          SOH
                        </TableHead>
                      )}

                      <TableHead className="max-w-18 text-center">
                        Quantity
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {formData.items.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={isViewMode ? 5 : 7}
                          className="h-24 text-center text-muted-foreground"
                        >
                          {isViewMode
                            ? "No transferred items found."
                            : "No stock-on-hand items found."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      formData.items.map((item, index) => (
                        <TableRow key={item.inventory_id || `item-${index}`}>
                          {!isViewMode && (
                            <TableCell className="text-center">
                              <Checkbox
                                checked={item.selected}
                                onCheckedChange={(checked) =>
                                  handleSelectItem(
                                    item.inventory_id,
                                    checked === true,
                                  )
                                }
                                disabled={isLoading || isViewMode}
                                aria-label={`Select ${item.item_name}`}
                              />
                            </TableCell>
                          )}

                          <TableCell className="text-center font-medium">
                            {item.item_code || "—"}
                          </TableCell>

                          <TableCell className="text-center">
                            {item.item_name || "—"}
                          </TableCell>

                          <TableCell className="text-center">
                            {item.uom || "—"}
                          </TableCell>

                          <TableCell className="text-center">
                            {item.account_title || "—"}
                          </TableCell>

                          {!isViewMode && (
                            <TableCell className="text-center">
                              {item.soh || "—"}
                            </TableCell>
                          )}

                          <TableCell className="text-center">
                            {isViewMode ? (
                              item.quantity
                            ) : (
                              <Input
                                type="number"
                                min="0"
                                max={item.soh}
                                step="1"
                                inputMode="decimal"
                                value={item.quantity}
                                onChange={(event) =>
                                  handleQuantityChange(
                                    item.inventory_id,
                                    event.target.value,
                                  )
                                }
                                placeholder="0"
                                disabled={
                                  isLoading || isViewMode || !item.selected
                                }
                                className="mx-auto max-w-18 text-center tabular-nums hide-arrow"
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {!isViewMode && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{selectedItems.length} item(s) selected</span>
                <span>Quantity cannot exceed available stock.</span>
              </div>
            )}
          </section>
        </form>

        <Separator />

        <DialogFooter>
          {isViewMode ? (
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
                form="transfer-out-form"
                disabled={!canSubmit}
              >
                <MoveUpRight className="mr-1 size-5" />
                {isLoading ? "Saving..." : "Transfer"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransferOutDialog;
