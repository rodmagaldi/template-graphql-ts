import { CryptoService } from '@server/core/crypto/crypto.service';
import Container from 'typedi';
import * as cpf from 'cpf';
import { name, internet } from 'faker';
import { User } from '@server/data/db/entity';
import { getRepository } from 'typeorm';

interface MockOptions {
  userCpf?: string;
  userEmail?: string;
  userPassword?: string;
}

export async function mockUsers(numberOfUsers: number, options?: MockOptions): Promise<void> {
  const cryptoService = Container.get(CryptoService);
  const usersRepository = getRepository(User);

  const { userCpf, userEmail, userPassword } = options;

  const usersList = [];

  for (let i = 0; i < numberOfUsers; i++) {
    const hashedPassword = await cryptoService.generateHash(userPassword || 'senha123');
    const hashedCpf = await cryptoService.generateIdentifiableHash(userCpf || cpf.generate());
    const user: Partial<User> = {
      firstName: name.firstName(),
      lastName: name.lastName(),
      email: userEmail || internet.email(),
      cpf: hashedCpf,
      password: hashedPassword,
    };
    const newUser = usersRepository.create(user);
    usersList.push(newUser);
  }

  await usersRepository.save(usersList);
}
