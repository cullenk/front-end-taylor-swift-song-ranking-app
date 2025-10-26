import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountryFlagsService {
  // Map country names to ISO 3166-1 alpha-2 country codes
  private countryToCodes: { [key: string]: string } = {
    'Afghanistan': 'af',
    'Albania': 'al',
    'Algeria': 'dz',
    'Argentina': 'ar',
    'Armenia': 'am',
    'Australia': 'au',
    'Austria': 'at',
    'Azerbaijan': 'az',
    'Bahrain': 'bh',
    'Bangladesh': 'bd',
    'Belarus': 'by',
    'Belgium': 'be',
    'Bolivia': 'bo',
    'Bosnia and Herzegovina': 'ba',
    'Brazil': 'br',
    'Bulgaria': 'bg',
    'Cambodia': 'kh',
    'Canada': 'ca',
    'Chile': 'cl',
    'China': 'cn',
    'Colombia': 'co',
    'Costa Rica': 'cr',
    'Croatia': 'hr',
    'Cyprus': 'cy',
    'Czech Republic': 'cz',
    'Denmark': 'dk',
    'Dominican Republic': 'do',
    'Ecuador': 'ec',
    'Egypt': 'eg',
    'Estonia': 'ee',
    'Finland': 'fi',
    'France': 'fr',
    'Georgia': 'ge',
    'Germany': 'de',
    'Ghana': 'gh',
    'Greece': 'gr',
    'Guatemala': 'gt',
    'Honduras': 'hn',
    'Hong Kong': 'hk',
    'Hungary': 'hu',
    'Iceland': 'is',
    'India': 'in',
    'Indonesia': 'id',
    'Iran': 'ir',
    'Iraq': 'iq',
    'Ireland': 'ie',
    'Israel': 'il',
    'Italy': 'it',
    'Japan': 'jp',
    'Jordan': 'jo',
    'Kazakhstan': 'kz',
    'Kenya': 'ke',
    'Kuwait': 'kw',
    'Latvia': 'lv',
    'Lebanon': 'lb',
    'Lithuania': 'lt',
    'Luxembourg': 'lu',
    'Malaysia': 'my',
    'Malta': 'mt',
    'Mexico': 'mx',
    'Morocco': 'ma',
    'Netherlands': 'nl',
    'New Zealand': 'nz',
    'Nigeria': 'ng',
    'Norway': 'no',
    'Pakistan': 'pk',
    'Panama': 'pa',
    'Peru': 'pe',
    'Philippines': 'ph',
    'Poland': 'pl',
    'Portugal': 'pt',
    'Qatar': 'qa',
    'Romania': 'ro',
    'Russia': 'ru',
    'Saudi Arabia': 'sa',
    'Serbia': 'rs',
    'Singapore': 'sg',
    'Slovakia': 'sk',
    'Slovenia': 'si',
    'South Africa': 'za',
    'South Korea': 'kr',
    'Spain': 'es',
    'Sri Lanka': 'lk',
    'Sweden': 'se',
    'Switzerland': 'ch',
    'Taiwan': 'tw',
    'Thailand': 'th',
    'Turkey': 'tr',
    'Ukraine': 'ua',
    'United Arab Emirates': 'ae',
    'United Kingdom': 'gb',
    'United States': 'us',
    'Uruguay': 'uy',
    'Venezuela': 've',
    'Vietnam': 'vn',
  };

  getCountryFlagClass(countryName: string | null | undefined): string {
    if (!countryName || 
        countryName.trim() === '' || 
        countryName === 'Select your country' ||
        countryName === 'undefined' ||
        countryName === 'null') {
      return 'fi fi-xx'; // Default flag (unknown country)
    }

    const countryCode = this.countryToCodes[countryName];
    return countryCode ? `fi fi-${countryCode}` : 'fi fi-xx';
  }

  getCountryFlagCode(countryName: string | null | undefined): string {
    if (!countryName || 
        countryName.trim() === '' || 
        countryName === 'Select your country' ||
        countryName === 'undefined' ||
        countryName === 'null') {
      return 'xx';
    }

    return this.countryToCodes[countryName] || 'xx';
  }

  hasCountryFlag(countryName: string | null | undefined): boolean {
    if (!countryName || countryName.trim() === '') {
      return false;
    }
    return this.countryToCodes.hasOwnProperty(countryName);
  }

  getAvailableCountries(): string[] {
    return Object.keys(this.countryToCodes);
  }

  // Backward compatibility - returns CSS class instead of emoji
  getCountryFlag(countryName: string | null | undefined): string {
    return this.getCountryFlagClass(countryName);
  }
}