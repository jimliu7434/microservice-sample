module.exports = async () => {
    const LoggingService = new (require('../service/example04.js'))({
        type: 'WRITER',
        handler: (serverName, logLevel, msg) => {
            const date = new Date();

            const getDateStr = (d) => {
                const HH = d.getHours();
                const mm = d.getMinutes();
                const ss = d.getSeconds();

                return [
                    HH,
                    (mm > 9 ? '' : '0') + mm,
                    (ss > 9 ? '' : '0') + ss,
                ].join(':');
            }

            console.log(`${logLevel}  ${getDateStr(date)}  [${serverName}]\t${msg}`);
        },
    });

    const LogProducer01 = new (require('../service/example04.js'))({
        type: 'SENDER',
        name: 'Server01',
    });

    const LogProducer02 = new (require('../service/example04.js'))({
        type: 'SENDER',
        name: 'Server02',
    });

    setTimeout(() => {
        for (let i = 1; i <= 500; i++) {
            if (i % 5 === 0) {
                LogProducer01.warn(`${i}`);
            }
            else {
                LogProducer01.info(`${i}`);
            }

            if (i % 3 === 0) {
                LogProducer02.warn(`${i}`);
            }
            else {
                LogProducer02.info(`${i}`);
            }
        }
    }, 1000);

}