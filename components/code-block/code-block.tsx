import hljs from "highlight.js/lib/core";
import cssLang from "highlight.js/lib/languages/css";

hljs.registerLanguage("css", cssLang);

type Props = { code: string };
function CodeBlock({ code }: Props) {
  const highlighted = hljs.highlight(code, { language: "css" }).value;

  return (
    <pre>
      <code
        className="hljs"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </pre>
  );
}

export default CodeBlock;
