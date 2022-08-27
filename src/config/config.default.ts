import { MidwayConfig, MidwayAppInfo } from '@midwayjs/core';

export default (appInfo: MidwayAppInfo) => {
  return {
    // use for cookie sign key, should change to your own and keep security
    keys: appInfo.name + '_1660201279657_1446',

    // egg config
    egg: {
      port: 7004,
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

    // 关闭passport 校验通过后序列化成json，有需要可以改为true，并按照官网重写，注意V8只会给你分配1400M左右的堆内存大小，需要序列化推荐redis
    passport: {
      session: false,
    },

    // casbin、jwt白名单
    middlewareWhiteList: ['/v1/user/login', '/v1/user/register', '/v1/user/checkUsername', '/v1/casbin/update'],

    // redis
    redis: {
      clients: {
        session: { host: '101.35.13.180', port: 6379, password: '990415', db: 0 },
        cache: { host: '101.35.13.180', port: 6379, password: '990415', db: 1 },
      },
    },

    // jwt相关
    jwt: {
      secret: 'xiaoqinvar`s security key.',
      expiresIn: '2 days', // https://github.com/vercel/ms
    },
  } as MidwayConfig;
};
