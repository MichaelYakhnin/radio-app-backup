import { Component, OnInit} from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import RadioStIsr from '../isr.json';
import RadioStUkr from '../ukr.json';

interface StationImage {
  path: string;
  id: number;
}

@Component({
  selector: "app-radio-player",
  templateUrl: "./radio-player.component.html",
  styleUrls: ["./radio-player.component.scss"]
})

export class RadioPlayerComponent implements OnInit {

  radioStations:{id:string, url:string, name: string}[] = RadioStIsr;
  src: any;
  stImages: StationImage[] = [];
  private queryParamSubscription: Subscription | undefined;
  routeParam: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.queryParamSubscription = this.route.queryParams.subscribe((params) => {
      this.routeParam = params['country']; 
      if(this.routeParam === 'isr'){
        this.radioStations = RadioStIsr;
      } else if(this.routeParam === 'ukr'){
        this.radioStations = RadioStUkr;
      }
      else{
        this.routeParam = 'isr';
      }
      const savedStations = localStorage.getItem('stations'+this.routeParam);
      if (savedStations) {
        this.stImages=JSON.parse(savedStations);
      }
      else{
        this.stImages=[];
      }
    });
   
  }

  play(id):void {
    setTimeout(() => this.src = this.getSrcById(id), 50);
  }
  getSrcById(id: number): any {
    return this.radioStations[id];
  }
  // addToFavorities(id): void {
  //   this.stImages.push({path: 'assets/images/small/' + this.getSrcById(id).id + '.jpg', id: id});
  //   localStorage.setItem('stations',JSON.stringify(this.stImages));
  // }
  addToFavorities(id: number): void {
    const newStation: StationImage = {
      path: `assets/${this.routeParam}/${this.getSrcById(id).id}${this.routeParam=='isr'?'.jpg':'.png'}`,
      id: id
    };
    this.stImages.push(newStation);
    localStorage.setItem('stations'+this.routeParam, JSON.stringify(this.stImages));
  }
  ngOnDestroy(): void {
    if (this.queryParamSubscription) {
      this.queryParamSubscription.unsubscribe();
    }
  }
}

