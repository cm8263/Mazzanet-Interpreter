declare global {
	namespace NodeJS {
		interface ProcessEnv {
			CAPCODES: string;
			ENDPOINT: string;
		}
	}
}

export {}