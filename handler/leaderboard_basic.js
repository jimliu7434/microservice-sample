const LEADERBOARD = 'leaderboard';

module.exports = {
    apia: async (ctx) => {
        const member = 'API_A';
        await ctx.RedisService.zincrby(LEADERBOARD, 1, member);
        return ctx.status = 200;
    },
    apib: async (ctx) => {
        const member = 'API_B';
        await ctx.RedisService.zincrby(LEADERBOARD, 1, member);
        return ctx.status = 200;
    },
    apic: async (ctx) => {
        const member = 'API_C';
        await ctx.RedisService.zincrby(LEADERBOARD, 1, member);
        return ctx.status = 200;
    },
    leaderboard: async (ctx) => {
        const { limit, } = ctx.request.query;
        const resp = await ctx.RedisService.zrevrange(LEADERBOARD, 0, limit - 1, 'WITHSCORES');
        const body = [];
        for (let i = 0; i < resp.length; i += 2) {
            body.push({ key: resp[i], score: resp[i + 1], });
        }
        ctx.body = body;
        return ctx.status = 200;
    },

};

