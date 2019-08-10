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
    const video = document.getElementsByTagName("video")[0];

    leapMotionElement.addEventListener("frame", event => {
        const frame = event.detail;
        
        frame.hands.forEach(hand => {
            const euler = new THREE.Euler();
            euler.setFromRotationMatrix(hand.palm.basis);
            if(hand.type == "left") {
                if(video !== undefined) {
                    if(hand.pinch.strength < 0.7) {
                        if(video.paused) {
                            video.play();
                        }
                    }
                    else {
                        if(!video.paused) {
                            video.pause();
                        }
                    }    
                }
            }
            else {
                window.scrollBy(-euler.y*20, -euler.x*20);
            }
        });
    });
}