declare global {
	namespace NodeJS {
		interface ProcessEnv {
			CAPCODES: string;
			ENDPOINT: string;
			ALL_ENDPOINT: string;
			STATION_ENDPOINT: string;
			BOT_ENDPOINT: string;
			BOT_TOKEN: string;
			HTTP_SERVER_PORT: string;
			HTTP_TOKEN: string;
			BASE_URL: string;
		}
	}
}

export {};