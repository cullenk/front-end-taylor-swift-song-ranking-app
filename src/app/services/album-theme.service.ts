import { Injectable } from '@angular/core';
import { albumThemes } from '../interfaces/albumThemes.config';
import { AlbumTheme } from '../interfaces/AlbumTheme';

@Injectable({
  providedIn: 'root'
})
export class AlbumThemeService {
  getTheme(albumTitle: string | undefined): AlbumTheme {
    if (!albumTitle) {
      return this.getDefaultTheme();
    }
    return albumThemes[albumTitle] || this.getDefaultTheme();
  }

  private getDefaultTheme(): AlbumTheme {
    return {
      backgroundImage: 'url(https://d3e29z0m37b0un.cloudfront.net/graphics/song+panels/singles-panel.png)',
      overlay: 'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1))'
    };
  }
}
