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
      backgroundImage: 'url(https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/graphics/song+panels/singles-panel.png)',
      overlay: 'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1))'
    };
  }
}
