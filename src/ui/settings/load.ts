import { localDB } from "#core/db";
import { Settings } from "#types";
import { settings } from "./data";

export async function loadSettings() {
    const proxy = await localDB.config.findOne({ _id: "proxy" });
    if (proxy) settings.proxyUrl.set(proxy.v);
}
