import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './order-status.enum';
import { GetOrdersFilterDto } from './dto/get-orders-filter.dto';
// import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { ProductService } from 'src/product/product.service';
import { OrderItem } from './order-item.entity';
import { OrderItemStatus } from './order-item-status.enum';
import { User } from 'src/auth/user/user.entity';
import { UpdateOrderAdminDto } from './dto/update-order-admin.dto';
import { UpdateOrderStaffDto } from './dto/update-order-staff.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @Inject(ProductService)
    private readonly productService: ProductService,
  ) {}

  async getOrders(filterDto: GetOrdersFilterDto, user: User): Promise<Order[]> {
    const { status, search } = filterDto;
    const query = this.orderRepository.createQueryBuilder('order');
    query.where({ user });
    if (status) {
      query.andWhere('order.order_status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(order.email) = LOWER(:search) OR LOWER(order.mobile) = LOWER(:search) OR order.payment_id = :search)',
        { search: `%${search}%` },
      );
    }
    query.orderBy('order.order_date', 'DESC');
    const orders = await query.getMany();
    return orders;
  }
  async getOrderById(id: string, user: User): Promise<Order> {
    const found = await this.orderRepository.findOne({ where: { id, user } });
    if (!found) {
      throw new NotFoundException(`Order with id "${id}" not found`);
    }
    return found;
  }

  async getOrderItemByOrderId(id: string): Promise<OrderItem[]> {
    return this.orderItemRepository.find({ where: { order_id: id } });
  }

  async getOrdersSecure(filterDto: GetOrdersFilterDto): Promise<Order[]> {
    const { status, search } = filterDto;
    const query = this.orderRepository.createQueryBuilder('order');
    if (status) {
      query.where('order.order_status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(order.email) = LOWER(:search) OR LOWER(order.mobile) = LOWER(:search) OR order.payment_id = :search)',
        { search: `%${search}%` },
      );
    }
    query.orderBy('order.order_date', 'DESC');
    const orders = await query.getMany();
    return orders;
  }
  async getOrderByIdSecure(id: string): Promise<Order> {
    const found = await this.orderRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Order with id "${id}" not found`);
    }
    return found;
  }

  // async createOrder(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
  //   const { product_ids, product_names, total_price, total_discount, email, mobile, address, net_amount, payment_id, quantities } = createOrderDto;
  //   const order = this.orderRepository.create({
  //     product_ids,
  //     product_names,
  //     total_price,
  //     total_discount,
  //     net_amount,
  //     payment_id,
  //     quantities,
  //     email,
  //     address,
  //     mobile,
  //     order_status: OrderStatus.PLACED,
  //     user,
  //   });
  //   await this.orderRepository.save(order);
  //   const productIds = product_ids.split('|');
  //   const productQuantities = quantities.split('|')
  //   let flag: boolean = false;
  //   for (let i = 0; i < productIds.length; i++) {
  //     const product = await this.productService.getProductById(productIds[i]);
  //     let isOutOfStock: boolean = false;
  //     if(Number(productQuantities[i]) > Number(product.stock)){
  //       flag = true;
  //       isOutOfStock = true;
  //     }
  //     let order_item_status: OrderItemStatus;
  //     if(isOutOfStock) {
  //       order_item_status = OrderItemStatus.PENDING;
  //     } else {
  //       order_item_status = OrderItemStatus.PLACED;
  //     }
  //     const orderItem = {
  //       order_id: order.id,
  //       product_id: product.id,
  //       product_name: product.product_name,
  //       quantity: parseInt(productQuantities[i]),
  //       net_mrp: product.mrp,
  //       net_amount: product.price,
  //       item_out_of_stock: isOutOfStock,
  //       order_item_status,
  //     }
  //     const new_stock: number = (Number(product.stock) - Number(productQuantities[i]));
  //     await this.productService.updateProductStock(product.id, new_stock);
  //     await this.orderItemRepository.save(orderItem);
  //   }
  //   if(flag){
  //     const finalOrder = await this.updateOrderStatus(order.id,OrderStatus.PENDING);
  //     return finalOrder;
  //   }
  //   return order;
  // }

  async createOrder(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const { product_ids, product_names, total_price, total_discount, email, mobile, billing_address, shipping_address, net_amount, delivery_charge, coupon_discount, payment_id, quantities } = createOrderDto;
    const order = this.orderRepository.create({
      product_ids,
      product_names,
      total_price,
      total_discount,
      net_amount,
      delivery_charge,
      coupon_discount,
      payment_id,
      quantities,
      email,
      billing_address,
      shipping_address,
      mobile,
      order_status: OrderStatus.PLACED,
      user,
    });
    await this.orderRepository.save(order);
    const productIds = product_ids.split('|');
    const productQuantities = quantities.split('|')
    let flag: boolean = false;
    for (let i = 0; i < productIds.length; i++) {
      const product = await this.productService.getProductById(productIds[i]);
      let isOutOfStock: boolean = false;
      if(Number(productQuantities[i]) > Number(product.stock)){
        flag = true;
        isOutOfStock = true;
      }
      let order_item_status: OrderItemStatus;
      if(isOutOfStock) {
        order_item_status = OrderItemStatus.PENDING;
      } else {
        order_item_status = OrderItemStatus.PLACED;
      }
      const orderItem = {
        order_id: order.id,
        product_id: product.id,
        product_name: product.product_name,
        product_image: product.image,
        quantity: parseInt(productQuantities[i]),
        net_mrp: product.mrp,
        net_amount: product.price,
        item_out_of_stock: isOutOfStock,
        order_item_status,
      }
      const new_stock: number = (Number(product.stock) - Number(productQuantities[i]));
      await this.productService.updateProductStock(product.id, new_stock);
      await this.orderItemRepository.save(orderItem);
    }
    if(flag){
      const finalOrder = await this.updateOrderStatus(order.id,OrderStatus.PENDING);
      return finalOrder;
    }
    return order;
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.getOrderByIdSecure(id);
    order.order_status = status;
    await this.orderRepository.save(order);
    return order;
  }

  async cancelOrderById(id: string, user: User): Promise<Order> {
    const orderItems = await this.getOrderItemByOrderId(id);

    // Iterate through order items and update status if pending
    for (const orderItem of orderItems) {
      orderItem.order_item_status = OrderItemStatus.CANCELED;
      orderItem.refund_amount = orderItem.net_amount * orderItem.quantity;
      await this.orderItemRepository.save(orderItem);
    }

    const order = await this.getOrderByIdSecure(id);
    order.refund_amount = order.net_amount;
    order.order_status = OrderStatus.CANCELED;
    await this.orderRepository.save(order);
    return order;
  }

  async cancelPendingItemsById(id: string, user: User): Promise<Order> {
    const orderItems = await this.getOrderItemByOrderId(id);

    let isOnePlaced = false
    let refundableAmount = 0;
    // Iterate through order items and update status if pending
    for (const orderItem of orderItems) {
      if (orderItem.order_item_status === OrderItemStatus.PENDING) {
        orderItem.refund_amount = (orderItem.net_amount * orderItem.quantity);
        refundableAmount = refundableAmount + orderItem.refund_amount;
        orderItem.order_item_status = OrderItemStatus.CANCELED;
        await this.orderItemRepository.save(orderItem);
      }
      if(orderItem.order_item_status === OrderItemStatus.PLACED){
        isOnePlaced = true;
      }
    }

    const Order_Status = isOnePlaced? OrderStatus.PLACED : OrderStatus.CANCELED;
    const order = await this.getOrderByIdSecure(id);
    if(!isOnePlaced){
      refundableAmount = order.net_amount;
    }
    order.refund_amount = refundableAmount;
    order.order_status = Order_Status;
    await this.orderRepository.save(order);
    return order;
  }

  async updateOrderStaff( id: string, updateOrderStaffDto: UpdateOrderStaffDto ): Promise<Order> {
    const { email, mobile, shipping_address, order_status } = updateOrderStaffDto;
    const order = await this.getOrderByIdSecure(id);
    order.email = email;
    order.mobile = mobile;
    order.shipping_address = shipping_address;
    order.order_status = order_status;
    await this.orderRepository.save(order);
    return order;
  }

  async updateOrderSuper( id: string, updateOrderAdminDto: UpdateOrderAdminDto ): Promise<Order> {
    const { email, mobile, shipping_address, order_status } = updateOrderAdminDto;
    const order = await this.getOrderByIdSecure(id);
    order.email = email;
    order.mobile = mobile;
    order.shipping_address = shipping_address;
    order.order_status = order_status;
    await this.orderRepository.save(order);
    return order;
  }

}