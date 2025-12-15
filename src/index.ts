import { loadFeed } from "#feed";
import "#style.scss";
import "#ui/header";
import "@wxn0brp/flanker-ui/html";
import "@wxn0brp/flanker-dialog/style.css";
import { mainUi } from "#ui/main";

loadFeed();
mainUi.mount();