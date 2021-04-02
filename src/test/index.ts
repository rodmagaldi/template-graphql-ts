import 'reflect-metadata';
import { setup } from 'setup-server';
before(async () => {
  await setup();
});

// require all test barrels here

require('graphql/module/hello-world/test');
require('graphql/module/auth/test');
