import { Order } from 'src/order/order.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { AccountStatus } from '../account-status.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

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

  @Column({default: ""})
  cart: string;

  @Column({ default: AccountStatus.ACTIVE })
  account_status: AccountStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  account_create_date: Date;

  @OneToMany((_type) => Order, (order) => order.user, { eager: true })
  order: Order[];
}
