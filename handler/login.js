module.exports = {
    login: (ctx) => {
        ctx.session = ctx.request.body;
        return ctx.status = 200;
    },
    session: (ctx) => {
        ctx.body = {
            session: ctx.session,
        }
        return ctx.status = 200;
    },
    logout: (ctx) => {
        ctx.session = null;
        return ctx.status = 200;
    },

    loginAsync: async (ctx) => {
        await ctx.SetSession(ctx.request.body);
        return ctx.status = 200;
    },
    sessionAsync: async (ctx) => {
        ctx.body = {
            session: await ctx.sessionAsync,
        }
        return ctx.status = 200;
    },
    logoutAsync: async (ctx) => {
        await ctx.SetSession(null);
        return ctx.status = 200;
    },
};

