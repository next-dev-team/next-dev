import { HelloService } from '@/module/foo';
import { HTTPController, HTTPMethod, HTTPMethodEnum, HTTPQuery, Inject } from '@eggjs/tegg';

@HTTPController({
  path: '/bar',
})
export class UserController {
  @Inject()
  helloService: HelloService;

  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: 'user',
  })
  async user(@HTTPQuery({ name: 'userId' }) userId: string) {
    return await this.helloService.hello(userId);
  }
}
