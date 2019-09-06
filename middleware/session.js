const uuid = require('uuid/v4');

module.exports = (model) => {
    return async (ctx, next) => {
        if (model.isAsync === true) {
            Object.defineProperty(ctx, 'sessionAsync', {
                get: async () => {
                    let key = ctx.cookies.get('sessid');
                    if (!key) {
                        key = uuid();
                        ctx.cookies.set('sessid', key);
                        await model.Set(key, {});
                    }
                    const sess = await model.Get(key);
                    return sess;
                },
                set: async () => {
                    throw new Error('Please Use \'await ctx.SetSession\'');
                },
            });

            ctx.SetSession = async (newValue) => {
                let key = ctx.cookies.get('sessid');
                if (!key) {
                    key = uuid();
                    ctx.cookies.set('sessid', key);
                }
                if (newValue !== undefined && newValue !== null) {
                    await model.Set(key, newValue);
                }
                else {
                    await model.Destroy(key);
                }
                return;
            };
        }
        else {
            Object.defineProperty(ctx, 'session', {
                get: () => {
                    let key = ctx.cookies.get('sessid');
                    if (!key) {
                        if(ctx.tmpSessid) {
                            key = ctx.tmpSessid;
                        }
                        else {
                            key = uuid();
                            ctx.cookies.set('sessid', key);
                            model.Set(key, {});
                        }
                    }
                    const sess = model.Get(key);
                    return sess;
                },
                set: (newValue) => {
                    let key = ctx.cookies.get('sessid');
                    if (!key) {
                        key = uuid();
                        ctx.cookies.set('sessid', key);
                        ctx.tmpSessid = key;
                    }
                    if (newValue !== undefined && newValue !== null) {
                        model.Set(key, newValue);
                    }
                    else {
                        model.Destroy(key);
                    }
                    return;
                },
            });
        }

        return await next();
    };
};