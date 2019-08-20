const MQ = require('../class/mq');

class Example {
    constructor({ type, name, handler }) {
        this.serverName = name;

        if (type === 'WRITER') {
            this.mq = new MQ({ type: 'SUB', queue: 'logging' });
            this.mq.on('data', ({ msg: data }) => {
                if (data && handler) {
                    const { serverName, logLevel, msg } = JSON.parse(data);
                    handler(serverName, logLevel, msg);
                }
            });
        }
        else {
            this.mq = new MQ({ type: 'PUB', queue: 'logging' });
        }
    }

    info(msg) {
        this.mq.publish(JSON.stringify({ serverName: this.serverName, logLevel: 'info', msg }));
    }

    warn(msg) {
        this.mq.publish(JSON.stringify({ serverName: this.serverName, logLevel: 'warn', msg }));
    }
}

module.exports = Example;

