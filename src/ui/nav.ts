import { VelesSource } from "#types";
import { mountView } from "@wxn0brp/flanker-ui";
import "./nav.scss";
import { mainUi } from "./main";

export const rssSourcesView = mountView({
    selector: "nav",

    template: (source: VelesSource) => {
        try {
            const imgUrl = new URL(source.url).origin + "/favicon.svg";
            return `<div class="rss-source" data-id="${source._id}" data-url="${source.url}">
                <img src="${imgUrl}">
                <div alt="${source.url}">${source.name}</div>
            </div>`;
        } catch {
            return `<p>Invalid URL ${source.url}</p>`;
        }
    },

    emptyData: `<div class="rss-empty">No RSS sources configured</div>`,
    sort: "name",
    events: {
        click: {
            ".rss-source": (el) => {
                const id = el.dataset.id;
                console.log("Selected RSS source:", id);
                mainUi.load(id);
            }
        }
    }
});