// global.d.ts
declare namespace kakao {
  namespace maps {
    class LatLng {
      constructor(lat: number, lng: number);
    }

    class Map {
      constructor(container: HTMLElement | null, options: object);
    }

    class Marker {
      constructor(options: object);
    }

    namespace services {
      class Geocoder {
        addressSearch(
          address: string,
          callback: (result: any, status: any) => void
        ): void;
      }

      const Status: {
        OK: string;
      };
    }

    function load(callback: () => void): void;
  }
}
