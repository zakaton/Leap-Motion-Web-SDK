// https://developer-archive.leapmotion.com/documentation/javascript/supplements/Leap_JSON.html

import Hand from "./Hand.js";
import Pointable from "./Pointable.js";

class Frame {
    constructor(frameData) {
        const {currentFrameRate, id, timestamp} = frameData;
            Object.assign(this, {currentFrameRate, id, timestamp});

        const {hands, pointables} = frameData;
            this.pointables = pointables.map(pointableData => new Pointable(pointableData));
            this.hands = hands.map(handData => new Hand(handData, this.pointables));
    }
}

export default Frame;