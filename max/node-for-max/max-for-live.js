// https://help.ableton.com/hc/en-us/articles/209071389-Controlling-Live-using-Max-for-Live-Tutorial-
// https://docs.cycling74.com/max6/dynamic/c74_docs.html#live_object_model

const maxAPI = require("max-api");

const LeapMotion = require("./leap-motion.js");
const leapMotion = new LeapMotion();

leapMotion.addEventListener("frame", event => {
    // add custom code here
});
leapMotion.open();

maxAPI.post("Leap for Node for Max Loaded");