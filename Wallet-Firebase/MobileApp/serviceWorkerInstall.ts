if ("serviceWorker" in navigator) {
    window.addEventListener("load", async (_evt) => {

        console.log("Serviceworker starting.");
        try {
            const registration = await navigator.serviceWorker.register("/service-worker.js");
            console.log("Serviceworker started.", registration);
        } catch (error) {
            console.error("Serviceworker failed.", error);
        }

    });
    /*self.addEventListener("install", async (evt: any) => {
        await evt.waitUntil();
    });
    self.addEventListener("activate", async (evt: any) => {
        await evt.waitUntil();
    });*/
}
