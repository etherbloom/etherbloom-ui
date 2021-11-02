import {Component, ElementRef, ViewChild} from '@angular/core';

declare const dat: any;

declare global {
  interface Window {
    segmentsMulti: any;
    globalCompositeOperation: any;
    showPolarity: any;
    friction: any;
    colorGravity: any;
    attractionThreshold: any;
    repulsionForce: any;
    squish: any;
    angle: any;
    numParticles: any;
    attractionForce: any;
  }
}

// class Ball {

//   radius: number;
//   point: any;
//   vector: any;
//   polarity: number;
//   color: number;
//   numSegment: number;
//   boundOffset: any[];
//   boundOffsetBuff: any[];
//   sidePoints: any[];
//   path: any;

//   constructor(r: any, p: any, v: any) {
//     this.radius = r;
//     this.point = p;
//     this.vector = v;
//     this.polarity = ~~(Math.random() * 3) - 1;
//     this.color = this.polarity + 1;
//     this.numSegment = Math.floor(r*window.segmentsMulti);
//     this.boundOffset = [];
//     this.boundOffsetBuff = [];
//     this.sidePoints = [];
//     this.path = new paper.Path({
//         fillColor: {
//             hue: 360 / (this.color + 1),
//             saturation: 1,
//             brightness: 1,
//             alpha: 0.5
//         },
//         blendMode: window.globalCompositeOperation
//     });

//     for (var i = 0; i < this.numSegment; i ++) {
//         this.boundOffset.push(this.radius);
//         this.boundOffsetBuff.push(this.radius);
//         //this.path.add(new paper.Point());
//         this.sidePoints.push(new paper.Point({
//             angle: 360 / this.numSegment * i,
//             length: 1
//         }));
//     }
//   }

//   iterate() {
//     this.checkBorders();
//     this.point += this.vector;
//     if(window.showPolarity) {
//       this.path.fillColor.hue = (this.polarity + 1) * 120;
//     } else {
//        this.path.fillColor.hue = (this.color * 360) % 360;
//     }
//     this.path.blendMode = window.globalCompositeOperation
//     this.updateShape();
//     }

//     checkBorders() {
//       var size = this.view.size;
//       if (this.point.x < this.radius) {
//           this.vector = -this.vector/2;
//           this.point.x = this.radius;
//       }
//       else if (this.point.x > size.width - this.radius) {
//         this.vector = -this.vector/2;
//         this.point.x = size.width - this.radius;
//       }

//       if (this.point.y < this.radius) {
//           this.vector = -this.vector/2;
//           this.point.y = this.radius;
//       }
//       else if (this.point.y > size.height - this.radius) {
//           this.vector = -this.vector/2;
//           this.point.y = size.height- this.radius;
//       }
//     }

//     updateShape() {
//         var segments = this.path.segments;
//         for (var i = 0; i < this.numSegment; i ++)
//             segments[i].point = this.getSidePoint(i);

//         this.path.smooth();
//         for (var i = 0; i < this.numSegment; i ++) {
//             if (this.boundOffset[i] < this.radius / 4)
//                 this.boundOffset[i] = this.radius / 4;
//             var next = (i + 1) % this.numSegment;
//             var prev = (i > 0) ? i - 1 : this.numSegment - 1;
//             var offset = this.boundOffset[i];
//             offset += (this.radius - offset) / 15;
//             offset += ((this.boundOffset[next] + this.boundOffset[prev]) / 2 - offset) / 3;
//             this.boundOffsetBuff[i] = this.boundOffset[i] = offset;
//         }
//     }



//     react(b: any) {
//       var dist = this.point.getDistance(b.point);
//       var force = (Math.pow(this.radius, 2) + Math.pow(b.radius, 2)) / Math.pow(dist, 2);
//       var direc = (this.point - b.point);
//       var polarityDelta =  Math.abs(this.polarity - b.polarity) ;
//       polarityDelta = polarityDelta === 0 && this.polarity != 0 ? -1 : polarityDelta;
//       polarityDelta = window.colorGravity ? polarityDelta : 1;
//       if (dist < window.attractionThreshold && dist < this.radius + b.radius && dist != 0) {
//           var overlap = this.radius + b.radius - dist;
//           direc = direc.normalize(overlap * force * window.squish)  * window.repulsionForce;
//           this.vector += direc;
//           b.vector -= direc;

//           var cadj = Math.abs(this.color - b.color);

//           this.color -= cadj / Math.pow(this.radius, 2);
//           b.color += cadj / Math.pow(b.radius, 2);


//       } else {
//           direc = direc.normalize(force * polarityDelta)  * window.attractionForce;
//           this.vector -= direc;
//           b.vector += direc;
//       }

//       this.vector *= 1 - (window.friction);
//       b.vector  *= 1 - (window.friction);

//       this.calcBounds(b);
//       b.calcBounds(this);
//       this.updateBounds();
//       b.updateBounds();
//     }


//     getBoundOffset(b:any) {
//       var diff = this.point - b;
//       var angle = (diff.angle + 180) % 360;
//       return this.boundOffset[Math.floor(angle / 360 * this.boundOffset.length)];
//   }

//   calcBounds(b:any) {
//       for (var i = 0; i < this.numSegment; i ++) {
//           var tp = this.getSidePoint(i);
//           var bLen = b.getBoundOffset(tp);
//           var td = tp.getDistance(b.point);
//           if (td < bLen) {
//               this.boundOffsetBuff[i] -= (bLen  - td) / 2;
//           }
//       }
//   },

//   getSidePoint(index:any) {
//       return this.point + this.sidePoints[index] * this.boundOffset[index];
//   },

//   updateBounds() {
//       for (var i = 0; i < this.numSegment; i ++)
//           this.boundOffset[i] = this.boundOffsetBuff[i];
//   }
// }


@Component({
  selector: 'app-art2',
  template: `<iframe #srt2 height="600" style="width: 100%;" scrolling="no" title="Fractal Nebula" src="https://codepen.io/sschepis/embed/poPzrqW?default-tab=result&theme-id=dark" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/sschepis/pen/poPzrqW">
  Three.js Fractal Nebula</a> by Sebastian Schepis (<a href="https://codepen.io/sschepis">@sschepis</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>`,
  styleUrls: ['./art2.component.css'],
})
export class Art2Component {
  @ViewChild('art2', {static: false}) art2View: ElementRef | undefined;

  constructor() {}

}
