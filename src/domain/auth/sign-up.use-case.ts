import { Service } from 'typedi';
import { SignUpInputModel, SignUpModel } from '@domain/model';
import { AuthDatasource } from '@server/data/source/auth.datasource';
import { CryptoService } from '@server/core/crypto/crypto.service';
import { BaseError, ErrorType } from '@server/error/error';

@Service()
export class SignUpUseCase {
  constructor(private authDatasource: AuthDatasource, private cryptoService: CryptoService) {}

  async exec(input: SignUpInputModel): Promise<SignUpModel> {
    const hashedCpf = await this.cryptoService.generateIdentifiableHash(input.cpf);

    const emailAlreadyExists = await this.authDatasource.findUserByEmail(input.email);
    const cpfAlreadyExists = await this.authDatasource.findUserByCpf(hashedCpf);

    if (emailAlreadyExists || cpfAlreadyExists) {
      throw new BaseError(ErrorType.ConflictError, 'Usuário com este email ou CPF já existe.');
    }

    const hashedPassword = await this.cryptoService.generateHash(input.password);

    await this.authDatasource.createUser({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      cpf: hashedCpf,
      password: hashedPassword,
    });

    return { cpf: input.cpf };
  }
}
