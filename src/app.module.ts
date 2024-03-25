import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule, UserModule } from './Modules';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module(
{
    imports: 
    [
        ConfigModule.forRoot({envFilePath: 'src/Config/dev.env'}),
        MongooseModule.forRoot(process.env.CONNECT_DB_LOCAL),
        AuthModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
