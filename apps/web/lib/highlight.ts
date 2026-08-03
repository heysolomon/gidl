import "server-only";
import { codeToHtml } from "shiki";

function languageForPath(filePath: string): string {
  const ext = filePath.split(".").pop() ?? "";
  switch (ext) {
    case "tsx":
      return "tsx";
    case "ts":
      return "typescript";
    case "jsx":
      return "jsx";
    case "js":
      return "javascript";
    case "css":
      return "css";
    case "json":
      return "json";
    default:
      return "text";
  }
}

export async function highlightFile(filePath: string, content: string) {
  return codeToHtml(content, {
    lang: languageForPath(filePath),
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
}
