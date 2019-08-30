module.exports = async ({ port, }) => {
    const { app, } = (require('../service/example01'))();
    app.listen(port, async () => {
        console.log(`[Example01] listening ${port}`);
    });
};