module.exports = async ({ port }) => {
    const ServiceDiscovery05 = new(require('../service/example05.js'))({ port });
    setTimeout(async () => {
        await ServiceDiscovery05.leave();
        process.exit();
    }, 60000);
}