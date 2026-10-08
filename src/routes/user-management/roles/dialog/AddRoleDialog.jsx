import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Check, ChevronDown, LockKeyhole, ShieldCheck, X } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useSelectedRow } from "../../../../context/SelectedRowProvider";
import { toast } from "../../../../components/ui/toast";

/* ====================================================================
   ROLE OPTIONS

   These are intentionally constant.

   Change this list to the actual roles your system supports.
==================================================================== */

const ROLE_OPTIONS = [
  {
    value: "admin",
    label: "Administrator",
    description: "Full access to system features and management.",
  },
  {
    value: "manager",
    label: "Manager",
    description: "Manage assigned operational data and activities.",
  },
  {
    value: "auditor",
    label: "Auditor",
    description: "Review records and perform audit-related tasks.",
  },
  {
    value: "user",
    label: "User",
    description: "Standard system access.",
  },
];

/* ====================================================================
   PERMISSION OPTIONS

   Add/remove permissions here as your application grows.

   The color classes are intentionally different so selected badges
   are easier to distinguish visually.
==================================================================== */

const PERMISSION_OPTIONS = [
  {
    value: "dashboard",
    label: "Dashboard",
    description: "View system dashboard and summaries.",
    badgeClass:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
    dotClass: "bg-sky-500",
  },
  {
    value: "masterlist",
    label: "Masterlist",
    description: "Manage masterlist records.",
    badgeClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
  },
  {
    value: "user-management",
    label: "User Management",
    description: "Manage users and their accounts.",
    badgeClass:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300",
    dotClass: "bg-rose-500",
  },
  {
    value: "inventory",
    label: "Inventory",
    description: "Monitor inventory",
    badgeClass:
      "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300",
    dotClass: "bg-cyan-500",
  },
];

const getPermission = (value) =>
  PERMISSION_OPTIONS.find((permission) => permission.value === value);

const AddRoleDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading,
  mode = "create",
}) => {
  const { selectedRow } = useSelectedRow();

  const isEditMode = mode === "edit";

  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  /* ==================================================================
     MODE CONTENT
  ================================================================== */

  const dialogContent = useMemo(() => {
    if (isEditMode) {
      return {
        title: "Edit Role",
        description:
          "Update the role name and permissions assigned to this role.",
        action: "Update Role",
        loadingAction: "Updating...",
      };
    }

    return {
      title: "Create Role",
      description:
        "Create a role and assign the permissions available to that role.",
      action: "Create Role",
      loadingAction: "Creating...",
    };
  }, [isEditMode]);

  /* ==================================================================
     INITIALIZE FORM
  ================================================================== */

  useEffect(() => {
    if (!open) {
      return;
    }

    if (selectedRow) {
      /*
       * Supports either:
       *
       * permissions: ["checklist", "masterlist"]
       *
       * OR
       *
       * permissions: [
       *   { name: "checklist" },
       *   { name: "masterlist" }
       * ]
       */

      const normalizedPermissions = Array.isArray(selectedRow.permissions)
        ? selectedRow.permissions
            .map((permission) =>
              typeof permission === "string"
                ? permission
                : (permission?.name ?? permission?.value ?? ""),
            )
            .filter(Boolean)
        : [];

      setSelectedRole(selectedRow.name ?? selectedRow.role_name ?? "");

      setSelectedPermissions(normalizedPermissions);

      return;
    }

    setSelectedRole("");
    setSelectedPermissions([]);
  }, [open, selectedRow]);

  /* ==================================================================
     ROLE CHANGE
  ================================================================== */

  const handleRoleChange = (value) => {
    setSelectedRole(value);
  };

  /* ==================================================================
     PERMISSION TOGGLE
  ================================================================== */

  const handlePermissionToggle = (permission) => {
    setSelectedPermissions((previous) => {
      const exists = previous.includes(permission.value);

      if (exists) {
        return previous.filter((value) => value !== permission.value);
      }

      return [...previous, permission.value];
    });
  };

  /* ==================================================================
     REMOVE PERMISSION
  ================================================================== */

  const handleRemovePermission = (value) => {
    setSelectedPermissions((previous) =>
      previous.filter((permission) => permission !== value),
    );
  };

  /* ==================================================================
     CLEAR ALL
  ================================================================== */

  const handleClearPermissions = () => {
    setSelectedPermissions([]);
  };

  /* ==================================================================
     SUBMIT
  ================================================================== */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    if (!selectedRole) {
      toast.add({
        type: "warning",
        title: "Role required",
        description: "Please select a role name before continuing.",
      });

      return;
    }

    if (!selectedPermissions.length) {
      toast.add({
        type: "warning",
        title: "Permission required",
        description: "Please select at least one permission.",
      });

      return;
    }

    /*
     * Final payload:
     *
     * {
     *   name: "admin",
     *   permissions: [
     *     "dashboard",
     *     "checklist",
     *     "masterlist"
     *   ]
     * }
     */

    const payload = {
      name: selectedRole,
      permissions: selectedPermissions,
    };

    /*
     * Preserve the ID during edit mode if your API expects it.
     */
    if (isEditMode && selectedRow?.id) {
      payload.id = selectedRow.id;
    }

    onConfirm(payload);
  };

  /* ==================================================================
     REQUIRED MARK
  ================================================================== */

  const RequiredMark = () => (
    <span className="ml-0.5 text-destructive" aria-hidden="true">
      *
    </span>
  );

  /* ==================================================================
     SELECTED ROLE
  ================================================================== */

  const selectedRoleData = ROLE_OPTIONS.find(
    (role) => role.value === selectedRole,
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isLoading) {
          return;
        }

        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="
          flex
          max-h-[90vh]
          w-[calc(100%-2rem)]
          max-w-2xl
          flex-col
          gap-0
          overflow-hidden
          rounded-2xl
          p-0
        "
      >
        {/* ==========================================================
            HEADER
        ========================================================== */}

        <DialogHeader
          className="
            shrink-0
            border-b
            px-6
            py-5
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-primary/10
                text-primary
              "
            >
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <DialogTitle
                className="
                  text-xl
                  font-semibold
                  tracking-tight
                "
              >
                {dialogContent.title}
              </DialogTitle>

              <DialogDescription
                className="
                  mt-1
                  max-w-xl
                  text-sm
                  leading-relaxed
                "
              >
                {dialogContent.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* ==========================================================
            BODY
        ========================================================== */}

        <form
          id="role-form"
          onSubmit={handleSubmit}
          className="
            min-h-0
            flex-1
            overflow-y-auto
          "
        >
          <div className="space-y-7 px-6 py-6">
            {/* ======================================================
                ROLE NAME
            ====================================================== */}

            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-muted
                  "
                >
                  <LockKeyhole className="h-4 w-4 text-muted-foreground" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold">Role Name</h3>

                  <p className="text-xs text-muted-foreground">
                    Select the role that best describes this access level.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>
                  Role <RequiredMark />
                </Label>

                <Select
                  value={selectedRole}
                  onValueChange={handleRoleChange}
                  disabled={isLoading}
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select a role..." />
                  </SelectTrigger>

                  <SelectContent
                    alignItemWithTrigger={false}
                    side="bottom"
                    sideOffset={4}
                    className="rounded-xl"
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem
                        key={role.value}
                        value={role.value}
                        className="rounded-lg"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium">{role.label}</span>

                          <span className="text-xs text-muted-foreground">
                            {role.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </section>

            {/* ======================================================
                PERMISSIONS
            ====================================================== */}

            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-muted
                  "
                >
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold">Permissions</h3>

                  <p className="text-xs text-muted-foreground">
                    Select one or more permissions for this role.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* --------------------------------------------------
                    MULTI SELECT
                -------------------------------------------------- */}
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isLoading}
                        className="
                          h-auto
                          min-h-10
                          w-full
                          justify-between
                          gap-2
                          px-3
                          text-left
                        "
                      />
                    }
                  >
                    <div className="flex min-w-0 flex-1 items-center">
                      {selectedPermissions.length > 0 ? (
                        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                          {selectedPermissions.map((value) => {
                            const permission = getPermission(value);

                            if (!permission) {
                              return null;
                            }

                            return (
                              <Badge
                                key={value}
                                variant="outline"
                                className={`
                                  shrink-0
                                  rounded-md
                                  px-2
                                  py-0.5
                                  text-xs
                                  font-medium
                                  ${permission.badgeClass}
                                `}
                              >
                                <span
                                  aria-hidden="true"
                                  className={`
                                    mr-1.5
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    ${permission.dotClass}
                                  `}
                                />

                                {permission.label}
                              </Badge>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="truncate text-sm text-muted-foreground">
                          Select permissions...
                        </span>
                      )}
                    </div>

                    <ChevronDown
                      className="
                        h-4
                        w-4
                        shrink-0
                        text-muted-foreground
                        transition-transform
                        group-data-[popup-open]:rotate-180
                      "
                    />
                  </PopoverTrigger>

                  <PopoverContent
                    align="start"
                    sideOffset={6}
                    className="
                      w-[var(--anchor-width)]
                      min-w-[320px]
                      max-w-[calc(100vw-2rem)]
                      rounded-xl
                      p-2
                    "
                  >
                    <div className="mb-2 flex items-center justify-between px-2 py-1">
                      <div>
                        <p className="text-sm font-medium">
                          Select permissions
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {selectedPermissions.length} selected
                        </p>
                      </div>

                      {selectedPermissions.length > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleClearPermissions}
                          className="
                            h-7
                            cursor-pointer
                            px-2
                            text-xs
                            text-muted-foreground
                            hover:text-foreground
                          "
                        >
                          Clear
                        </Button>
                      )}
                    </div>

                    <div className="space-y-1">
                      {PERMISSION_OPTIONS.map((permission) => {
                        const isSelected = selectedPermissions.includes(
                          permission.value,
                        );

                        return (
                          <button
                            key={permission.value}
                            type="button"
                            onClick={() => handlePermissionToggle(permission)}
                            className="
                                flex
                                w-full
                                cursor-pointer
                                items-center
                                gap-3
                                rounded-lg
                                px-3
                                py-2.5
                                text-left
                                transition-colors
                                hover:bg-muted
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-ring
                              "
                          >
                            {/* Checkbox */}
                            <span
                              className={`
                                  flex
                                  h-4
                                  w-4
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded
                                  border
                                  transition-colors
                                  ${
                                    isSelected
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-input bg-background"
                                  }
                                `}
                            >
                              {isSelected && <Check className="h-3 w-3" />}
                            </span>

                            {/* Permission dot */}
                            <span
                              className={`
                                  h-2
                                  w-2
                                  shrink-0
                                  rounded-full
                                  ${permission.dotClass}
                                `}
                            />

                            {/* Text */}
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium">
                                {permission.label}
                              </span>

                              <span className="mt-0.5 block text-xs text-muted-foreground">
                                {permission.description}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>

                {!selectedPermissions.length && (
                  <p className="text-xs text-muted-foreground">
                    Select at least one permission.
                  </p>
                )}
              </div>
            </section>

            {/* ======================================================
                SUMMARY
            ====================================================== */}

            <section
              className="
                rounded-xl
                border
                bg-muted/30
                p-4
              "
            >
              <div className="flex items-start gap-3">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-background
                    shadow-sm
                  "
                >
                  <Check className="h-4 w-4 text-emerald-500" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium">Role configuration</p>

                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {selectedRole
                      ? `The ${
                          selectedRoleData?.label ?? selectedRole
                        } role will have ${selectedPermissions.length} ${
                          selectedPermissions.length === 1
                            ? "permission"
                            : "permissions"
                        }.`
                      : "Select a role and permissions to configure this role."}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </form>

        {/* ==========================================================
            FOOTER
        ========================================================== */}

        <DialogFooter
          className="
            shrink-0
            border-t
            px-6
            py-4
            sm:justify-between
          "
        >
          <div className="hidden text-xs text-muted-foreground sm:block">
            <span className="text-destructive">*</span> Required fields
          </div>

          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onClose}
              disabled={isLoading}
              className="
                flex-1
                cursor-pointer
                font-medium
                sm:flex-none
              "
            >
              Cancel
            </Button>

            <Button
              form="role-form"
              type="submit"
              size="lg"
              disabled={isLoading}
              className="
                flex-1
                cursor-pointer
                gap-2
                font-semibold
                sm:min-w-32
                sm:flex-none
              "
            >
              {isLoading ? (
                <>
                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-current
                      border-t-transparent
                    "
                  />

                  {dialogContent.loadingAction}
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  {dialogContent.action}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoleDialog;
