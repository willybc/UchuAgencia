import { Component } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
    @ViewChild('videoPlayer') videoplayer!: ElementRef;

    toggleVideo() {
        this.videoplayer.nativeElement.play();
    }
}
