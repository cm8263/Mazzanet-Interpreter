import axios, {AxiosError} from "axios";
import {JSDOM} from "jsdom";
import {Page} from "./types/components/page";
import * as dotenv from "dotenv";

dotenv.config({ path: process.cwd() + "/.env" });

let recentPages: Page[] = [];

const getRecentPagerMessages = async (): Promise<Page[]> => {
	let html;

	await axios.get(process.env.ENDPOINT)
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
			cells[0].textContent as string,
			cells[1].textContent as string,
			cells[2].textContent as string
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

const main = async () => {
	const pages = await getPagerMessagesByCapcodes(getCapcodes());

	if (recentPages.length === 0) {
		console.log("First run, skipping comparison.");
	} else {
		if (pages[0] !== undefined && pages[0].equals(recentPages[0])){
			console.log("No changes.")
		} else {
			console.info("New changes!");
		}
	}

	recentPages = pages;

	console.info(`${recentPages.length} recent page messages found!`);
}

main().finally();
setInterval(() => main().finally(), 60 * 1000);