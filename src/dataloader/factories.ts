import { User, UserRole } from '../entities/User';
import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker'




export const userFactory = setSeederFactory(User, (
) => {
  const user = new User();
  user.firstname = faker.person.firstName();
  user.lastname = faker.person.lastName();
  user.email = faker.internet.email();
  user.role = faker.helpers.arrayElement([UserRole.STUDENT, UserRole.TEACHER]);
  user.passwordHash = faker.internet.password();
  return user;
});



