import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { UsersModule } from './core/users/users.module';
import { MailController } from './core/mail/mail.controller';
import { MailModule } from './core/mail/mail.module';
import { CustomerModule } from './modules/customer/customer.module';
import { DesignerModule } from './modules/designer/designer.module';
import { DeveloperModule } from './modules/developer/developer.module';
import { UserModule } from './modules/user/user.module';
import { DevopsModule } from './modules/devops/devops.module';
import { ProductManagerModule } from './modules/product-manager/product-manager.module';
import { SalesModule } from './modules/sales/sales.module';
import { ProfileModule } from './core/profile/profile.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'db_mokami',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Jangan aktifkan di production
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    UserModule,
    MailModule,
    CustomerModule,
    DesignerModule,
    DeveloperModule,
    DevopsModule,
    ProductManagerModule,
    SalesModule,
    ProfileModule,
    AdminModule,
  ],
  controllers: [AppController, MailController],
  providers: [AppService],
})
export class AppModule {}
