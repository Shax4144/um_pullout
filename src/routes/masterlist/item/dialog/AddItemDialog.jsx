import { useEffect, useState } from "react";
import { Package, Save } from "lucide-react";

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

import CategoriesDropdown from "@/components/dropdowns/CategoriesDropdown";
import { useLazyFetchCategoriesQuery } from "../../../../api/masterlist/categories.api";
import { useLazyFetchUomsQuery } from "../../../../api/masterlist/uom.api";
import { useLazyFetchWarehousesQuery } from "../../../../api/masterlist/warehouses.api";
import Dropdown from "@/components/Dropdown";

const EMPTY_ITEM = {
  code: "",
  name: "",
  category_id: "",
  uom_id: "",
  warehouse_id: "",
};

const AddItemDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading,
  selectedRow,
}) => {
  const isEditMode = Boolean(selectedRow?.id);
  const [formData, setFormData] = useState(EMPTY_ITEM);

  // =======================================
  // CATEGORY DROPDOWN
  // =======================================
  const [
    fetchCategories,
    {
      data: categoriesData,
      isFetching: isFetchingCategories,
      isError: isCategoriesError,
    },
  ] = useLazyFetchCategoriesQuery();

  useEffect(() => {
    if (open) {
      fetchCategories(
        {
          status: 1,
          page: "none",
        },
        true,
      );
    }
  }, [open, fetchCategories]);

  // =======================================
  // UOM DROPDOWN
  // =======================================
  const [
    fetchUOMs,
    { data: uomsData, isFetching: isFetchingUOMs, isError: isUOMsError },
  ] = useLazyFetchUomsQuery();

  useEffect(() => {
    if (open) {
      fetchUOMs(
        {
          status: 1,
          page: "none",
        },
        true,
      );
    }
  }, [open, fetchUOMs]);

  // =======================================
  // UOM DROPDOWN
  // =======================================
  const [
    fetchWarehouses,
    {
      data: warehousesData,
      isFetching: isFetchingWarehouses,
      isError: isWarehouses,
      Error,
    },
  ] = useLazyFetchWarehousesQuery();

  useEffect(() => {
    if (open) {
      fetchWarehouses(
        {
          status: 1,
          page: "none",
        },
        true,
      );
    }
  }, [open, fetchWarehouses]);

  // =======================================
  // prefill on edit
  // =======================================
  useEffect(() => {
    if (!open) return;

    setFormData({
      code: selectedRow?.code ?? "",
      name: selectedRow?.name ?? "",
      category_id:
        selectedRow?.category_id != null ? String(selectedRow.category_id) : "",
      uom_id: selectedRow?.uom_id != null ? String(selectedRow.uom_id) : "",
      warehouse_id:
        selectedRow?.warehouse_id != null
          ? String(selectedRow.warehouse_id)
          : "",
    });
  }, [selectedRow, open]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onConfirm({
      ...formData,
      code: formData.code.trim(),
      name: formData.name.trim(),
      category_id: Number(formData.category_id),
      uom_id: Number(formData.uom_id),
      warehouse_id: Number(formData.warehouse_id),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-xl rounded-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Package className="size-5" />
            </div>

            <div>
              <DialogTitle>{isEditMode ? "Edit Item" : "Add Item"}</DialogTitle>

              <DialogDescription>
                {isEditMode
                  ? "Update the inventory item details."
                  : "Add a new item to inventory."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          id="item-form"
          onSubmit={handleSubmit}
          className="grid gap-4 py-2"
        >
          <div className="grid gap-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              disabled={isLoading}
              required
              placeholder="e.g. ITEM-001"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              required
              placeholder="e.g. Ballpen"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Dropdown
                data={categoriesData?.data ?? []}
                value={formData.category_id}
                onChange={(value) =>
                  setFormData((current) => ({
                    ...current,
                    category_id: value,
                  }))
                }
                open={open}
                isLoading={isLoading || isFetchingCategories}
                placeholder="Select Category"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="uom">UOM</Label>
              <Dropdown
                data={uomsData?.data ?? []}
                value={formData.uom_id}
                onChange={(value) =>
                  setFormData((current) => ({
                    ...current,
                    uom_id: value,
                  }))
                }
                open={open}
                isLoading={isLoading || isFetchingUOMs}
                placeholder="Select Unit of Measure"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="warehouse">Warehouse</Label>
            {/* <Input
              id="warehouse"
              name="warehouse"
              value={formData.warehouse}
              onChange={handleChange}
              disabled={isLoading}
              required
            />*/}
            <Dropdown
              data={warehousesData?.data ?? []}
              value={formData.warehouse_id}
              onChange={(value) =>
                setFormData((current) => ({
                  ...current,
                  warehouse_id: value,
                }))
              }
              open={open}
              isLoading={isLoading || isFetchingWarehouses}
              placeholder="Select Warehouse"
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>

          <Button
            type="submit"
            form="item-form"
            disabled={
              isLoading ||
              !formData.category_id ||
              !formData.uom_id ||
              !formData.warehouse_id
            }
          >
            <Save className="mr-1 size-4" />
            {isLoading ? "Saving..." : isEditMode ? "Save changes" : "Add item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
