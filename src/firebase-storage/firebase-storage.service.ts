import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { File } from 'multer';
import { initializeApp } from 'firebase/app';
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from 'firebase/storage';
import * as fs from 'fs';
import { ProductService } from 'src/product/product.service';
import { AuthService } from 'src/auth/auth.service';
import { Staff } from 'src/auth/staff/staff.entity';
import { ConfigService } from '@nestjs/config';
import { Admin } from 'src/auth/admin/admin.entity';
import { Product } from 'src/product/product.entity';

@Injectable()
export class FirebaseStorageService {
  private storage;
  constructor(
    private readonly productService: ProductService,
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {
    const firebaseConfig = {
      apiKey: this.configService.get('FB_API_KEY'),
      authDomain: this.configService.get('FB_AUTH_DOMAIN'),
      projectId: this.configService.get('FB_PROJECT_ID'),
      storageBucket: this.configService.get('FB_STORAGE_BUCKET'),
      messagingSenderId: this.configService.get('FB_MESSAGING_SENDER_ID'),
      appId: this.configService.get('FB_APP_ID'),
      measurementId: this.configService.get('FB_MEASUREMENT_ID'),
    };

    // const firebaseConfig = {
    //     apiKey: "AIzaSyB0OLoAcxXvqSPTK6mtyeuutf6EF-cNnJg",
    //     authDomain: "stylekunj-cdd6c.firebaseapp.com",
    //     projectId: "stylekunj-cdd6c",
    //     storageBucket: "stylekunj-cdd6c.appspot.com",
    //     messagingSenderId: "260877770365",
    //     appId: "1:260877770365:web:e73c1c7eae982f916c5b14",
    //     measurementId: "G-0R47R3YDD3"
    //   };

    const app = initializeApp(firebaseConfig);
    this.storage = getStorage(app);
  }

async uploadProductImagesIntoFirebaseStorage(files: File[]): Promise<Product> {
  const filename = files[0].originalname;
  const urls = await Promise.all(files.map(file => this.uploadSingleImage(file)));
  const downloadURLs = urls.join('|');
  const product_id = filename.split('.').slice(0, -1).join('.').slice(0, -1);
  const product_images = downloadURLs;
  const product = await this.productService.updateProductImages(product_id, product_images);

    return product;
  }

private async uploadSingleImage(file: File): Promise<String> {
    const metadata = {
      contentType: 'image/jpeg',
    };

    const filename = file.originalname;
    const filePath = file.path;
    const fileData = fs.readFileSync(filePath);

    const storageRef = ref(this.storage, 'ProductImages/' + filename);
    const uploadTask = uploadBytesResumable(storageRef, fileData, metadata);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Track upload progress if needed
        },
        (error) => {
          // Delete the file from the ./uploads folder
          fs.unlinkSync(filePath);
          // Handle upload error
          reject(new InternalServerErrorException('Something went wrong while uploading product images.'));
        },
        async () => {
          try {
            // Upload completed successfully, get download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Delete the file from the ./uploads folder
            fs.unlinkSync(filePath);

            resolve(downloadURL);
          } catch (error) {
            reject(new InternalServerErrorException('Something went wrong while uploading product images.'));
          }
        }
      );
    });
  }

  async uploadStaffDetailsIntoFirebaseStorage(file: File): Promise<Staff> {
    const metadata = {
      contentType: 'application/pdf',
    };
  
    const filename = file.originalname;
    const filePath = file.path;
    const fileData = fs.readFileSync(filePath);
  
    const storageRef = ref(this.storage, 'StaffDetails/' + filename);
    const uploadTask = uploadBytesResumable(storageRef, fileData, metadata);
  
    return new Promise(async (resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Track upload progress if needed
        },
        (error) => {
          // Delete the file from the ./uploads folder
          fs.unlinkSync(filePath);
          // Handle upload error
          reject(new InternalServerErrorException('Something went wrong while uploading staff details.'));
        },
        async () => {
          try {
            // Upload completed successfully, get download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  
            // Delete the file from the ./uploads folder
            fs.unlinkSync(filePath);
  
            const staff_id = await filename.split('.').slice(0, -1).join('.');
            const staff_details = downloadURL;
            const staff = await this.authService.updateStaffDetails(staff_id, staff_details);
  
            resolve(staff);
          } catch (error) {
            reject(new InternalServerErrorException('Something went wrong while uploading staff details.'));
          }
        }
      );
    });
  }

  async uploadAdminDetailsIntoFirebaseStorage(file: File): Promise<Admin> {
    const metadata = {
      contentType: 'application/pdf',
    };
  
    const filename = file.originalname;
    const filePath = file.path;
    const fileData = fs.readFileSync(filePath);
  
    const storageRef = ref(this.storage, 'AdminDetails/' + filename);
    const uploadTask = uploadBytesResumable(storageRef, fileData, metadata);
  
    return new Promise(async (resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Track upload progress if needed
        },
        (error) => {
          // Delete the file from the ./uploads folder
          fs.unlinkSync(filePath);
          // Handle upload error
          reject(new InternalServerErrorException('Something went wrong while uploading admin details.'));
        },
        async () => {
          try {
            // Upload completed successfully, get download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  
            // Delete the file from the ./uploads folder
            fs.unlinkSync(filePath);
  
            const admin_id = await filename.split('.').slice(0, -1).join('.');
            const admin_details = downloadURL;
            const admin = await this.authService.updateAdminDetails(admin_id, admin_details);
  
            resolve(admin);
          } catch (error) {
            reject(new InternalServerErrorException('Something went wrong while uploading admin details.'));
          }
        }
      );
    });
  }

}
