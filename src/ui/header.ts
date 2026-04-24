import { localDB } from "#core/db";
import { fetchAllFeeds, fetchFeed, loadFeed } from "#feed";
import { uiMsg } from "@wxn0brp/flanker-dialog/msg/index";
import { prompt } from "@wxn0brp/flanker-dialog/prompt/index";
import "./header.scss";
import { mainUi } from "./main";
import { toggle as toggleSettings } from "./settings/toggle";

const header = qs("header");

header.qs("add", 1).addEventListener("click", async () => {
    const name = await prompt("Name");
    let url = await prompt("URL");
    if (url && !url.startsWith("http")) url = "https://" + url;
    const existing = await localDB.source.findOne({ $or: [{ url }, { name }] });
    if (existing) return uiMsg("Source already exists");

    await localDB.source.add({ name, url });
    uiMsg("Source added");
    loadFeed();
});

header.qs("preview", 1).addEventListener("click", async () => {
    let url = await prompt("URL");
    if (!url) return;
    if (!url.startsWith("http")) url = "https://" + url;

    const data = await fetchFeed(url);
    if (!data) return uiMsg("Failed to fetch feed");

    mainUi.render(data.items || []);
});

header.qs("fetch", 1).addEventListener("click", fetchAllFeeds);
header.qs("settings", 1).addEventListener("click", toggleSettings);
