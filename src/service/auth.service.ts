import { TUser } from './../type';
import { GithubApi } from './../http/github.http';
import { GithubAuthResponse } from './../interface';
import { HttpService } from '@midwayjs/axios';
import { Config, Inject, Provide } from '@midwayjs/decorator';
import { UserVo } from '../vo/user.vo';
import BaseService from './base.service';
import { TGithub } from '../type';
import { BadRequestError } from '@midwayjs/core/dist/error/http';
import { JwtService } from '@midwayjs/jwt';

@Provide()
export class AuthService extends BaseService<TGithub> {
  @Inject()
  httpService: HttpService;
  @Inject()
  githubApi: GithubApi;
  @Inject()
  jwt: JwtService;

  @Config('egg.port')
  port: number;

  model = 'github';
  env = process.env;

  /**
   * 获取github动态码
   * @returns
   */
  /* async requestGithub() {
    const clientId = this.env.GITHUB_CLIENT_ID;
    const state = Math.random().toString(32).slice(2);
    const redirectURL = `http://127.0.0.1:${this.port}/v1/auth/github/token`;
    const githubAuthorizeURL = `https://github.com/login/oauth/authorize?client_id=${clientId}&state=${state}&redirect_uri=${redirectURL}`;
    const getRet = await this.httpService.get(githubAuthorizeURL, {
      responseType: 'document',
      responseEncoding: 'UTF-8',
    });
    this.logger.info(getRet);
    return getRet.data;
  } */

  /**
   * 通过动态码获取github 授权码
   * @param code 动态码
   * @returns
   */
  async requestGithubToken(code: string): Promise<any> {
    const getGithubTokenRet = await this.httpService.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: this.env.GITHUB_CLIENT_ID,
        client_secret: this.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `http://127.0.0.1:${this.port}/v1/auth/github`,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );
    const data: GithubAuthResponse = getGithubTokenRet.data;
    const token = data['token_type'] + ' ' + data['access_token'];

    // 获取信息
    const info = await this.githubApi.getUser(token);
    // this.logger.info(info.data);
    const { avatar_url: avatarUrl, login: username, name: nickname, email, bio, location } = info.data;
    const githubId = (info.data.id as number).toString();
    const github = await this.existGithubAccount(githubId);

    // 存在生成token并返回
    if (github) {
      return this.generateGithubToken(github);
    }

    // 将数据添加db
    const createRet = await this.create({
      data: {
        githubId,
        avatarUrl,
        username,
        nickname,
        email,
        bio,
        location,
        webToken: token,
      },
    });
    this.logger.info(createRet);
    if (!createRet) {
      throw new BadRequestError('创建用户github错误.');
    }
    return '';
  }

  /**
   * 根据用户登陆的github id检测是否存在
   * @param id githubId
   * @returns boolean
   */
  async existGithubAccount(id: string): Promise<TGithub> {
    const github = await this.findOne({
      where: {
        githubId: id,
      },
      select: {
        id: true,
        username: true,
        nickname: true,
        avatarUrl: true,
        email: true,
        bio: true,
        location: true,
      },
    });
    return github;
  }

  /**
   * 生成github token
   * @param payload
   * @returns
   */
  async generateGithubToken(payload: Record<string, any>) {
    return this.jwt.sign(payload);
  }
}