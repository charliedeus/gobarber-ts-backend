import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not allow the creation of a new user with an existing email', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
    });

    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
