import { useMemo } from "react";
import DOMPurify from "dompurify";
import { renderMathText } from "../lib/math";

/** Plain text with $math$ rendered, for question stems, choices and explanations. */
export default function MathText({ text, as: Tag = "span", className }: { text: string; as?: "span" | "p" | "div"; className?: string }) {
  const html = useMemo(() => DOMPurify.sanitize(renderMathText(text)), [text]);
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
