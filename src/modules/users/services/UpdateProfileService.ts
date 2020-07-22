import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  oldPassword?: string;
  password?: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private HashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    oldPassword,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const userWithUpdateEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdateEmail && userWithUpdateEmail.id !== user_id) {
      throw new AppError('E-mail already in use');
    }

    user.name = name;
    user.email = email;

    if (password && !oldPassword) {
      throw new AppError(
        'You need to inform the old password to set a new password',
      );
    }

    if (password && oldPassword) {
      const checkOldPassword = await this.HashProvider.compareHash(
        oldPassword,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Old password does not match');
      }

      user.password = await this.HashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateUserAvatarService;
