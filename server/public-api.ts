export interface LocationDto {
    countryCode: string;
    country: string;
    city: string;
}

export enum DevelopmentConfigurations {
  dev = 'dev',
  local = 'local'
}