import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

const DarkmodeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  const handleToggle = (checked) => {
    const root = document.documentElement;
    const switchElement = document.querySelector("[data-dark-mode-switch]");
    const rect = switchElement?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
  
    /*
     * Make the circle large enough to cover
     * the entire viewport.
     */
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
  
    /*
     * Create the overlay using the CURRENT theme.
     */
    const overlay = document.createElement("div");
    overlay.className = "theme-overlay";
    overlay.style.width = `${radius * 2}px`;
    overlay.style.height = `${radius * 2}px`;
    overlay.style.left = `${x - radius}px`;
    overlay.style.top = `${y - radius}px`;
    overlay.style.backgroundColor = getComputedStyle(root)
      .getPropertyValue("--background")
      .trim();
    document.body.appendChild(overlay);
  
    /*
     * Update the theme IMMEDIATELY.
     *
     * The switch therefore moves immediately.
     */
    root.classList.toggle("dark", checked);
    setIsDarkMode(checked);
  
    /*
     * Start the circle transition.
     */
    requestAnimationFrame(() => {
      overlay.classList.add("theme-overlay-active");
    });
  
    /*
     * Remove it when finished.
     */
    overlay.addEventListener(
      "transitionend",
      () => {
        overlay.remove();
      },
      { once: true },
    );
  };

  return (
    <div className="relative z-10000 flex items-center rounded-xl border">
      <Switch
        data-dark-mode-switch
        checked={isDarkMode}
        onCheckedChange={handleToggle}
        className="[&>span]:bg-primary data-[state=checked]:[&>span]:bg-background"
      />

      {isDarkMode ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-end px-1">
          <Moon className="h-4 w-4 text-background" />
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-start px-1">
          <Sun className="h-4 w-4 text-background" />
        </div>
      )}
    </div>
  );
};

export default DarkmodeToggle;