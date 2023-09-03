import {Page} from "./types/page";
import axios, {AxiosError} from "axios";
import {JSDOM} from "jsdom";
import {ConsoleType} from "./types/consoleType";
import {ExternalPage} from "./types/externalPage";

const consoleMessage = (message: any, type: ConsoleType = ConsoleType.Log) => {
	message = `${new Date().toLocaleString("en-AU")} // ${message}`;

	switch (type) {
		case ConsoleType.Log:
			console.log(message);
			break;

		case ConsoleType.Info:
			console.info(message);
			break;

		case ConsoleType.Warn:
			console.warn(message);
			break;

		case ConsoleType.Error:
			console.error(message);
			break;

	}
}

const getRecentPagerMessages = async (): Promise<Page[]> => {
	let html;

	await axios.get(`${process.env.ALL_ENDPOINT}${process.env.ALL_ENDPOINT}`)
		.then(res => {
			html = res.data;
		})
		.catch((error: AxiosError) => {
			console.error(`There was an error with ${error.config?.url}.`);
			console.error(error.toJSON());
			return [];
		});

	const dom = new JSDOM(html);
	const tableEntries = Array.from(dom.window.document.querySelectorAll("tr"));

	let pages = [];

	for (const entry of tableEntries) {
		const cells = entry.cells;

		pages.push(new Page(
			cells[2].textContent as string,
			cells[0].textContent as string,
			cells[1].textContent as string
		));
	}

	return pages;
}

const getPagerMessagesByCapcodes = async (capcodes: string[]): Promise<Page[]> => {
	const recentPages = await getRecentPagerMessages();

	let pages: Page[] = [];

	for (const page of recentPages) {
		if (!page.checkCapcode(capcodes)) continue;

		pages.push(page);
	}

	return pages;
}

const getCapcodes = (): string[] => {
	const rawCapcodes = process.env.CAPCODES;

	return rawCapcodes.split(";");
}

const getLatestPagerMessageByStation = async (station: string, district: string): Promise<ExternalPage> => {
	let html;

	await axios.get(`${process.env.ENDPOINT}${process.env.STATION_ENDPOINT}&filter=${station}&reg=${district}`)
		.then(res => {
			html = res.data;
		})
		.catch((error: AxiosError) => {
			console.error(`There was an error with ${error.config?.url}.`);
			console.error(error.toJSON());
			return [];
		});

	const dom = new JSDOM(html);

	const alert = Array.from(dom.window.document.querySelectorAll("strong"))[0];
	const mapUrl = dom.window.document.querySelector("img");

	return new ExternalPage(alert.textContent as string, mapUrl?.src as string);
}

const broadcast = async (page: Page) => {
	await axios.post(process.env.BOT_ENDPOINT, {
		token: process.env.BOT_TOKEN,
		...page
	}, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	})
		.then(_ => {
			consoleMessage("Broadcasted", ConsoleType.Info);
		})
		.catch((error: AxiosError) => {
			consoleMessage(`There was an error with ${error.config?.url}.`, ConsoleType.Error);
			consoleMessage(error, ConsoleType.Error);
			return [];
		});
}

export {consoleMessage, getRecentPagerMessages, getPagerMessagesByCapcodes, getCapcodes, getLatestPagerMessageByStation, broadcast}