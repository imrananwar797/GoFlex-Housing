/// <reference types="vite/client" />

declare global {
    interface ImportMetaEnv {
        readonly VITE_API_URL?: string;
        // add other Vite env variables here as needed
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}

export { };
