import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ICreateUserRequestDTO } from './CreateUserDTO';
import { User } from "../../entities/User";
import { IMailProvider } from "../../providers/IMailProvider";

export class CreateUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private mailProvider: IMailProvider,
  ) {}

  async execute(data: ICreateUserRequestDTO) {
    const userAlreadyExists = await this.usersRepository.findByEmail(data.email);
    
    if (userAlreadyExists) {
      throw new Error('User already exists.');
    }

    const user = new User(data);

    await this.usersRepository.save(user);

    await this.mailProvider.sendMail({
      to: {
        name: data.name,
        email: data.email,
      },
      from: {
        name: 'SOLID API, but no so much',
        email: 'solid_api@butnotsomuch.com',
      },
      subject: 'Welcome to SOLID API',
      body: '<p>Hey, welcome :)</p>',
    });
  }
}
