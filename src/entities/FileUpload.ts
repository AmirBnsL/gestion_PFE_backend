import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './Project';

@Entity('file_upload')
export class FileUpload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  link: string;

  @ManyToOne(() => Project, proj => proj.files)
  project: Project;
}
