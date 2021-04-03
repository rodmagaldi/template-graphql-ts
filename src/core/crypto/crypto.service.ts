import { hash, compare } from 'bcryptjs';
import * as crypto from 'crypto';
import { Service } from 'typedi';

@Service()
export class CryptoService {
  generateHash = (payload: string): Promise<string> => {
    return hash(payload, 10);
  };

  compareHash = (payload: string, hashed: string): Promise<boolean> => {
    return compare(payload, hashed);
  };

  generateIdentifiableHash = (value: string): string => {
    return crypto.createHash('sha256').update(value).digest('hex');
  };
}
