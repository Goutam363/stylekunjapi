import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { GetOrdersFilterDto } from './dto/get-orders-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/user/get-user.decorator';
import { User } from 'src/auth/user/user.entity';
import { OrderItem } from './order-item.entity';
import { UpdateOrderAdminDto } from './dto/update-order-admin.dto';
import { UpdateOrderStaffDto } from './dto/update-order-staff.dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}
  @Get()
  @UseGuards(AuthGuard('user-jwt'))
  getOrders(@Query() filterDto: GetOrdersFilterDto, @GetUser() user: User): Promise<Order[]> {
    return this.orderService.getOrders(filterDto, user);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('user-jwt'))
  getOrderById(@Param('id') id: string, @GetUser() user: User): Promise<Order> {
    return this.orderService.getOrderById(id, user);
  }

  @Get('/:id/order-item')
  @UseGuards(AuthGuard('user-jwt'))
  getOrderItemByOrderId(@Param('id') id: string, @GetUser() user: User): Promise<OrderItem[]> {
    return this.orderService.getOrderItemByOrderId(id);
  }

  @Get('/secure/staff')
  @UseGuards(AuthGuard('staff-jwt'))
  getOrdersStaff(@Query() filterDto: GetOrdersFilterDto): Promise<Order[]> {
    return this.orderService.getOrdersSecure(filterDto);
  }

  @Get('/secure/staff/:id')
  @UseGuards(AuthGuard('staff-jwt'))
  getOrderByIdStaff(@Param('id') id: string): Promise<Order> {
    return this.orderService.getOrderByIdSecure(id);
  }

  @Get('/secure/admin')
  @UseGuards(AuthGuard('admin-jwt'))
  getOrdersAdmin(@Query() filterDto: GetOrdersFilterDto): Promise<Order[]> {
    return this.orderService.getOrdersSecure(filterDto);
  }

  @Get('/secure/admin/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  getOrderByIdAdmin(@Param('id') id: string): Promise<Order> {
    return this.orderService.getOrderByIdSecure(id);
  }

  // @Post()
  // @UseGuards(AuthGuard('user-jwt'))
  // createOrder(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User): Promise<Order> {
  //   return this.orderService.createOrder(createOrderDto, user);
  // }

  @Post()
  @UseGuards(AuthGuard('user-jwt'))
  createOrder(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User): Promise<Order> {
    return this.orderService.createOrder(createOrderDto, user);
  }

  // @Patch('/:id/status')
  // @UseGuards(AuthGuard('user-jwt'))
  // updateOrderStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto, @GetUser() user: User): Promise<Order> {
  //   const { status } = updateOrderStatusDto;
  //   return this.orderService.updateOrderStatus(id, status);
  // }

  @Patch('/:id/cancel')
  @UseGuards(AuthGuard('user-jwt'))
  cancelOrderById(@Param('id') id: string, @GetUser() user: User): Promise<Order> {
    return this.orderService.cancelOrderById(id, user);
  }

  @Patch('/:id/cancel-pending')
  @UseGuards(AuthGuard('user-jwt'))
  cancelPendingItemsById(@Param('id') id: string, @GetUser() user: User): Promise<Order> {
    return this.orderService.cancelPendingItemsById(id, user);
  }

  @Patch('/secure/staff/:id/status')
  @UseGuards(AuthGuard('staff-jwt'))
  updateOrderStatusStaff(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const { status } = updateOrderStatusDto;
    return this.orderService.updateOrderStatus(id, status);
  }

  @Patch('/secure/admin/:id/status')
  @UseGuards(AuthGuard('admin-jwt'))
  updateOrderStatusAdmin(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const { status } = updateOrderStatusDto;
    return this.orderService.updateOrderStatus(id, status);
  }

  @Patch('/secure/staff/:id')
  @UseGuards(AuthGuard('staff-jwt'))
  updateOrderStaff(
    @Param('id') id: string,
    @Body() updateOrderStaffDto: UpdateOrderStaffDto,
  ): Promise<Order> {
    return this.orderService.updateOrderStaff(id, updateOrderStaffDto);
  }

  @Patch('/secure/admin/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  updateOrderAdminSuper(
    @Param('id') id: string,
    @Body() updateOrderAdminDto: UpdateOrderAdminDto,
  ): Promise<Order> {
    return this.orderService.updateOrderSuper(id, updateOrderAdminDto);
  }

}
