const DBotHook = require('dbothook');

const hook = new DBotHook({
    authSecrets: {
        topgg: process.env.TOPGG_PASSWORD,
        discordbotlist: process.env.DBL_HOOK_PASSWORD,
    },
});

hook.listen(9836);
hook.on('called', event => {
  console.log(event);
});