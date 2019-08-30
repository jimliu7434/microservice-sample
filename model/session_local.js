const base = require('./session_base.js');

class Session extends base {
    constructor() {
        super();
        this.Data = new Map();
        this.Info = new Map();
        this.maxAge = 300 * 1000;
        this.isAsync = false;

        const that = this;
        setInterval(() => {
            [...that.Info.entries(),].forEach(([key, obj,]) => {
                if (obj.ExpiredUnixTSMS < Number(new Date())) {
                    this.Destroy(key);
                }
            });
        }, 30000);

        setInterval(() => {
            [...that.Data.entries(),].forEach(([key, obj,]) => {
                console.log(`[Example01] ${key}: ${JSON.stringify(obj)}`);
            });
            console.log('---');
        }, 10000);
    }

    Get(key) {
        return this.Data.get(key);
    }

    Set(key, data) {
        this.Info.set(key, {
            ExpiredUnixTSMS: Number(new Date()) + this.maxAge,
        });
        this.Data.set(key, data);
        return;
    }

    Destroy(key) {
        this.Info.delete(key);
        this.Data.delete(key);
        return;
    }
}

module.exports = Session;