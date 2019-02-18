import {
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import * as dat from 'dat.gui';

@Component({
    selector: 'app-weather-effect-lightning',
    templateUrl: './weather-effect-lightning.component.html',
    styleUrls: ['./weather-effect-lightning.component.scss']
})
export class WeatherEffectLightningComponent implements OnInit {
    @Input() viewHeight: number;
    @Input() viewWidth: number;

    @ViewChild('lightningCanvas') lightningCanvasRef: ElementRef;

    public lightningCanvas;

    constructor() { }

    ngOnInit() {
        this.lightningCanvas = this.lightningCanvasRef.nativeElement;
        this.generateLightning();
    }

    // TODO: add interval to render lighting (change flag => hide it by *ngFor), initial: hidden

    // TODO: move to service
    // Heavily simplified version of https://codepen.io/akm2/pen/Aatbf by Akimitsu Hamamuro
    public generateLightning(): void {
        const SimplexNoise = require('simplex-noise');
        const canvas = this.lightningCanvas;

        /** Vector */
        function Vector(x?, y?) {
            this.x = x || 0;
            this.y = y || 0;
        }

        Vector.add = function(a, b) {
            return new Vector(a.x + b.x, a.y + b.y);
        };

        Vector.sub = function(a, b) {
            return new Vector(a.x - b.x, a.y - b.y);
        };

        Vector.prototype = {
            set: function(x, y) {
                if (typeof x === 'object') {
                  y = x.y;
                  x = x.x;
                }

                this.x = x || 0;
                this.y = y || 0;

                return this;
            },

            add: function(v) {
                this.x += v.x;
                this.y += v.y;

                return this;
            },

            sub: function(v) {
                this.x -= v.x;
                this.y -= v.y;

                return this;
            },

            scale: function(s) {
                this.x *= s;
                this.y *= s;

                return this;
            },

            length: function() {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            },

            normalize: function() {
                const len = Math.sqrt(this.x * this.x + this.y * this.y);

                if (len) {
                  this.x /= len;
                  this.y /= len;
                }

                return this;
            },

            angle: function() {
                return Math.atan2(this.y, this.x);
            },

            distanceTo: function(v) {
                const dx = v.x - this.x;
                const dy = v.y - this.y;

                return Math.sqrt(dx * dx + dy * dy);
            },

            distanceToSq: function(v) {
                const dx = v.x - this.x;
                const dy = v.y - this.y;

                return dx * dx + dy * dy;
            },

            clone: function() {
                return new Vector(this.x, this.y);
            }
        };

        /** Point */
        function Point(x, y, radius) {
            Vector.call(this, x, y);
            this.radius = radius || 7;
            // this.vec = new Vector(random(1, -1) || 1, random(1, -1) || 1).normalize();
            this.vec = new Vector(randomNotNull(1, -1), randomNotNull(2, 1)).normalize();
            // this.vec = new Vector(random(1, 0.1), random(1, 0.1)).normalize();
            this._easeRadius = this.radius;
            this._currentRadius = this.radius;
        }

        Point.prototype = (function(o) {
            const s = new Vector(0, 0);

            for (const p in o) {
                if (o.hasOwnProperty(p)) {
                    s[p] = o[p];
                }
            }

            return s;
        })({
            color: 'rgb(255, 255, 255)',
            // dragging: false,
            // _latestDrag: null,

            update: function(points, bounds) {
                const vec = this.vec;

                this._currentRadius = random(this._easeRadius, this._easeRadius * 0.35);
                this._easeRadius += (this.radius - this._easeRadius) * 0.1;

                // if (this.dragging) {
                //     return;
                // }

                for (let i = 0, len = points.length; i < len; i += 1) {
                    const p = points[i];

                    if (p !== this) {
                        const d = this.distanceToSq(p);

                        if (d < 90000) {
                          vec.add(Vector.sub(this, p).normalize().scale(0.03));
                        } else if (d > 250000) {
                          vec.add(Vector.sub(p, this).normalize().scale(0.015));
                        }
                    }
                }

                if (vec.length() > 3) {
                    vec.normalize().scale(3);
                }

                this.add(vec);

                // Controls left/right borders bounds => changes X movement vector
                if (this.x < bounds.x) {
                    this.x = bounds.x;

                    // if (vec.x < 0) {
                    //   vec.x *= -1;
                    // }
                } else if (this.x > bounds.right) {
                    this.x = bounds.right;

                    // if (vec.x > 0) {
                    //   vec.x *= -1;
                    // }
                }

                // Controls top/bottom borders bounds => changes Y movement vector
                if (this.y < bounds.y) {
                    this.y = bounds.y;

                    // if (vec.y < 0) {
                    //   vec.y *= -1;
                    // }
                } else if (this.y > bounds.bottom) {
                    this.y = bounds.bottom;

                    // if (vec.y > 0) {
                    //   vec.y *= -1;
                    // }
                }
            },

            draw: function(ctx) {
                ctx.save();
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this._currentRadius, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.shadowBlur = 20;
                ctx.shadowColor = this.color;
                ctx.fillStyle = 'rgba(0, 0, 0, 1)';
                ctx.globalCompositeOperation = 'lighter';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this._currentRadius, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.restore();
            }
        });

        /** Lightning */
        function Lightning(startPoint?, endPoint?, step?) {
            this.startPoint = startPoint || new Vector();
            this.endPoint = endPoint || new Vector();
            this.step = step || 45;
            this.children = [];
        }

        // TODO: adjust visualisation properties here (mainly speed), also add interval of occurrences
        Lightning.prototype = {
            color: 'rgba(255, 255, 255, 1)',
            speed: 0.025,
            amplitude: 1,
            lineWidth: 5,
            blur: 50,
            blurColor: 'rgba(255, 255, 255, 0.5)',
            points: null,
            off: 0,
            _simplexNoise: new SimplexNoise(),
            parent: null,
            startStep: 0,
            endStep: 0,

            length: function() {
                return this.startPoint.distanceTo(this.endPoint);
            },

            setChildNum: function(num) {
                const children = this.children;
                const len = this.children.length;

                if (len > num) {
                    for (let i = num; i < len; i += 1) {
                        children[i].dispose();
                    }

                    children.splice(num, len - num);
                } else {
                    for (let i = len; i < num; i += 1) {
                        const child = new Lightning();

                        child._setAsChild(this);
                        children.push(child);
                    }
                }
            },

            update: function() {
                const startPoint = this.startPoint;
                const endPoint = this.endPoint;
                let length;
                let normal;
                let radian;
                let sinv;
                let cosv;
                let points;
                let off;
                let waveWidth;
                let children;

                if (this.parent) {
                    if (this.endStep > this.parent.step) {
                        this._updateStepsByParent();
                    }

                    // TODO: update only end step (old X + step)
                    startPoint.set(this.parent.points[this.startStep]);
                    endPoint.set(this.parent.points[this.endStep]);
                }

                length = this.length();
                normal = Vector.sub(endPoint, startPoint).normalize().scale(length / this.step);
                radian = normal.angle();
                sinv = Math.sin(radian);
                cosv = Math.cos(radian);
                points = this.points = [];
                off = this.off += random(this.speed, this.speed * 0.2);
                waveWidth = (this.parent ? length * 1.5 : length) * this.amplitude;

                if (waveWidth > 750) {
                    waveWidth = 750;
                }

                for (let i = 0, len = this.step + 1; i < len; i += 1) {
                    const n = i / 60;

                    const av = waveWidth * this._noise(n - off, 0) * 0.5;
                    const ax = sinv * av;
                    const ay = cosv * av;

                    const bv = waveWidth * this._noise(n + off, 0) * 0.5;
                    const bx = sinv * bv;
                    const by = cosv * bv;

                    const m = Math.sin((Math.PI * (i / (len - 1))));

                    const x = startPoint.x + normal.x * i + (ax - bx) * m;
                    const y = startPoint.y + normal.y * i - (ay - by) * m;

                    points.push(new Vector(x, y));
                }

                children = this.children;

                for (let i = 0, len = children.length; i < len; i += 1) {
                    const child = children[i];
                    child.color = this.color;
                    child.speed = this.speed * 1.35;
                    child.amplitude = this.amplitude;
                    child.lineWidth = this.lineWidth * 0.75;
                    child.blur = this.blur;
                    child.blurColor = this.blurColor;
                    children[i].update();
                }
            },

            draw: function(ctx) {
                const points = this.points;
                const children = this.children;

                if (this.blur) {
                    ctx.save();
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.fillStyle   = 'rgba(0, 0, 0, 1)';
                    ctx.shadowBlur  = this.blur;
                    ctx.shadowColor = this.blurColor;
                    ctx.beginPath();

                    for (let i = 0, len = points.length; i < len; i += 1) {
                        const p = points[i];
                        const d = len > 1 ? p.distanceTo(points[i === len - 1 ? i - 1 : i + 1]) : 0;
                        ctx.moveTo(p.x + d, p.y);
                        ctx.arc(p.x, p.y, d, 0, Math.PI * 2, false);
                    }

                    ctx.fill();
                    ctx.restore();
                }

                ctx.save();
                ctx.lineWidth = random(this.lineWidth, 0.5);
                ctx.strokeStyle = this.color;
                ctx.beginPath();

                for (let i = 0, len = points.length; i < len; i += 1) {
                    const p = points[i];
                    ctx[i === 0 ? 'moveTo' : 'lineTo'](p.x, p.y);
                }

                ctx.stroke();
                ctx.restore();

                for (let i = 0, len = this.children.length; i < len; i += 1) {
                    children[i].draw(ctx);
                }
            },

            dispose: function() {
                if (this._timeoutId) {
                    clearTimeout(this._timeoutId);
                }

                this._simplexNoise = null;
            },

            _noise: function(v) {
                const octaves = 6;
                const fallout = 0.5;
                let amp = 1;
                let f = 1;
                let sum = 0;

                for (let i = 0; i < octaves; ++i) {
                    amp *= fallout;
                    sum += amp * (this._simplexNoise.noise2D(v * f, 0) + 1) * 0.5;
                    f *= 2;
                }

                return sum;
            },

            _setAsChild: function(lightning) {
                if (!(lightning instanceof Lightning)) {
                    return;
                }

                this.parent = lightning;

                const self = this;
                const setTimer = function() {
                    self._updateStepsByParent();
                    self._timeoutId = setTimeout(setTimer, randomInteger(1500));
                };

                self._timeoutId = setTimeout(setTimer, randomInteger(1500));
            },

            _updateStepsByParent: function() {
                if (!this.parent) {
                    return;
                }

                const parentStep = this.parent.step;

                this.startStep = randomInteger(parentStep - 2);
                this.endStep = this.startStep + randomInteger(parentStep - this.startStep - 2) + 2;
                this.step = this.endStep - this.startStep;
            }
        };

        /** Rect */
        function Rect(x, y, width, height) {
            this.x = x || 0;
            this.y = y || 0;
            this.width  = width || 0;
            this.height = height || 0;
            this.right  = this.x + this.width;
            this.bottom = this.y + this.height;
        }

        // Helpers
        function random(max, min) {
            if (typeof max !== 'number') {
                return Math.random();
            } else if (typeof min !== 'number') {
                min = 0;
            }

            return Math.random() * (max - min) + min;
        }

        function randomInteger(max?, min?) {
            if (!max) {
                return 0;
            }

            return random(max + 1, min) | 0;  // tslint:disable-line
        }

        function randomNotNull(max, min) {
            let result;

            if (typeof max !== 'number') {
                return Math.random();
            } else if (typeof min !== 'number') {
                min = 0;
            }

            result = Math.random() * (max - min) + min;

            return (result !== 0) ? result : (Math.random() + 0.1);
        }

        // Initialize
        (function() {
            let context;
            let centerX;
            let centerY;
            let grad;
            // let mouse;
            let bounds;
            let points;
            let lightning;
            let gui;
            let control;
            let startX;

            // Event Listeners
            function resize() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                centerX = canvas.width * 0.5;
                centerY = canvas.height * 0.5;
                context = canvas.getContext('2d');
                grad = context.createRadialGradient(
                    centerX,
                    centerY,
                    0,
                    centerX,
                    centerY,
                    Math.sqrt(centerX * centerX + centerY * centerY),
                );
                grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
                grad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
            }

            // TODO: delete, implement method to generate start/end points
            // function mouseMove(e) {
            //     let hit = false;
            //
            //     mouse.set(e.clientX, e.clientY);
            //
            //     for (let i = 0; i < 2; i += 1) {
            //         if ((!hit && points[i].hitTest(mouse)) || points[i].dragging) {
            //             hit = true;
            //         }
            //     }
            //
            //     document.body.style.cursor = hit ? 'pointer' : 'default';
            // }

            // TODO: delete
            // function mouseDown(e) {
            //     for (let i = 0; i < 2; i += 1) {
            //         if (points[i].hitTest(mouse)) {
            //             points[i].startDrag();
            //             return;
            //         }
            //     }
            // }

            // TODO: delete
            // function mouseUp(e) {
            //     for (let i = 0; i < 2; i += 1) {
            //         if (points[i].dragging) {
            //             points[i].endDrag();
            //         }
            //     }
            // }

            // GUI Control
            control = {
                childNum: 3,
                color: [255, 255, 255],
                backgroundColor: '#0b5693',
            };

            // Init
            resize();

            bounds = new Rect(0, 0, canvas.width, canvas.height);
            // mouse = new Vector();

            lightning = new Lightning();


            // TODO: set random X and Y for start and end points here
            // Point(X, Y, point size)
            // startpoint === endpoint
            // points = [
            //     new Point(centerX - 200, centerY, lightning.lineWidth * 0.25),
            //     new Point(centerX + 200, centerY, lightning.lineWidth * 0.25),
            // ];

            startX = random(canvas.width, 0);

            points = [
                new Point(startX, 0, lightning.lineWidth * 0.25),
                new Point(startX, 0, lightning.lineWidth * 0.25),
            ];

            lightning.startPoint.set(points[0]);
            lightning.endPoint.set(points[1]);
            lightning.setChildNum(3);

            // canvas.addEventListener('mousemove', mouseMove, false);
            // canvas.addEventListener('mousedown', mouseDown, false);
            // canvas.addEventListener('mouseup', mouseUp, false);

            // GUI
            gui = new dat.GUI();
            gui.add(lightning, 'amplitude', 0, 2).name('Amplitude');
            gui.add(lightning, 'speed', 0, 0.1).name('Speed');
            gui.add(control, 'childNum', 0, 10).step(1).name('Child Num').onChange(function() {
                lightning.setChildNum(control.childNum | 0);  // tslint:disable-line
            });
            gui.addColor(control, 'color').name('Color').onChange(function() {
                const c = control.color;
                const r = (c[0] || 0) | 0;    // tslint:disable-line
                const g = (c[1] || 0) | 0;    // tslint:disable-line
                const b = (c[2] || 0) | 0;    // tslint:disable-line

                lightning.color = 'rgb(' + r + ',' + g + ',' + b + ')';
                lightning.blurColor = 'rgba(' + r + ',' + g + ',' + b + ', 0.5)';

                for (let i = 0, len = points.length; i < len; i += 1) {
                    points[i].color = lightning.color;
                }
            });
            gui.add(lightning, 'lineWidth', 1, 10).name('Line Width').onChange(function() {
                for (let i = 0, len = points.length; i < len; i++) {
                    points[i].radius = lightning.lineWidth * 1.25;
                }
            });
            gui.add(lightning, 'blur', 0, 100).name('Blur');
            gui.addColor(control, 'backgroundColor').name('Background');
            gui.close();

            // Start Update
            const loop = function() {
                context.save();
                context.fillStyle = control.backgroundColor;
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.fillStyle = grad;
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.restore();

                // updating only lightning endpoint
                // lightning.startPoint.set(points[0]);
                lightning.endPoint.set(points[1]);
                lightning.step = Math.ceil(lightning.length() / 10);

                if (lightning.step < 5) {
                    lightning.step = 5;
                }

                lightning.update();
                lightning.draw(context);

                // for (let i = 0; i < 2; i += 1) {
                //     const p = points[i];
                //
                //     // if (p.dragging) {
                //     //     p.drag(mouse);
                //     // }
                //
                //     // p.update(points, bounds);
                //     p.draw(context);
                // }

                // updating only lightning endpoint
                points[1].update(points, bounds);
                points[1].draw(context);

                // requestAnimationFrame(loop);

                if (points[1].y < canvas.height + 20) {
                    requestAnimationFrame(loop);
                } else {
                    // TODO: reset lightning on timer here
                    console.log('Finished!');
                    lightning.dispose();
                    lightning = new Lightning();
                }
            };

            loop();
        })();
    }





    // // TODO: move to service
    // // Taken from https://codepen.io/akm2/pen/Aatbf by Akimitsu Hamamuro
    // public generateLightning(): void {
    //     const SimplexNoise = require('simplex-noise');
    //     const canvas = this.lightningCanvas;
    //
    //     /**
    //      * Vector
    //      */
    //     function Vector(x?, y?) {
    //         this.x = x || 0;
    //         this.y = y || 0;
    //     }
    //
    //     Vector.add = function(a, b) {
    //         return new Vector(a.x + b.x, a.y + b.y);
    //     };
    //
    //     Vector.sub = function(a, b) {
    //         return new Vector(a.x - b.x, a.y - b.y);
    //     };
    //
    //     Vector.prototype = {
    //         set: function(x, y) {
    //             if (typeof x === 'object') {
    //                 y = x.y;
    //                 x = x.x;
    //             }
    //
    //             this.x = x || 0;
    //             this.y = y || 0;
    //
    //             return this;
    //         },
    //
    //         add: function(v) {
    //             this.x += v.x;
    //             this.y += v.y;
    //
    //             return this;
    //         },
    //
    //         sub: function(v) {
    //             this.x -= v.x;
    //             this.y -= v.y;
    //
    //             return this;
    //         },
    //
    //         scale: function(s) {
    //             this.x *= s;
    //             this.y *= s;
    //
    //             return this;
    //         },
    //
    //         length: function() {
    //             return Math.sqrt(this.x * this.x + this.y * this.y);
    //         },
    //
    //         normalize: function() {
    //             const len = Math.sqrt(this.x * this.x + this.y * this.y);
    //
    //             if (len) {
    //                 this.x /= len;
    //                 this.y /= len;
    //             }
    //
    //             return this;
    //         },
    //
    //         angle: function() {
    //             return Math.atan2(this.y, this.x);
    //         },
    //
    //         distanceTo: function(v) {
    //             const dx = v.x - this.x;
    //             const dy = v.y - this.y;
    //
    //             return Math.sqrt(dx * dx + dy * dy);
    //         },
    //
    //         distanceToSq: function(v) {
    //             const dx = v.x - this.x;
    //             const dy = v.y - this.y;
    //
    //             return dx * dx + dy * dy;
    //         },
    //
    //         clone: function() {
    //             return new Vector(this.x, this.y);
    //         }
    //     };
    //
    //     /**
    //      * Point
    //      */
    //     function Point(x, y, radius) {
    //         Vector.call(this, x, y);
    //
    //         this.radius = radius || 7;
    //         this.vec = new Vector(random(1, -1), random(1, -1)).normalize();
    //         this._easeRadius    = this.radius;
    //         this._currentRadius = this.radius;
    //     }
    //
    //     Point.prototype = (function(o) {
    //         const s = new Vector(0, 0);
    //
    //         for (const p in o) {
    //             if (o.hasOwnProperty(p)) {
    //                 s[p] = o[p];
    //             }
    //         }
    //
    //         return s;
    //     })({
    //         color: 'rgb(255, 255, 255)',
    //         dragging: false,
    //         _latestDrag: null,
    //
    //         update: function(points, bounds) {
    //             const vec = this.vec;
    //
    //             this._currentRadius = random(this._easeRadius, this._easeRadius * 0.35);
    //             this._easeRadius += (this.radius - this._easeRadius) * 0.1;
    //
    //             if (this.dragging) {
    //                 return;
    //             }
    //
    //             for (let i = 0, len = points.length; i < len; i += 1) {
    //                 const p = points[i];
    //
    //                 if (p !== this) {
    //                     const d = this.distanceToSq(p);
    //
    //                     if (d < 90000) {
    //                         vec.add(Vector.sub(this, p).normalize().scale(0.03));
    //                     } else if (d > 250000) {
    //                         vec.add(Vector.sub(p, this).normalize().scale(0.015));
    //                     }
    //                 }
    //             }
    //
    //             if (vec.length() > 3) {
    //                 vec.normalize().scale(3);
    //             }
    //
    //             this.add(vec);
    //
    //             if (this.x < bounds.x) {
    //                 this.x = bounds.x;
    //
    //                 if (vec.x < 0) {
    //                     vec.x *= -1;
    //                 }
    //             } else if (this.x > bounds.right) {
    //                 this.x = bounds.right;
    //
    //                 if (vec.x > 0) {
    //                     vec.x *= -1;
    //                 }
    //             }
    //
    //             if (this.y < bounds.y) {
    //                 this.y = bounds.y;
    //
    //                 if (vec.y < 0) {
    //                     vec.y *= -1;
    //                 }
    //             } else if (this.y > bounds.bottom) {
    //                 this.y = bounds.bottom;
    //
    //                 if (vec.y > 0) {
    //                     vec.y *= -1;
    //                 }
    //             }
    //         },
    //
    //         hitTest: function(p) {
    //             if (this.distanceToSq(p) < 900) {
    //                 this._easeRadius = this.radius * 2.5;
    //                 return true;
    //             }
    //
    //             return false;
    //         },
    //
    //         startDrag: function() {
    //             this.dragging = true;
    //             this.vec.set(0, 0);
    //             this._latestDrag = new Vector().set(this);
    //         },
    //
    //         drag: function(p) {
    //             this._latestDrag.set(this);
    //             this.set(p);
    //         },
    //
    //         endDrag: function() {
    //             this.vec = Vector.sub(this, this._latestDrag);
    //             this.dragging = false;
    //         },
    //
    //         draw: function(ctx) {
    //             ctx.save();
    //             ctx.fillStyle = this.color;
    //             ctx.beginPath();
    //             ctx.arc(this.x, this.y, this._currentRadius, 0, Math.PI * 2, false);
    //             ctx.fill();
    //             ctx.shadowBlur  = 20;
    //             ctx.shadowColor = this.color;
    //             ctx.fillStyle   = 'rgba(0, 0, 0, 1)';
    //             ctx.globalCompositeOperation = 'lighter';
    //             ctx.beginPath();
    //             ctx.arc(this.x, this.y, this._currentRadius, 0, Math.PI * 2, false);
    //             ctx.fill();
    //             ctx.restore();
    //         }
    //     });
    //
    //     /**
    //      * Lightning
    //      */
    //     function Lightning(startPoint?, endPoint?, step?) {
    //         this.startPoint = startPoint || new Vector();
    //         this.endPoint = endPoint || new Vector();
    //         this.step = step || 45;
    //         this.children = [];
    //     }
    //
    //     Lightning.prototype = {
    //         color: 'rgba(255, 255, 255, 1)',
    //         speed: 0.025,
    //         amplitude: 1,
    //         lineWidth: 5,
    //         blur: 50,
    //         blurColor: 'rgba(255, 255, 255, 0.5)',
    //         points: null,
    //         off: 0,
    //         _simplexNoise: new SimplexNoise(),
    //         // Case by child
    //         parent: null,
    //         startStep: 0,
    //         endStep: 0,
    //
    //         length: function() {
    //             return this.startPoint.distanceTo(this.endPoint);
    //         },
    //
    //         setChildNum: function(num) {
    //             const children = this.children;
    //             const len = this.children.length;
    //
    //             if (len > num) {
    //                 for (let i = num; i < len; i += 1) {
    //                     children[i].dispose();
    //                 }
    //
    //                 children.splice(num, len - num);
    //             } else {
    //                 for (let i = len; i < num; i += 1) {
    //                     const child = new Lightning();
    //
    //                     child._setAsChild(this);
    //                     children.push(child);
    //                 }
    //             }
    //         },
    //
    //         update: function() {
    //             const startPoint = this.startPoint;
    //             const endPoint = this.endPoint;
    //             let length;
    //             let normal;
    //             let radian;
    //             let sinv;
    //             let cosv;
    //             let points;
    //             let off;
    //             let waveWidth;
    //             let children;
    //
    //             if (this.parent) {
    //                 if (this.endStep > this.parent.step) {
    //                     this._updateStepsByParent();
    //                 }
    //
    //                 startPoint.set(this.parent.points[this.startStep]);
    //                 endPoint.set(this.parent.points[this.endStep]);
    //             }
    //
    //             length = this.length();
    //             normal = Vector.sub(endPoint, startPoint).normalize().scale(length / this.step);
    //             radian = normal.angle();
    //             sinv = Math.sin(radian);
    //             cosv = Math.cos(radian);
    //             points = this.points = [];
    //             off = this.off += random(this.speed, this.speed * 0.2);
    //             waveWidth = (this.parent ? length * 1.5 : length) * this.amplitude;
    //
    //             if (waveWidth > 750) {
    //                 waveWidth = 750;
    //             }
    //
    //             for (let i = 0, len = this.step + 1; i < len; i += 1) {
    //                 const n = i / 60;
    //
    //                 const av = waveWidth * this._noise(n - off, 0) * 0.5;
    //                 const ax = sinv * av;
    //                 const ay = cosv * av;
    //
    //                 const bv = waveWidth * this._noise(n + off, 0) * 0.5;
    //                 const bx = sinv * bv;
    //                 const by = cosv * bv;
    //
    //                 const m = Math.sin((Math.PI * (i / (len - 1))));
    //
    //                 const x = startPoint.x + normal.x * i + (ax - bx) * m;
    //                 const y = startPoint.y + normal.y * i - (ay - by) * m;
    //
    //                 points.push(new Vector(x, y));
    //             }
    //
    //             children = this.children;
    //
    //             for (let i = 0, len = children.length; i < len; i += 1) {
    //                 const child = children[i];
    //
    //                 child.color     = this.color;
    //                 child.speed     = this.speed * 1.35;
    //                 child.amplitude = this.amplitude;
    //                 child.lineWidth = this.lineWidth * 0.75;
    //                 child.blur      = this.blur;
    //                 child.blurColor = this.blurColor;
    //                 children[i].update();
    //             }
    //         },
    //
    //         draw: function(ctx) {
    //             const points = this.points;
    //             const children = this.children;
    //
    //             // Blur
    //             if (this.blur) {
    //                 ctx.save();
    //                 ctx.globalCompositeOperation = 'lighter';
    //                 ctx.fillStyle   = 'rgba(0, 0, 0, 1)';
    //                 ctx.shadowBlur  = this.blur;
    //                 ctx.shadowColor = this.blurColor;
    //                 ctx.beginPath();
    //
    //                 for (let i = 0, len = points.length; i < len; i += 1) {
    //                     const p = points[i];
    //                     const d = len > 1 ? p.distanceTo(points[i === len - 1 ? i - 1 : i + 1]) : 0;
    //                     ctx.moveTo(p.x + d, p.y);
    //                     ctx.arc(p.x, p.y, d, 0, Math.PI * 2, false);
    //                 }
    //
    //                 ctx.fill();
    //                 ctx.restore();
    //             }
    //
    //             ctx.save();
    //             ctx.lineWidth = random(this.lineWidth, 0.5);
    //             ctx.strokeStyle = this.color;
    //             ctx.beginPath();
    //
    //             for (let i = 0, len = points.length; i < len; i += 1) {
    //                 const p = points[i];
    //                 ctx[i === 0 ? 'moveTo' : 'lineTo'](p.x, p.y);
    //             }
    //
    //             ctx.stroke();
    //             ctx.restore();
    //
    //             // Draw children
    //             for (let i = 0, len = this.children.length; i < len; i += 1) {
    //                 children[i].draw(ctx);
    //             }
    //         },
    //
    //         dispose: function() {
    //             if (this._timeoutId) {
    //                 clearTimeout(this._timeoutId);
    //             }
    //
    //             this._simplexNoise = null;
    //         },
    //
    //         _noise: function(v) {
    //             const octaves = 6;
    //             const fallout = 0.5;
    //             let amp = 1;
    //             let f = 1;
    //             let sum = 0;
    //
    //             for (let i = 0; i < octaves; ++i) {
    //                 amp *= fallout;
    //                 sum += amp * (this._simplexNoise.noise2D(v * f, 0) + 1) * 0.5;
    //                 f *= 2;
    //             }
    //
    //             return sum;
    //         },
    //
    //         _setAsChild: function(lightning) {
    //             if (!(lightning instanceof Lightning)) {
    //                 return;
    //             }
    //
    //             this.parent = lightning;
    //
    //             const self = this;
    //             const setTimer = function() {
    //                 self._updateStepsByParent();
    //                 self._timeoutId = setTimeout(setTimer, randomInteger(1500));
    //             };
    //
    //             self._timeoutId = setTimeout(setTimer, randomInteger(1500));
    //         },
    //
    //         _updateStepsByParent: function() {
    //             if (!this.parent) {
    //                 return;
    //             }
    //
    //             const parentStep = this.parent.step;
    //
    //             this.startStep = randomInteger(parentStep - 2);
    //             this.endStep = this.startStep + randomInteger(parentStep - this.startStep - 2) + 2;
    //             this.step = this.endStep - this.startStep;
    //         }
    //     };
    //
    //     /**
    //      * Rect
    //      */
    //     function Rect(x, y, width, height) {
    //         this.x = x || 0;
    //         this.y = y || 0;
    //         this.width  = width || 0;
    //         this.height = height || 0;
    //         this.right  = this.x + this.width;
    //         this.bottom = this.y + this.height;
    //     }
    //
    //     // Helpers
    //     function random(max, min) {
    //         if (typeof max !== 'number') {
    //             return Math.random();
    //         } else if (typeof min !== 'number') {
    //             min = 0;
    //         }
    //
    //         return Math.random() * (max - min) + min;
    //     }
    //
    //     function randomInteger(max?, min?) {
    //         if (!max) {
    //             return 0;
    //         }
    //
    //         return random(max + 1, min) | 0;  // tslint:disable-line
    //     }
    //
    //     // Initialize
    //     (function() {
    //         // let canvas;
    //         let context;
    //         let centerX;
    //         let centerY;
    //         let grad;
    //         let mouse;
    //         let bounds;
    //         let points;
    //         let lightning;
    //         let gui;
    //         let control;
    //
    //         // Event Listeners
    //         function resize() {
    //             canvas.width  = window.innerWidth;
    //             canvas.height = window.innerHeight;
    //             centerX = canvas.width * 0.5;
    //             centerY = canvas.height * 0.5;
    //             context = canvas.getContext('2d');
    //             grad = context.createRadialGradient(
    //                 centerX,
    //                 centerY,
    //                 0,
    //                 centerX,
    //                 centerY,
    //                 Math.sqrt(centerX * centerX + centerY * centerY)
    //             );
    //             grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    //             grad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    //         }
    //
    //         // TODO: delete, implement method to generate start/end points
    //         function mouseMove(e) {
    //             let hit = false;
    //
    //             mouse.set(e.clientX, e.clientY);
    //
    //             for (let i = 0; i < 2; i += 1) {
    //                 if ((!hit && points[i].hitTest(mouse)) || points[i].dragging) {
    //                     hit = true;
    //                 }
    //             }
    //
    //             document.body.style.cursor = hit ? 'pointer' : 'default';
    //         }
    //
    //         // TODO: delete
    //         function mouseDown(e) {
    //             for (let i = 0; i < 2; i += 1) {
    //                 if (points[i].hitTest(mouse)) {
    //                     points[i].startDrag();
    //                     return;
    //                 }
    //             }
    //         }
    //
    //         // TODO: delete
    //         function mouseUp(e) {
    //             for (let i = 0; i < 2; i += 1) {
    //                 if (points[i].dragging) {
    //                     points[i].endDrag();
    //                 }
    //             }
    //         }
    //
    //         // GUI Control
    //         control = {
    //             childNum: 3,
    //             color: [255, 255, 255],
    //             backgroundColor: '#0b5693'
    //         };
    //
    //         // Init
    //         // canvas = document.getElementById('c');
    //
    //         // window.addEventListener('resize', resize, false);
    //         resize();
    //
    //         bounds = new Rect(0, 0, canvas.width, canvas.height);
    //         mouse = new Vector();
    //
    //         lightning = new Lightning();
    //
    //         points = [
    //             new Point(centerX - 200, centerY, lightning.lineWidth * 1.25),
    //             new Point(centerX + 200, centerY, lightning.lineWidth * 1.25)
    //         ];
    //
    //         lightning.startPoint.set(points[0]);
    //         lightning.endPoint.set(points[1]);
    //         lightning.setChildNum(3);
    //
    //         canvas.addEventListener('mousemove', mouseMove, false);
    //         canvas.addEventListener('mousedown', mouseDown, false);
    //         canvas.addEventListener('mouseup', mouseUp, false);
    //
    //         // GUI
    //         gui = new dat.GUI();
    //         gui.add(lightning, 'amplitude', 0, 2).name('Amplitude');
    //         gui.add(lightning, 'speed', 0, 0.1).name('Speed');
    //         gui.add(control, 'childNum', 0, 10).step(1).name('Child Num').onChange(function() {
    //             lightning.setChildNum(control.childNum | 0);  // tslint:disable-line
    //         });
    //         gui.addColor(control, 'color').name('Color').onChange(function() {
    //             const c = control.color;
    //             const r = (c[0] || 0) | 0;    // tslint:disable-line
    //             const g = (c[1] || 0) | 0;    // tslint:disable-line
    //             const b = (c[2] || 0) | 0;    // tslint:disable-line
    //
    //             lightning.color = 'rgb(' + r + ',' + g + ',' + b + ')';
    //             lightning.blurColor = 'rgba(' + r + ',' + g + ',' + b + ', 0.5)';
    //
    //             for (let i = 0, len = points.length; i < len; i += 1) {
    //                 points[i].color = lightning.color;
    //             }
    //         });
    //         gui.add(lightning, 'lineWidth', 1, 10).name('Line Width').onChange(function() {
    //             for (let i = 0, len = points.length; i < len; i++) {
    //                 points[i].radius = lightning.lineWidth * 1.25;
    //             }
    //         });
    //         gui.add(lightning, 'blur', 0, 100).name('Blur');
    //         gui.addColor(control, 'backgroundColor').name('Background');
    //         gui.close();
    //
    //         // Start Update
    //         const loop = function() {
    //             context.save();
    //             context.fillStyle = control.backgroundColor;
    //             context.fillRect(0, 0, canvas.width, canvas.height);
    //             context.fillStyle = grad;
    //             context.fillRect(0, 0, canvas.width, canvas.height);
    //             context.restore();
    //
    //             lightning.startPoint.set(points[0]);
    //             lightning.endPoint.set(points[1]);
    //             lightning.step = Math.ceil(lightning.length() / 10);
    //
    //             if (lightning.step < 5) {
    //                 lightning.step = 5;
    //             }
    //
    //             lightning.update();
    //             lightning.draw(context);
    //
    //             for (let i = 0; i < 2; i += 1) {
    //                 const p = points[i];
    //
    //                 if (p.dragging) {
    //                     p.drag(mouse);
    //                 }
    //
    //                 p.update(points, bounds);
    //                 p.draw(context);
    //             }
    //
    //             requestAnimationFrame(loop);
    //         };
    //
    //         loop();
    //     })();
    // }
}
