import {
  getGeocode,
  getLatLng,
  LatLng
} from '../src/usePlacesAutocomplete/geocoding';

describe('getGeocode', () => {
  const data = [{ place_id: '0109' }];
  const error = 'ERROR';
  const geocode = jest.fn();
  const setupMaps = (type = 'success'): void => {
    // @ts-ignore
    global.google = {
      maps: {
        Geocoder: class {
          geocode =
            type === 'opts'
              ? geocode
              : (
                  _: object,
                  cb: (data: object[] | null, status: string) => void
                ): void => {
                  cb(
                    type === 'success' ? data : null,
                    type === 'success' ? 'OK' : error
                  );
                };
        }
      }
    };
  };

  it('should set options correctly', () => {
    setupMaps('opts');
    const opts = { address: 'Taipei', placeId: '0109' };
    getGeocode(opts);
    expect(geocode).toBeCalledWith(opts, expect.any(Function));
  });

  it('should handle success correctly', () => {
    setupMaps();
    getGeocode({ address: 'Taipei' }).then(results => {
      expect(results).toBe(data);
    });
  });

  it('should handle failure correctly', () => {
    setupMaps('failure');
    getGeocode({ address: 'Taipei' }).catch(err => {
      expect(err).toBe(error);
    });
  });
});

describe('getLatLng', () => {
  it('should handle success correctly', () => {
    const latLng = { lat: 123, lng: 456 };
    getLatLng({
      geometry: {
        // @ts-ignore
        location: {
          lat: (): number => latLng.lat,
          lng: (): number => latLng.lng
        }
      }
    }).then((result: LatLng) => {
      expect(result).toEqual(latLng);
    });
  });

  it('should handle failure correctly', () => {
    // @ts-ignore
    getLatLng({}).catch(error => {
      expect(error).toEqual(expect.any(Error));
    });
  });
});
