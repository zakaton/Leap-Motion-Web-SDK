const maxAPI = require("max-api");
const WebSocket = require("ws");

const esmRequire = require("esm")(module);
const LeapMotion = esmRequire("./leap-motion.js");

LeapMotion.WebSocket = WebSocket;
LeapMotion.CustomEvent = class {
    constructor(type, options) {
        this.type = type;
        this.detail = options.detail;
    }
}

const leapMotion = new LeapMotion();
leapMotion.addEventListener("frame", event => {
    // add your custom code here
});
leapMotion.open();

maxAPI.post("Leap for Node for Max Loaded");