import { Component, OnInit } from '@angular/core';
import {LoaderService} from '../../services/loader.service';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  private sub:any;
  show:boolean = false;
  width:number = 0;
  height:number = 0;
  top:number = 0;
  left:number = 0;

  constructor(private loaderService:LoaderService) { }

  ngOnInit() {
    this.sub = this.loaderService.getData().subscribe(loaderModel => {
      this.show = loaderModel==undefined?false:loaderModel.show;
      if(!this.show) return;
      let sz = loaderModel.htmlElement;
      if(sz==undefined) sz = document.body;
      let rec = sz.getBoundingClientRect();
      this.width = sz.clientWidth;
      this.height = sz.clientHeight;
      this.top = rec.top + (window.pageYOffset?window.pageYOffset:document.documentElement.scrollTop);
      this.left = rec.left + (window.pageXOffset?window.pageXOffset:document.documentElement.scrollLeft);
    });
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

}
