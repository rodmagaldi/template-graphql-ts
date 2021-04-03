import { SignUpInputModel } from '@server/domain/model';
import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { User } from '../db/entity';

@Service()
export class AuthDatasource {
  userRepository = getRepository(User);

  createUser = async (user: SignUpInputModel): Promise<User> => {
    const newUser = this.userRepository.create({
      cpf: user.cpf,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    await this.userRepository.save(newUser);
    return newUser;
  };

  findUserByEmail = async (email: string): Promise<User> => {
    return this.userRepository.findOne({ email });
  };

  findUserByCpf = async (cpf: string): Promise<User> => {
    return this.userRepository.findOne({ cpf });
  };

  findUserById = async (id: string): Promise<User> => {
    return this.userRepository.findOne({ id });
  };
}
