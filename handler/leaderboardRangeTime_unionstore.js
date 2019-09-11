const LEADERBOARD = 'leaderboard';
const GetHourStr = (date) => `${date.getHours() > 10 ? '' :  '0'}${date.getHours()}`;
const GetMinuteStr = (date) => `${date.getMinutes() > 10 ? '' :  '0'}${date.getMinutes()}`;
// ex: leaderboard>range>1605
const LeaderBoardPerMin = (date) => `${LEADERBOARD}>range>${GetHourStr(date)}${GetMinuteStr(date)}`;
const LeaderboardExpire = 3 * 60;

module.exports = {
    apia: async (ctx) => {
        const member = 'API_A';
        const key = LeaderBoardPerMin(new Date());
        await ctx.RedisService.zincrby(key, 1, member);
        ctx.RedisService.expire(key, LeaderboardExpire);
        console.log(`${key}: ${member} +1`);
        return ctx.status = 200;
    },
    apib: async (ctx) => {
        const member = 'API_B';
        const key = LeaderBoardPerMin(new Date());
        await ctx.RedisService.zincrby(key, 1, member);
        ctx.RedisService.expire(key, LeaderboardExpire);
        console.log(`${key}: ${member} +1`);
        return ctx.status = 200;
    },
    apic: async (ctx) => {
        const member = 'API_C';
        const key = LeaderBoardPerMin(new Date());
        await ctx.RedisService.zincrby(key, 1, member);
        ctx.RedisService.expire(key, LeaderboardExpire);
        console.log(`${key}: ${member} +1`);
        return ctx.status = 200;
    },
    leaderboard: async (ctx) => {
        const { limit, } = ctx.request.query;
        const keys = await ctx.RedisService.keys(`${LEADERBOARD}>range>????`);
        const body = [];

        console.log(`Get from redis:\n${keys.join('\n')}`);
        if(keys.length > 0) {
            const unionStoreKey = `${LEADERBOARD}>range>union`;
            await ctx.RedisService.zunionstore(unionStoreKey, keys.length, ...keys);
            const resp = await ctx.RedisService.zrevrange(unionStoreKey, 0, limit - 1, 'WITHSCORES');
            for (let i = 0; i < resp.length; i += 2) {
                body.push({ key: resp[i], score: resp[i + 1], });
            }
            ctx.body = body;
        }
        return ctx.status = 200;
    },

};

