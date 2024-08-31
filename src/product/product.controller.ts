import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductAdminDto } from './dto/update-product-admin.dto';
import { GetProductsFilterDto } from './dto/get-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProductStaffDto } from './dto/update-product-staff.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getProducts(@Query() filterDto: GetProductsFilterDto): Promise<Product[]> {
    return this.productService.getProducts(filterDto);
  }

  @Get('/related-products/:id')
  getRelatedProductsbyId(@Param('id') id: string): Promise<Product[]> {
    return this.productService.getRelatedProductsById(id);
  }

  @Get('/featured-products')
  getFeaturedProducts(): Promise<Product[]> {
    return this.productService.getFeaturedProducts();
  }

  @Get('/secure/admin/:id/verify')
  @UseGuards(AuthGuard('admin-jwt'))
  verifyProductByIdAdmin(@Param('id') id: string): Promise<boolean> {
    return this.productService.verifyProductById(id);
  }

  @Post('/ids')
  getProductsByIds(@Body() cartIds: {cartIds: string}): Promise<Product[]> {
    return this.productService.getProductsByIds(cartIds.cartIds);
  }

  @Get('/:id')
  getProductById(@Param('id') id: string): Promise<Product> {
    return this.productService.getProductById(id);
  }

  @Post()
  @UseGuards(AuthGuard('admin-jwt'))
  createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(createProductDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productService.deleteProduct(id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('staff-jwt'))
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Patch('/:id/admin')
  @UseGuards(AuthGuard('admin-jwt'))
  updateProductAdmin(
    @Param('id') id: string,
    @Body() updateProductAdminDto: UpdateProductAdminDto,
  ): Promise<Product> {
    return this.productService.updateProductAdmin(id, updateProductAdminDto);
  }

  @Patch('/secure/staff/:id')
  @UseGuards(AuthGuard('staff-jwt'))
  updateProductStaff(
    @Param('id') id: string,
    @Body() updateProductStaffDto: UpdateProductStaffDto,
  ): Promise<Product> {
    return this.productService.updateProductStaff(id, updateProductStaffDto);
  }

  @Patch('/secure/admin/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  updateProductAdminSuper(
    @Param('id') id: string,
    @Body() updateProductAdminDto: UpdateProductAdminDto,
  ): Promise<Product> {
    return this.productService.updateProductAdmin(id, updateProductAdminDto);
  }

}
