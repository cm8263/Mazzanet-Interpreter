declare global {
	namespace NodeJS {
		interface ProcessEnv {
			CAPCODES: string;
		}
	}
}

export {}