import {Nature} from "./nature";

class ExternalPage {
	nature: Nature;
	timestamp: Date;
	localTimestamp: string;
	message: string;
	mapUrl: string;

	constructor(message: string, mapUrl: string) {
		this.message = message;
		this.nature = Nature.Emergency;
		this.message = this.message.substring(7);
		this.timestamp = new Date(this.message.substring(0, 19));
		this.localTimestamp = this.timestamp.toLocaleString("en-AU");
		this.message = this.message.substring(20);
		this.mapUrl = mapUrl;
	}
}

export {ExternalPage};