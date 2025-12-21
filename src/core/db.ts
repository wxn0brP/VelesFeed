import { Settings, VelesSource } from "#types";
import { createMemoryValthera } from "@wxn0brp/db-core";
import { createWebStorageValthera } from "@wxn0brp/db-storage-web";
import { mgl } from "./mgl";

export const localDB = createWebStorageValthera<{
    source: VelesSource[];
    config: Settings[];
}>("veles-feed");

export const memoryDB = createMemoryValthera();

mgl.db = {
    local: localDB,
    memory: memoryDB
}

const firstRun = localStorage.getItem("run") !== "true";
if (firstRun) {
    localStorage.setItem("run", "true");

    if (typeof (window as any).zhiva_isApp !== "undefined") {
        localDB.config.add({ _id: "proxy", "v": "/api/proxy?url=" });
    }
}