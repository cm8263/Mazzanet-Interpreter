import {Nature} from "./nature";

class Page {
	nature: Nature;
	capcode: string;
	timestamp: Date;
	message: string;

	constructor(capcode: string, timestamp: string, message: string) {
		this.capcode = capcode;
		this.timestamp = new Date(timestamp);
		this.message = message;

		let stripAmount = 2;

		if (message.startsWith("@@ALERT")){
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
	}

	public checkCapcode(capcodes: string[]): boolean {
		return capcodes.includes(this.capcode);
	}
}

export {Page}