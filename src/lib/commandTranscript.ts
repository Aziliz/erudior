import { escapeHtml } from "./blockUtil";

/** A prompt starts each command. A second prompt before the result continues a multiline command. */
export function renderCommandTranscript(body: string): string | undefined {
  const lines = body.replace(/\r\n/g, "\n").replace(/\n$/, "").split("\n");
  if (!lines[0]?.startsWith("> ")) return undefined;
  const steps: string[] = [];
  for (let i = 0; i < lines.length;) {
    const command: string[] = [], output: string[] = [];
    while (i < lines.length && lines[i].startsWith("> ")) command.push(lines[i++].slice(2));
    if (!command.some(line => line.trim())) return undefined;
    while (i < lines.length && !lines[i].startsWith("> ")) output.push(lines[i++]);
    while (output.length && output[output.length - 1] === "") output.pop();
    const expected = output.length ? output.join("\n") : "No output on success.";
    steps.push(`<section class="command-step"><div class="row"><strong>Command</strong><button type="button" class="btn sm command-copy">Copy command</button><span role="status" class="small"></span></div><pre class="command-input"><code>${command.map(line => `<span class="command-line">${escapeHtml(line)}</span>`).join("\n")}</code></pre><strong>Expected result</strong><pre class="command-result">${escapeHtml(expected)}</pre></section>`);
  }
  return `<div class="command-transcript">${steps.join("")}</div>`;
}

export async function copyTranscriptCommand(button: HTMLButtonElement) {
  const step = button.closest(".command-step");
  const code = step?.querySelector("code");
  const status = step?.querySelector('[role="status"]');
  if (!code || !status) return;
  try {
    await navigator.clipboard.writeText(code.textContent ?? "");
    status.textContent = "Copied.";
  } catch {
    const range = document.createRange();
    range.selectNodeContents(code);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    status.textContent = "Select Copy from your device’s menu.";
  }
}
