import { IsEnum, IsNotEmpty } from "class-validator";
import { ProductCategory } from "../product-category.enum";

export class UpdateProductDto {
    @IsNotEmpty()
    product_name: string;

    @IsNotEmpty()
    product_description: string;

    @IsNotEmpty()
    keywords: string;

    @IsEnum(ProductCategory)
    category: ProductCategory;

    @IsNotEmpty()
    stock: number;
}