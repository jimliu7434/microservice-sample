class Session {
    constructor() {}

    async Get(key) {
        throw new ReferenceError(`Not Implemented`);
    }

    async Set(key, data) {
        throw new ReferenceError(`Not Implemented`);
    }

    async Destroy(key) {
        throw new ReferenceError(`Not Implemented`);
    }
}

module.exports = Session;