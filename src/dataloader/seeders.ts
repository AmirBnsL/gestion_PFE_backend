import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User, UserRole } from '../entities/User';
import { Admin } from '../entities/Admin';
import { Student } from '../entities/Student';
import { Teacher } from '../entities/Teacher';

export class UserSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const userFactory = factoryManager.get(User);
    const adminFactory = factoryManager.get(Admin);
    const studentFactory = factoryManager.get(Student);
    const teacherFactory = factoryManager.get(Teacher);

    // Create users with different roles
    const users = await userFactory.saveMany(20);

    for (const user of users) {
      if (user.role === UserRole.ADMIN) {
        user.admin = await adminFactory.save();
        await dataSource.getRepository(User).save(user);
      } else if (user.role === UserRole.STUDENT) {
        user.student = await studentFactory.save();
        await dataSource.getRepository(User).save(user);
      } else if (user.role === UserRole.TEACHER) {
        user.teacher = await teacherFactory.save();
        await dataSource.getRepository(User).save(user);
      }
    }
  }
}