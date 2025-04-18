import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  BeforeInsert,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Team } from './Team';
import { WishList } from './WishList';
import { Project } from './Project';

@Entity()
export class WishListEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WishList, wishList => wishList.entries, { nullable: false })
  wishList: WishList;

  @ManyToOne(() => Project)
  project: Project;

  @Column()
  priority: number; // 1 = top choice, 2 = second, etc.
}
