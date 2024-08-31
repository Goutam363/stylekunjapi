import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { Coupon } from './coupon.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateCouponDto } from './dto/create-coupon.dto';

@Controller('coupon')
export class CouponController {
    constructor(private couponService: CouponService){}

    @Get()
    getCoupons(): Promise<Coupon[]> {
        return this.couponService.getCoupons();
    }

    @Get('/:id')
    getCouponById(@Param('id') id: string): Promise<Coupon> {
        return this.couponService.getCouponById(id);
    }

    @Post()
    @UseGuards(AuthGuard('admin-jwt'))
    createCoupon(@Body() createCouponDto: CreateCouponDto): Promise<Coupon> {
        return this.couponService.createCoupon(createCouponDto);
    }

    @Delete('/:id')
    @UseGuards(AuthGuard('admin-jwt'))
    deleteCoupon(@Param('id') id: string): Promise<void> {
        return this.couponService.deleteCoupon(id);
    }
}
