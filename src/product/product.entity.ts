import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ProductCategory } from "./product-category.enum";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    product_name: string;

    @Column()
    product_description: string;

    @Column({default: false})
    isFeatured: boolean;

    @Column()
    keywords: string;

    @Column({default: ""})
    image: string;

    @Column()
    category: ProductCategory;

    @Column()
    price: number;

    @Column()
    stock: number;

    @Column()
    mrp: number;
}