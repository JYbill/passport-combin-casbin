import { EggAppConfig, PowerPartial } from 'egg';
import { MidwayConfig } from '@midwayjs/core';

export type DefaultConfig = PowerPartial<EggAppConfig>;

/**
 * 这里加入这段是因为 egg 默认的安全策略，在 post 请求的时候如果不传递 token 会返回 403
 * 由于大部分新手用户不太了解这个机制，所以在本地和单测环境做了默认处理
 * 请注意，线上环境依旧会有该错误，需要手动开启
 * 如果想了解更多细节，请访问 https://eggjs.org/zh-cn/core/security.html#安全威胁-csrf-的防范
 */
export default {
  // 关闭passport 校验通过后序列化成json，有需要可以改为true，并按照官网重写，注意V8只会给你分配1400M左右的堆内存大小，需要序列化推荐redis
  passport: {
    session: false,
  },
  middlewareWhiteList: ['/v1/user/login', '/v1/user/register', '/v1/user/checkUsername'],
  jwt: {
    secret: 'xiaoqinvar`s security key.',
    expiresIn: '2 days', // https://github.com/vercel/ms
  },
} as MidwayConfig & DefaultConfig;
