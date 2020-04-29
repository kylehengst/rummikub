import { Workbox } from "workbox-window";

let wb;

if ("serviceWorker" in navigator) {
  wb = new Workbox(`${process.env.BASE_URL}service-worker.js`);

  wb.addEventListener("controlling", (event) => {
    console.log('controlling', event);
    window.location.reload();
  });

  wb.addEventListener("message", (event) => {
    console.log('message', event);
  });

  wb.register();
} else {
  wb = null;
}

export default wb;
