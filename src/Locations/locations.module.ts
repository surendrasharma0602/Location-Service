import { Module } from '@nestjs/common';
import { LocationController } from './Location.controller';
import { LocationService } from './location.service';

@Module({
  controllers: [LocationController],
  providers: [LocationService],
  imports: [],
})
export class LocationModule {}
