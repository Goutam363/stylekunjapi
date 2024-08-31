import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { AccountStatus } from '../account-status.enum';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: "" })
  staff_details: string;

  @Column()
  email: string;

  @Column()
  mobile: string;

  @Column()
  dob: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: AccountStatus.ACTIVE })
  account_status: AccountStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  account_create_date: Date;
}