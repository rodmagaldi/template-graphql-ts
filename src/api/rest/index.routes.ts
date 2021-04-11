import Router from 'express';
import uploadAvatarRouter from '@rest/upload-avatar/routes';

const routes = Router();

routes.use(uploadAvatarRouter);

export default routes;
