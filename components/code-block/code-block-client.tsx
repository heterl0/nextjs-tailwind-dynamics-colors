"use client";

import { useEffect, useRef } from "react";
type Props = {
  code: string;
  className?: string;
  language: "css" | "typescript";
};

export default function CodeBlockClient({ code, className, language }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    (async () => {
      const { default: hljs } = await import("highlight.js/lib/core");
      const cssLang = (await import("highlight.js/lib/languages/css")).default;
      const tsLang = (await import("highlight.js/lib/languages/typescript"))
        .default;
      hljs.registerLanguage("css", cssLang);
      hljs.registerLanguage("typescript", tsLang);
      if (ref.current) hljs.highlightElement(ref.current);
    })();
  }, [code]);

  return (
    <pre className={className}>
      <code ref={ref} className={`hljs language-${language}`}>
        {code}
      </code>
    </pre>
  );
}
