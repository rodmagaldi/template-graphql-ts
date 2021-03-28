import { Service } from 'typedi';
import { LoginInputModel, LoginModel } from '@domain/model';
import { AuthDatasource } from '@server/data/source/auth.datasource';
import { CryptoService } from '@server/core/crypto/crypto.service';
import { BaseError, ErrorType } from '@server/error/error';
import { JwtService } from '@server/core/jwt/jwt.service';

@Service()
export class LoginUseCase {
  constructor(
    private authDatasource: AuthDatasource,
    private cryptoService: CryptoService,
    private jwtService: JwtService,
  ) {}

  async exec({ cpf, password, rememberMe }: LoginInputModel): Promise<LoginModel> {
    const hashedCpf = await this.cryptoService.generateIdentifiableHash(cpf);
    const user = await this.authDatasource.findUserByCpf(hashedCpf);

    if (!user) {
      throw new BaseError(ErrorType.NotFoundError, 'Combinação email/senha inexistente.');
    }

    const passwordMatched = await this.cryptoService.compareHash(password, user.password);

    if (!passwordMatched) {
      throw new BaseError(ErrorType.NotFoundError, 'Combinação email/senha inexistente.');
    }

    const token = this.jwtService.generateToken(user.id, rememberMe);

    return { token: `Bearer ${token}` };
  }
}
