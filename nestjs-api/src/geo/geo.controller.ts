import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { ProcessGeoDto } from './dto/process-geo.dto';

@Controller('geo')
export class GeoController {
  private readonly pythonServiceUrl = 'http://host.docker.internal:8000/process_geo';
  @Post('process')
  async processGeo(@Body() body: ProcessGeoDto) {
    try {
      const response = await axios.post(this.pythonServiceUrl, { points: body.points });
      if (!response.data.success) {
        throw new BadRequestException(response.data.message || 'Failed to process coordinates');
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new BadRequestException(errorMessage || 'Failed to process coordinates');
      } else {
        throw new Error('Failed to process coordinates: Unknown error');
      }
    }
  }
}
