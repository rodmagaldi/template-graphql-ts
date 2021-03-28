import { SignUpInputModel } from '@server/domain/model';
import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { User } from '../db/entity';

@Service()
export class AuthDatasource {
  userRepository = getRepository(User);

  createUser = async (user: SignUpInputModel) => {
    const newUser = this.userRepository.create({
      cpf: user.cpf,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    this.userRepository.save(newUser);
  };

  findUserByEmail = async (email: string) => {
    return this.userRepository.findOne({ email });
  };

  findUserByCpf = async (cpf: string) => {
    return this.userRepository.findOne({ cpf });
  };
}
