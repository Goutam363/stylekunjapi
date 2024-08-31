import { IsEnum, IsNotEmpty } from "class-validator";
import { ProductCategory } from "../product-category.enum";

export class CreateProductDto {
    @IsNotEmpty()
    product_name: string;

    @IsNotEmpty()
    product_description: string;

    @IsNotEmpty()
    keywords: string;

    image: string;

    @IsEnum(ProductCategory)
    category: ProductCategory;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    stock: number;

    @IsNotEmpty()
    mrp: number;
}