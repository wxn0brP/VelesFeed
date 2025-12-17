import { ReactiveCell } from "@wxn0brp/flanker-ui";
import { toggleBoolean } from "@wxn0brp/flanker-ui/storeUtils";
import { settingsPanel } from "./html";

const aside = qs("aside");
const viewStatus = new ReactiveCell(false);
export function toggle(e: Event) {
    toggleBoolean(viewStatus);
    (e.target as HTMLButtonElement).clT("active");
}

viewStatus.subscribe(v => {
    aside.style.display = v ? "none" : "";
    settingsPanel.style.display = v ? "" : "none";
});