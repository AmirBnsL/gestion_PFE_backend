import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToOne,
    BeforeInsert,
    OneToMany,
    JoinColumn
  } from 'typeorm';

import { Team } from './Team';
import { WishListEntry } from './WishListEntry';

@Entity()
export class WishList {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Team, (team) => team.wishList)
  team: Team;

  @OneToMany(() => WishListEntry, (entry) => entry.wishList, { cascade: true })
  @JoinColumn()
  entries: WishListEntry[];

  @Column()
  createdAt: Date;

  @BeforeInsert()
  setDate() {
    this.createdAt = new Date();
  }
}
