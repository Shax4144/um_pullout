import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { useFetchAccountTitlesQuery } from "@/api/masterlist/account-titles.api";

const AccountTitlesDropdown = ({
  value,
  onChange,
  allowedIds = [],
  open,
  isLoading = false,
  disabled = false,
}) => {
  const [comboOpen, setComboOpen] = useState(false);

  const {
    data: response,
    isFetching,
    isError,
  } = useFetchAccountTitlesQuery(
    { pagination: "none" },
    { skip: !open },
  );

  const accountTitles = Array.isArray(response)
    ? response
    : response?.data ?? [];

  // Only show account titles associated with this item's stock records.
  // const allowedIdSet = new Set(allowedIds.map(String));

  // const filteredAccountTitles = accountTitles.filter((accountTitle) => {
  //   const id = accountTitle.id ?? accountTitle._id;
  //   return allowedIdSet.has(String(id));
  // });

  const selectedAccountTitle = accountTitles.find(
    (accountTitle) =>
      String(accountTitle.id ?? accountTitle._id) === String(value),
  );

  return (
    <Popover
      modal={false}
      open={comboOpen}
      onOpenChange={setComboOpen}
    >
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={comboOpen}
            disabled={isLoading || disabled}
            className="h-9 w-full min-w-20 justify-between font-normal"
          >
            <span className="truncate">
              {isFetching
                ? "Loading..."
                : selectedAccountTitle
                  ? `${selectedAccountTitle.code ?? ""} - ${selectedAccountTitle.name ?? ""}`
                  : "Select account title"}
            </span>

            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        }
      />

      <PopoverContent
        className="w-(--anchor-width) p-0"
        sideOffset={4}
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search account title..." />

          <CommandList className="custom-scrollbar max-h-45 overflow-y-auto">
            {isFetching && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Loading account titles...
              </div>
            )}

            {!isFetching && isError && (
              <CommandEmpty>
                Unable to load account titles.
              </CommandEmpty>
            )}

            {!isFetching &&
              !isError &&
              accountTitles.length === 0 && (
                <CommandEmpty>
                  No account titles available for this item.
                </CommandEmpty>
              )}

            {!isFetching && !isError && accountTitles.length > 0 && (
              <CommandGroup>
                {accountTitles.map((accountTitle) => {
                  const id = accountTitle.id ?? accountTitle._id;

                  return (
                    <CommandItem
                      key={id}
                      value={`${accountTitle.code ?? ""} ${accountTitle.name ?? ""}`}
                      onSelect={() => {
                        onChange(String(id));
                        setComboOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4 shrink-0",
                          String(value) === String(id)
                            ? "text-teal-400 opacity-100"
                            : "opacity-0",
                        )}
                      />

                      <span className="truncate">
                        {accountTitle.code} - {accountTitle.name}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AccountTitlesDropdown;