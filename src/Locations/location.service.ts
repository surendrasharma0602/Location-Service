import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { Client, LatLngLiteral } from '@googlemaps/google-maps-services-js';
const tj = require('@mapbox/togeojson');
const { DOMParser } = require('@xmldom/xmldom');
const turf = require('@turf/turf');
@Injectable()
export class LocationService {
  private googleClient: Client;
  constructor() {
    this.googleClient = new Client({});
  }
  async getServiceRestaurant(address: string): Promise<string> {
    try {
      const locationGeoCode = await this.getCoordinates(address);
      console.log(`Address ${address}, location ${locationGeoCode} `);
      const areas = await this.getAreasJson();
      for (const area of areas['features']) {
        const geometry = area['geometry'];
        if (geometry['type'] === 'Polygon') {
          //   const point = turf.point([16.343174, 48.196818]); // Stumpergasse 51, 1060 Vienna  === au_vienna_schoenbrunnerstr
          const point = turf.point([locationGeoCode.lng, locationGeoCode.lat]);
          const poly = turf.polygon(geometry['coordinates']);
          const found = turf.booleanPointInPolygon(point, poly);
          if (found) {
            const name = area['properties']['name'];
            return name;
          }
        }
      }
      // find out where the provided geoCode lies in the specified locations
    } catch (error) {
      console.log(error);
    }
    return '';
  }

  private async getAreasJson(): Promise<unknown> {
    try {
      const fileContent = await fs.promises.readFile(
        './src/Locations/areas.kml',
        'utf8',
      );
      const kml = new DOMParser().parseFromString(fileContent, 'text/xml');

      const converted = tj.kml(kml);
      return converted;
      //   console.log('converted', converted);
      //   const convertedWithStyles = tj.kml(kml, { styles: true });
      //   console.log('convertedWithStyles', convertedWithStyles);
    } catch (error) {
      console.log(error);
    }
  }
  async getCoordinates(address: string): Promise<LatLngLiteral> {
    try {
      const googleRes = await this.googleClient.geocode({
        params: {
          address: address,
          key: process.env.GOOGLE_MAPS_API_KEY,
          //     place_id?: null,
          // bounds?: null,
          // language?: null,
          // region?: null,
          // components?: null
        },
      });

      const { lng, lat } = googleRes.data.results[0].geometry.location;
      return { lng, lat };
    } catch (error) {
      console.log(error);
    }
  }
}
