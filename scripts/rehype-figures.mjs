// Turns paragraphs that contain only images into figures.
// ![alt text](./photo.jpg "Caption") becomes <figure><img alt="alt text"><figcaption>Caption</figcaption></figure>;
// $...$ in the caption is typeset as inline math.
// Several images in one paragraph become several figures, so a <div class="row"> around them lays them out side by side.
const isBlank = (node) => node.type === 'text' && !node.value.trim();
// Caption text may contain inline math written as $...$. Those parts become the inline-math elements that
// rehype-katex typesets, so this plugin runs before rehype-katex.
const captionChildren = (text) => text.split(/(\$[^$]+\$)/).filter(Boolean).map((part) => (/^\$[^$]+\$$/.test(part)
  ? { type: 'element', tagName: 'code', properties: { className: ['language-math', 'math-inline'] }, children: [{ type: 'text', value: part.slice(1, -1) }] }
  : { type: 'text', value: part }));

export default function figures() {
  return (tree) => {
    const visit = (node) => {
      if (!node.children) return;
      node.children = node.children.flatMap((child) => {
        if (child.type === 'element' && child.tagName === 'p') {
          const content = child.children.filter((c) => !isBlank(c) && !(c.type === 'element' && c.tagName === 'br'));
          if (content.length && content.every((c) => c.type === 'element' && c.tagName === 'img')) {
            return content.map((img) => {
              const caption = img.properties?.title;
              if (caption) delete img.properties.title;
              const children = [img];
              if (caption) children.push({ type: 'element', tagName: 'figcaption', properties: {}, children: captionChildren(String(caption)) });
              return { type: 'element', tagName: 'figure', properties: {}, children };
            });
          }
        }
        visit(child);
        return [child];
      });
    };
    visit(tree);
  };
}
