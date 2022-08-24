import { MidwayConfig, MidwayAppInfo } from '@midwayjs/core';

export default (appInfo: MidwayAppInfo) => {
  return {
    // use for cookie sign key, should change to your own and keep security
    keys: appInfo.name + '_1660201279657_1446',

    // egg config
    egg: {
      port: 7003,
    },

    // prisma config
    prismaConfig: {
      default: {
        log: ['info', 'warn', 'error'],
        errorFormat: 'pretty',
      },
      client: {},
    },

    // midway logger customized config
    midwayLogger: {
      clients: {
        middlewareLogger: {
          fileLogName: 'request.log',
          format: info => {
            const ctx = info.ctx;
            return `${info.timestamp} ${info.LEVEL} ${info.pid} [${Date.now() - ctx.startTime}ms ${ctx.method}] ${info.message}`;
          },
        },
      },
    },
  } as MidwayConfig;
};
