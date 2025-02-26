import { Component, OnInit, Input, AfterViewInit ,ViewChild,ElementRef} from '@angular/core';

@Component({
  selector: 'audio-player',
  templateUrl: './audio-component.component.html',
  styleUrls: ['./audio-component.component.scss']
})
export class AudioComponent implements AfterViewInit {
  @Input() public src: string;
  @Input() public type: string;
  @Input() public autoplay: boolean = false;
  @Input() public showStateLabel: boolean = false;
  public audioStateLabel = 'Audio sample';
  @Input() public volume: number = 1.0; /* 1.0 is loudest */

  @ViewChild('audioElement', { static: false }) public _audioRef:  ElementRef;
  private audio: HTMLMediaElement;

  public constructor() { }

  public pause(): void {
    if (this.audio) {
      this.audio.pause();
      this.audioStateLabel = 'Paused';
    }
  }

  public get paused(): boolean {
    if (this.audio) {
      return this.audio.paused;
    } else {
      return true;
    }
  }

  public play(): void {
    this.getAudioTypeCanPlayType();
    if (this.audio) {
      if (this.audio.readyState >= 2) {
        this.audio.play();
        this.audioStateLabel = 'Playing...'
      }
    }
  }

  public ngAfterViewInit() {
    this.getAudioTypeCanPlayType();
    this.audio = this._audioRef.nativeElement;
    if (this.audio) {
      this.audio.volume = this.volume;
      this.audio.autoplay = this.autoplay;
    }
  }
  getAudioTypeCanPlayType(): void {
    const audioElement = this._audioRef.nativeElement;
    if (!audioElement.src) {
      this.type = 'Unknown (no source)';
      return;
    }
    if (audioElement.src.includes('.m3u8')) {
      this.type = 'application/vnd.apple.mpegurl';
      return;
    }

    const mimeTypesToTest = [
      'audio/mpeg',       // MP3
      'audio/ogg',        // Ogg Vorbis
      'audio/wav',        // WAV
      'audio/aac',        // AAC
      'audio/mp4',        // AAC in MP4 container (often used)
      'application/vnd.apple.mpegurl' // HLS (m3u8) - Native browser support is limited
    ];

    for (const mimeType of mimeTypesToTest) {
      if (audioElement.canPlayType(mimeType)) {
        if (mimeType === 'audio/mpeg') {
          this.type = mimeType;
        } else if (mimeType === 'audio/ogg') {
          this.type = mimeType;
        } else if (mimeType === 'audio/wav') {
          this.type = mimeType;
        } else if (mimeType === 'audio/aac' || mimeType === 'audio/mp4') {
          this.type = mimeType;
        } else if (mimeType === 'application/vnd.apple.mpegurl') {
          this.type = mimeType;
        }
        return; // Found a playable type, exit loop
      }
    }

    this.type = 'Unknown (canPlayType inconclusive)';
  }
}
