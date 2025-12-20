import { loadSettings } from "./load";
import { saveSettings } from "./save";
import "./settings.scss";
import { watchInputs } from "./text";

watchInputs();
loadSettings();
saveSettings();