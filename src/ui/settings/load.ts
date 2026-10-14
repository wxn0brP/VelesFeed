import { localDB } from "#core/db";
import { settings } from "./data";

const DEFAULT_PROXY = "/zhiva-api/proxy?url=";

export async function loadSettings() {
	const proxy = await localDB.config.findOne({
		_id: "proxy",
	});
	if (proxy) settings.proxyUrl.set(proxy.v);
	else if (typeof (window as any).zhiva_isApp !== "undefined")
		settings.proxyUrl.set(DEFAULT_PROXY);
}
