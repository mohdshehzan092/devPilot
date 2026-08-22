import { Fragment, type ReactNode } from "react";

/** Tokenizes a line of JSON (or JS) into colored spans using design tokens. */
export function highlightLine(line: string, language: "json" | "js" = "json"): ReactNode {
  if (language === "js") return highlightJs(line);

  const nodes: ReactNode[] = [];
  const re =
    /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b|([{}[\],:])/g;

  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = re.exec(line)) !== null) {
    if (match.index > last) {
      nodes.push(<Fragment key={i++}>{line.slice(last, match.index)}</Fragment>);
    }

    if (match[1]) {
      const isKey = Boolean(match[2]);
      nodes.push(
        <span key={i++} className={isKey ? "text-code-key" : "text-code-string"}>
          {match[1]}
        </span>,
      );
      if (match[2]) {
        nodes.push(
          <span key={i++} className="text-code-punct">
            {match[2]}
          </span>,
        );
      }
    } else if (match[3]) {
      nodes.push(
        <span key={i++} className="text-code-number">
          {match[3]}
        </span>,
      );
    } else if (match[4]) {
      nodes.push(
        <span key={i++} className="text-code-boolean">
          {match[4]}
        </span>,
      );
    } else if (match[5]) {
      nodes.push(
        <span key={i++} className="text-code-punct">
          {match[5]}
        </span>,
      );
    }

    last = re.lastIndex;
  }

  if (last < line.length) {
    nodes.push(<Fragment key={i++}>{line.slice(last)}</Fragment>);
  }

  return nodes.length ? nodes : "\u200b";
}

const JS_KEYWORDS =
  /\b(const|let|var|function|return|if|else|for|while|try|catch|throw|new|await|async|typeof|expect|pm|test|describe|it)\b/g;

function highlightJs(line: string): ReactNode {
  const nodes: ReactNode[] = [];
  const re = new RegExp(
    `(//.*$)|("(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*'|\`(?:\\\\.|[^\`\\\\])*\`)|(-?\\d+(?:\\.\\d+)?)|${JS_KEYWORDS.source}`,
    "g",
  );

  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = re.exec(line)) !== null) {
    if (match.index > last) {
      nodes.push(<Fragment key={i++}>{line.slice(last, match.index)}</Fragment>);
    }

    const cls = match[1]
      ? "text-muted-foreground italic"
      : match[2]
        ? "text-code-string"
        : match[3]
          ? "text-code-number"
          : "text-code-boolean";

    nodes.push(
      <span key={i++} className={cls}>
        {match[0]}
      </span>,
    );

    last = re.lastIndex;
  }

  if (last < line.length) {
    nodes.push(<Fragment key={i++}>{line.slice(last)}</Fragment>);
  }

  return nodes.length ? nodes : "\u200b";
}

export function prettyJson(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
