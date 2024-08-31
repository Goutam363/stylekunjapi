import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { AccountStatus } from '../account-status.enum';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: "" })
  admin_details: string;

  @Column()
  password: string;

  @Column({ default: AccountStatus.ACTIVE })
  account_status: AccountStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  account_create_date: Date;
}