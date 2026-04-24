import { watchInput } from "@wxn0brp/flanker-ui/component/helpers";
import { settings } from "./data";
import { settingsPanel } from "./html";

export function watchInputs() {
    watchInput(settingsPanel.qi("proxy-url", 1), settings.proxyUrl);
}