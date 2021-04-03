import { Service } from 'typedi';
import { HelloWorldModel } from 'domain/model/hello-world.model';

@Service()
export class HelloWorldUseCase {
  exec(userId: string): HelloWorldModel {
    return {
      helloWorld: userId,
    };
  }
}
