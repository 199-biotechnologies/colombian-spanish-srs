/**
 * Format text for display by:
 * 1. Removing Anki formatting markers like {{}} and [[]]
 * 2. Adding line breaks for dialogue format (A: ... B: ...)
 */
export function formatCardText(text: string): string {
  // Remove Anki markers {{}} and [[]]
  let formatted = text
    .replace(/\{\{/g, '')
    .replace(/\}\}/g, '')
    .replace(/\[\[/g, '')
    .replace(/\]\]/g, '');

  // Add line breaks for dialogue format
  // Match patterns like "A: ... B: ..." or "Person: ... Other: ..."
  formatted = formatted.replace(/([AB]):\s*/g, '$1:\n');

  // Clean up if we ended up with a line break at the start
  formatted = formatted.replace(/^\n/, '');

  return formatted;
}

/**
 * Split text into lines for rendering with <br> tags
 */
export function getTextLines(text: string): string[] {
  return formatCardText(text).split('\n').filter(line => line.trim());
}
