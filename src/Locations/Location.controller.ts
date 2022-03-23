import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get('serviceable')
  async CheckLocationService(@Query('address') address) {
    if (!address) {
      throw new BadRequestException('address not provided');
    }
    let restraunt = '';
    try {
      restraunt = await this.locationService.getServiceRestaurant(address);
      if (restraunt) {
        return restraunt;
      }
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
    if (!restraunt) {
      throw new NotFoundException('unserviceable location');
    }
  }
}
