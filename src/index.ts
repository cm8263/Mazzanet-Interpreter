import {Page} from "./types/page";
import * as dotenv from "dotenv";
import {
	broadcast,
	consoleMessage,
	getCapcodes,
	getPagerMessagesByCapcodes
} from "./helpers";
import {ConsoleType} from "./types/consoleType";
import {HttpServer} from "./types/httpServer";

dotenv.config({ path: process.cwd() + "/.env" });

let recentPages: Page[] = [];

// const main = async () => {
// 	const pages = await getPagerMessagesByCapcodes(getCapcodes());
//
// 	if (recentPages.length === 0) {
// 		consoleMessage("First run, skipping comparison.");
// 	} else if (pages[0] !== undefined && pages[0].equals(recentPages[0])){
// 		consoleMessage("No changes.")
// 	} else {
// 		consoleMessage("New changes!", ConsoleType.Info);
//
// 		const newPages = pages.filter(x => !recentPages.includes(x)).concat(recentPages.filter(x => !pages.includes(x)));
//
// 		consoleMessage(`${newPages.length} new pages found!`, ConsoleType.Info);
//
// 		for (const page of newPages) {
// 			await broadcast(page);
// 		}
// 	}
//
// 	recentPages = pages;
//
// 	consoleMessage(`${recentPages.length} recent pages messages found!`, ConsoleType.Info);
// }
//
// setInterval(() => main().finally(), 5 * 60 * 1000);

new HttpServer();