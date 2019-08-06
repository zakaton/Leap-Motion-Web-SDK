// https://developer-archive.leapmotion.com/documentation/javascript/api/Leap.Hand.html

import Skeleton from "./Skeleton.js";

class Hand {
    constructor(handData, fingers) {
        const {confidence, id, timeVisible, type} = handData;
        Object.assign(this, {confidence, id, timeVisible, type});

        const {armBasis, armWidth} = handData;
        this.arm = {
            basis : new THREE.Vector3(...armBasis),
            width : armWidth,
        };

        const {wrist} = handData;
        this.wrist = new THREE.Vector3(...wrist);

        const {direction} = handData;
        this.direction = new THREE.Vector3(...direction);

        const {elbow} = handData;
        this.elbow = new THREE.Vector3(...elbow);

        const {grabAngle, grabStrength} = handData;
        this.grab = {
            angle : grabAngle,
            strength : grabStrength,
        };

        const {palmNormal, palmPosition, palmVelocity, palmWidth} = handData;
        this.palm = {
            normal : new THREE.Vector3(...palmNormal),
            position : new THREE.Vector3(...palmPosition),
            velocity : new THREE.Vector3(...palmVelocity),
            width : palmWidth,
        };

        const {pinchDistance, pinchStrength} = handData;
        this.pinch = {
            distance : pinchDistance,
            strength : pinchStrength,
        };

        this.fingers = [];
        fingers.forEach(finger => {
            if(finger.handId == this.id) {
                this.fingers[finger.type] = finger;
                finger.hand = this;
            }
        });
    }

    get skeleton() {
        this._skeleton = this._skeleton || new Skeleton(this);
        return this._skeleton;
    }
}

export default Hand;