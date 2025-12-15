import { localDB } from "#core/db";
import { mgl } from "#core/mgl";
import { VelesSource } from "#types";
import { mainUi } from "#ui/main";
import { rssSourcesView } from "#ui/nav";
import { parseFeed } from "@rowanmanning/feed-parser";
import { FeedItem } from "@rowanmanning/feed-parser/lib/feed/item/base";

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

    await Promise.all(sources.map(async source => {
        const feed = await fetchFeed(source.url);
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