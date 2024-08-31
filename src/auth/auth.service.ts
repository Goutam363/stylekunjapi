import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Repository } from 'typeorm';
import { Staff } from './staff/staff.entity';
import { JwtService } from '@nestjs/jwt';
import { Admin } from './admin/admin.entity';
import { AuthCreateUserDto } from './dto/auth-create-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { AuthCreateStaffDto } from './dto/auth-create-staff.dto';
import { AuthCreateAdminDto } from './dto/auth-create-admin.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { GetUserProfileDto } from './dto/get-profile-user.dto';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/product.entity';
import { UpdatePasswordDto } from './dto/update-password-dto';
import { AccountStatus } from './account-status.enum';
import { UpdateUserByAdminDto } from './dto/update-user-by-admin.dto';
import { UpdateUserByStaffDto } from './dto/update-user-by-staff.dto';
import { UpdateStaffByAdminDto } from './dto/update-staff-by-admin.dto';
import { UpdateAdminByAdminDto } from './dto/update-admin-by-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly productService: ProductService,
    private jwtService: JwtService,
  ) {}

  async createUser(authCreateUserDto: AuthCreateUserDto): Promise<void> {
    const { name, email, mobile, dob, username, password } = authCreateUserDto;

    //Hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      name,
      email,
      mobile,
      dob,
      username,
      password: hashedPassword,
    });
    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getAllAdmins(): Promise<Admin[]> {
    const query = this.adminRepository.createQueryBuilder('admin');
    query.orderBy('admin.account_create_date','DESC');
    const admins = await query.getMany();
    return admins;
  }

  async deleteAdmin(id: string): Promise<void> {
    const result = await this.adminRepository.delete({ id });
    if(result.affected === 0) {
      throw new NotFoundException(`Admin with id "${id}" not found`);
    }
  }

  async getUserById(id: string): Promise<User> {
    const found = await this.userRepository.findOne({ where: { id } });
    if(!found) {
        throw new NotFoundException(`User with id ${id} not found`);
    }
    return found;
  }

  async getAdminById(id: string): Promise<Admin> {
    const found = await this.adminRepository.findOne({ where: { id } });
    if(!found) {
        throw new NotFoundException(`Admin with id ${id} not found`);
    }
    return found;
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto): Promise<void> {
    const usernames = await this.getUsernamesByEmail(updatePasswordDto.email);
    if(usernames===""){
      throw new UnauthorizedException();
    } else {
      const usernameArr = usernames.split('|');
      const username = updatePasswordDto.username;
      const isUsernameMatched: boolean = usernameArr.includes(username);
      if(isUsernameMatched){

        //Hash
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(updatePasswordDto.password, salt);

        const user = await this.userRepository.findOneBy({username});
        user.password = hashedPassword;
        await this.userRepository.save(user);
      } else {
        throw new UnauthorizedException();
      }
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOneBy({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      if(user.account_status !== AccountStatus.ACTIVE){
        throw new UnauthorizedException('Admin blocked/deactivated your account');
      }
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async getUsernamesByEmail( email: string ): Promise<string> {
    const users = await this.userRepository.find({ where : { email }});

    if (users.length === 0) {
      return ""; // Return empty string if no users found
  }
    // Extract usernames and join them with '|'
    const usernames = users.map(user => user.username).join('|');
    return usernames;
  }

  async getProfileByUsername(username: string): Promise<GetUserProfileDto> {
    const user = await this.userRepository.findOneBy({ username });
    if (user) {
      const profile: GetUserProfileDto = {
        username: user.username,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        dob: user.dob,
        cart: user.cart,
      };
      return profile;
    } else {
      throw new NotFoundException("Username does not exist!");
    }
  }

  async checkUsername(username: string): Promise<{exist:boolean}> {
    const user = await this.userRepository.findOneBy({ username });
    if (user) {
      return { exist: true };
    } else {
      return { exist: false };
    }
  }

  async getCartByUsername(username: string): Promise<Product[]> {
    const user = await this.userRepository.findOneBy({ username });
    const cart = await this.productService.getProductsByIds(user.cart);
    return cart;
  }

  async updateCartByUsername(updateCartDto: UpdateCartDto): Promise<void> {
    const { username, cart } = updateCartDto;
    const user = await this.userRepository.findOneBy({ username });
    user.cart = cart;
    await this.userRepository.save(user);
  }

  async createStaff(authCreateStaffDto: AuthCreateStaffDto): Promise<void> {
    const { name, email, mobile, dob, username, password } = authCreateStaffDto;

    //Hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const staff = this.staffRepository.create({
      name,
      email,
      mobile,
      dob,
      username,
      password: hashedPassword,
    });
    try {
      await this.staffRepository.save(staff);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getStaffById(id: string): Promise<Staff> {
    const found = await this.staffRepository.findOne({ where: { id } });
    if(!found) {
        throw new NotFoundException(`Staff with id ${id} not found`);
    }
    return found;
  }

  async signInStaff(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const staff = await this.staffRepository.findOneBy({ username });
    if (staff && (await bcrypt.compare(password, staff.password))) {
      if(staff.account_status !== AccountStatus.ACTIVE){
        throw new UnauthorizedException('Admin blocked/deactivated your account');
      }
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async createAdmin(authCreateAdminDto: AuthCreateAdminDto): Promise<void> {
    const { name, email, username, password } = authCreateAdminDto;

    //Hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = this.adminRepository.create({
      name,
      email,
      username,
      password: hashedPassword,
    });
    try {
      await this.adminRepository.save(admin);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signInAdmin(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const admin = await this.adminRepository.findOneBy({ username });
    if (admin && (await bcrypt.compare(password, admin.password))) {
      if(admin.account_status !== AccountStatus.ACTIVE){
        throw new UnauthorizedException('Admin blocked/deactivated your account');
      }
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async getAllUsers(): Promise<User[]> {
    const query = this.userRepository.createQueryBuilder('user');
    query.orderBy('user.account_create_date','DESC');
    const users = await query.getMany();
    return users;
  }

  async getAllStaffs(): Promise<Staff[]> {
    const query = this.staffRepository.createQueryBuilder('staff');
    query.orderBy('staff.account_create_date','DESC');
    const staffs = await query.getMany();
    return staffs;
  }

  async checkUsernameStaff(username: string): Promise<{ exist: boolean }> {
    const staff = await this.staffRepository.findOneBy({ username });
    if (staff) {
      return { exist: true };
    } else {
      return { exist: false };
    }
  }

  async checkUsernameAdmin(username: string): Promise<{ exist: boolean }> {
    const admin = await this.adminRepository.findOneBy({ username });
    if (admin) {
      return { exist: true };
    } else {
      return { exist: false };
    }
  }

  async updateUserByStaff(id: string, updateUserByStaffDto: UpdateUserByStaffDto): Promise<User> {
    const { mobile, dob, account_status } = updateUserByStaffDto;
    const user = await this.getUserById(id);
    user.mobile = mobile;
    user.dob = dob;
    user.account_status = account_status;
    await this.userRepository.save(user);
    return user;
  }

  async updateUserByAdmin(id: string, updateUserByAdminDto: UpdateUserByAdminDto): Promise<User> {
    const { name, email, mobile, dob, username, account_status } = updateUserByAdminDto;
    const user = await this.getUserById(id);
    user.name = name;
    user.email = email;
    user.mobile = mobile;
    user.dob = dob;
    user.username = username;
    user.account_status = account_status;
    await this.userRepository.save(user);
    return user;
  }

  async updateStaffByAdmin(id: string, updateStaffByAdminDto: UpdateStaffByAdminDto): Promise<Staff> {
    const { name, email, mobile, dob, username, account_status, staff_details } = updateStaffByAdminDto;
    const staff = await this.getStaffById(id);
    staff.name = name;
    staff.email = email;
    staff.mobile = mobile;
    staff.dob = dob;
    staff.username = username;
    staff.account_status = account_status;
    staff.staff_details = staff_details;
    await this.staffRepository.save(staff);
    return staff;
  }

  async updateAdminByAdmin(id: string, updateAdminByAdminDto: UpdateAdminByAdminDto): Promise<Admin> {
    const { name, email, username, account_status, admin_details } = updateAdminByAdminDto;
    const admin = await this.getAdminById(id);
    admin.name = name;
    admin.email = email;
    admin.username = username;
    admin.account_status = account_status;
    admin.admin_details = admin_details;
    await this.adminRepository.save(admin);
    return admin;
  }

  async updateStaffDetails( id: string, staff_details: string ): Promise<Staff> {
    const staff = await this.getStaffById(id);
    staff.staff_details = staff_details;
    await this.staffRepository.save(staff);
    return staff;
  }

  async updateAdminDetails( id: string, admin_details: string ): Promise<Admin> {
    const admin = await this.getAdminById(id);
    admin.admin_details = admin_details;
    await this.adminRepository.save(admin);
    return admin;
  }

  async verifyStaffById(id: string): Promise<boolean> {
    const found = await this.staffRepository.findOne({ where: { id } });
    if(found) {
        return true;
    } else {
      return false;
    }
  }

  async verifyAdminById(id: string): Promise<boolean> {
    const found = await this.adminRepository.findOne({ where: { id } });
    if(found) {
        return true;
    } else {
      return false;
    }
  }

}
