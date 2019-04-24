import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    this.mouseFloat();
    this.viewScroll();
  }

  viewScroll() {
    let aboutImages = $('.about-images div');
    let aboutImage1 = $('.about-image-layer1');
    let aboutImage2 = $('.about-image-layer2');

    let answersImages = $('.answers-images div');
    let answersImage1 = $('.answers-image-layer1');
    let answersImage2 = $('.answers-image-layer2');

    let ideasImages = $('.ideas-images div');
    let ideasImage1 = $('.ideas-image-layer1');
    let ideasImage2 = $('.ideas-image-layer2');
    // console.log(scroll);
    $(function () {
      $(window).scroll(function () {
        let scroll = $(window).scrollTop();

        if (scroll >= 700 && scroll <= 1600) {
          aboutImages[0].style.animation = ".66667s .3s forwards slide-downwards cubic-bezier(.71, .01, 0, .9)";
          aboutImages[1].style.animation = " .66667s .3s forwards slide-downwards cubic-bezier(.71, .01, 0, .9)";
          aboutImages[2].style.animation = ".66667s .3s forwards slide-downwards cubic-bezier(.71, .01, 0, .9)";
          aboutImage1[0].style.animation = " .5s .2s forwards slide-upwards cubic-bezier(.71, .01, .38, 1.01)";
          aboutImage2[0].style.animation = ".5s .2s forwards slide-upwards cubic-bezier(.71, .01, .38, 1.01)";
        } else if(scroll >1500 && scroll <=2000){
          answersImages[0].style.animation = "1s .3s forwards slide-downwards cubic-bezier(.71, .01, 0, .9)";
          answersImages[1].style.animation = "1s .3s forwards slide-downwards cubic-bezier(.71, .01, 0, .9)";
          answersImages[2].style.animation = "1s .3s forwards slide-downwards cubic-bezier(.71, .01, 0, .9)";
          answersImage1[0].style.animation = " .5s .2s forwards slide-upwards cubic-bezier(.71, .01, .38, 1.01)";
          answersImage2[0].style.animation = " .5s .2s forwards slide-upwards cubic-bezier(.71, .01, .38, 1.01)";
        } else if(scroll >1800 && scroll <=2600){
          ideasImages[0].style.animation = "1s .3s forwards slide-downwards cubic-bezier(.71, .01, 0, .9)";
          ideasImages[1].style.animation = "1s .3s forwards slide-downwards cubic-bezier(.71, .01, 0, .9)";
          ideasImages[2].style.animation = "1s .3s forwards slide-downwards cubic-bezier(.71, .01, 0, .9)";
          ideasImages[3].style.animation = "2s 1s forwards infinite bob-up-and-down cubic-bezier(.71, .01, 0, .9)";
          ideasImages[3].style.opacity = '1';
          ideasImage1[0].style.animation = " .5s .2s forwards slide-upwards cubic-bezier(.71, .01, .38, 1.01)";
          ideasImage2[0].style.animation = " .5s .2s forwards slide-upwards cubic-bezier(.71, .01, .38, 1.01)";
        }
      });
      let scroll = $(window).scrollTop();

      if (scroll >= 700 && scroll <= 1600) {
        aboutImages[0].style.animation = ".66667s .3s forwards slide-downwards cubic-bezier(.71, .01, 0, .9)";
        aboutImages[1].style.animation = " .66667s .3s forwards slide-downwards cubic-bezier(.71, .01, 0, .9)";
        aboutImages[2].style.animation = ".66667s .3s forwards slide-downwards cubic-bezier(.71, .01, 0, .9)";
        aboutImage1[0].style.animation = " .5s .2s forwards slide-upwards cubic-bezier(.71, .01, .38, 1.01)";
        aboutImage2[0].style.animation = ".5s .2s forwards slide-upwards cubic-bezier(.71, .01, .38, 1.01)";
      } else if(scroll >1500 && scroll <=2000){
        answersImages[0].style.animation = "1s .3s forwards slide-downwards cubic-bezier(.71, .01, 0, .9)";
        answersImages[1].style.animation = "1s .3s forwards slide-downwards cubic-bezier(.71, .01, 0, .9)";
        answersImages[2].style.animation = "1s .3s forwards slide-downwards cubic-bezier(.71, .01, 0, .9)";
        answersImage1[0].style.animation = " .5s .2s forwards slide-upwards cubic-bezier(.71, .01, .38, 1.01)";
        answersImage2[0].style.animation = " .5s .2s forwards slide-upwards cubic-bezier(.71, .01, .38, 1.01)";
      } else if(scroll >1800 && scroll <=2600){
        ideasImages[0].style.animation = "1s .3s forwards slide-downwards cubic-bezier(.71, .01, 0, .9)";
        ideasImages[1].style.animation = "1s .3s forwards slide-downwards cubic-bezier(.71, .01, 0, .9)";
        ideasImages[2].style.animation = "1s .3s forwards slide-downwards cubic-bezier(.71, .01, 0, .9)";
        ideasImages[3].style.animation = "2s 1s forwards infinite bob-up-and-down cubic-bezier(.71, .01, 0, .9)";
        ideasImages[3].style.opacity = '1';
        ideasImage1[0].style.animation = " .5s .2s forwards slide-upwards cubic-bezier(.71, .01, .38, 1.01)";
        ideasImage2[0].style.animation = " .5s .2s forwards slide-upwards cubic-bezier(.71, .01, .38, 1.01)";
      }
    });
  }

  mouseFloat() {
    // Init
    let container = document.getElementsByClassName('container')[0],
      inner = document.getElementById('floatingBox'),
      header = document.getElementById('header-home');

    // Mouse
    let mouse = {
      _x: 0,
      _y: 0,
      x: 0,
      y: 0,
      updatePosition: function (event) {
        let e = event || window.event;
        this.x = e.clientX - this._x;
        this.y = (e.clientY - this._y) * -1;
      },
      setOrigin: function (e) {
        this._x = e.offsetLeft + Math.floor(e.offsetWidth / 2);
        this._y = e.offsetTop + Math.floor(e.offsetHeight / 2);
      },
      show: function () {
        return '(' + this.x + ', ' + this.y + ')';
      }
    };

    // Track the mouse position relative to the center of the container.
    mouse.setOrigin(container);

    //----------------------------------------------------

    let counter = 0;
    let refreshRate = 10;
    let isTimeToUpdate = function () {
      return counter++ % refreshRate === 0;
    };

    //----------------------------------------------------

    let onMouseEnterHandler = function (event) {
      update(event);
    };

    let onMouseLeaveHandler = function () {
      // @ts-ignore
      inner.style = '';
    };

    let onMouseMoveHandler = function (event) {
      if (isTimeToUpdate()) {
        update(event);
      }
    };

    //----------------------------------------------------

    let update = function (event) {
      mouse.updatePosition(event);
      // console.log(mouse.x + ' ' + mouse.y);
      // console.log(Math.abs(mouse.x / window.innerWidth));
      updateTransformStyle(
        (mouse.y / inner.offsetHeight / 2).toFixed(2),
        (mouse.x / inner.offsetWidth / 2).toFixed(2),
        Math.abs(mouse.x / window.innerWidth) * 200
      );
    };

    let updateTransformStyle = function (x, y, styleX) {
      let style = 'rotateX(' + x + 'deg) rotateY(' + y + 'deg)';
      inner.style.transform = style;
      inner.style.webkitTransform = style;
      header.style.backgroundImage = 'linear-gradient(45deg, rgb(88, 231, 245) 0px, rgb(1, 207, 227) ' + Math.abs(styleX) + '%, rgb(79, 59, 219) 100%)';
    };

    //--------------------------------------------------------

    header.onmousemove = onMouseMoveHandler;
    header.onmouseleave = onMouseLeaveHandler;
    header.onmouseenter = onMouseEnterHandler;

  }

}
