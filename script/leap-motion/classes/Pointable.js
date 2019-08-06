// https://developer-archive.leapmotion.com/documentation/javascript/api/Leap.Pointable.html

import Bone from "./Bone.js";

class Pointable {
    constructor(pointableData) {
        // https://developer-archive.leapmotion.com/documentation/javascript/devguide/Intro_Skeleton_API.html
        const {carpPosition, mcpPosition, pipPosition, dipPosition, btipPosition} = pointableData;
        
        this.carpPosition = new THREE.Vector3(...carpPosition);
        this.mcpPosition = new THREE.Vector3(...mcpPosition);
        this.pipPosition = new THREE.Vector3(...pipPosition);
        this.dipPosition = new THREE.Vector3(...dipPosition);
        this.btipPosition = new THREE.Vector3(...btipPosition);

        const {bases} = pointableData;
        this.bones = bases.map((basis, index) => {
            return new Bone(basis, index);
        });
    
        this.bones.forEach((bone, index) => {
            bone.pointable = this;

            if(index > 0)
                bone.prevJoint = this.bones[index-1];

            if(index < this.bones.length-1)
                bone.nextJoint = this.bones[index+1];

            switch(bone.name) {
                case "metacarpal":
                    this.metacarpal = bone;
                    bone.length = this.carpPosition.distanceTo(this.mcpPosition);
                    break;
                case "proximal":
                    this.proximal = bone;
                    bone.length = this.mcpPosition.distanceTo(this.pipPosition)
                    break;
                case "medial":
                    this.medial = bone;
                    bone.length = this.pipPosition.distanceTo(this.dipPosition);
                    break;
                case "distal":
                    this.distal = bone;
                    bone.length = this.dipPosition.distanceTo(this.btipPosition);
                    break;
                default:
                    throw `undefined bone index ${index}`;
            }
        });

        const {tipPosition} = pointableData;
        this.tipPosition = new THREE.Vector3(...tipPosition);
        
        const {direction} = pointableData;
        this.direction = new THREE.Vector3(...direction);

        const {extended} = pointableData;
        this.extended = extended;

        const {id, handId} = pointableData;
        this.id = id;
        this.handId = handId;

        const {length, width} = pointableData;
        this.length = length;
        this.width = width;

        const {timeVisible} = pointableData;
        this.timeVisible = timeVisible;

        const {type} = pointableData;
        this.type = type;
        this.name = this.constructor.names[this.type];
    }

    static get names() {
        return [
            "thumb",
            "index finger",
            "middle finger",
            "ring finger",
            "pinky finger",
        ];
    }
}

export default Pointable;