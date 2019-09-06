module.exports = async ({ port, }) => {
    const { app, } = (require('../service/example06'))();
    app.listen(port, async () => {
        console.log(`[Example06] listening ${port}`);
    });
};