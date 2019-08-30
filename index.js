
const config = require('./config.js');

(async () => {
    const port = Number(process.argv[2] || 80);
    switch (config.ExampleNo) {
        case 1: {
            await (require('./exampleHandler/example01.js'))({ port, });
            break;
        }
        case 2: {
            await (require('./exampleHandler/example02.js'))({ port, });
            break;
        }
        case 3: {
            await (require('./exampleHandler/example03.js'))({ port, });
            break;
        }
        case 4: {
            await (require('./exampleHandler/example04.js'))({ port, });
            break;
        }
        case 5: {
            await (require('./exampleHandler/example05.js'))({ port, });
            break;
        }
        default: {
            throw new Error(`config.ExampleNo ${config.ExampleNo} is not implemented`);
        }
    }
})();
