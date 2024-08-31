import { IsEnum, IsNotEmpty } from "class-validator";
import { ProductCategory } from "../product-category.enum";

export class UpdateProductAdminDto {
    @IsNotEmpty()
    product_name: string;

    @IsNotEmpty()
    product_description: string;

    @IsNotEmpty()
    keywords: string;

    @IsNotEmpty()
    image: string;

    @IsEnum(ProductCategory)
    category: ProductCategory;

    @IsNotEmpty()
    isFeatured: boolean;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    stock: number;

    @IsNotEmpty()
    mrp: number;
}