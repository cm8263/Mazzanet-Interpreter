declare global {
	namespace NodeJS {
		interface ProcessEnv {
			CAPCODES: string;
			ENDPOINT: string;
			BOT_ENDPOINT: string;
		}
	}
}

export {}