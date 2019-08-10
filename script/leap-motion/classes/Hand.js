// https://developer-archive.leapmotion.com/documentation/javascript/api/Leap.Hand.html

import Skeleton from "./Skeleton.js";

class Hand {
    constructor(handData) {
        const {confidence, id, timeVisible, type} = handData;
        Object.assign(this, {confidence, id, timeVisible, type});

        const {armBasis, armWidth} = handData;
        this.arm = {
            width : armWidth,
            basis : new THREE.Matrix4(),
        };

        {
            // https://developer-archive.leapmotion.com/documentation/javascript/api/Leap.Hand.html#Hand.direction
            const armBasisVectors = armBasis.map(vector => new THREE.Vector3(...vector));
            if(this.type == "left") 
                armBasisVectors[0].negate();
            this.arm.basis.makeBasis(...armBasisVectors)
        }

        const {elbow} = handData;
        this.elbow = new THREE.Vector3(...elbow);

        const {wrist} = handData;
        this.wrist = new THREE.Vector3(...wrist);

        const {grabAngle, grabStrength} = handData;
        this.grab = {
            angle : grabAngle,
            strength : grabStrength,
        };

        // https://developer-archive.leapmotion.com/documentation/javascript/api/Leap.Hand.html#Hand.direction
        const {direction} = handData;
        this.direction = new THREE.Vector3(...direction);

        const {palmNormal, palmPosition, palmVelocity, palmWidth} = handData;
        this.palm = {
            normal : new THREE.Vector3(...palmNormal),
            position : new THREE.Vector3(...palmPosition),
            velocity : new THREE.Vector3(...palmVelocity),
            width : palmWidth,
            basis : new THREE.Matrix4(),
            direction : this.direction,
            
            // lazy evaluation for yaw/pitch/roll
            get euler() {
                if(this._euler == undefined) {
                    this._euler = new THREE.Euler();
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
            const negatedPalmNormal = new THREE.Vector3();
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

    get skeleton() {
        this._skeleton = this._skeleton || new Skeleton(this);
        return this._skeleton;
    }
}

export default Hand;