export type Language = "javascript" | "typescript";

export interface ExecutionResult {
  output: string[];
  error?: string;
  executionTime?: number;
}

export type LightTheme =
  | "github-light"
  | "vitesse-light"
  | "one-light"
  | "min-light"
  | "slack-ochin"
  | "solarized-light";

export type DarkTheme =
  | "github-dark"
  | "vitesse-dark"
  | "one-dark-pro"
  | "dracula"
  | "nord"
  | "tokyo-night";

export type EditorTheme = LightTheme | DarkTheme;

export type AccentColor =
  | "neutral"
  | "orange"
  | "red"
  | "green"
  | "rose"
  | "purple";

export type EditorFont =
  | "azeret"
  | "jetbrains"
  | "fira"
  | "source"
  | "cascadia"
  | "ibm"
  | "inconsolata"
  | "ubuntu"
  | "monaspace"
  | "geist"
  | "noto"
  | "roboto";

export interface Settings {
  theme: "light" | "dark" | "system";
  lightTheme: LightTheme;
  darkTheme: DarkTheme;
  accentColor: AccentColor;
  font: EditorFont;
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  lineNumbers: boolean;
  autoRun: boolean;
  debounceMs: number;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: "system",
  lightTheme: "github-light",
  darkTheme: "github-dark",
  accentColor: "orange",
  font: "azeret",
  fontSize: 14,
  tabSize: 2,
  wordWrap: false,
  lineNumbers: true,
  autoRun: true,
  debounceMs: 300,
};

export const LIGHT_THEMES: { value: LightTheme; label: string }[] = [
  { value: "github-light", label: "GitHub" },
  { value: "vitesse-light", label: "Vitesse" },
  { value: "one-light", label: "One Light" },
  { value: "min-light", label: "Min" },
  { value: "slack-ochin", label: "Slack" },
  { value: "solarized-light", label: "Solarized" },
];

export const DARK_THEMES: { value: DarkTheme; label: string }[] = [
  { value: "github-dark", label: "GitHub" },
  { value: "vitesse-dark", label: "Vitesse" },
  { value: "one-dark-pro", label: "One Dark" },
  { value: "dracula", label: "Dracula" },
  { value: "nord", label: "Nord" },
  { value: "tokyo-night", label: "Tokyo" },
];

export const ACCENT_COLORS: { value: AccentColor; color: string }[] = [
  { value: "neutral", color: "#6D6C6C" },
  { value: "orange", color: "#E56D00" },
  { value: "red", color: "#6F100F" },
  { value: "green", color: "#006233" },
  { value: "rose", color: "#AE4560" },
  { value: "purple", color: "#57316B" },
];

export const EDITOR_FONTS: {
  value: EditorFont;
  label: string;
  family: string;
}[] = [
  { value: "azeret", label: "Azeret", family: "AzeretMono" },
  { value: "jetbrains", label: "JetBrains", family: "JetBrainsMono" },
  { value: "fira", label: "Fira", family: "FiraMono" },
  { value: "source", label: "Source Code", family: "SourceCodePro" },
  { value: "cascadia", label: "Cascadia", family: "CascadiaMono" },
  { value: "ibm", label: "IBM Plex", family: "IBMPlexMono" },
  { value: "inconsolata", label: "Inconsolata", family: "Inconsolata" },
  { value: "ubuntu", label: "Ubuntu", family: "UbuntuMono" },
  { value: "monaspace", label: "Monaspace", family: "MonaspaceArgon" },
  { value: "geist", label: "Geist", family: "GeistMono" },
  { value: "noto", label: "Noto Sans", family: "NotoSansMono" },
  { value: "roboto", label: "Roboto", family: "RobotoMono" },
];
