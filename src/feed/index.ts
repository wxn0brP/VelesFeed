import { localDB } from "#core/db";
import { mgl } from "#core/mgl";
import { Settings, VelesSource } from "#types";
import { mainUi } from "#ui/main";
import { rssSourcesView } from "#ui/nav";
import { parseFeed } from "@rowanmanning/feed-parser";
import { FeedItem } from "@rowanmanning/feed-parser/lib/feed/item/base";

function assignProxyUrl(URL: string, proxyUrl: string) {
    if (!proxyUrl) return URL;
    if (!URL.includes("$URL")) return proxyUrl + URL;
    return proxyUrl.replace("$URL", URL);
}

export async function fetchFeed(url: string) {
    const res = await fetch(url);
    return parseFeed(await res.text());
}

export async function loadFeed() {
    const sources = await localDB.find<VelesSource>("source");
    rssSourcesView.render(sources);
}

export async function fetchAllFeeds() {
    const sources = await localDB.find<VelesSource>("source");
    console.log("Fetching feeds for", sources.length, "sources");

    const proxyUrlData = await localDB.findOne<Settings>("config", { _id: "proxy" });
    const proxyUrl = proxyUrlData?.v || "";

    await Promise.all(sources.map(async source => {
        const feed = await fetchFeed(assignProxyUrl(source.url, proxyUrl)).catch(e => {
            console.log("Failed to fetch feed for", source.name)
            console.error("Fetch Failed", source.name, e);
            return null;
        });
        if (!feed) return;
        const existing = await localDB.find<FeedItem>("feed/" + source._id);

        const missing = feed.items.filter(i => !existing.find(e => e.id === i.id));
        console.log("Adding", missing.length, "items for", source.name);

        for (const item of missing)
            await localDB.add("feed/" + source._id, item, false);

        return feed;
    }));

    console.log("Done");
    mainUi.refresh();
}

mgl.feed = {
    clearCache: async (name: string) => {
        const source = await localDB.findOne<VelesSource>("source", { name });
        await localDB.remove("feed/" + source._id, {});
    }
}