import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { OrderItemStatus } from "./order-item-status.enum";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    order_id: string;

    @Column()
    product_id: string;

    @Column()
    product_name: string;

    @Column()
    product_image: string;

    @Column()
    quantity: number;

    @Column()
    net_mrp: number;

    @Column()
    net_amount: number;

    @Column({ default: 0 })
    refund_amount: number;

    @Column()
    order_item_status: OrderItemStatus;

    @Column()
    item_out_of_stock: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    order_date: Date;
}