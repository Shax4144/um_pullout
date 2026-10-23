import { useEffect, useState } from "react";
import {
  Package,
  Save,
  Plus,
  Trash2,
  ChevronsUpDown,
  Check,
  Loader2,
} from "lucide-react";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

import Datepicker from "../../../../components/Datepicker";
import AccountTitlesDropdown from "@/components/dropdowns/AccountTitlesDropdown";

import { useLazyFetchItemsQuery } from "../../../../api/masterlist/items.api";

const createEmptyItem = () => ({
  item_id: "",
  item_code: "",
  item_name: "",
  uom: "",
  uom_id: "",
  account_title_id: "",
  quantity_to_receive: "",
  actual_received: "",
});

const createEmptyForm = () => ({
  receive_date: new Date(),
  supplier: "",
  remarks: "",
  items: [createEmptyItem()],
});

const normalizeDate = (date) => {
  if (!date) return new Date();

  const parsed = date instanceof Date ? date : parseISO(date);

  return isValid(parsed) ? parsed : new Date();
};

const ReceivingDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading,
  selectedRow,
}) => {
  const isEditMode = Boolean(selectedRow?.id);

  const [formData, setFormData] = useState(createEmptyForm);
  const [activeItemIndex, setActiveItemIndex] = useState(null);

  // =======================================
  // ITEM MASTERLIST - LAZY FETCH
  // =======================================
  const [
    fetchItems,
    { data: itemsData, isFetching: isFetchingItems, isError: isItemsError },
  ] = useLazyFetchItemsQuery();

  useEffect(() => {
    if (!open) return;

    fetchItems({
      status: 1,
      page: 0,
    });
  }, [open, fetchItems]);

  const masterItems = itemsData?.data ?? [];

  // =======================================
  // PREFILL / RESET FORM
  // =======================================
  useEffect(() => {
    if (!open) return;

    if (selectedRow) {
      setFormData({
        receive_date: normalizeDate(
          selectedRow.received_date ?? selectedRow.receive_date,
        ),
        supplier: selectedRow.supplier_name ?? selectedRow.supplier ?? "",
        remarks: selectedRow.remarks ?? "",

        items: (
          selectedRow.inventories ??
          selectedRow.inventory ??
          selectedRow.items ??
          []
        ).map((inventory) => ({
          item_id: String(
            inventory.item?.id ?? inventory.item_id ?? inventory.id ?? "",
          ),

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

          quantity_to_receive:
            inventory.quantity_received ?? inventory.quantity_to_receive ?? "",

          actual_received: inventory.actual_received ?? "",
        })),
      });
    } else {
      setFormData(createEmptyForm());
    }

    setActiveItemIndex(null);
  }, [open, selectedRow]);

  // =======================================
  // FORM HANDLERS
  // =======================================
  const handleDetailChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const addItem = () => {
    setFormData((current) => ({
      ...current,
      items: [...current.items, createEmptyItem()],
    }));
  };

  const removeItem = (index) => {
    setFormData((current) => ({
      ...current,
      items: current.items.filter((_, i) => i !== index),
    }));
  };

  const selectItem = (index, item) => {
    setFormData((current) => {
      const nextItems = [...current.items];

      nextItems[index] = {
        ...nextItems[index],
        item_id: item.id ?? item._id ?? item.item_id ?? "",
        item_code: item.code ?? item.item_code ?? "",
        item_name: item.name ?? item.item_name ?? "",
        uom: item.uom?.name ?? item.uom ?? "",
        uom_id: item.uom_id ?? item.uom?.id ?? item.uom?.uom_id ?? "",
      };

      return {
        ...current,
        items: nextItems,
      };
    });

    setActiveItemIndex(null);
  };

  const handleQuantityChange = (index, field, value) => {
    // Actual received must be a whole, nonnegative number.
    if (field === "actual_received") {
      if (value !== "" && !/^\d+$/.test(value)) return;
    }

    setFormData((current) => ({
      ...current,
      items: current.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
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

  // =======================================
  // SUBMIT
  // =======================================
  const handleSubmit = (event) => {
    event.preventDefault();

    const inventory = formData.items.map((item) => ({
      item_id: Number(item.item_id),
      uom_id: Number(item.uom_id),
      quantity_to_receive: Number(item.quantity_to_receive),
      actual_received: Number(item.actual_received),
      account_title_id: Number(item.account_title_id),
    }));

    // Validate required inventory fields.
    const hasInvalidInventory = inventory.some(
      (item) =>
        !Number.isInteger(item.item_id) ||
        item.item_id <= 0 ||
        !Number.isInteger(item.uom_id) ||
        item.uom_id <= 0 ||
        !Number.isFinite(item.quantity_to_receive) ||
        item.quantity_to_receive < 0 ||
        !Number.isInteger(item.actual_received) ||
        item.actual_received < 0 ||
        !Number.isInteger(item.account_title_id) ||
        item.account_title_id <= 0,
    );

    if (
      inventory.length === 0 ||
      hasInvalidInventory ||
      !formData.supplier.trim()
    ) {
      return;
    }

    const payload = {
      received_date: format(formData.receive_date, "yyyy-MM-dd"),
      supplier_name: formData.supplier.trim(),
      remarks: formData.remarks.trim(),
      inventory,
    };

    onConfirm(payload);
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Package className="size-5" />
            </div>

            <div>
              <DialogTitle>
                {isEditMode ? "View Received Items" : "Receive Items"}
              </DialogTitle>

              <DialogDescription>
                Record the receiving details and quantities of items received.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />
        <form
          id="receiving-form"
          onSubmit={handleSubmit}
          className="grid gap-6 py-2"
        >
          {/* =======================================
              RECEIVING DETAILS
          ======================================= */}
          <section className="grid gap-4">
            <div>
              <h3 className="text-sm font-semibold">Receiving Details</h3>
              <p className="text-sm text-muted-foreground">
                Enter the supplier and receiving information.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Receiving Date</Label>

                <Datepicker
                  variant="outline"
                  value={formData.receive_date}
                  onChange={(date) =>
                    date &&
                    setFormData((current) => ({
                      ...current,
                      receive_date: date,
                    }))
                  }
                  placeholder="Select receiving date"
                  maxDate={new Date()}
                  disabled={isLoading || isEditMode}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleDetailChange}
                  placeholder="Enter supplier name"
                  maxLength={150}
                  required
                  disabled={isLoading || isEditMode}
                />
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

          {/* =======================================
              RECEIVED ITEMS
          ======================================= */}
          <section className="grid gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold">Received Items</h3>
                <p className="text-sm text-muted-foreground">
                  Select items and record the quantities received.
                </p>
              </div>

              {!isEditMode && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addItem}
                  disabled={isLoading}
                >
                  <Plus className="mr-2 size-4" />
                  Add
                </Button>
              )}
            </div>

            {isItemsError && (
              <p className="text-sm text-destructive">
                Unable to load the item masterlist. Please try again.
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => fetchItems({ status: 1, page: 0 })}
                >
                  Retry
                </Button>
              </p>
            )}

            <div className="w-full overflow-x-auto rounded-md shadow-lg">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="min-w-48">Item Code</TableHead>
                    <TableHead className="min-w-40 ">Item Name</TableHead>
                    <TableHead className="min-w-24 ">UOM</TableHead>
                    <TableHead className="min-w-24 ">Account Title</TableHead>
                    <TableHead className="min-w-36 ">
                      Quantity to Receive
                    </TableHead>
                    <TableHead className="min-w-28 ">Remaining</TableHead>
                    <TableHead className="min-w-36">Actual Received</TableHead>
                    {!isEditMode && (
                      <TableHead className="w-16 text-center">Action</TableHead>
                    )}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {formData.items.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No items added. Click Add Item to begin.
                      </TableCell>
                    </TableRow>
                  ) : (
                    formData.items.map((item, index) => {
                      const quantity = Number(item.quantity_to_receive) || 0;
                      const actual = Number(item.actual_received) || 0;
                      const remaining = Math.max(quantity - actual, 0);

                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Popover
                              open={activeItemIndex === index}
                              onOpenChange={(nextOpen) =>
                                setActiveItemIndex(nextOpen ? index : null)
                              }
                            >
                              <PopoverTrigger
                                render={
                                  <Button
                                    type="button"
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={activeItemIndex === index}
                                    className="w-full min-w-44 h-9 justify-between font-normal"
                                    disabled={isLoading || isEditMode}
                                  >
                                    <span className="truncate">
                                      {item.item_code || "Select item code"}
                                    </span>
                                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                                  </Button>
                                }
                              />
                              <PopoverContent
                                className="w-75 p-0"
                                align="start"
                              >
                                <Command>
                                  <CommandInput placeholder="Search item code or name..." />

                                  <CommandList>
                                    {isFetchingItems && (
                                      <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                                        <Loader2 className="size-4 animate-spin" />
                                        Loading items...
                                      </div>
                                    )}

                                    {!isFetchingItems &&
                                      masterItems.length === 0 && (
                                        <CommandEmpty>
                                          No items found.
                                        </CommandEmpty>
                                      )}

                                    <CommandGroup>
                                      {masterItems.map((masterItem) => {
                                        const code =
                                          masterItem.code ??
                                          masterItem.item_code ??
                                          "";
                                        const name =
                                          masterItem.name ??
                                          masterItem.item_name ??
                                          "";

                                        return (
                                          <CommandItem
                                            key={
                                              masterItem.id ??
                                              masterItem._id ??
                                              code
                                            }
                                            value={`${code} ${name}`}
                                            onSelect={() =>
                                              selectItem(index, masterItem)
                                            }
                                          >
                                            <Check
                                              className={`mr-2 size-4 ${
                                                item.item_code === code
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              }`}
                                            />

                                            <div className="flex min-w-0 flex-col">
                                              <span className="font-medium">
                                                {code}
                                              </span>
                                              <span className="truncate text-xs text-muted-foreground">
                                                {name}
                                              </span>
                                            </div>
                                          </CommandItem>
                                        );
                                      })}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </TableCell>

                          <TableCell>
                            <span className="block max-w-48 truncate">
                              {item.item_name || "—"}
                            </span>
                          </TableCell>

                          <TableCell>{item.uom || "—"}</TableCell>

                          <TableCell>
                            <AccountTitlesDropdown
                              value={item.account_title_id}
                              onChange={(accountTitleId) =>
                                handleAccountTitleChange(index, accountTitleId)
                              }
                              open={open}
                              isLoading={isLoading}
                              disabled={isLoading || isEditMode}
                            />
                          </TableCell>

                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="any"
                              value={item.quantity_to_receive}
                              onChange={(event) =>
                                handleQuantityChange(
                                  index,
                                  "quantity_to_receive",
                                  event.target.value,
                                )
                              }
                              placeholder="0"
                              disabled={isLoading || isEditMode}
                              className="min-w-28 hide-arrow"
                            />
                          </TableCell>

                          <TableCell>
                            <span
                              className={
                                remaining > 0
                                  ? "font-medium"
                                  : "text-muted-foreground"
                              }
                            >
                              {remaining}
                            </span>
                          </TableCell>

                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              inputMode="numeric"
                              value={item.actual_received}
                              onChange={(event) =>
                                handleQuantityChange(
                                  index,
                                  "actual_received",
                                  event.target.value,
                                )
                              }
                              placeholder="0"
                              disabled={isLoading || isEditMode}
                              className="min-w-28 hide-arrow"
                            />
                          </TableCell>

                          {!isEditMode && (
                            <TableCell className="text-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => removeItem(index)}
                                disabled={isLoading}
                                aria-label={`Remove ${item.item_code || "item"}`}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        </form>

        <Separator />

        {!isEditMode && (
          <DialogFooter>
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
              form="receiving-form"
              disabled={
                isLoading ||
                formData.items.length === 0 ||
                !formData.supplier.trim() ||
                formData.items.some(
                  (item) =>
                    !item.item_id ||
                    !item.uom_id ||
                    !item.account_title_id ||
                    item.quantity_to_receive === "" ||
                    !Number.isFinite(Number(item.quantity_to_receive)) ||
                    Number(item.quantity_to_receive) < 0 ||
                    item.actual_received === "" ||
                    !Number.isInteger(Number(item.actual_received)) ||
                    Number(item.actual_received) < 0,
                )
              }
            >
              <Save className="mr-2 size-4" />
              {isLoading
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Receive"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReceivingDialog;
