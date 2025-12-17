import { loadFeed } from "#feed";
import "#style.scss";
import "#ui/header";
import { mainUi } from "#ui/main";
import "#ui/settings";
import "@wxn0brp/flanker-dialog/style.css";
import "@wxn0brp/flanker-ui/html";

loadFeed();
mainUi.mount();