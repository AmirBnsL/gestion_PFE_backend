

import { DataSource } from 'typeorm';
import { SeederFactoryManager,Seeder } from 'typeorm-extension';
import { User } from '../entities/User';





export class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {

    const userFactory = factoryManager.get(User);
    // save 1 factory generated entity, to the database
    await userFactory.save();

    // save 5 factory generated entities, to the database
    await userFactory.saveMany(5);
  }
}







