import { useEffect, useState } from "react";
import { Ruler, Save } from "lucide-react";

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

const EMPTY_ITEM = {
  code: "",
  name: "",
};

const AddUomDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading,
  item,
}) => {
  const isEditMode = Boolean(item?.id);
  const [formData, setFormData] = useState(EMPTY_ITEM);

  useEffect(() => {
    if (!open) return;

    setFormData({
      code: item?.code ?? "",
      name: item?.name ?? "",
    });
  }, [item, open]);

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
    });
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-xl rounded-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Ruler className="size-5" />
            </div>

            <div>
              <DialogTitle>
                {isEditMode ? "Edit UOM" : "Add UOM"}
              </DialogTitle>

              <DialogDescription>
                {isEditMode
                  ? "Update the UOM details."
                  : "Add a new UOM to inventory."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form id="item-form" onSubmit={handleSubmit} className="grid gap-4 py-2 m-2">
          <div className="grid gap-2">
            <Label htmlFor="uom_code">Code</Label>
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
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>

          <Button
            disabled={isLoading}
          >
            <Save className="mr-1 size-4" />
            {isLoading ? "Saving..." : isEditMode ? "Save changes" : "Add UOM"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUomDialog;