/*
    TODO
        *
*/

// https://threejs.org/docs/#api/en/objects/Bone
// https://threejs.org/docs/#api/en/objects/Skeleton
// https://threejs.org/docs/#api/en/helpers/SkeletonHelper
// https://threejs.org/docs/#api/en/objects/SkinnedMesh

import {Skeleton as _Skeleton} from "../../../node_modules/three/src/objects/Skeleton.js";
import {Bone} from "../../../node_modules/three/src/objects/Bone.js";
import {Vector3} from "../../../node_modules/three/src/math/Vector3.js";
import {Matrix4} from "../../../node_modules/three/src/math/Matrix4.js";


class Skeleton extends _Skeleton {
    constructor(hand) {
        const bones = [];

        const forearm = new Bone();
        forearm.name = `${hand.type} forearm`;
        bones.push(forearm);

        const wrist = new Bone();
        wrist.name = `${hand.type} wrist`;
        forearm.add(wrist);
        bones.push(wrist);

        hand.fingers.forEach(finger => {
            // https://developer-archive.leapmotion.com/documentation/javascript/devguide/Intro_Skeleton_API.html
            
            const metacarpal = new Bone();
            metacarpal.name = `${hand.type} ${finger.name} ${finger.metacarpal.name}`;
            bones.push(metacarpal);
            wrist.add(metacarpal);

            const proximal = new Bone();
            proximal.name = `${hand.type} ${finger.name} ${finger.proximal.name}`;
            bones.push(proximal);
            metacarpal.add(proximal);

            const medial = new Bone();
            medial.name = `${hand.type} ${finger.name} ${finger.medial.name}`;
            bones.push(medial);
            proximal.add(medial);

            const distal = new Bone();
            distal.name = `${hand.type} ${finger.name} ${finger.distal.name}`;
            bones.push(distal);
            medial.add(distal);

            const tip = new Bone();
            tip.name = `${hand.type} ${finger.name} "tip"`;
            bones.push(tip);
            distal.add(tip);
        });

        super(bones);

        this.setFromHand(hand);
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

            const tip = this.getBoneByName(`${hand.type} ${finger.name} "tip"`);
            this._updateBonePosition(tip, finger.tipPosition);
        });
    }

    _updateBonePosition(bone, position) {
        const _position = new Vector3(...position.toArray());
        bone.parent.worldToLocal(_position);
        bone.position.copy(_position);
    }
    _updateBoneRotation(bone, basis) {
        const rotation = new Matrix4();
        rotation.extractRotation(bone.parent.matrixWorld);
        rotation.getInverse(rotation);
        rotation.multiply(basis);
        bone.setRotationFromMatrix(rotation);
    }
    _updateBonePositionAndRotation(bone, position, basis) {
        this._updateBonePosition(bone, position);
        this._updateBoneRotation(bone, basis);
    }
}

export default Skeleton;