import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "./order-status.enum";
import { User } from "src/auth/user/user.entity";
import { Exclude } from "class-transformer";

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    product_ids: string;

    @Column()
    product_names: string;

    @Column()
    total_price: number;

    @Column()
    total_discount: number;

    @Column()
    delivery_charge: number;

    @Column()
    coupon_discount: number;

    @Column()
    net_amount: number;

    @Column({ default: 0 })
    refund_amount: number;

    @Column()
    payment_id: string;

    @Column()
    email: string;

    @Column()
    mobile: string;

    @Column()
    quantities: string;

    @Column()
    billing_address: string;

    @Column()
    shipping_address: string;

    @Column()
    order_status: OrderStatus;

    @CreateDateColumn({ type: 'timestamptz' })
    order_date: Date;

    @ManyToOne((_type) => User, (user) => user.order, {eager: false})
    @Exclude({ toPlainOnly: true })
    user: User;

    // @Column({ type: 'timestamptz' })
    // order_date_time_with_timezone: Date;

    // @CreateDateColumn()
    // created_at: Date;

    // @UpdateDateColumn()
    // updated_at: Date;

    // @DeleteDateColumn()
    // deleted_at: Date;
}