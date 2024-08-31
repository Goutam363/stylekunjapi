import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Coupon } from './coupon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCouponDto } from './dto/create-coupon.dto';

@Injectable()
export class CouponService {
    constructor(
        @InjectRepository(Coupon)
        private readonly couponRepository: Repository<Coupon>,
    ) {}

    async getCoupons(): Promise<Coupon[]> {
        const coupons = await this.couponRepository.find();
        return coupons;
    }

    async getCouponById(id: string): Promise<Coupon> {
        const found = await this.couponRepository.findOne({ where: { id } });
        if (!found) {
            throw new NotFoundException(`Coupon with id "${id}" not found`);
        }
        return found;
    }

    async createCoupon(createCouponDto: CreateCouponDto): Promise<Coupon> {
        const {
            coupon_code,
            base_value,
            discount,
            description,
        } = createCouponDto;
        const coupon = this.couponRepository.create({
            coupon_code,
            base_value,
            discount,
            description,
        });
        await this.couponRepository.save(coupon);
        return coupon;
    }

    async deleteCoupon(id: string): Promise<void> {
        const result = await this.couponRepository.delete({ id });
        if (result.affected === 0) {
            throw new NotFoundException(`Coupon with id "${id}" not found`);
        }
    }
}
