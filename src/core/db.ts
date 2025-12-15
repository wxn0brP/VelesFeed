import { VelesSource } from "#types";
import { createMemoryValthera } from "@wxn0brp/db-core";
import { createWebStorageValthera } from "@wxn0brp/db-storage-web";
import { mgl } from "./mgl";

export const localDB = createWebStorageValthera<{
    source: VelesSource[];
}>("veles-feed");

export const memoryDB = createMemoryValthera();

mgl.db = {
    local: localDB,
    memory: memoryDB
}