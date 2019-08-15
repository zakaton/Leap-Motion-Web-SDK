// https://developer-archive.leapmotion.com/documentation/javascript/api/Leap.Hand.html

import {Vector3} from "../../../node_modules/three/src/math/Vector3.js";
import {Matrix4} from "../../../node_modules/three/src/math/Matrix4.js";
import {Euler} from "../../../node_modules/three/src/math/Euler.js";

class Hand {
    constructor(handData) {
        const {confidence, id, timeVisible, type} = handData;
        Object.assign(this, {confidence, id, timeVisible, type});

        const {armBasis, armWidth} = handData;
        this.arm = {
            width : armWidth,
            basis : new Matrix4(),
        };

        {
            // https://developer-archive.leapmotion.com/documentation/javascript/api/Leap.Hand.html#Hand.direction
            const armBasisVectors = armBasis.map(vector => new Vector3(...vector));
            if(this.type == "left") 
                armBasisVectors[0].negate();
            this.arm.basis.makeBasis(...armBasisVectors)
        }

        const {elbow} = handData;
        this.elbow = new Vector3(...elbow);

        const {wrist} = handData;
        this.wrist = new Vector3(...wrist);

        const {grabAngle, grabStrength} = handData;
        this.grab = {
            angle : grabAngle,
            strength : grabStrength,
        };

        // https://developer-archive.leapmotion.com/documentation/javascript/api/Leap.Hand.html#Hand.direction
        const {direction} = handData;
        this.direction = new Vector3(...direction);

        const {palmNormal, palmPosition, palmVelocity, palmWidth} = handData;
        this.palm = {
            normal : new Vector3(...palmNormal),
            position : new Vector3(...palmPosition),
            velocity : new Vector3(...palmVelocity),
            width : palmWidth,
            basis : new Matrix4(),
            direction : this.direction,
            
            // lazy evaluation for yaw/pitch/roll
            get euler() {
                if(this._euler == undefined) {
                    this._euler = new Euler();
                    this._euler.setFromRotationMatrix(this.basis);
                }
                return this._euler;
            },
            get yaw() {
                return this.euler.y;
            },
            get pitch() {
                return this.euler.x;
            },
            get roll() {
                return this.euler.z;
            },
        };
        
        {
            const negatedPalmNormal = new Vector3();
            negatedPalmNormal.copy(this.palm.normal); negatedPalmNormal.negate();

            this.palm.basis.lookAt(
                this.wrist, // center
                this.palm.position, // eye
                negatedPalmNormal, // up
            );
        }

        const {pinchDistance, pinchStrength} = handData;
        this.pinch = {
            distance : pinchDistance,
            strength : pinchStrength,
        };

        this.fingers = [];
    }
}

export default Hand;