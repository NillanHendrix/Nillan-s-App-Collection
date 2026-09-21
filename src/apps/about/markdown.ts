// Minimaler Markdown-Renderer. HTML wird zuerst escaped, daher ist die Ausgabe sicher.
// Unterstützt: #-Überschriften, **fett**, *kursiv*, `code`, ```Codeblöcke```, Listen,
// > Zitate, ---, [Text](https://url) und [[Wikilinks]].

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function inline(text: string, known: Set<string>): string {
  let s = esc(text)
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>')
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  s = s.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  )
  s = s.replace(/\[\[([^\]]+)\]\]/g, (_, t: string) => {
    const title = t.trim()
    const cls = known.has(title.toLowerCase()) ? 'wikilink' : 'wikilink missing'
    return `<a class="${cls}" data-wiki="${title}" href="#">${title}</a>`
  })
  return s
}

export function renderMarkdown(src: string, titles: string[]): string {
  const known = new Set(titles.map((t) => t.toLowerCase()))
  const out: string[] = []
  let list: 'ul' | 'ol' | null = null
  let code: string[] | null = null
  const closeList = () => {
    if (list) out.push(`</${list}>`)
    list = null
  }

  for (const line of src.split('\n')) {
    if (line.startsWith('```')) {
      if (code) {
        out.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`)
        code = null
      } else {
        closeList()
        code = []
      }
      continue
    }
    if (code) {
      code.push(line)
      continue
    }
    let m: RegExpMatchArray | null
    if ((m = line.match(/^(#{1,6})\s+(.*)$/))) {
      closeList()
      out.push(`<h${m[1].length}>${inline(m[2], known)}</h${m[1].length}>`)
    } else if ((m = line.match(/^\s*[-*]\s+(.*)$/))) {
      if (list !== 'ul') { closeList(); out.push('<ul>'); list = 'ul' }
      out.push(`<li>${inline(m[1], known)}</li>`)
    } else if ((m = line.match(/^\s*\d+\.\s+(.*)$/))) {
      if (list !== 'ol') { closeList(); out.push('<ol>'); list = 'ol' }
      out.push(`<li>${inline(m[1], known)}</li>`)
    } else if ((m = line.match(/^>\s?(.*)$/))) {
      closeList()
      out.push(`<blockquote>${inline(m[1], known)}</blockquote>`)
    } else if (/^---+$/.test(line.trim())) {
      closeList()
      out.push('<hr>')
    } else if (line.trim() === '') {
      closeList()
    } else {
      closeList()
      out.push(`<p>${inline(line, known)}</p>`)
    }
  }
  if (code) out.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`)
  closeList()
  return out.join('\n')
}
