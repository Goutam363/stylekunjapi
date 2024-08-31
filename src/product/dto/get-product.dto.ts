import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { ProductCategory } from "../product-category.enum";

export class GetProductsFilterDto {
    @IsOptional()
    @IsEnum(ProductCategory)
    category?: ProductCategory;

    @IsOptional()
    @IsString()
    search?: string;

    // @IsOptional()
    // page?: number;

    // @IsOptional()
    // limit?: number;
}