import { Request, Response, NextFunction } from 'express';

import { format } from 'util';
import { Storage } from '@google-cloud/storage';
import path from 'path';
import Container, { Service } from 'typedi';
import { JwtService } from '@server/core/jwt/jwt.service';
import { AuthDatasource } from '@server/data/source/auth.datasource';
import { BaseError, ErrorType } from '@server/error/error';

@Service()
export class UploadAvatarController {
  public async upload(request: Request, response: Response, next: NextFunction): Promise<Response> {
    const jwtService = Container.get(JwtService);
    const authDatasource = Container.get(AuthDatasource);

    const token = request.headers?.authorization;
    const authData = jwtService.verifyToken(token).data;

    const user = await authDatasource.findUserById(authData.id);

    if (!user) {
      throw new BaseError(ErrorType.UnauthorizedError, 'Usuário sem credenciais válidas.');
    }

    const storage = new Storage({
      projectId: process.env.GCLOUD_PROJECT_ID,
      credentials: {
        client_email: process.env.GCLOUD_CLIENT_EMAIL,
        private_key: process.env.GCLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });
    const bucket = storage.bucket(process.env.GCLOUD_AVATAR_STORAGE_BUCKET);

    if (!request.file) {
      response.status(400).send('No file uploaded.');
      return;
    }

    await bucket.deleteFiles({ directory: user.id });

    const fileExtension = path.extname(request.file.originalname);

    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(`${user.id}/${new Date().getTime()}${fileExtension}`);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => {
      next(err);
    });

    blobStream.on('finish', () => {
      // The public URL can be used to directly access the file via HTTP.
      const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
      authDatasource.updateUserAvatar(user.id, publicUrl);
      return response.json({
        imageUrl: publicUrl,
      });
    });

    blobStream.end(request.file.buffer);
  }
}
