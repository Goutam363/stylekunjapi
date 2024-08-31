import { Injectable, NotFoundException } from '@nestjs/common';
import { Contact } from './contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactByAdminDto } from './dto/update-contact-by-admin.dto';
import { UpdateContactByStaffDto } from './dto/update-contact-by-staff.dto';

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(Contact)
        private readonly contactRepository: Repository<Contact>,
        private readonly authService: AuthService,
      ) {}

    async getContacts(): Promise<Contact[]> {
      const query = this.contactRepository.createQueryBuilder('contact');
      query.orderBy('contact.create_date','DESC');
      const contacts = await query.getMany();
      return contacts;
    }

    async getContactById(id: string): Promise<Contact> {
        const found = await this.contactRepository.findOne({ where: { id } });
    if(!found) {
        throw new NotFoundException(`Contact detail with id ${id} not found`);
    }
    return found;
    }

      async getContactByEmail(email: string): Promise<Contact> {
        const contact = await this.contactRepository.findOne({ where: { email } });
        return contact;
      }

      async updateContactUsernamesById( id: string, usernames: string ): Promise<Contact> {
        const contact = await this.getContactById(id);
        contact.usernames = usernames;
        await this.contactRepository.save(contact);
        return contact;
      }
    
      async updateContactMobileById( id: string, mobile: string ): Promise<Contact> {
        const contact = await this.getContactById(id);
        contact.mobile = mobile;
        await this.contactRepository.save(contact);
        return contact;
      }

      async createContact(createContactDto: CreateContactDto): Promise<Contact> {
        const { name, email } = createContactDto;
        const mobile = (((createContactDto.mobile) && (createContactDto.mobile !=="")) ? createContactDto.mobile : "");
        const address = (((createContactDto.address) && (createContactDto.address !=="")) ? createContactDto.address : "");
        const usernames = await this.authService.getUsernamesByEmail(email);
        const isUser = (usernames !=="");
        const contact = this.contactRepository.create({
            name,
            email,
            mobile,
            address,
            isUser,
            usernames,
        })
        await this.contactRepository.save(contact);
        return contact;
      }

      async updateContactByStaff( id: string, updateContactByStaffDto: UpdateContactByStaffDto ): Promise<Contact> {
        const { mobile, dnd, address } = updateContactByStaffDto;
        const contact = await this.getContactById(id);
        contact.mobile = mobile;
        contact.dnd = dnd;
        contact.address = address;
        await this.contactRepository.save(contact);
        return contact;
      }

      async updateContactByAdmin( id: string, updateContactByAdminDto: UpdateContactByAdminDto ): Promise<Contact> {
        const { name, email, mobile, address, dnd, isUser, usernames } = updateContactByAdminDto;
        const contact = await this.getContactById(id);
        contact.name = name;
        contact.email = email;
        contact.mobile = mobile;
        contact.address = address;
        contact.dnd = dnd;
        contact.isUser = isUser;
        contact.usernames = usernames;
        await this.contactRepository.save(contact);
        return contact;
      }
}
