import { Settings, VelesSource } from "#types";
import { forgeTypedValthera } from "@wxn0brp/db-core";
import { createWebStorageValthera } from "@wxn0brp/db-storage-web";
import { mgl } from "./mgl";

export const localDB = forgeTypedValthera<{
    source: VelesSource;
    config: Settings;
}>(createWebStorageValthera("veles-feed"));

mgl.db = localDB;

const firstRun = localStorage.getItem("run") !== "true";
if (firstRun) {
    localStorage.setItem("run", "true");

    if (typeof (window as any).zhiva_isApp !== "undefined") {
        localDB.config.add({ _id: "proxy", "v": "/api/proxy?url=" });
    }
}
