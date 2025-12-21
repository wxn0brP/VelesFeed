import { localDB } from "#core/db";
import { fetchAllFeeds, loadFeed } from "#feed";
import { VelesSource } from "#types";
import { prompt, uiMsg } from "@wxn0brp/flanker-dialog";
import "./header.scss";
import { toggle as toggleSettings } from "./settings/toggle";

const header = qs("header");

header.qs("add", 1).addEventListener("click", async () => {
    const name = await prompt("Name");
    let url = await prompt("URL");
    if (url && !url.startsWith("http")) url = "https://" + url;
    const existing = await localDB.findOne<VelesSource>("source", { $or: [{ url }, { name }] });
    if (existing) return uiMsg("Source already exists");

    await localDB.add<VelesSource>("source", { name, url });
    uiMsg("Source added");
    loadFeed();
});

header.qs("fetch", 1).addEventListener("click", fetchAllFeeds);
header.qs("settings", 1).addEventListener("click", toggleSettings);