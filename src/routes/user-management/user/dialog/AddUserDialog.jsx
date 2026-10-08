import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  Building2,
  Check,
  IdCard,
  Loader2,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import OneChargingDropdown from "../../../../components/dropdowns/OneChargingDropdown";
import RolesDropdown from "../../../../components/dropdowns/RolesDropdown";
import { useFetchRolesQuery } from "../../../../api/roles/roles.api";
import { useSelectedRow } from "../../../../context/SelectedRowProvider";
import { toast } from "../../../../components/ui/toast";

const initialForm = {
  idPrefix: "RDFFLFI",
  idNumber: "",
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  position: "",
  username: "",
};

const AddUserDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading,
  mode,
}) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedCharging, setSelectedCharging] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const { selectedRow } = useSelectedRow();

  const isEditMode = mode === "edit";
  const isPendingMode = mode === "pending";
  const isCreateMode = mode === "create";

  const isIdentityLocked =
    isLoading || isEditMode || isPendingMode;

  const isPositionLocked =
    isLoading || isEditMode;

  const isAccountLocked =
    isLoading || isEditMode || isPendingMode;

  // --------------------------------------------------------------
  // MODE TEXT
  // --------------------------------------------------------------

  const dialogContent = useMemo(() => {
    if (isEditMode) {
      return {
        title: "Edit User",
        description:
          "Update this user's account and organizational information.",
        action: "Update User",
        loadingAction: "Updating...",
      };
    }

    if (isPendingMode) {
      return {
        title: "Complete User Setup",
        description:
          "Finish the account setup for this pending user.",
        action: "Create User",
        loadingAction: "Creating...",
      };
    }

    return {
      title: "Create User",
      description:
        "Add a new user and assign their account and organizational details.",
      action: "Create User",
      loadingAction: "Creating...",
    };
  }, [isEditMode, isPendingMode]);

  // --------------------------------------------------------------
  // FETCH ROLES
  // --------------------------------------------------------------

  const {
    data: rolesResponse,
    isFetching: isRolesFetching,
  } = useFetchRolesQuery(
    {
      pagination: "none",
      refetchOnMountOrArgChange: true,
    },
    {
      skip: !open,
    },
  );

  const rolesData =
    rolesResponse?.data ??
    [];

  // --------------------------------------------------------------
  // INITIALIZE / RESET FORM
  // --------------------------------------------------------------

  useEffect(() => {
    if (!open) {
      return;
    }

    if (selectedRow) {
      const [employeePrefix = "RDFFLFI", employeeNumber = ""] =
        selectedRow.employee_id?.split(" - ") ?? [];

      setFormData({
        idPrefix: employeePrefix,
        idNumber: employeeNumber,
        firstName: selectedRow.first_name ?? "",
        middleName: selectedRow.middle_name ?? "",
        lastName: selectedRow.last_name ?? "",
        suffix: selectedRow.suffix ?? "",
        position: selectedRow.position ?? "",
        username:
          selectedRow?.id_prefix && selectedRow?.id_no
            ? `${selectedRow.id_prefix}-${selectedRow.id_no}`
            : (selectedRow.username ?? ""),
      });

      setSelectedRole(selectedRow.role ?? "");

      setSelectedCharging({
        code: selectedRow.charging_code,
        name: selectedRow.charging_name,
        company_code: selectedRow.company_code,
        company_name: selectedRow.company_name,
        business_unit_code: selectedRow.business_unit_code,
        business_unit_name: selectedRow.business_unit_name,
        department_code: selectedRow.department_code,
        department_name: selectedRow.department_name,
        unit_code: selectedRow.unit_code,
        unit_name: selectedRow.unit_name,
        sub_unit_code: selectedRow.sub_unit_code,
        sub_unit_name: selectedRow.sub_unit_name,
        location_code: selectedRow.location_code,
        location_name: selectedRow.location_name,
      });

      return;
    }

    setFormData(initialForm);
    setSelectedRole("");
    setSelectedCharging(null);
  }, [open, selectedRow]);

  // --------------------------------------------------------------
  // GENERATED USERNAME
  // --------------------------------------------------------------

  const generatedUsername = useMemo(() => {
    if (!isCreateMode) {
      return formData.username;
    }

    const prefix = formData.idPrefix?.trim();
    const number = formData.idNumber?.trim();

    if (!prefix || !number) {
      return "";
    }

    return `${prefix}-${number}`;
  }, [
    isCreateMode,
    formData.idPrefix,
    formData.idNumber,
    formData.username,
  ]);

  // --------------------------------------------------------------
  // HANDLERS
  // --------------------------------------------------------------

  const handleChange = (field) => (event) => {
    const value = event.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "idPrefix"
          ? value.toUpperCase()
          : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    if (!selectedRole) {
      toast.add({
        type: "warning",
        title: "Role required",
        description: "Please select a role before continuing.",
      });
      return;
    }

    if (!selectedCharging) {
      toast.add({
        type: "warning",
        title: "One Charging required",
        description: "Please select a One Charging assignment before continuing.",
      });
      return;
    }

    if (!formData.firstName.trim()) {
      toast.add({
        type: "warning",
        title: "First name required",
        description: "Please enter the user's first name.",
      });
      return;
    }

    if (!formData.lastName.trim()) {
      toast.add({
        type: "warning",
        title: "Last name required",
        description: "Please enter the user's last name.",
      });
      return;
    }

    if (!formData.idPrefix.trim() || !formData.idNumber.trim()) {
      toast.add({
        type: "warning",
        title: "Employee ID required",
        description: "Please provide both the ID prefix and ID number.",
      });
      return;
    }

    if (!formData.position.trim()) {
      toast.add({
        type: "warning",
        title: "Position required",
        description: "Please enter the user's position.",
      });
      return;
    }

    const matchedRole = rolesData.find(
      (role) => role.name === selectedRole,
    );

    const username = generatedUsername;

    const payload = {
      employee_id: `${formData.idPrefix.trim()} - ${formData.idNumber.trim()}`,

      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      middle_name: formData.middleName.trim(),
      suffix: formData.suffix.trim(),
      position: formData.position.trim(),

      charging_code: selectedCharging.code,
      charging_name: selectedCharging.name,

      company_code: selectedCharging.company_code,
      company_name: selectedCharging.company_name,

      business_unit_code:
        selectedCharging.business_unit_code,
      business_unit_name:
        selectedCharging.business_unit_name,

      department_code:
        selectedCharging.department_code,
      department_name:
        selectedCharging.department_name,

      unit_code: selectedCharging.unit_code,
      unit_name: selectedCharging.unit_name,

      sub_unit_code:
        selectedCharging.sub_unit_code,
      sub_unit_name:
        selectedCharging.sub_unit_name,

      location_code:
        selectedCharging.location_code,
      location_name:
        selectedCharging.location_name,

      username,

      password: selectedRow?.username ?? "",

      role_id: matchedRole?.id,
    };

    onConfirm(payload);
  };

  // --------------------------------------------------------------
  // FIELD HELPERS
  // --------------------------------------------------------------

  const RequiredMark = () => (
    <span
      className="ml-0.5 text-destructive"
      aria-hidden="true"
    >
      *
    </span>
  );

  const SectionHeader = ({
    icon: Icon,
    title,
    description,
  }) => (
    <div className="flex items-start gap-3">
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-primary/10
          text-primary
        "
      >
        <Icon className="h-4.5 w-4.5" />
      </div>

      <div className="min-w-0">
        <h3 className="text-sm font-semibold">
          {title}
        </h3>

        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
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
          max-h-[80vh]
          w-[calc(100%-2rem)]
          max-w-3xl
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
        <DialogHeader className="shrink-0 border-b px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            {dialogContent.title}
          </DialogTitle>

          <DialogDescription className="max-w-2xl text-sm leading-relaxed">
            {dialogContent.description}
          </DialogDescription>
        </DialogHeader>

        {/* ==========================================================
            FORM BODY
        ========================================================== */}
        <form
          id="add-user-form"
          onSubmit={handleSubmit}
          className="custom-scrollbar min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-8 px-6 py-6">
            {/* ======================================================
                PERSONAL INFORMATION
            ====================================================== */}
            <section className="space-y-5">
              <SectionHeader
                icon={UserRound}
                title="Personal Information"
                description="Basic identity information associated with the employee."
              />

              <div className="rounded-xl border border-input-border bg-muted/20 p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* ID Prefix */}
                  <div className="space-y-1.5">
                    <Label htmlFor="id-prefix">
                      ID Prefix <RequiredMark />
                    </Label>

                    <Input
                      id="id-prefix"
                      value={formData.idPrefix}
                      onChange={handleChange("idPrefix")}
                      placeholder="e.g. RDFFLFI"
                      required
                      disabled={isIdentityLocked}
                      autoComplete="off"
                      className="uppercase"
                    />
                  </div>

                  {/* ID Number */}
                  <div className="space-y-1.5">
                    <Label htmlFor="id-number">
                      ID Number <RequiredMark />
                    </Label>

                    <Input
                      id="id-number"
                      value={formData.idNumber}
                      onChange={handleChange("idNumber")}
                      placeholder="Employee number"
                      required
                      disabled={isIdentityLocked}
                      autoComplete="off"
                    />
                  </div>
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  Employee ID fields are locked when editing or
                  completing a pending account.
                </p>
              </div>

              {/* Name */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="first-name">
                    First Name <RequiredMark />
                  </Label>

                  <Input
                    id="first-name"
                    value={formData.firstName}
                    onChange={handleChange("firstName")}
                    placeholder="First name"
                    required
                    disabled={isIdentityLocked}
                    autoComplete="given-name"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="last-name">
                    Last Name <RequiredMark />
                  </Label>

                  <Input
                    id="last-name"
                    value={formData.lastName}
                    onChange={handleChange("lastName")}
                    placeholder="Last name"
                    required
                    disabled={isIdentityLocked}
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="middle-name">
                    Middle Name
                  </Label>

                  <Input
                    id="middle-name"
                    value={formData.middleName}
                    onChange={handleChange("middleName")}
                    placeholder="Middle name"
                    disabled={isIdentityLocked}
                    autoComplete="additional-name"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="suffix">
                    Suffix
                  </Label>

                  <Input
                    id="suffix"
                    value={formData.suffix}
                    onChange={handleChange("suffix")}
                    placeholder="Jr., Sr., III..."
                    disabled={isIdentityLocked}
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Position */}
              <div className="space-y-1.5">
                <Label htmlFor="position">
                  Position <RequiredMark />
                </Label>

                <Input
                  id="position"
                  value={formData.position}
                  onChange={handleChange("position")}
                  placeholder="e.g. Software Developer"
                  required
                  disabled={isPositionLocked}
                  autoComplete="organization-title"
                />

                {isEditMode && (
                  <p className="text-xs text-muted-foreground">
                    Position cannot be changed while editing this
                    account.
                  </p>
                )}
              </div>
            </section>

            <Separator />

            {/* ======================================================
                ACCOUNT
            ====================================================== */}
            <section className="space-y-5">
              <SectionHeader
                icon={ShieldCheck}
                title="Account"
                description="Login and access settings for this user."
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Username */}
                <div className="space-y-1.5">
                  <Label htmlFor="username">
                    Username
                  </Label>

                  <div className="relative">
                    <Input
                      id="username"
                      value={generatedUsername}
                      readOnly
                      disabled={isAccountLocked}
                      className="bg-muted/50 pr-10 font-mono text-sm"
                    />

                    {generatedUsername && (
                      <Check
                        className="
                          absolute
                          right-3
                          top-1/2
                          h-4
                          w-4
                          -translate-y-1/2
                          text-emerald-500
                        "
                      />
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Automatically generated from the employee ID.
                  </p>
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <Label>
                    Role <RequiredMark />
                  </Label>

                  <RolesDropdown
                    rolesData={rolesData}
                    value={selectedRole}
                    onChange={setSelectedRole}
                    open={open}
                    isLoading={
                      isLoading || isRolesFetching
                    }
                  />
                </div>
              </div>
            </section>

            <Separator />

            {/* ======================================================
                ORGANIZATION
            ====================================================== */}
            <section className="space-y-5">
              <SectionHeader
                icon={Building2}
                title="Organization"
                description="Assign the user's One Charging and organizational structure."
              />

              <div className="rounded-xl border border-input-border bg-muted/20 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <IdCard className="h-4 w-4 text-muted-foreground" />

                  <div>
                    <p className="text-sm font-medium">
                      One Charging
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Select the organizational assignment for
                      this user.
                    </p>
                  </div>
                </div>

                <OneChargingDropdown
                  value={selectedCharging?.code ?? ""}
                  onChange={setSelectedCharging}
                  open={open}
                  isLoading={isLoading}
                />
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
            <span className="text-destructive">*</span>{" "}
            Required fields
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
              form="add-user-form"
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
                  <Loader2 className="h-4 w-4 animate-spin" />
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

export default AddUserDialog;
