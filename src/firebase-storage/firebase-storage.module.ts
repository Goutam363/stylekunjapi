import { Module } from '@nestjs/common';
import { FirebaseStorageController } from './firebase-storage.controller';
import { FirebaseStorageService } from './firebase-storage.service';
import { MulterConfigPdfService } from './multer-config-pdf.service';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from 'src/product/product.module';
import { MulterConfigJpgService } from './multer-config-jpg.service';

@Module({
  imports:[
    ConfigModule,
    MulterModule.registerAsync({
      useClass: MulterConfigPdfService,
    }),
    MulterModule.registerAsync({
      useClass: MulterConfigJpgService,
    }),
    ProductModule,
    AuthModule,
  ],
  controllers: [FirebaseStorageController],
  providers: [FirebaseStorageService, MulterConfigPdfService, MulterConfigJpgService],
})
export class FirebaseStorageModule {}
