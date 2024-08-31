import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { AuthGuard } from '@nestjs/passport';
import { Contact } from './contact.entity';
import { UpdateContactByStaffDto } from './dto/update-contact-by-staff.dto';
import { UpdateContactByAdminDto } from './dto/update-contact-by-admin.dto';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('api/contact')
export class ContactController {
    constructor(private contactService: ContactService) {}

    // @Post()
    // createContact(@Body() createContactDto: CreateContactDto): Promise<Contact> {
    //     return this.contactService.createContact(createContactDto);
    // }

    //Staff Section
  @Get('/secure/staff')
  @UseGuards(AuthGuard('staff-jwt'))
  getContactsStaff(): Promise<Contact[]> {
    return this.contactService.getContacts();
  }

  @Patch('/secure/staff/:id')
  @UseGuards(AuthGuard('staff-jwt'))
  updateContactStaff(
    @Param('id') id: string,
    @Body() updateContactByStaffDto: UpdateContactByStaffDto,
  ): Promise<Contact> {
    return this.contactService.updateContactByStaff(
      id,
      updateContactByStaffDto,
    );
  }

  //Admin Section
  @Get('/secure/admin')
  @UseGuards(AuthGuard('admin-jwt'))
  getContactsAdmin(): Promise<Contact[]> {
    return this.contactService.getContacts();
  }

  @Patch('/secure/admin/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  updateContactAdmin(
    @Param('id') id: string,
    @Body() updateContactByAdminDto: UpdateContactByAdminDto,
  ): Promise<Contact> {
    return this.contactService.updateContactByAdmin(
      id,
      updateContactByAdminDto,
    );
  }
}
