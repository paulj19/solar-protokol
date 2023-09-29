import {defineConfig} from "cypress";

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        baseUrl: 'http://localhost:3000',
        env: {
            NODE_ENV: 'test',
            NEXT_PUBLIC_FIREBASE_URL_TEST: "https://solar-protokol-e2e-default-rtdb.europe-west1.firebasedatabase.app",
            NEXT_PUBLIC_FIREBASE_URL: "https://solar-protokol-default-rtdb.europe-west1.firebasedatabase.app"
        },
        watchForFileChanges: false,
    },
});
