import { Controller, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FirebaseStorageService } from './firebase-storage.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { File } from 'multer';
import { Product } from 'src/product/product.entity';
import { Staff } from 'src/auth/staff/staff.entity';
import { Admin } from 'src/auth/admin/admin.entity';

@Controller('firebase-storage')
export class FirebaseStorageController {
    constructor(private readonly firebaseStorageService: FirebaseStorageService) {}

    @Post('upload/product-images')
    @UseGuards(AuthGuard('admin-jwt'))
    @UseInterceptors(FilesInterceptor('files'))
    uploadProductImages(@UploadedFiles() files: File[]): Promise<Product> {
      // Handle the uploaded file here
      // For example, upload the file to Firebase Storage
      return this.firebaseStorageService.uploadProductImagesIntoFirebaseStorage(files);
    }

    @Post('upload/staff-details')
    @UseGuards(AuthGuard('admin-jwt'))
    @UseInterceptors(FileInterceptor('file'))
    uploadStaffDetails(@UploadedFile() file: File): Promise<Staff> {
      // Handle the uploaded file here
      // For example, upload the file to Firebase Storage
      return this.firebaseStorageService.uploadStaffDetailsIntoFirebaseStorage(file);
    }

    @Post('upload/admin-details')
    @UseGuards(AuthGuard('admin-jwt'))
    @UseInterceptors(FileInterceptor('file'))
    uploadAdminDetails(@UploadedFile() file: File): Promise<Admin> {
      // Handle the uploaded file here
      // For example, upload the file to Firebase Storage
      return this.firebaseStorageService.uploadAdminDetailsIntoFirebaseStorage(file);
    }

}
