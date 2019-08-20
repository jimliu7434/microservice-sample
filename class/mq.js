const RabbitMQ = require('rabbit.js');
const EventEmitter = require('events');

const MQ_TYPE_ENUM = Object.freeze({
    PUB: { type: 'send', str: 'PUB' },
    PUBLISH: { type: 'send', str: 'PUB' },
    SUB: { type: 'recv', str: 'SUB' },
    SUBSCRIBE: { type: 'recv', str: 'SUB' },
    PUSH: { type: 'send', str: 'PUSH' },
    PULL: { type: 'recv', str: 'PULL' },
    REQ: { type: 'send', str: 'REQ' },
    REQUEST: { type: 'send', str: 'REQ' },
    REP: { type: 'recv', str: 'REP' },
    REPLY: { type: 'recv', str: 'REP' },
    WORKER: { type: 'recv', str: 'WORKER' },
});

class MQ extends EventEmitter {
    constructor({ type, queue, encoding = 'utf8', prefetch = 10 }) {
        super();
        this.RabbitMQ_URL = 'amqp://broker:86136982@10.99.0.146/test';
        this.rbtype = MQ_TYPE_ENUM[type.toUpperCase()];
        this.queue = queue;

        if (!this.RabbitMQ_URL) {
            throw new Error(`RabbitMQ_URL not exists`);
        }
        if (!this.queue) {
            throw new Error(`Queue name not exists`);
        }
        if (!this.rbtype) {
            throw new Error(`MQ type Error`);
        }

        const opt = {
            prefetch: prefetch,
        };
        const that = this;
        that._encoding = encoding;
        that._context = RabbitMQ.createContext(this.RabbitMQ_URL);
        that._context.on('ready', () => {
            that.emit('ready');
        });
        that._socket = that._context.socket(this.rbtype.str, opt);
        if (this.rbtype.type === 'recv') {
            that._socket.setEncoding(that._encoding);
            that._socket.on('data', (msg) => {
                that.emit('data',
                    {
                        msg,
                        ack: that._socket.ack ? that._socket.ack.bind(that._socket) : null,
                    }
                );
            });
        }
        that._socket.connect(this.queue);
    }

    publish(msg, encoding = this._encoding) {
        const topic = 'n';
        this._socket.publish(topic, msg, encoding);
    }

    write(msg, encoding = this._encoding) {
        this._socket.write(msg, encoding);
    }

    close() {
        this._socket.close();
    }
}

module.exports = MQ;