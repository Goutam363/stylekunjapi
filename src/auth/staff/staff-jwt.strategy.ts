import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Staff } from './staff.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayload } from '../jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StaffJwtStrategy extends PassportStrategy(Strategy, 'staff-jwt') {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    private configService: ConfigService,
  ) {
    super({
        secretOrKey: configService.get('JWT_SECRET'),
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<Staff> {
    const { username } = payload;
    const staff: Staff = await this.staffRepository.findOneBy({ username });
    if(!staff) {
        throw new UnauthorizedException();
    }
    return staff;
  }
}