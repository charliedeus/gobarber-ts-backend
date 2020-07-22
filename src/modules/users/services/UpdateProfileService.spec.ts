import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Fred Doe',
      email: 'fred.doe@example.com',
    });

    expect(updatedUser.name).toBe('Fred Doe');
    expect(updatedUser.email).toBe('fred.doe@example.com');
  });

  it('should not be able update email to existing email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Fred Doe',
      email: 'fred.doe@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Fred Doe',
        email: 'john.doe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Fred Doe',
      email: 'fred.doe@example.com',
      oldPassword: '123456',
      password: 'password',
    });

    expect(updatedUser.password).toBe('password');
  });

  it('should not be able to update the password with old password filled', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Fred Doe',
        email: 'fred.doe@example.com',
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Fred Doe',
        email: 'fred.doe@example.com',
        oldPassword: 'wrong-password',
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not  able to update profile from non-existing user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'non-existing-user',
        name: 'Fred Doe',
        email: 'fred.doe@example.com',
        oldPassword: 'wrong-password',
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
