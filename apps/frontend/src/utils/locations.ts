export interface StateData {
  isoCode: string;
  name: string;
}

export interface CityData {
  name: string;
  stateCode: string;
}

export const SUPPORTED_STATES: StateData[] = [
  { isoCode: 'KA', name: 'Karnataka' },
  { isoCode: 'MH', name: 'Maharashtra' },
  { isoCode: 'DL', name: 'Delhi' },
  { isoCode: 'GA', name: 'Goa' },
  { isoCode: 'TS', name: 'Telangana' },
  { isoCode: 'TN', name: 'Tamil Nadu' },
  { isoCode: 'WB', name: 'West Bengal' }
];

export const SUPPORTED_CITIES: CityData[] = [
  // Karnataka
  { name: 'Bengaluru', stateCode: 'KA' },
  { name: 'Mangaluru', stateCode: 'KA' },
  { name: 'Mysuru', stateCode: 'KA' },
  // Maharashtra
  { name: 'Mumbai', stateCode: 'MH' },
  { name: 'Pune', stateCode: 'MH' },
  { name: 'Nagpur', stateCode: 'MH' },
  { name: 'Thane', stateCode: 'MH' },
  // Delhi
  { name: 'New Delhi', stateCode: 'DL' },
  { name: 'Delhi', stateCode: 'DL' },
  { name: 'Noida', stateCode: 'DL' },
  { name: 'Gurugram', stateCode: 'DL' },
  // Goa
  { name: 'Panaji', stateCode: 'GA' },
  { name: 'Vasco da Gama', stateCode: 'GA' },
  { name: 'Margao', stateCode: 'GA' },
  // Telangana
  { name: 'Hyderabad', stateCode: 'TS' },
  { name: 'Secunderabad', stateCode: 'TS' },
  { name: 'Warangal', stateCode: 'TS' },
  // Tamil Nadu
  { name: 'Chennai', stateCode: 'TN' },
  { name: 'Coimbatore', stateCode: 'TN' },
  { name: 'Madurai', stateCode: 'TN' },
  // West Bengal
  { name: 'Kolkata', stateCode: 'WB' },
  { name: 'Darjeeling', stateCode: 'WB' },
  { name: 'Howrah', stateCode: 'WB' }
];

export const locationService = {
  getStates: () => SUPPORTED_STATES,
  getCitiesOfState: (stateIso: string) => {
    return SUPPORTED_CITIES.filter(c => c.stateCode === stateIso);
  },
  getAllCities: () => SUPPORTED_CITIES,
};
