// https://developer-archive.leapmotion.com/documentation/javascript/api/Leap.Bone.html

class Bone {
    constructor(basis, type) {
        this.basis = basis;

        this.type = type;
        this.name = this.constructor.names[this.type];
    }

    static get names() {
        return [
            "metacarpal",
            "proximal",
            "medial",
            "distal",
        ];
    }
}

export default Bone;