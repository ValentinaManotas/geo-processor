import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { GeoService } from './geo/geo.service';
import { ProcessGeoDto } from './geo/dto/process-geo.dto';

@Controller()
export class AppController {
  constructor(private readonly geoService: GeoService) {}
  @Post()
  async redirectPost(@Body() body: ProcessGeoDto) {
    try {
      const result = await this.geoService.processGeo(body.points);
      return result;
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error instanceof Error ? error.message : 'Failed to process coordinates');
    }
  }
}
