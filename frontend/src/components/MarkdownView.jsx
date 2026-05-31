import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

/**
 * MarkdownView — renders Markdown + GFM tables + LaTeX/arXiv math.
 * Math is delimited by $...$ inline and $$...$$ block, plus \( \) and \[ \] for arxiv-style.
 */
export default function MarkdownView({ children }) {
  if (!children) return null;
  // Normalise common arxiv \( ... \) and \[ ... \] into $ and $$ so remark-math picks them up.
  let src = String(children);
  src = src
    .replace(/\\\((.+?)\\\)/gs, "$$$1$$")
    .replace(/\\\[(.+?)\\\]/gs, "$$$$$$1$$$$$$");

  return (
    <div className="prose-a0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {src}
      </ReactMarkdown>
    </div>
  );
}
