import { localDB } from "#core/db";
import { escapeHtml, isSafeUrl, sanitizeHtml } from "#core/sanitize";
import { FeedItem } from "@rowanmanning/feed-parser/lib/feed/item/base";
import { UiComponent } from "@wxn0brp/flanker-ui";
import "./index.scss";

class MainUi implements UiComponent {
	element: HTMLDivElement;
	_loaded: string;

	mount(): void {
		this.element = qs("aside");
		this.state("Select a source from the list");
	}

	async load(id: string) {
		this._loaded = id;
		this.state("Loading items…");

		const data = await localDB.find<FeedItem>({
			collection: "feed/" + id,
		});

		const time = (item: FeedItem) =>
			(item.published ?? item.updated)?.getTime?.() ?? 0;

		data.sort((a, b) => time(b) - time(a));
		this.render(data);
	}

	render(items: FeedItem[]) {
		if (!items?.length) {
			this.state("No items yet. Use Fetch to load the latest.");
			return;
		}

		this.element.innerHTML = items.map(item => this.item(item)).join("");
	}

	item(item: FeedItem): string {
		const title = escapeHtml(item.title || "No title");
		const description = item.description ? sanitizeHtml(item.description) : "";
		const content = item.content ? sanitizeHtml(item.content) : "";
		const image = item.image?.url
			? `<img src="${escapeHtml(item.image.url)}" alt="">`
			: "";
		const link =
			item.url && isSafeUrl(item.url)
				? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">Open online</a>`
				: "";

		return `<article class="feed-item">
            <h3>${title}</h3>
            ${description ? `<p>${description}</p>` : ""}
            ${link}
            ${image}
            ${content ? `<details><summary>Read more</summary>${content}</details>` : ""}
        </article>`;
	}

	state(text: string) {
		this.element.innerHTML = `<div class="feed-state">${escapeHtml(text)}</div>`;
	}

	refresh() {
		if (!this._loaded) return;
		this.load(this._loaded);
	}
}

export const mainUi = new MainUi();
