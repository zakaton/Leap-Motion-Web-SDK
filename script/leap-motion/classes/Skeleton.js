/*
    TODO
        *
*/

// https://threejs.org/docs/#api/en/objects/Bone
// https://threejs.org/docs/#api/en/objects/Skeleton
// https://threejs.org/docs/#api/en/helpers/SkeletonHelper
// https://threejs.org/docs/#api/en/objects/SkinnedMesh

import {Skeleton as _Skeleton} from "../../../node_modules/three/src/objects/Skeleton.js";
import {Bone as _Bone} from "../../../node_modules/three/src/objects/Bone.js";
import {Vector3} from "../../../node_modules/three/src/math/Vector3.js";
import {Matrix4} from "../../../node_modules/three/src/math/Matrix4.js";

import Bone from "./Bone.js";
import Pointable from "./Pointable.js";

class Skeleton extends _Skeleton {
    constructor() {
        const bones = [];
        const root = new _Bone();
        bones.push(root);

        const addBone = (name) => {
            const bone = new _Bone();
            bone.name = name;
            root.add(bone);
            bones.push(bone);
        }

        ["left", "right"].forEach(handType => {
            addBone(`${handType} forearm`);
            addBone(`${handType} wrist`);
            
            Pointable.names.forEach(fingerName => {
                Bone.names.forEach(boneName => addBone(`${handType} ${fingerName} ${boneName}`));
                addBone(`${handType} ${fingerName} tip`);
            });
        });

        super(bones);
    }

    setFromHand(hand) {
        const forearm = this.getBoneByName(`${hand.type} forearm`);
        forearm.setRotationFromMatrix(hand.arm.basis);
        forearm.position.copy(hand.elbow);

        const wrist = this.getBoneByName(`${hand.type} wrist`);
        this._updateBonePositionAndRotation(wrist, hand.wrist, hand.palm.basis);
        
        hand.fingers.forEach((finger, index) => {                      
            const metacarpal = this.getBoneByName(`${hand.type} ${finger.name} ${finger.metacarpal.name}`);
            this._updateBonePositionAndRotation(metacarpal, finger.metacarpal.position, finger.metacarpal.basis);

            const proximal = this.getBoneByName(`${hand.type} ${finger.name} ${finger.proximal.name}`);
            this._updateBonePositionAndRotation(proximal, finger.proximal.position, finger.proximal.basis);

            const medial = this.getBoneByName(`${hand.type} ${finger.name} ${finger.medial.name}`);
            this._updateBonePositionAndRotation(medial, finger.medial.position, finger.medial.basis);

            const distal = this.getBoneByName(`${hand.type} ${finger.name} ${finger.distal.name}`);
            this._updateBonePositionAndRotation(distal, finger.distal.position, finger.distal.basis);

            const tip = this.getBoneByName(`${hand.type} ${finger.name} tip`);
            this._updateBonePosition(tip, finger.tipPosition);
        });
    }

    _updateBonePosition(bone, position) {
        bone.position.copy(position);
    }
    _updateBoneRotation(bone, basis) {
        bone.setRotationFromMatrix(basis);
    }
    _updateBonePositionAndRotation(bone, position, basis) {
        this._updateBonePosition(bone, position);
        this._updateBoneRotation(bone, basis);
    }

    setFromHands(...hands) {
        hands.forEach(hand => this.setFromHand(hand));
    }
}

export default Skeleton;