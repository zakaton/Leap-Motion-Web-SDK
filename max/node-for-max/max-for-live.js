const maxAPI = require("max-api");
const LiveObjectModel = require("./live-object-model.js");

const LeapMotion = require("./leap-motion.js");

const leapMotion = new LeapMotion();
leapMotion.addEventListener("frame", event => {
    // add your custom code here
});
leapMotion.open();

maxAPI.post("Leap for Node for Max Loaded");