module.exports = async ({ port }) => {
    const ServiceDiscovery02 = new (require('../service/example02.js'))({ port });
    setInterval(async () => {
        await ServiceDiscovery02.getPods();
        ServiceDiscovery02.showPods();
    }, 10000);

    setTimeout(async() => {
        await ServiceDiscovery02.leave();
        console.log(`[Example02] Remove this instance before exit`);
        process.exit();
    }, 60000);
}