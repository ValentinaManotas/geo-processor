import { IsArray, ArrayNotEmpty, ValidateNested, IsNumber, Min, Max} from 'class-validator';
import { Type } from 'class-transformer';

class PointDto {
  @IsNumber({}, { message: "Latitude must be decimal" })
  @Type(() => Number)
  @Min(-90, { message: "Latitude must be greater than or equal to -90" })
  @Max(90, { message: "Latitude must be less than or equal to 90" })
  lat: number;

  @IsNumber({}, { message: "Longitude must be decimal" })
  @Type(() => Number)
  @Min(-180, { message: "Longitude must be greater than or equal to -180" })
  @Max(180, { message: "Longitude must be less than or equal to 180" })
  lng: number;
}

export class ProcessGeoDto {
  @IsArray({ message: "points must be an array" })
  @ArrayNotEmpty({ message: "points array should not be empty" })
  @ValidateNested({ each: true })
  @Type(() => PointDto)
  points: PointDto[];
}