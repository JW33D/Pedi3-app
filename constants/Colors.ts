const primary = "#4CAF50";

const tintColorLight = primary;
const tintColorDark = primary;

export default {
  light: {
    text: "#111827",
    background: "#f3f4f6",
    card: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#e5e7eb",
    tabIconSelected: tintColorLight,
    primary,
  },
  dark: {
    text: "#e5e7eb",
    background: "#374151",
    card: "#374151",
    tint: tintColorDark,
    tabIconDefault: "#e5e7eb",
    tabIconSelected: tintColorDark,
    primary,
  },
};