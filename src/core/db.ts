import { Settings, VelesSource } from "#types";
import { forgeTypedValthera } from "@wxn0brp/db-core";
import { createWebStorageValthera } from "@wxn0brp/db-storage-web";
import { mgl } from "./mgl";

export const localDB = forgeTypedValthera<{
	source: VelesSource;
	config: Settings;
}>(createWebStorageValthera("veles-feed"));

mgl.db = localDB;
