import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UserJwtStrategy } from './user/user-jwt.strategy';
import { StaffJwtStrategy } from './staff/staff-jwt.strategy';
import { AdminJwtStrategy } from './admin/admin-jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { User } from './user/user.entity';
import { Staff } from './staff/staff.entity';
import { Admin } from './admin/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from 'src/product/product.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register([
      { name: 'user-jwt', passportStrategy: UserJwtStrategy },
      { name: 'staff-jwt', passportStrategy: StaffJwtStrategy },
      { name: 'admin-jwt', passportStrategy: AdminJwtStrategy },
    ]),
    // JwtModule.register({
    //   secret: 'topSecret51',
    //   signOptions: { expiresIn: '1d' },
    // }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { 
          expiresIn: 3600,
         },
      }),
    }),
    TypeOrmModule.forFeature([User, Staff, Admin]),
    ProductModule,
  ],
  providers: [AuthService, UserJwtStrategy, StaffJwtStrategy, AdminJwtStrategy],
  controllers: [AuthController],
  exports: [PassportModule, UserJwtStrategy, StaffJwtStrategy, AdminJwtStrategy, AuthService],
})
export class AuthModule {}
