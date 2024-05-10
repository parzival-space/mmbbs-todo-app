import liveServer from "live-server";

liveServer.start({
    port: 8080,
    host: "0.0.0.0",
    root: "./src",
    open: false,
    ignore: ''
})