import { app, oneWindow } from "@wxn0brp/zhiva-base-lib";
import { apiRouter } from "@wxn0brp/zhiva-base-lib/api";

const USER_AGENT = "VelesFeed/0.1 (+https://github.com/wxn0brP/VelesFeed)";
const FEED_ACCEPT =
	"application/atom+xml, application/rss+xml, application/xml;q=0.9, text/xml;q=0.9, */*;q=0.8";

app.static(".");
app.static("/", "dist", {
	errorIfDirNotFound: false,
});
app.static("/", "public", {
	errorIfDirNotFound: false,
});

apiRouter.get("/proxy", async (req, res) => {
	const url = req.query.url;
	if (!url || !url.startsWith("http"))
		return res.status(400).json({
			error: "Missing URL",
		});

	try {
		const upstream = await fetch(url, {
			headers: {
				"user-agent": USER_AGENT,
				accept: FEED_ACCEPT,
			},
		});

		if (!upstream.ok)
			return res.status(upstream.status).json({
				error: `Upstream responded ${upstream.status}`,
			});

		res.ct("application/xml").send(await upstream.text());
	} catch {
		res.status(400).json({
			error: "Invalid URL",
		});
	}
});

oneWindow();
