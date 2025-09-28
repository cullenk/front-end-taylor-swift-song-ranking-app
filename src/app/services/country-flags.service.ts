import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountryFlagsService {
  private countryFlags: { [key: string]: string } = {
    Afghanistan: '🇦🇫',
    Albania: '🇦🇱',
    Algeria: '🇩🇿',
    Argentina: '🇦🇷',
    Armenia: '🇦🇲',
    Australia: '🇦🇺',
    Austria: '🇦🇹',
    Azerbaijan: '🇦🇿',
    Bahrain: '🇧🇭',
    Bangladesh: '🇧🇩',
    Belarus: '🇧🇾',
    Belgium: '🇧🇪',
    Bolivia: '🇧🇴',
    'Bosnia and Herzegovina': '🇧🇦',
    Brazil: '🇧🇷',
    Bulgaria: '🇧🇬',
    Cambodia: '🇰🇭',
    Canada: '🇨🇦',
    Chile: '🇨🇱',
    China: '🇨🇳',
    Colombia: '🇨🇴',
    'Costa Rica': '🇨🇷',
    Croatia: '🇭🇷',
    Cyprus: '🇨🇾',
    'Czech Republic': '🇨🇿',
    Denmark: '🇩🇰',
    'Dominican Republic': '🇩🇴',
    Ecuador: '🇪🇨',
    Egypt: '🇪🇬',
    Estonia: '🇪🇪',
    Finland: '🇫🇮',
    France: '🇫🇷',
    Georgia: '🇬🇪',
    Germany: '🇩🇪',
    Ghana: '🇬🇭',
    Greece: '🇬🇷',
    Guatemala: '🇬🇹',
    Honduras: '🇭🇳',
    'Hong Kong': '🇭🇰',
    Hungary: '🇭🇺',
    Iceland: '🇮🇸',
    India: '🇮🇳',
    Indonesia: '🇮🇩',
    Iran: '🇮🇷',
    Iraq: '🇮🇶',
    Ireland: '🇮🇪',
    Israel: '🇮🇱',
    Italy: '🇮🇹',
    Japan: '🇯🇵',
    Jordan: '🇯🇴',
    Kazakhstan: '🇰🇿',
    Kenya: '🇰🇪',
    Kuwait: '🇰🇼',
    Latvia: '🇱🇻',
    Lebanon: '🇱🇧',
    Lithuania: '🇱🇹',
    Luxembourg: '🇱🇺',
    Malaysia: '🇲🇾',
    Malta: '🇲🇹',
    Mexico: '🇲🇽',
    Morocco: '🇲🇦',
    Netherlands: '🇳🇱',
    'New Zealand': '🇳🇿',
    Nigeria: '🇳🇬',
    Norway: '🇳🇴',
    Pakistan: '🇵🇰',
    Panama: '🇵🇦',
    Peru: '🇵🇪',
    Philippines: '🇵🇭',
    Poland: '🇵🇱',
    Portugal: '🇵🇹',
    Qatar: '🇶🇦',
    Romania: '🇷🇴',
    Russia: '🇷🇺',
    'Saudi Arabia': '🇸🇦',
    Serbia: '🇷🇸',
    Singapore: '🇸🇬',
    Slovakia: '🇸🇰',
    Slovenia: '🇸🇮',
    'South Africa': '🇿🇦',
    'South Korea': '🇰🇷',
    Spain: '🇪🇸',
    'Sri Lanka': '🇱🇰',
    Sweden: '🇸🇪',
    Switzerland: '🇨🇭',
    Taiwan: '🇹🇼',
    Thailand: '🇹🇭',
    Turkey: '🇹🇷',
    Ukraine: '🇺🇦',
    'United Arab Emirates': '🇦🇪',
    'United Kingdom': '🇬🇧',
    'United States': '🇺🇸',
    Uruguay: '🇺🇾',
    Venezuela: '🇻🇪',
    Vietnam: '🇻🇳',
  };

  getCountryFlag(countryName: string | null | undefined): string {
    if (!countryName || 
        countryName.trim() === '' || 
        countryName === 'Select your country' ||
        countryName === 'undefined' ||
        countryName === 'null') {
      return '🌍'; // Default globe emoji
    }

    return this.countryFlags[countryName] || '🌍';
  }

  hasCountryFlag(countryName: string | null | undefined): boolean {
    if (!countryName || countryName.trim() === '') {
      return false;
    }
    return this.countryFlags.hasOwnProperty(countryName);
  }

  getAvailableCountries(): string[] {
    return Object.keys(this.countryFlags);
  }
}