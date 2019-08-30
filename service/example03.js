const MQ = require('../class/mq');

class Example {
    constructor({type, evtcnt, delay = 100, handler,}) {
        const that = this;

        if(type === 'PRODUCER') {
            this.mq = new MQ({ type: 'REQ', queue: 'events', });
            this.mq.on('ready', () => {
                setTimeout(() => {
                    for(let i = 1 ; i <= evtcnt; i ++){
                        console.log(`[Example03] [Producer] Sending task ${i}`);
                        that.mq.write(`{${i}}`);
                    }
                }, delay || 100);
            });
        }
        else {
            this.mq = new MQ({ type: 'WORKER', queue: 'events', });
            this.mq.on('data', async ({msg, ack,}) => {
                if(handler) {
                    await handler(msg, ack);
                }
            });
        }
    }
}

module.exports = Example;

