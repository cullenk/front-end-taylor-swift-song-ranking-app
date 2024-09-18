import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../../../../services/user-profile.service';
import { EraSetList } from '../../../../interfaces/EraSetList';
import { CommonModule } from '@angular/common';

interface EraSetListSong {
  _id: string;
  title: string;
  audioSource: string;
}

@Component({
  selector: 'app-share-setlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './share-set-list.component.html',
  styleUrls: ['./share-set-list.component.scss']
})
export class ShareSetlistComponent implements OnInit {
  setList: EraSetList[] = [];
  username: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userProfileService: UserProfileService
  ) {}

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username');
    this.loadSetList(this.username);
  }

  loadSetList(username: string | null) {
    if (username) {
      this.userProfileService.getErasTourSetListByUsername(username).subscribe(
        (setList) => {
          this.setList = setList;
        },
        (error) => {
          console.error('Error loading set list:', error);
        }
      );
    }
  }

  getAlbumCover(era: string): string {
    const albumCovers: { [key: string]: string } = {
      'Debut': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/Taylor+Swift.jpg',
      'Fearless': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/fearless_taylors_version_album.jpg',
      'Speak Now': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/speak-now-tv.jpg',
      'Red': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/red-tv.jpeg',
      '1989': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/1989.jpeg',
      'Reputation': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/reputation.jpg',
      'Lover': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/lover.jpg',
      'Folklore': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/folklore.jpg',
      'Evermore': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/evermore.jpeg',
      'Midnights': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/MidnightsNoText.png',
      'The Tortured Poets Department': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/ttpd.jpg',
      'Surprise Songs': 'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/surpriseSongs.png'
    };
    return albumCovers[era] || '';
  }

  getSurpriseSongs(songs: EraSetListSong[]): { guitar: EraSetListSong, piano: EraSetListSong } {
    return {
      guitar: songs[0] || { _id: '', title: '', audioSource: '' },
      piano: songs[1] || { _id: '', title: '', audioSource: '' }
    };
  }
}
