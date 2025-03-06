import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstname: string;

  @Column()
  lastname:string;

  @Column()
  email: string;

  @Column()
  passwordHash: string;
}