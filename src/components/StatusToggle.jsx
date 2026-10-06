// const StatusToggle = ({ checked, onCheckedChange }) => {
//   return (
//     <button
//       onClick={() => onCheckedChange(!checked)}
//       className={`top-1 relative w-22.5 h-6 rounded-full transition-colors ${checked ? "bg-input" : "bg-primary"}`}
//     >
//       <div
//         className={`absolute top-0.5 h-5 w-15.5 flex items-center justify-center rounded-full bg-background text-[11px] font-bold text-foreground transition-all duration-300 ${checked ? "left-0.5" : "left-6.5"}`}
//       >
//         <div className="relative h-4 w-full overflow-hidden">
//           <span
//             className={`
//         absolute inset-0 flex items-center justify-center
//         transition-all duration-300
//         ${checked ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"}
//       `}
//           >
//             Archived
//           </span>

//           <span
//             className={`
//             absolute inset-0 flex items-center justify-center
//             transition-all duration-300
//             ${checked ? "translate-x-3 opacity-0" : "translate-x-0 opacity-100"}
//           `}
//           >
//             Active
//           </span>
//         </div>
//       </div>
//     </button>
//   );
// };

// export default StatusToggle;

const StatusToggle = ({
  value,
  onChange,
  options = ["active", "archived"],
}) => {
  const labels = {
    active: "Active",
    pending: "Pending",
    archived: "Archived",
  };

  const colors = {
    active: "bg-primary",
    pending: "bg-yellow-500",
    archived: "bg-input",
  };

  const currentIndex = options.indexOf(value);
  const currentOption = options[currentIndex] ?? options[0];

  // =========================================================
  // 1–2 OPTIONS → SWITCH STYLE
  // =========================================================
  if (options.length <= 2) {
    return (
      <button
        type="button"
        onClick={() => {
          const nextOption = options.find((option) => option !== currentOption);

          if (nextOption) {
            onChange(nextOption);
          }
        }}
        className={`
					relative top-1
					w-22.5 h-6
					rounded-full
					transition-colors
					${colors[currentOption] ?? "bg-primary"}
				`}
      >
        <div
          className={`
						absolute top-0.5
						h-5 w-15.5
						flex items-center justify-center
						rounded-full
						bg-background
						text-[11px]
						font-bold
						text-foreground
						transition-all duration-100
						${currentIndex === 0 ? "left-0.5" : "left-6.5"}
					`}
        >
          <div className="relative h-4 w-full overflow-hidden">
            {options.map((option, index) => (
              <span
                key={option}
                className={`
									absolute inset-0
									flex items-center justify-center
									transition-all duration-300
									${
                    option === currentOption
                      ? "translate-x-0 opacity-100"
                      : index < currentIndex
                        ? "-translate-x-3 opacity-0"
                        : "translate-x-3 opacity-0"
                  }
								`}
              >
                {labels[option] ?? option}
              </span>
            ))}
          </div>
        </div>
      </button>
    );
  }

  // =========================================================
  // 3+ OPTIONS → FREE NAVIGATION / SEGMENTED SELECTOR
  // =========================================================
  return (
    <div
      className="
				inline-flex
				items-center
				gap-1
				rounded-lg
				border
				bg-muted/50
				p-1
			"
    >
      {options.map((option) => {
        const isActive = option === currentOption;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`
							px-3
							py-1.5
							rounded-md
							text-[11px]
							font-semibold
							transition-all
							whitespace-nowrap
							${
                isActive
                  ? `
										bg-primary
										text-white
										shadow-sm
									`
                  : `
										text-muted-foreground
										hover:text-chart-2
									`
              }
						`}
          >
            {labels[option] ?? option}
          </button>
        );
      })}
    </div>
  );
};

export default StatusToggle;
