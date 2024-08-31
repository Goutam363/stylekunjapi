import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthCreateUserDto } from './dto/auth-create-user.dto';
import { AuthCreateStaffDto } from './dto/auth-create-staff.dto';
import { AuthCreateAdminDto } from './dto/auth-create-admin.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCartDto } from './dto/update-cart.dto';
import { GetUserProfileDto } from './dto/get-profile-user.dto';
import { Product } from 'src/product/product.entity';
import { UpdatePasswordDto } from './dto/update-password-dto';
import { User } from './user/user.entity';
import { UpdateUserByAdminDto } from './dto/update-user-by-admin.dto';
import { UpdateUserByStaffDto } from './dto/update-user-by-staff.dto';
import { Staff } from './staff/staff.entity';
import { UpdateStaffByAdminDto } from './dto/update-staff-by-admin.dto';
import { Admin } from './admin/admin.entity';
import { UpdateAdminByAdminDto } from './dto/update-admin-by-admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCreateUserDto: AuthCreateUserDto): Promise<void> {
    return this.authService.createUser(authCreateUserDto);
  }

  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Get('/check/:username')
  checkUsername(@Param('username') username: string): Promise<{exist:boolean}> {
    return this.authService.checkUsername(username);
  }

  @Get('/:username')
  @UseGuards(AuthGuard('user-jwt'))
  getProfileByUsername(@Param('username') username: string): Promise<GetUserProfileDto> {
    return this.authService.getProfileByUsername(username);
  }

  @Get('/:username/cart')
  @UseGuards(AuthGuard('user-jwt'))
  getCartByUsername(@Param('username') username: string): Promise<Product[]> {
    return this.authService.getCartByUsername(username);
  }

  @Post('/cart')
  @UseGuards(AuthGuard('user-jwt'))
  updateCartByUsername(@Body() updateCartDto: UpdateCartDto): Promise<void> {
    return this.authService.updateCartByUsername(updateCartDto);
  }

  @Post('/secure/staff/signup')
  signUpStaff(@Body() authCreateStaffDto: AuthCreateStaffDto): Promise<void> {
    return this.authService.createStaff(authCreateStaffDto);
  }

  @Post('/secure/staff/signup/by-adm')
  @UseGuards(AuthGuard('admin-jwt'))
  signUpStaffByAdmin(@Body() authCreateStaffDto: AuthCreateStaffDto): Promise<void> {
    return this.authService.createStaff(authCreateStaffDto);
  }

  @Post('/secure/staff/signin')
  signInStaff(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signInStaff(authCredentialsDto);
  }

  @Post('/secure/admin/signup')
  signUpAdmin(@Body() authCreateAdminDto: AuthCreateAdminDto): Promise<void> {
    return this.authService.createAdmin(authCreateAdminDto);
  }

  @Post('/secure/admin/signup/by-adm')
  @UseGuards(AuthGuard('admin-jwt'))
  signUpAdminByAdmin(@Body() authCreateAdminDto: AuthCreateAdminDto): Promise<void> {
    return this.authService.createAdmin(authCreateAdminDto);
  }

  @Post('/secure/admin/signin')
  signInAdmin(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signInAdmin(authCredentialsDto);
  }

  @Patch('/psw')
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto): Promise<void> {
    return this.authService.updatePassword(updatePasswordDto);
  }

@Get('/secure/staff/get-users')
  @UseGuards(AuthGuard('staff-jwt'))
  getAllUsersByStaff(): Promise<User[]> {
    return this.authService.getAllUsers();
  }

  @Patch('/secure/staff/:id')
  @UseGuards(AuthGuard('staff-jwt'))
  updateUserStaff(
    @Param('id') id: string,
    @Body() updateUserByStaffDto: UpdateUserByStaffDto,
  ): Promise<User> {
    return this.authService.updateUserByStaff(id, updateUserByStaffDto);
  }

@Get('/secure/admin/get-users')
@UseGuards(AuthGuard('admin-jwt'))
getAllUsersByAdmin(): Promise<User[]> {
  return this.authService.getAllUsers();
}

  @Get('/secure/admin/get-staffs')
  @UseGuards(AuthGuard('admin-jwt'))
  getAllStaffs(): Promise<Staff[]> {
    return this.authService.getAllStaffs();
  }

  @Get('/secure/admin/get-admins')
  @UseGuards(AuthGuard('admin-jwt'))
  getAllAdmins(): Promise<Admin[]> {
    return this.authService.getAllAdmins();
  }

  @Get('/check/:username/staff')
  checkStaffUsername(
    @Param('username') username: string,
  ): Promise<{ exist: boolean }> {
    return this.authService.checkUsernameStaff(username);
  }

  @Get('/check/:username/admin')
  checkAdminUsername(
    @Param('username') username: string,
  ): Promise<{ exist: boolean }> {
    return this.authService.checkUsernameAdmin(username);
  }

  @Delete('/secure/admin/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  deleteAdmin(@Param('id') id: string): Promise<void> {
    return this.authService.deleteAdmin(id);
  }

  @Patch('/secure/admin/:id/user')
  @UseGuards(AuthGuard('admin-jwt'))
  updateUserAdminSuper(
    @Param('id') id: string,
    @Body() updateUserByAdminDto: UpdateUserByAdminDto,
  ): Promise<User> {
    return this.authService.updateUserByAdmin(id, updateUserByAdminDto);
  }

  @Patch('/secure/admin/:id/staff')
  @UseGuards(AuthGuard('admin-jwt'))
  updateStaffAdminSuper(
    @Param('id') id: string,
    @Body() updateStaffByAdminDto: UpdateStaffByAdminDto,
  ): Promise<Staff> {
    return this.authService.updateStaffByAdmin(id, updateStaffByAdminDto);
  }

  @Patch('/secure/admin/:id/admin')
  @UseGuards(AuthGuard('admin-jwt'))
  updateAdminAdminSuper(
    @Param('id') id: string,
    @Body() updateAdminByAdminDto: UpdateAdminByAdminDto,
  ): Promise<Admin> {
    return this.authService.updateAdminByAdmin(id, updateAdminByAdminDto);
  }

  @Get('/staff/secure/admin/:id/verify')
  @UseGuards(AuthGuard('admin-jwt'))
  verifyStaffByIdAdmin(@Param('id') id: string): Promise<boolean> {
    return this.authService.verifyStaffById(id);
  }

  @Get('/admin/secure/admin/:id/verify')
  @UseGuards(AuthGuard('admin-jwt'))
  verifyAdminByIdAdmin(@Param('id') id: string): Promise<boolean> {
    return this.authService.verifyAdminById(id);
  }

}
