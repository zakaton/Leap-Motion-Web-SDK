const LeapMotion = require("./leap-motion.js");

const leapMotion = new LeapMotion();
leapMotion.addEventListener("frame", event => {
    // add your custom code here
    console.log(event.detail);
});
leapMotion.open();