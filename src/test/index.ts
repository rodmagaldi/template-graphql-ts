import 'reflect-metadata';
import { setup } from 'setup-server';

before(async () => {
  await setup();
});

// require all test barrels here

require('api/graphql/module/hello-world/test');
require('api/graphql/module/auth/test');
