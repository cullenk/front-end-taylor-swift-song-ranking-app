// rules.service.ts
import { Injectable } from '@angular/core';
import { EraSetList } from '../interfaces/EraSetList';

@Injectable({
  providedIn: 'root'
})
export class RulesService {
  validateSetList(setList: EraSetList[]): boolean {
    const isValidSongCount = this.validateSongCount(setList);
    const isValidSurpriseSongs = this.validateSurpriseSongs(setList);
    const isValidMashups = this.validateMashups(setList);
    const isValidEraRepresentation = this.validateEraRepresentation(setList);

    console.log('Validation Results:');
    console.log('Song Count:', isValidSongCount);
    console.log('Surprise Songs:', isValidSurpriseSongs);
    console.log('Mashups:', isValidMashups);
    console.log('Era Representation:', isValidEraRepresentation);

    return isValidSongCount && isValidSurpriseSongs && isValidMashups && isValidEraRepresentation;
  }

  private validateSongCount(setList: EraSetList[]): boolean {
    const totalSongs = setList.reduce((count, era) => {
      if (era.era === 'Surprise Songs') return count;
      return count + era.songs.length;
    }, 0);
    return totalSongs === 45;
  }

  private validateSurpriseSongs(setList: EraSetList[]): boolean {
    const surpriseSongs = setList.find(era => era.era === 'Surprise Songs');
    return !!surpriseSongs && surpriseSongs.songs.length === 2;
  }

  private validateMashups(setList: EraSetList[]): boolean {
    const mashups = setList.reduce((count, era) => count + era.songs.filter(song => song.isMashup).length, 0);
    return mashups <= 3;
  }

  private validateEraRepresentation(setList: EraSetList[]): boolean {
    const eras = setList.filter(era => era.era !== 'Surprise Songs');
    return eras.every(era => era.songs.length >= 1 && era.songs.length <= 6);
  }
}
