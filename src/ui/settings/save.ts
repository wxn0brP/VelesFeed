import { localDB } from "#core/db";
import { ReactiveCell } from "@wxn0brp/flanker-ui";
import { settings } from "./data";
import { Settings } from "#types";

export async function saveSettings() {
    register(settings.proxyUrl, "proxy");
}

const register = (cell: ReactiveCell<any>, dbKey: Settings["_id"]) =>
    cell.subscribe(v =>
        localDB.config.updateOneOrAdd({ _id: dbKey }, { v }, {}));