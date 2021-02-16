import { Service } from 'typedi';
import { HelloWorldModel } from 'domain/model/hello-world.model';

@Service()
export class HelloWorldUseCase {
  exec(): HelloWorldModel {
    return {
      helloWorld: 'Hello, World!',
    };
  }
}
