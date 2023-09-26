import { rootApi } from "@/src/context/RootApi";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        [rootApi.reducerPath]: rootApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(rootApi.middleware)
});

export default store;
