import { User, UserRole } from '../entities/User';
import { setSeederFactory } from 'typeorm-extension';




export const userFactory = setSeederFactory(User, (faker) => {
  const user = new User();
  user.firstname = faker.person.firstName();
  user.lastname = faker.person.lastName();

  user.role = faker.helpers.arrayElement([UserRole.ADMIN, UserRole.STUDENT, UserRole.TEACHER]);
  user.passwordHash = faker.internet.password();
  return user;
});



