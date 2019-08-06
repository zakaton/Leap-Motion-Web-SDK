/*
    Takes in a hand, outputs a skeleton
    use hands to update the skeleton
    automatically updated by hands of the given id
    can also add helpers for motion and stuff
*/

// https://threejs.org/docs/#api/en/objects/Bone
// https://threejs.org/docs/#api/en/objects/Skeleton
// https://threejs.org/docs/#api/en/helpers/SkeletonHelper
// https://threejs.org/docs/#api/en/objects/SkinnedMesh

class Skeleton extends THREE.Skeleton {
    constructor(hand) {
        const bones = [];

        const elbow = new THREE.Bone();
        elbow.name = "elbow";
        bones.push(elbow);

        const wrist = new THREE.Bone();
        wrist.name = "wrist";
        elbow.add(wrist);
        bones.push(elbow);

        const palm = new THREE.Bone();
        palm.name = "palm";
        wrist.add(palm);
        bones.push(palm);

        hand.fingers.forEach((finger, index) => {
            // https://developer-archive.leapmotion.com/documentation/javascript/devguide/Intro_Skeleton_API.html

            const metacarpal = new THREE.Bone();
            metacarpal.name = `${finger.typeString} metacarpal`;
            palm.add(metacarpal);

            const proximal = new THREE.Bone();
            proximal.name = `${finger.typeString} proximal`;
            metacarpal.add(proximal);

            const intermediate = new THREE.Bone();
            intermediate.name = `${finger.typeString} intermediate`;
            proximal.add(intermediate);

            const distal = new THREE.Bone();
            distal.name = `${finger.typeString} distal`;
            intermediate.add(distal);
        });

        super(bones);

        this.setFromHand(hand);
    }

    setFromHand(hand) {
        const elbow = this.getBoneByName("elbow");

        const wrist = this.getBoneByName("wrist");

        const palm = this.getBoneByName("palm");

        hand.fingers.forEach(finger => {
            finger.bones.forEach(bone => {

            });
        });
    }
}

export default Skeleton;