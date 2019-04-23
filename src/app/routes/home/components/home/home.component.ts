import {Component, OnInit} from '@angular/core';

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
      updatePosition: function(event) {
        let e = event || window.event;
        this.x = e.clientX - this._x;
        this.y = (e.clientY - this._y) * -1;
      },
      setOrigin: function(e) {
        this._x = e.offsetLeft + Math.floor(e.offsetWidth / 2);
        this._y = e.offsetTop + Math.floor(e.offsetHeight / 2);
      },
      show: function() {
        return '(' + this.x + ', ' + this.y + ')';
      }
    };

    // Track the mouse position relative to the center of the container.
    mouse.setOrigin(container);

    //----------------------------------------------------

    let counter = 0;
    let refreshRate = 10;
    let isTimeToUpdate = function() {
      return counter++ % refreshRate === 0;
    };

    //----------------------------------------------------

    let onMouseEnterHandler = function(event) {
      update(event);
    };

    let onMouseLeaveHandler = function() {
      // @ts-ignore
      inner.style = '';
    };

    let onMouseMoveHandler = function(event) {
      if (isTimeToUpdate()) {
        update(event);
      }
    };

    //----------------------------------------------------

    let update = function(event) {
      mouse.updatePosition(event);
      // console.log(mouse.x + ' ' + mouse.y);
      // console.log(Math.abs(mouse.x / window.innerWidth));
      updateTransformStyle(
        (mouse.y / inner.offsetHeight / 2).toFixed(2),
        (mouse.x / inner.offsetWidth / 2).toFixed(2),
        Math.abs(mouse.x / window.innerWidth) * 200
      );
    };

    let updateTransformStyle = function(x, y, styleX) {
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
