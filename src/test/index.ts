import 'reflect-metadata';
import { setup } from 'setup-server';
before(async () => {
  await setup();
});

// require all test files here

require('test/hello-world.test.ts');
// require('test/create-user.test.ts');
// require('test/query-user.test.ts');
// require('test/query-users.test.ts');
