import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GeoModule } from './geo/geo.module'; 

@Module({
  imports: [GeoModule],
  controllers: [AppController],
})
export class AppModule {}

