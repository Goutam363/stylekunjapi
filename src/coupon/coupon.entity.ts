import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Coupon {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    coupon_code: string;

    @Column()
    base_value: number;

    @Column()
    discount: number;

    @Column()
    description: string;
}