import Router from 'express';

import { UploadAvatarController } from '@rest/upload-avatar/controller/upload-avatar.controller';
import { multerConfigs } from '../../config/multer-config';

const uploadAvatarRouter = Router();
const uploadAvatarController = new UploadAvatarController();

// eslint-disable-next-line @typescript-eslint/unbound-method
uploadAvatarRouter.post('/avatar', multerConfigs.single('avatar'), uploadAvatarController.upload);

export default uploadAvatarRouter;
