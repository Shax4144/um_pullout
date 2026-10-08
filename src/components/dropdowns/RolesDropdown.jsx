import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const RolesDropdown = ({ rolesData = [], value, onChange, isLoading }) => {
  return (
    <Select value={value ?? ""} onValueChange={onChange} disabled={isLoading}>
      <SelectTrigger className="h-8 w-full">
        <SelectValue placeholder={isLoading ? "Loading..." : "Select Role"} />
      </SelectTrigger>

      <SelectContent alignItemWithTrigger={false}>
        {rolesData.map((role) => (
          <SelectItem key={role.id} value={String(role.name)}>
            {role.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default RolesDropdown;
