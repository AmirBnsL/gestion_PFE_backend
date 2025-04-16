import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  BeforeInsert,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';

import { Team } from './Team';
import { WishListEntry } from './WishListEntry';

@Entity()
export class WishList {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Team, team => team.wishList)
  @JoinColumn()
  team: Team;

  @OneToMany(() => WishListEntry, entry => entry.wishList, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  entries: WishListEntry[];

  @Column()
  createdAt: Date;

  @BeforeInsert()
  setDate() {
    this.createdAt = new Date();
  }
}
