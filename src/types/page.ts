import {Nature} from "./nature";

class Page {
	nature: Nature;
	capcode: string;
	timestamp: Date;
	localTimestamp: string;
	message: string;

	constructor(message: string, capcode: string, timestamp: string) {
		this.message = message;

		let stripAmount = 2;

		if (message.startsWith("@@ALERT")) {
			this.nature = Nature.Emergency;

			stripAmount = 8;
		} else if (message.startsWith("Hb")) {
			this.nature = Nature.NonEmergency;
		} else if (message.startsWith("QD")) {
			this.nature = Nature.Administrative;
		} else {
			this.nature = Nature.Invalid;
		}

		this.message = this.message.substring(stripAmount);
		this.capcode = capcode as string;
		this.timestamp = new Date(timestamp as string);
		this.localTimestamp = this.timestamp.toLocaleString("en-AU");
	}

	public checkCapcode(capcodes: string[]): boolean {
		return capcodes.includes(this.capcode);
	}

	public equals(comparison: Page) {
		return comparison !== undefined && this.capcode === comparison.capcode && this.message === comparison.message;
	}
}

export {Page}