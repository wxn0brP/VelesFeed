import { localDB } from "#core/db";
import { mgl } from "#core/mgl";
import { VelesSource } from "#types";
import { mainUi } from "#ui/main";
import { rssSourcesView } from "#ui/nav";
import { settings } from "#ui/settings/data";
import { sourcesView as settingsSourcesView } from "#ui/settings/resources";
import { parseFeed } from "@rowanmanning/feed-parser";
import { Feed } from "@rowanmanning/feed-parser/lib/feed/base";
import { FeedItem } from "@rowanmanning/feed-parser/lib/feed/item/base";

const zhivaToken = typeof (window as any).zhiva_isApp !== "undefined" ?
    new URLSearchParams(window.location.search).get("secret") :
    "";

function assignProxyUrl(URL: string, proxyUrl: string) {
    if (!proxyUrl) return URL;
    if (!proxyUrl.includes("$URL")) return proxyUrl + URL;
    return proxyUrl.replace("$URL", URL);
}

export async function fetchFeed(url: string) {
    const init: RequestInit = {};
    if (zhivaToken) init.headers = { "x-zhiva-token": zhivaToken };
    const res = await fetch(url, init);
    return parseFeed(await res.text());
}

export async function loadFeed() {
    const sources = await localDB.source.find();
    rssSourcesView.render(sources);
    settingsSourcesView.render(sources);
}

export async function fetchAllFeeds() {
    const sources = await localDB.source.find();
    console.log("Fetching feeds for", sources.length, "sources");

    await Promise.all(sources.map(async source => {
        const feed: Feed = await fetchFeed(assignProxyUrl(source.url, settings.proxyUrl.get())).catch(e => {
            console.log("Failed to fetch feed for", source.name)
            console.error("Fetch Failed", source.name, e);
            return null;
        });
        if (!feed) return;
        const collection = localDB.c<FeedItem>("feed/" + source._id);
        const existing = await collection.find();

        const missing = feed.items.filter(i => !existing.find(e => e.id === i.id));
        console.log("Adding", missing.length, "items for", source.name);

        for (const item of missing)
            await collection.add(item, false);

        return feed;
    }));

    console.log("Done");
    mainUi.refresh();
}

mgl.feed = {
    clearCache: async (name: string) => {
        const source = await localDB.source.findOne({ name });
        await localDB.removeCollection("feed/" + source._id);
    }
}
