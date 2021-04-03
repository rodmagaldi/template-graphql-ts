import { Service } from 'typedi';
import { LoginModel, SignUpInputModel } from '@domain/model';
import { AuthDatasource } from '@server/data/source/auth.datasource';
import { CryptoService } from '@server/core/crypto/crypto.service';
import { BaseError, ErrorType } from '@server/error/error';
import { JwtService } from '@server/core/jwt/jwt.service';

@Service()
export class SignUpUseCase {
  constructor(
    private authDatasource: AuthDatasource,
    private cryptoService: CryptoService,
    private jwtService: JwtService,
  ) {}

  async exec(input: SignUpInputModel): Promise<LoginModel> {
    const hashedCpf = await this.cryptoService.generateIdentifiableHash(input.cpf);

    const emailAlreadyExists = await this.authDatasource.findUserByEmail(input.email);
    const cpfAlreadyExists = await this.authDatasource.findUserByCpf(hashedCpf);

    if (emailAlreadyExists || cpfAlreadyExists) {
      throw new BaseError(ErrorType.ConflictError, 'Usuário com este email ou CPF já existe.');
    }

    const hashedPassword = await this.cryptoService.generateHash(input.password);

    const user = await this.authDatasource.createUser({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      cpf: hashedCpf,
      password: hashedPassword,
    });

    const token = this.jwtService.generateToken(user.id);

    return { token };
  }
}
