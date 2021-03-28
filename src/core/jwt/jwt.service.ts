import { sign, verify } from 'jsonwebtoken';
import { Service } from 'typedi';

@Service()
export class JwtService {
  generateToken = (id: string, rememberMe?: boolean): string => {
    return sign({ data: { id: id } }, process.env.JWT_SECRET, {
      expiresIn: rememberMe ? process.env.JWT_REMEMBER_ME_EXPIRATION : process.env.JWT_EXPIRATION,
    });
  };

  verifyToken = (token: string) => {
    const decoded = verify(token, process.env.JWT_SECRET);
    return decoded?.data;
  };
}
