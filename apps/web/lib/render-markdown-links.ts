import type { ReactNode } from "react";
import { createElement } from "react";

export function renderDescriptionWithLinks(text: string): ReactNode {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match;
  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    nodes.push(
      createElement(
        "a",
        {
          key: match.index,
          href: match[2],
          target: "_blank",
          rel: "noreferrer",
          className:
            "underline underline-offset-2 transition-opacity hover:opacity-70",
        },
        match[1]
      )
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes.length === 0 ? text : nodes;
}
