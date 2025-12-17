import { localDB } from "#core/db";
import { VelesSource } from "#types";
import { prompt } from "@wxn0brp/flanker-dialog";
import { mountView } from "@wxn0brp/flanker-ui";

export const sourcesView = mountView<VelesSource>({
    selector: "#settings-sources",
    template: (source: VelesSource) => `
        <div class="source-item" data-id="${source._id}">
            <span>${source.name}</span>
            <div class="actions">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        </div>
    `,
    emptyData: "No sources configured",
    events: {
        "click": {
            ".edit": async (el) => {
                const id = el.closest<HTMLElement>(".source-item").dataset.id;
                const source = await localDB.source.findOne({ _id: id }) as VelesSource;
                const newUrl = await prompt("Enter new URL", source.url);
                if (!newUrl) return;
                await localDB.source.update({ _id: id }, { url: newUrl });
            },
            ".delete": async (el) => {
                const id = el.closest<HTMLElement>(".source-item").dataset.id;
                await localDB.source.remove({ _id: id });
            }
        }
    }
});