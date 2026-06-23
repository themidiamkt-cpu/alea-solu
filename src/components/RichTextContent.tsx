import { useMemo } from "react";

type RichTextContentProps = {
  content?: string | null;
  className?: string;
};

const allowedTags = new Set([
  "a",
  "b",
  "blockquote",
  "br",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "i",
  "li",
  "ol",
  "p",
  "span",
  "strong",
  "u",
  "ul",
]);

const allowedUrlProtocols = new Set(["http:", "https:", "mailto:", "tel:"]);

const hasHtmlTags = (content: string) => /<\/?[a-z][\s\S]*>/i.test(content);

const sanitizeNode = (node: Node, ownerDocument: Document): Node | null => {
  if (node.nodeType === Node.TEXT_NODE) {
    return ownerDocument.createTextNode(node.textContent || "");
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const element = node as HTMLElement;
  const tagName = element.tagName.toLowerCase();

  if (!allowedTags.has(tagName)) {
    const fragment = ownerDocument.createDocumentFragment();
    element.childNodes.forEach((child) => {
      const sanitizedChild = sanitizeNode(child, ownerDocument);
      if (sanitizedChild) fragment.appendChild(sanitizedChild);
    });
    return fragment;
  }

  const sanitizedElement = ownerDocument.createElement(tagName);

  if (tagName === "a") {
    const href = element.getAttribute("href");
    if (href) {
      try {
        const url = new URL(href, window.location.origin);
        if (allowedUrlProtocols.has(url.protocol)) {
          sanitizedElement.setAttribute("href", href);
          sanitizedElement.setAttribute("target", "_blank");
          sanitizedElement.setAttribute("rel", "noopener noreferrer");
        }
      } catch {
        // Ignore invalid URLs.
      }
    }
  }

  element.childNodes.forEach((child) => {
    const sanitizedChild = sanitizeNode(child, ownerDocument);
    if (sanitizedChild) sanitizedElement.appendChild(sanitizedChild);
  });

  return sanitizedElement;
};

const sanitizeHtml = (content: string) => {
  if (typeof window === "undefined") return content;

  const parser = new DOMParser();
  const parsed = parser.parseFromString(content, "text/html");
  const sanitizedDocument = document.implementation.createHTMLDocument("");
  const container = sanitizedDocument.createElement("div");

  parsed.body.childNodes.forEach((child) => {
    const sanitizedChild = sanitizeNode(child, sanitizedDocument);
    if (sanitizedChild) container.appendChild(sanitizedChild);
  });

  return container.innerHTML;
};

const renderPlainText = (content: string) => {
  const paragraphs = content
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return paragraphs.map((paragraph, paragraphIndex) => (
    <p key={paragraphIndex}>
      {paragraph.split(/\n/g).map((line, lineIndex, lines) => (
        <span key={lineIndex}>
          {line}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      ))}
    </p>
  ));
};

export const RichTextContent = ({ content, className = "" }: RichTextContentProps) => {
  const safeContent = useMemo(() => {
    const value = content?.trim() || "";
    return hasHtmlTags(value) ? sanitizeHtml(value) : value;
  }, [content]);

  if (!safeContent) return null;

  const classes = ["rich-content text-foreground leading-relaxed", className].filter(Boolean).join(" ");

  if (hasHtmlTags(safeContent)) {
    return <div className={classes} dangerouslySetInnerHTML={{ __html: safeContent }} />;
  }

  return <div className={classes}>{renderPlainText(safeContent)}</div>;
};
