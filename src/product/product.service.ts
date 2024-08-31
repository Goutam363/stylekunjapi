import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductAdminDto } from './dto/update-product-admin.dto';
import { GetProductsFilterDto } from './dto/get-product.dto';
import { UpdateProductStaffDto } from './dto/update-product-staff.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProducts(filterDto: GetProductsFilterDto): Promise<Product[]> {
    const { category, search } = filterDto;
    
    // Ensure page and limit are numbers
    // const pageNumber = Number(page);
    // const limitNumber = Number(limit);

    // if (isNaN(pageNumber) || isNaN(limitNumber)) {
    //   throw new TypeError('Page and limit must be numeric values');
    // }

    const query = this.productRepository.createQueryBuilder('product');
    if (category) {
      query.where('product.category = :category', { category });
    }
    if (search) {
      query.where(
        '(LOWER(product.product_name) LIKE LOWER(:search) OR LOWER(product.keywords) LIKE LOWER(:search) OR LOWER(product.product_description) LIKE LOWER(:search) OR LOWER(product.category) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    // const products = query.skip((pageNumber - 1) * limitNumber).take(limitNumber).getMany();
    const products = await query.getMany();
    return products;
  }

  async getRelatedProductsById(id: string): Promise<Product[]> {
    const product = await this.getProductById(id);
    const category = product.category;
    const search = product.keywords;
    const query = this.productRepository.createQueryBuilder('product');
      query.where('product.id != :id', { id });
      query.andWhere('product.category = :category', { category });
      query.andWhere(
        '(LOWER(product.product_name) LIKE LOWER(:search) OR LOWER(product.keywords) LIKE LOWER(:search) OR LOWER(product.product_description) LIKE LOWER(:search) OR LOWER(product.category) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    query.take(12);
    const products = await query.getMany();
    return products;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const query = this.productRepository.createQueryBuilder('product');

    // Adding condition to filter products where "isFeatured" is true
    query.where('product.isFeatured = :isFeatured', { isFeatured: true });

    // Limiting the results to 50 products
    query.take(50);

    const products = await query.getMany();
    return products;
  }

  async getProductById(id: string): Promise<Product> {
    const found = await this.productRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }
    return found;
  }

  async getProductsByIds(ids: string): Promise<Product[]> {
    const idsArr = ids.split('|');

    // Query the database to get products matching the ids
    const products = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id IN (:...idArr)', { idArr: idsArr })
      .getMany();
      return products;
  }

  async verifyProductById(id: string): Promise<boolean> {
    const found = await this.productRepository.findOne({ where: { id } });
    if(found) {
        return true;
    } else {
      return false;
    }
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const {
      product_name,
      product_description,
      keywords,
      image,
      category,
      price,
      stock,
      mrp,
    } = createProductDto;
    const product = this.productRepository.create({
      product_name,
      product_description,
      keywords,
      image,
      category,
      price,
      stock,
      mrp,
    });
    await this.productRepository.save(product);
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    const result = await this.productRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.getProductById(id);
    product.product_name = updateProductDto.product_name;
    product.product_description = updateProductDto.product_description;
    product.keywords = updateProductDto.keywords;
    product.category = updateProductDto.category;
    product.stock = updateProductDto.stock;
    await this.productRepository.save(product);
    return product;
  }

  async updateProductStock(
    id: string,
    stock: number,
  ): Promise<Product> {
    const product = await this.getProductById(id);
    product.stock = stock;
    await this.productRepository.save(product);
    return product;
  }

  async updateProductImages(
    id: string,
    images: string,
  ): Promise<Product> {
    const product = await this.getProductById(id);
    product.image = images;
    await this.productRepository.save(product);
    return product;
  }

  async updateProductStaff(
    id: string,
    updateProductStaffDto: UpdateProductStaffDto,
  ): Promise<Product> {
    const product = await this.getProductById(id);
    product.product_name = updateProductStaffDto.product_name;
    product.product_description = updateProductStaffDto.product_description;
    product.keywords = updateProductStaffDto.keywords;
    product.image = updateProductStaffDto.image;
    product.category = updateProductStaffDto.category;
    product.stock = updateProductStaffDto.stock;
    product.isFeatured = updateProductStaffDto.isFeatured;
    await this.productRepository.save(product);
    return product;
  }

  async updateProductAdmin(
    id: string,
    updateProductAdminDto: UpdateProductAdminDto,
  ): Promise<Product> {
    const product = await this.getProductById(id);
    product.product_name = updateProductAdminDto.product_name;
    product.product_description = updateProductAdminDto.product_description;
    product.keywords = updateProductAdminDto.keywords;
    product.image = updateProductAdminDto.image;
    product.category = updateProductAdminDto.category;
    product.price = updateProductAdminDto.price;
    product.stock = updateProductAdminDto.stock;
    product.mrp = updateProductAdminDto.mrp;
    product.isFeatured = updateProductAdminDto.isFeatured;
    await this.productRepository.save(product);
    return product;
  }
}
