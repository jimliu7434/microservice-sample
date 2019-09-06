module.exports = async ({ port, }) => {
    const { app, } = (require('../service/example07'))();
    app.listen(port, async () => {
        console.log(`[Example07] listening ${port}`);
    });
};