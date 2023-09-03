import {IncomingMessage, Server, ServerResponse} from "http";
import * as http from "http";
import {parse} from "querystring";
import {getLatestPagerMessageByStation} from "../helpers";

class HttpServer {
	private readonly server: Server;

	constructor() {
		this.server = http.createServer();
		this.server.on("request", this.handler.bind(this.handler));
		this.server.listen(process.env.HTTP_SERVER_PORT);
	}

	private handler = async (request: IncomingMessage, response: ServerResponse) => {
		if (request.method !== "POST") {
			response.writeHead(405, {
				"Content-Type": "text/html",
				"Allow": "POST"
			});
			response.end("<img src=\"https://http.cat/images/405.jpg\" alt=\"405 Method Not Allowed\">");
			return;
		}

		const url = new URL(request.url as string, process.env.BASE_URL);

		let body = "";

		request.on("data", chunk => {
			body += chunk.toString();
		});

		request.on("end", async () => {
			const data = parse(body);
			const token = data["token"] as string | undefined;

			if (token === undefined) {
				this.badRequest(response);
				return;
			}

			if (token !== process.env.HTTP_TOKEN) {
				response.writeHead(401, {
					"Content-Type": "text/html"
				});
				response.end("<img src=\"https://http.cat/images/401.jpg\" alt=\"401 Unauthorized\">");
				return;
			}

			switch (url.pathname) {
			case "/checkStation":
				const station = data["station"] as string | undefined;
				const district = data["district"] as string | undefined;

				if (station === undefined || district === undefined) {
					this.badRequest(response);
					return;
				}
				const page = await getLatestPagerMessageByStation(station, district);

				const mapUrl = new URL(`${process.env.ENDPOINT}${page.mapUrl}`);

				mapUrl.searchParams.set("zoom", "13");

				page.mapUrl = mapUrl.toString();

				response.writeHead(200, {
					"Content-Type": "application/json"
				});
				response.end(JSON.stringify(page));
				break;

			default:
				this.badRequest(response);
				break;
			}
		});
	};

	private badRequest = (response: ServerResponse) => {
		response.writeHead(400, {
			"Content-Type": "text/html"
		});
		response.end("<img src=\"https://http.cat/images/400.jpg\" alt=\"400 Bad Request\">");
	};
}

export {HttpServer};