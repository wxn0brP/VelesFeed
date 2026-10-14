// Feed content is untrusted HTML, so it is parsed and reduced to a safe subset.

const ALLOWED_TAGS = new Set([
	"a",
	"p",
	"br",
	"hr",
	"span",
	"em",
	"strong",
	"b",
	"i",
	"u",
	"s",
	"small",
	"sub",
	"sup",
	"code",
	"pre",
	"blockquote",
	"cite",
	"q",
	"ul",
	"ol",
	"li",
	"dl",
	"dt",
	"dd",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"img",
	"figure",
	"figcaption",
	"table",
	"thead",
	"tbody",
	"tfoot",
	"tr",
	"th",
	"td",
	"caption",
	"time",
	"abbr",
	"mark",
	"del",
	"ins",
	"div",
	"section",
	"article",
]);

const ALLOWED_ATTRS = new Set([
	"href",
	"src",
	"alt",
	"title",
	"width",
	"height",
	"colspan",
	"rowspan",
	"datetime",
]);

const URL_ATTRS = new Set([
	"href",
	"src",
]);

export function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

export function isSafeUrl(url: string): boolean {
	const value = url.trim();
	if (!value) return false;
	return /^(https?:|mailto:)/i.test(value) || /^[/#.]/.test(value);
}

export function sanitizeHtml(dirty: string): string {
	const doc = new DOMParser().parseFromString(dirty, "text/html");

	const clean = (parent: Element) => {
		for (const el of Array.from(parent.children)) {
			if (!ALLOWED_TAGS.has(el.tagName.toLowerCase())) {
				el.remove();
				continue;
			}
			for (const attr of Array.from(el.attributes)) {
				const name = attr.name.toLowerCase();
				const blockedUrl = URL_ATTRS.has(name) && !isSafeUrl(attr.value);
				if (!ALLOWED_ATTRS.has(name) || blockedUrl) {
					el.removeAttribute(attr.name);
				}
			}
			clean(el);
		}
	};

	clean(doc.body);
	return doc.body.innerHTML;
}
