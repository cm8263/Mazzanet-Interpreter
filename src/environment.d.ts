declare global {
	namespace NodeJS {
		interface ProcessEnv {
			CAPCODES: string;
			ENDPOINT: string;
			BOT_ENDPOINT: string;
			BOT_TOKEN: string;
		}
	}
}

export {}