function cleanText(text = "") {
  return text.replace(/\s+/g, " ").trim();
}

function safeRect(el) {
  try {
    const rect = el.getBoundingClientRect();
    if (!Number.isFinite(rect.width) || !Number.isFinite(rect.height)) {
      return null;
    }
    return rect;
  } catch {
    return null;
  }
}

export function summarizePageForAI() {
  try {
    const title = cleanText(document.title || "Untitled page");

    const headings = Array.from(document.querySelectorAll("h1, h2, h3"))
      .map((el) => cleanText(el.textContent))
      .filter(Boolean)
      .slice(0, 8);

    const buttons = Array.from(document.querySelectorAll("button, [role='button']"))
      .map((el) => cleanText(el.textContent || el.getAttribute("aria-label") || "Button"))
      .filter(Boolean)
      .slice(0, 12);

    const fields = Array.from(document.querySelectorAll("input, textarea, select"))
      .map((el) => {
        const label =
          cleanText(el.getAttribute("aria-label")) ||
          cleanText(el.getAttribute("placeholder")) ||
          cleanText(el.name) ||
          cleanText(el.id) ||
          "Field";
        return label;
      })
      .filter(Boolean)
      .slice(0, 12);

    return `Title: ${title}\nHeadings: ${headings.join(", ")}\nButtons: ${buttons.join(", ")}\nFields: ${fields.join(", ")}`;
  } catch {
    return "Page context unavailable right now.";
  }
}

export function detectImportantElements() {
  try {
    const candidates = [
      ...Array.from(document.querySelectorAll("nav a, nav button")),
      ...Array.from(document.querySelectorAll("form button, form input, form select")),
      ...Array.from(document.querySelectorAll("main button, main a")),
      ...Array.from(document.querySelectorAll("[data-smart='important']")),
    ];

    const unique = Array.from(new Set(candidates));

    return unique
      .map((el, idx) => {
        const rect = safeRect(el);
        if (!rect || rect.width < 24 || rect.height < 24) {
          return null;
        }

        const label =
          cleanText(el.textContent) ||
          cleanText(el.getAttribute("aria-label")) ||
          cleanText(el.getAttribute("placeholder")) ||
          `Element ${idx + 1}`;

        return {
          id: `${idx}-${label.slice(0, 20)}-${Math.round(rect.top)}`,
          top: Math.max(0, rect.top + window.scrollY),
          left: Math.max(0, rect.left + window.scrollX),
          width: rect.width,
          height: rect.height,
          label,
          role: el.tagName.toLowerCase(),
        };
      })
      .filter(Boolean)
      .slice(0, 20);
  } catch {
    return [];
  }
}
