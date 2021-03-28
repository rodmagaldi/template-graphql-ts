import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';

@Service()
export class JwtService {
  generateToken = (id: string, rememberMe: boolean): string => {
    return sign({ id: id }, process.env.JWT_SECRET, {
      expiresIn: rememberMe ? process.env.JWT_REMEMBER_ME_EXPIRATION : process.env.JWT_EXPIRATION,
    });
  };
}
