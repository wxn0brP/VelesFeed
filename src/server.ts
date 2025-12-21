import { app, oneWindow } from "@wxn0brp/zhiva-base-lib";
import { apiRouter } from "@wxn0brp/zhiva-base-lib/api";

app.static(".");
apiRouter.get("/proxy", async (req, res) => {
    const url = req.query.url;
    if (!url || !url.startsWith("http")) return res.status(400).json({ error: "Missing URL" });

    try {
        const data = await fetch(url).then(res => res.text());
        res.send(data);
    } catch {
        res.status(400).json({ error: "Invalid URL" });
    }
});

oneWindow();