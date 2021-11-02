import {Component, AfterViewInit, ElementRef, ViewChild} from '@angular/core';

declare const dat: any;

@Component({
  selector: 'app-art1',
  template: '<div #artparent id="canvasParent"><canvas id="art1" #art1></canvas></div>',
  styleUrls: ['./art1.component.css'],
})
export class Art1Component implements AfterViewInit {
  @ViewChild('art1', {static: false}) art1View: ElementRef | undefined;
  @ViewChild('artparent', { static: false }) artParentView: ElementRef | undefined;

  constructor() {}

  ngAfterViewInit(): void {
    if (!this.art1View) {
      return;
    }
    // standard shim
    var myRequestAnimationFrame =
      window.requestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 10);
      };
    window.requestAnimationFrame = myRequestAnimationFrame;

    const PI = Math.PI;
    const configObject = {
      magnetize : false,
      unbounded : true,
      magnetizeThreshold : 1.0,
      dark : true,
      repelPressure : 0,
      attractionForce : 1,
      frictionx : 0.5,
      frictiony : 0.5,
      trails : true,
      mutableAngles : true,
      attractionThreshold: 1000,
      numParticles: 40
    }

    // dom stuff
    var canvas = this.art1View.nativeElement;
    // canvas.width = window.innerWidth - 20;
    // canvas.height = window.innerHeight - 20;
    var ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'normal';

    function randomMax(max: any) {
      return Math.floor(Math.random() * max);
    }
    function distance(a: any, b: any) {
      var d = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
      return d;
    }

    var numParticles = 100,
      fillStyle;

    var rgbdata = [0, PI / 3, (PI / 3) * 2];
    var cnter = 0;

    class Particle {
      parent;
      ind;
      x;
      y;
      dx;
      dy;
      r;
      a;
      cnt;
      color;
      constructor(ind: any, par: any) {
        this.parent = par;
        this.ind = ind;
        this.x = randomMax(canvas.width);
        this.y = randomMax(canvas.height);
        this.dy = 0;
        this.dx = 0;
        this.r = 1 + ~~(Math.random() * 15);
        this.a = rgbdata[cnter++ % 3];
        this.cnt = 0;
        this.color = '#000';
      }
      draw() {
        this.y += this.dy;
        this.x += this.dx;

        this.color = `hsl(${(this.a / Math.PI) * 2 * 720}, ${100}%, 50%)`;

        var xx = Math.cos(this.a + this.dx + Math.PI / 4) * 8;
        var yy = Math.sin(this.a + this.dy + Math.PI / 4) * 8;

        var fillStyle = ctx.createRadialGradient(
          this.x,
          this.y,
          this.r * 0.001,
          this.x,
          this.y,
          this.r
        );
        fillStyle.addColorStop(0, this.color);
        fillStyle.addColorStop(1, this.color);

        // Set the fill style and draw a rectangle
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.globalAlpha = 0.25 / this.r;
        ctx.arc(this.x, this.y, this.r * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 1;
        ctx.arc(this.x, this.y, this.r / 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class ParticleSystem {
      particles: any = [];
      constructor() {
        for (var i = 0; i < numParticles; i++) {
          this.particles.push(new Particle(i, this));
        }
      }
      draw() {
        if (!configObject.trails) ctx.clearRect(0, 0, canvas.width, canvas.height);
        const pp = [];
        this.particles.forEach((particle: any) => {
          this.particles.forEach((p: any) => {
            var dist =
              Math.pow(particle.y - p.y, 2) + Math.pow(particle.x - p.x, 2);
            var distr = Math.sqrt(dist);
            var partd = particle.r * particle.r + p.r * p.r;
            dist = dist < partd ? partd : dist;
            var bd = particle.dx,
              bdy = particle.dy;
            var distx = particle.x - p.x < 0 ? dist : -dist;
            var disty = particle.y - p.y < 0 ? dist : -dist;

            var ad = particle.a - p.a;
            ad = (PI - Math.abs(ad)) / PI;
            //if (ad === 0.5 && particle.a === (PI * 2) / 3) ad = 0;
            if (ad === 1) ad = 0;
            else if (ad === 0) ad = 1;

            if (distr < configObject.attractionThreshold) {
              var cdx =
                (1 / distx) *
                configObject.attractionForce *
                (distr < configObject.repelPressure ? -ad : ad) *
                particle.r *
                p.r;
              var cdy =
                (1 / disty) *
                configObject.attractionForce *
                (distr < configObject.repelPressure ? -ad : ad) *
                particle.r *
                p.r;

              var fdx = (1000 - configObject.frictionx) / 1000;
              var pdx = Math.cos((particle.a - p.a) / dist) / 100000;
              var pdy = Math.sin((particle.a - p.a) / dist) / 100000;

              cdx /= 10;
              cdy /= 10;
              pdx /= 10;
              pdy /= 10;

              particle.dx += cdx;
              particle.dy += cdy;
              particle.dx *= fdx;
              particle.dy *= fdx;

              particle.dx -= pdx;
              particle.dy -= pdy;

              if (
                configObject.magnetize &&
                distr <= Math.sqrt(partd) + particle.r &&
                Math.abs(particle.a - p.a) >= PI / 2
              ) {
                p.x = particle.x + Math.cos(Math.PI - p.a) * (particle.r + p.r);
                p.y = particle.y + Math.cos(Math.PI - p.a) * (particle.r + p.r);
                p.dx = particle.dx;
                p.dy = particle.dy;
              }
            }

            if (particle.y >= canvas.height) {
              if (configObject.unbounded) particle.y = 0;
              else particle.dy = -particle.dy;
            } else if (particle.y < 0) {
              if (configObject.unbounded) particle.y = canvas.height;
              else particle.dy = -particle.dy;
            }
            if (particle.x >= canvas.width) {
              if (configObject.unbounded) particle.x = 0;
              else particle.dx = -particle.dx;
            } else if (particle.x < 0) {
              if (configObject.unbounded) particle.x = canvas.width;
              else particle.dx = -particle.dx;
            }
            if (configObject.mutableAngles) {
              particle.a += 1 / dist;
            }
          });
          particle.draw();
        });
      }
    }

    var particleSystem = new ParticleSystem();

    configObject.magnetize = false;
    configObject.unbounded = true;
    configObject.magnetizeThreshold = 1.0;
    configObject.dark = true;
    configObject.repelPressure = 0;
    configObject.attractionForce = 10;
    configObject.frictionx = 1;
    configObject.frictiony = 1;
    configObject.trails = true;
    configObject.mutableAngles = true;
    configObject.attractionThreshold = 1000;

    var gui = new dat.GUI({ autoPlace: false });
    if (this.artParentView) {
      var customContainer = this.artParentView.nativeElement;
      customContainer.appendChild(gui.domElement);
    }
    function go() {
      particleSystem = new ParticleSystem();
    }

    gui
      .add(configObject, 'dark')
      .name('Dark')
      .onFinishChange(() => {
        if (!this.art1View || !this.art1View.nativeElement) {
          return;
        }
        this.art1View.nativeElement.style.backgroundColor = configObject.dark
        ? '#000'
        : '#fff';
      });
    gui.add(configObject, 'trails').name('Trails');
    gui.add(configObject, 'unbounded').name('Unbounded');
    gui.add(configObject, 'mutableAngles').name('Mutable A');
    gui.add(configObject, 'magnetize').name('Magnetize');
    gui
      .add(configObject, 'magnetizeThreshold')
      .min(0)
      .max(5)
      .step(0.01)
      .name('Magnetize Threshold');
    gui;
    gui
      .add(configObject, 'numParticles')
      .min(3)
      .max(1500)
      .step(1)
      .name('Count')
      .onFinishChange(go);
    gui
      .add(configObject, 'attractionForce')
      .min(1)
      .max(10000)
      .step(1)
      .name('Attraction Force');
    gui
      .add(configObject, 'attractionThreshold')
      .min(1)
      .max(1000)
      .step(1)
      .name('Attraction Thresh');
    gui
      .add(configObject, 'repelPressure')
      .min(0)
      .max(100)
      .step(1)
      .name('Repel Pressure');
    gui.add(configObject, 'frictionx').min(0).max(1000).step(1).name('Friction X');
    gui.add(configObject, 'frictiony').min(0).max(1000).step(1).name('Friction Y');

    canvas.onclick = function () {
      particleSystem = new ParticleSystem();
    };

    window.onresize =  () => {
      if (!this.art1View || !this.art1View.nativeElement) {
        //canvas.width = window.innerWidth;
        //canvas.height = window.innerHeight;
        ctx.globalCompositeOperation = 'lighter';
        particleSystem = new ParticleSystem();
      }
    };

    (function animloop() {
      particleSystem.draw();
      requestAnimationFrame(animloop);
    })();
  }
}
