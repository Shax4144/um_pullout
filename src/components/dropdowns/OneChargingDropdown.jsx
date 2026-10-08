import { useState } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { cn } from "@/lib/utils";
import { useFetchOneChargingQuery } from "../../api/one-charging/one-charging-api";

const OneChargingDropdown = ({ value, onChange, open, isLoading }) => {
  const [comboOpen, setComboOpen] = useState(false);

  const { data: chargingData = [], isFetching } = useFetchOneChargingQuery(
    { pagination: "none" },
    { skip: !open },
  );

  const selectedCharge = chargingData.find(
    (charge) => String(charge.code) === String(value),
  );

  return (
    <Popover modal={false} open={comboOpen} onOpenChange={setComboOpen}>
      <PopoverTrigger
        nativeButton={false}
        render={
          <Input
            readOnly
            autoComplete="off"
            placeholder={isFetching ? "Loading..." : "Select Charging"}
            value={selectedCharge?.name ?? ""}
            disabled={isLoading}
          />
        }
      />

      <PopoverContent
        className="w-(--radix-popover-trigger-width)"
        sideOffset={4}
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search charging..." />

          <CommandList className="custom-scrollbar max-h-70 overflow-y-auto">
            <CommandEmpty>
              {isFetching ? "Loading charging..." : "No charging found."}
            </CommandEmpty>

            {!isFetching && (
              <CommandGroup>
                {chargingData.map((charge) => (
                  <CommandItem
                    key={charge.id}
                    value={[
                      charge.code,
                      charge.name,
                      charge.company_name,
                      charge.department_name,
                      charge.location_name,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onSelect={() => {
                      onChange(charge);
                      setComboOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0",
                        String(value) === String(charge.code)
                          ? "opacity-100 text-teal-400"
                          : "opacity-0",
                      )}
                    />

                    <div className="flex flex-col">
                      <span className="font-medium text-white">{charge.name}</span>

                      <span className="text-xs text-muted-foreground">
                        {charge.code} • {charge.company_name} •{" "}
                        {charge.department_name}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {charge.location_name}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default OneChargingDropdown;
