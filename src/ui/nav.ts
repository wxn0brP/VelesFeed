import { escapeHtml } from "#core/sanitize";
import { VelesSource } from "#types";
import { mountView } from "@wxn0brp/flanker-ui";
import "./nav.scss";
import { mainUi } from "./main";

const ICON_STEPS = [
	"/favicon.ico",
	"/favicon.svg",
];

export const rssSourcesView = mountView({
	selector: "nav",

	template: (source: VelesSource) => {
		try {
			const origin = new URL(source.url).origin;
			const name = source.name || source.url;
			const letter = (name.trim()[0] || "?").toUpperCase();
			const type = source.type
				? `<span class="rss-type">${escapeHtml(source.type)}</span>`
				: "";
			return `<button type="button" class="rss-source" data-id="${source._id}" data-url="${escapeHtml(source.url)}" title="${escapeHtml(source.url)}">
                <span class="rss-icon" data-origin="${escapeHtml(origin)}" data-letter="${escapeHtml(letter)}">
                    <img src="${escapeHtml(origin + ICON_STEPS[0])}" alt="" referrerpolicy="no-referrer" decoding="async">
                </span>
                <span class="rss-name">${escapeHtml(name)}</span>
                ${type}
            </button>`;
		} catch {
			return `<p class="rss-invalid">Invalid URL ${escapeHtml(source.url || "")}</p>`;
		}
	},

	emptyData: `<div class="rss-empty">No feeds configured</div>`,
	sort: "name",
	events: {
		click: {
			".rss-source": el => {
				const id = el.dataset.id;
				qs("nav .rss-source.active")?.classList.remove("active");
				el.classList.add("active");
				mainUi.load(id);
			},
		},
	},
});

// Image error events do not bubble, so the fallback runs in the capture phase.
qs("nav").addEventListener(
	"error",
	(e: Event) => {
		const img = e.target as HTMLImageElement;
		if (!(img instanceof HTMLImageElement)) return;

		const holder = img.closest<HTMLElement>(".rss-icon");
		if (!holder) return;

		const step = Number(img.dataset.step || "0") + 1;
		if (step < ICON_STEPS.length) {
			img.dataset.step = String(step);
			img.src = (holder.dataset.origin || "") + ICON_STEPS[step];
			return;
		}

		holder.classList.add("icon-fallback");
		holder.textContent = holder.dataset.letter || "?";
	},
	true,
);
