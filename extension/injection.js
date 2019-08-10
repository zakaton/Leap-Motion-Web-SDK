const intervalId = setInterval(() => {
    if(window.THREE !== undefined) {
        const leapMotionElement = document.createElement("leap-motion");
        leapMotionElement.setAttribute("open", '');
        document.body.appendChild(leapMotionElement);
        clearInterval(intervalId);
        leapMotionCallback(leapMotionElement);
    }
}, 10);

function leapMotionCallback(leapMotionElement) {
    // this is where you'd add your custom code
}