import { Platform } from "react-native";

const primaryBlue = "#4A90E2";
const successGreen = "#27AE60";
const errorRed = "#E74C3C";
const warningYellow = "#F39C12";

export const Colors = {
  light: {
    text: "#2C3E50",
    textSecondary: "#7F8C8D",
    textDisabled: "#BDC3C7",
    buttonText: "#FFFFFF",
    tabIconDefault: "#687076",
    tabIconSelected: primaryBlue,
    link: primaryBlue,
    primary: primaryBlue,
    success: successGreen,
    error: errorRed,
    warning: warningYellow,
    backgroundRoot: "#F8FAFB",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#F2F2F7",
    backgroundTertiary: "#E5E5EA",
    border: "#E1E8ED",
    chartLine: primaryBlue,
    chartGrid: "#E1E8ED",
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    textDisabled: "#5A5A5A",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#0A84FF",
    link: "#0A84FF",
    primary: "#0A84FF",
    success: "#32D74B",
    error: "#FF453A",
    warning: "#FFD60A",
    backgroundRoot: "#000000",
    backgroundDefault: "#1C1C1E",
    backgroundSecondary: "#2C2C2E",
    backgroundTertiary: "#3A3A3C",
    border: "#38383A",
    chartLine: "#0A84FF",
    chartGrid: "#38383A",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  cardValue: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
