import { localDB } from "#core/db";
import { FeedItem } from "@rowanmanning/feed-parser/lib/feed/item/base";
import { UiComponent } from "@wxn0brp/flanker-ui";
import "./index.scss";

class MainUi implements UiComponent {
    element: HTMLDivElement;
    _loaded: string;

    mount(): void {
        this.element = qs("aside");
    }

    async load(id: string) {
        const data = await localDB.find<FeedItem>("feed/" + id);
        this._loaded = id;

        data.sort((a, b) => a.published?.getTime?.() - b.published?.getTime?.());

        this.element.innerHTML = data.map(item => {
            const { image } = item;

            const img = image && `<img src="${image.url}" alt="${image.title || "Image"}">`;

            return `<div>
                <h3>${item.title || "No title"}</h3>
                <p>${item.description || ""}</p>
                <a href="${item.url || "#"}" target="_blank">Open Online</a>
                ${img || ""}
                <details>
                    <summary>Read more</summary>
                    ${item.content || ""}
                </details>
            </div>
            `
        }).join("");
    }

    refresh() {
        if (!this._loaded) return;
        this.load(this._loaded);
    }
}

export const mainUi = new MainUi();