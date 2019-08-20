module.exports = async () => {
    const Producer = new (require('../service/example03.js'))({
        type: 'PRODUCER',
        evtcnt: 500,
        delay: 500,
    });
    const Consumer01 = new (require('../service/example03.js'))({
        type: 'CONSUMER',
        handler: (msg, ack) => {
            console.log(`[Example03] [Consumber01] ${msg} handled`);
            setTimeout(() => {
                if (ack)
                    ack();
            }, 50);
        },
    });
    const Consumer02 = new (require('../service/example03.js'))({
        type: 'CONSUMER',
        handler: (msg, ack) => {
            console.log(`[Example03] [Consumber02] ${msg} handled`);
            setTimeout(() => {
                if (ack)
                    ack();
            }, 100);
        },
    });
}