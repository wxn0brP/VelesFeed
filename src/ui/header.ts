import { localDB } from "#core/db";
import { assignProxyUrl, fetchAllFeeds, fetchFeed, loadFeed } from "#feed";
import { uiMsg } from "@wxn0brp/flanker-dialog/msg/index";
import { prompt } from "@wxn0brp/flanker-dialog/prompt/index";
import "./header.scss";
import { mainUi } from "./main";
import { settings } from "./settings/data";
import { toggle as toggleSettings } from "./settings/toggle";

const header = qs("header");

header.qs("add", 1).addEventListener("click", async () => {
	const name = await prompt("Name");
	let url = await prompt("URL");
	if (url && !url.startsWith("http")) url = "https://" + url;
	const existing = await localDB.source.findOne({
		$or: [
			{
				url,
			},
			{
				name,
			},
		],
	});
	if (existing) return uiMsg("Source already exists");

	await localDB.source.add({
		name,
		url,
	});
	uiMsg("Source added");
	loadFeed();
});

header.qs("preview", 1).addEventListener("click", async () => {
	let url = await prompt("URL");
	if (!url) return;
	if (!url.startsWith("http")) url = "https://" + url;

	try {
		const data = await fetchFeed(assignProxyUrl(url, settings.proxyUrl.get()));
		if (!data) return uiMsg("Failed to fetch feed");
		mainUi.render(data.items || []);
	} catch {
		uiMsg("Failed to fetch feed");
	}
});

const fetchButton = header.qs<HTMLButtonElement>("fetch", 1);
fetchButton.addEventListener("click", async () => {
	if (fetchButton.disabled) return;
	fetchButton.disabled = true;
	const label = fetchButton.textContent;
	fetchButton.textContent = "Fetching…";

	try {
		const { total, failed } = await fetchAllFeeds();
		if (total === 0) uiMsg("No sources to fetch");
		else if (failed.length)
			uiMsg(`Fetched ${total - failed.length} of ${total} sources`);
		else uiMsg(`Fetched ${total} sources`);
	} finally {
		fetchButton.disabled = false;
		fetchButton.textContent = label;
	}
});

header.qs("settings", 1).addEventListener("click", toggleSettings);
