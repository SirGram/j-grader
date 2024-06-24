import { useTheme } from "../context/ThemeContext";

export default function ThemeSelector() {
  const { currentTheme, setCurrentTheme } = useTheme();

  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ].sort((a, b) => a.localeCompare(b));

  return (
    <div className="absolute top-0 right-0">
      <select
        className="select w-full max-w-xs bg-base-200"
        onChange={(e) => setCurrentTheme(e.target.value)}
        value={currentTheme}
      >
        {themes.map((theme) => (
          <option key={theme} value={theme}>
            {theme}
          </option>
        ))}
      </select>
    </div>
  );
}
