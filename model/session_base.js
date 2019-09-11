class Session {
    constructor() {}

    async Get() {
        throw new ReferenceError('Not Implemented');
    }

    async Set() {
        throw new ReferenceError('Not Implemented');
    }

    async Destroy() {
        throw new ReferenceError('Not Implemented');
    }
}

module.exports = Session;