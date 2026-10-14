import { localDB } from "#core/db";
import { mgl } from "#core/mgl";
import { mainUi } from "#ui/main";
import { rssSourcesView } from "#ui/nav";
import { settings } from "#ui/settings/data";
import { sourcesView as settingsSourcesView } from "#ui/settings/resources";
import { parseFeed } from "@rowanmanning/feed-parser";
import { Feed } from "@rowanmanning/feed-parser/lib/feed/base";
import { FeedItem } from "@rowanmanning/feed-parser/lib/feed/item/base";

const zhivaToken =
	typeof (window as any).zhiva_isApp !== "undefined"
		? new URLSearchParams(window.location.search).get("zhiva-secret")
		: "";

export function assignProxyUrl(URL: string, proxyUrl: string) {
	if (!proxyUrl) return URL;
	const target = encodeURIComponent(URL);
	if (!proxyUrl.includes("$URL")) return proxyUrl + target;
	return proxyUrl.replace("$URL", target);
}

export async function fetchFeed(url: string) {
	const init: RequestInit = {};
	if (zhivaToken && url.startsWith("/"))
		init.headers = {
			"x-zhiva-token": zhivaToken,
		};
	const res = await fetch(url, init);
	if (!res.ok) throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
	return parseFeed(await res.text());
}

export async function loadFeed() {
	const sources = await localDB.source.find();
	rssSourcesView.render(sources);
	settingsSourcesView.render(sources);
}

export interface FetchSummary {
	total: number;
	failed: string[];
}

export async function fetchAllFeeds(): Promise<FetchSummary> {
	const sources = await localDB.source.find();
	const failed: string[] = [];

	await Promise.all(
		sources.map(async source => {
			const feed: Feed = await fetchFeed(
				assignProxyUrl(source.url, settings.proxyUrl.get()),
			).catch(e => {
				console.error("Fetch failed", source.name, e);
				failed.push(source.name || source.url);
				return null;
			});
			if (!feed) return;

			const type = feed.meta?.type;
			if (type && type !== source.type) {
				await localDB.source.update(
					{
						_id: source._id,
					},
					{
						type,
						version: feed.meta?.version,
					},
				);
			}

			const collection = localDB.c<FeedItem>("feed/" + source._id);
			const existing = await collection.find();
			const missing = feed.items.filter(
				i => !existing.find(e => e.id === i.id),
			);

			for (const item of missing) await collection.add(item, false);
		}),
	);

	loadFeed();
	mainUi.refresh();
	return {
		total: sources.length,
		failed,
	};
}

mgl.feed = {
	clearCache: async (name: string) => {
		const source = await localDB.source.findOne({
			name,
		});
		await localDB.removeCollection("feed/" + source._id);
	},
};
