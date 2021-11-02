import {Component, ElementRef, Input, AfterViewInit, ViewChild} from '@angular/core';

import {BigNumber} from 'ethers';

import * as paper from 'paper';
import {keccak256, pack} from '@ethersproject/solidity';

const colors = [
  '8f1d58',
  '73388a',
  '4b04e6',
  '0100e4',
  '0cc3ad',
  '00cb00',
  'b3e10d',
  'fff600',
  'fac201',
  'fec200',
  'ff7a01',
  'e43b04',
  'e30504',
];

@Component({
  selector: 'app-bloom',
  template: '<div id="bloom" #bloom></div>',
  styleUrls: ['./bloom.component.css'],
})
export class BloomComponent implements AfterViewInit {

  @ViewChild('bloom', {static: false}) bloomView: ElementRef | undefined;

  // the hash seed and hash of this bloom
  _seed: string = '';
  _hash: string = '';
  _canvas: any;
  @Input() set seed(seed: string) {
    if (this._seed !== seed && seed !== '') {
      this._seed = seed;
      this._hash = keccak256(
        ['string'],
        [ pack(['string'], [seed]) ]
      );
    }
  } get pool() {
    return this._hash;
  }

  ngAfterViewInit() {
    const showBloom: any = () => {
      if (!this.bloomView || !this._hash) {
        setTimeout(() => showBloom(), 100);
        return;
      }
      if (!this._hash) return;
      this._canvas = document.createElement('canvas');
      this.bloomView.nativeElement.appendChild(this._canvas);
      this._canvas.style.width = `320px`;
      this._canvas.style.height = `320px`;
      this.render(this._canvas, this._hash);
    }
    showBloom();
  }
  render(canvas: any, itemId: any) {

    if (!itemId) {
      return;
    }

    const bnItemId = BigNumber.from(itemId);
    itemId = bnItemId.toHexString();

    const canvasWidth = 800;
    const canvasHeight = 800;

    const scope = new paper.PaperScope();
    scope.setup(canvas);
    scope.activate();

    scope.project.activeLayer.remove();

    let itemType = 0;
    let itemOvershoot = 0;
    if (bnItemId.gte(256) && bnItemId.lt(4096)) {
      itemType = 1;
      itemOvershoot = bnItemId.sub(255).toNumber();
    } else if (bnItemId.gte(4096) && bnItemId.lt(8192)) {
      itemType = 2;
      itemOvershoot = bnItemId.sub(255).toNumber();
    }
    if (bnItemId.gte(8192)) {
      itemType = 3;
    }

    const rndColor = () =>
      '#' + colors[Math.round(Math.random() * colors.length)] + 'ff';
    const colorAt = (ndx: number) => '#' + colors[ndx % colors.length] + 'ff';

    let centerSides = 3 + Math.round(Math.random() * 9);
    let centerDiameter = 400 + Math.round(Math.random() * 500);
    const centerPoint = new scope.Point(canvasWidth / 2, canvasHeight / 2);

    const drawFlowerIter = (iter: number, max: number, rot: number) => {
      let petalSides = 3 + Math.round(Math.random() * 9);
      let petalDiameter = 400 + Math.round(Math.random() * 500);
      let centerColor = rndColor();
      let petalColor = rndColor();
      let backShapeColor = rndColor();

      if (itemType === 1) {
        centerSides = 3;
        centerDiameter = 300;
        petalSides = 3;
        petalDiameter = 300 + itemOvershoot * 30;
        petalColor = colorAt(0 + itemOvershoot);
        centerColor = colorAt(1 + itemOvershoot);
        backShapeColor = colorAt(2 + itemOvershoot);
      }
      if (itemType === 2) {
        centerSides = 6;
        centerDiameter = 300;
        petalSides = 6;
        petalDiameter = 300 + itemOvershoot * 60;
        petalColor = colorAt(1 + itemOvershoot);
        centerColor = colorAt(2 + itemOvershoot);
        backShapeColor = colorAt(3 + itemOvershoot);
      }
      if (itemType === 3) {
        petalColor = colorAt(
          parseInt(
            '0x' +
              itemId.substring(itemId.length - 1 - iter, itemId.length - iter)
          )
        );
        centerColor = colorAt(
          parseInt(
            '0x' +
              itemId.substring(
                itemId.length - 2 - iter,
                itemId.length - 1 - iter
              )
          )
        );
        backShapeColor = colorAt(
          parseInt(
            '0x' +
              itemId.substring(
                itemId.length - 3 - iter,
                itemId.length - 2 - iter
              )
          )
        );
        centerSides = parseInt(
          '0x' +
            itemId.substring(itemId.length - 4 - iter, itemId.length - 3 - iter)
        );
        petalSides = parseInt(
          '0x' +
            itemId.substring(itemId.length - 5 - iter, itemId.length - 4 - iter)
        );
        centerDiameter = parseInt(
          '0x' +
            itemId.substring(itemId.length - 7 - iter, itemId.length - 5 - iter)
        );
        petalDiameter = parseInt(
          '0x' +
            itemId.substring(itemId.length - 9 - iter, itemId.length - 7 - iter)
        );
      }

      if (iter === 1) {
        let backShape;
        if (itemType === 1 || itemType === 2) {
          backShape = new scope.Path.Circle(
            centerPoint,
            petalDiameter + centerDiameter
          );
        } else {
          backShape = new scope.Path.RegularPolygon(
            centerPoint,
            centerSides,
            petalDiameter + centerDiameter
          );
        }
        backShape.fillColor = new scope.Color(backShapeColor);
        backShape.blendMode = 'xor';
      }

      const scale = iter;
      const centerPath = new scope.Path.RegularPolygon(
        centerPoint,
        petalSides,
        centerDiameter / scale
      );
      centerPath.rotate(rot);
      centerPath.fillColor = new scope.Color(petalColor);
      centerPath.strokeColor = new scope.Color(petalColor);
      centerPath.strokeWidth = 6 / scale;
      centerPath.blendMode = 'hard-light';
      centerPath.segments.forEach((segment) => {
        const polygon = new scope.Path.RegularPolygon(
          new scope.Point(segment.point.x, segment.point.y),
          petalSides,
          petalDiameter / scale
        );
        polygon.rotate(rot);
        polygon.fillColor = new scope.Color(centerColor);
        polygon.strokeWidth = 60 / scale;
        polygon.blendMode = 'xor';
      });
      if (iter < max) {
        drawFlowerIter(iter + 1, max, rot / 2);
      }
    };

    drawFlowerIter(1, 5, 0);
    //scope.project.activeLayer.draw();
    scope.project.activeLayer.fitBounds(scope.view.bounds);

    return {scope, canvas};
  }

  constructor() {}

}
