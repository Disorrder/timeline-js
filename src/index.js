import EventEmitter from './EventEmitter';
import Timer from "./Timer";
import easing from './easing';
import {clamp, mixin} from "./utils";

export default class Timeline {
    static get version() { return VERSION; }
    static get easing() { return easing; }

    static defaultAnimation(time = 0) {
        if (this.defaultAnimation) {
            requestAnimationFrame(this.defaultAnimation);
        }
        this.update(time);
    }

    // static items = new Set(); // TODO: Typescript
    static update(time) {
        this.items.forEach(item => {
            item.update(time);
        });
    }

    constructor(options = {}) {
        this.active = false;
        this.__name = options.name;

        this.keyframes = [];

        this.time = 0;
        this.timeEnd = 0;
        this.timeScale = 1;
        this.repeat = 1;
        this.duration = 0;
        this.setOptions(options)

        this.timer = new Timer();

        Timeline.items.add(this);
    }

    setOptions(options = {}) {
        this._options = options = {
            repeat: 1,
            ...options
        };

        this.repeat = options.repeat;
        if (options.timeScale) this.timeScale = options.timeScale;
    }

    get lastKeyframe() {
        return this.keyframes[this.keyframes.length-1] || null;
    }

    startAnimationLoop() {
        this.timer.time = performance.now();
        this.animationLoop(this.timer.time);
    }

    update(time) {
        if (!this.active) {
            return;
        }
        this.timer.setTime(time);
        this._update(this.timer.dt);
    }

    add(frame) { // support single frame, array and Timeline
        if (frame instanceof Timeline) {
            // TODO: ref to `timeline` property and save timeline for animation
            // Also calculate timeScale by durations
            let timeline = frame;
            frame = timeline.keyframes.map(frame => {
                frame = {
                    ...frame,
                    delay: frame.delay / timeline.timeScale,
                    duration: frame.duration / timeline.timeScale,
                };
                return frame;
            })
        };
        if (Array.isArray(frame)) {
            frame.forEach(v => this._addFrame(v));
        } else {
            this._addFrame(frame);
        }
        return this;
    }

    _addFrame(frame) { // private and only for frames
        if (frame.delay == null) frame.delay = 0;
        if (frame.duration == null) frame.duration = 1000;
        if (frame.repeat == null) frame.repeat = 1;
        if (frame.easing == null) frame.easing = Timeline.easing.QuadraticIn;
        // if (frame.animate && !Array.isArray(frame.animate)) frame.animate = [frame.animate];
        this._timeline = this;

        this.keyframes.push(frame);
    }

    calculateFrames() {
        this.duration = 0;
        this.keyframes.forEach((frame, i) => {
            var prevKeyframe = this.keyframes[i-1] || {};
            var startTime = prevKeyframe._endTime || 0;
            if (frame.delay) startTime += frame.delay;
            if (frame.offset != null) startTime = frame.offset;
            if (frame.offset === 'prev') startTime = prevKeyframe._startTime || 0;
            frame._startTime = startTime;
            frame._endTime = startTime + frame.duration * frame.repeat;
            frame._began = false;
            frame._completed = false;

            this.duration = Math.max(frame._endTime, this.duration);
        });
    }

    play() {
        if (this.active) {
            throw new Error("Timeline is already playing.");
        }
        if (this.time === 0) { // start
            this.calculateFrames();
            this.promise = new Promise((resolve, reject) => {
                this.on('complete', resolve);
                this.on('stop', reject);
            });
        }
        this.active = true;
        this.timer.start();
        this.emit('play');
        return this;
    }

    pause() {
        // throw "Not implemented";
        this.active = false;
        this.timer.stop();
        this.emit('pause');
        return this;
    }

    stop() {
        this.active = false;
        this.emit('stop');
        this.timer.stop();
        this.time = 0;
        this.keyframes.forEach((frame) => {
            frame._began = false;
            frame._completed = false;
        });
        this.setOptions(this._options);
        return this;
    }

    replay() {
        this.keyframes.forEach((frame) => {
            frame._began = false;
            frame._completed = false;
        });
        this.active = true;
        this.time = 0;
        this.emit('replay');
        return this;
    }

    moveTo(time) {
        return this;
    }

    _update(dt = 0) {
        if (!this.active) return;
        dt *= this.timeScale;
        if (!dt) return;
        // increment time here?

        this.keyframes.forEach((frame) => {
            if (frame._completed) return;
            if (this.time >= frame._startTime) {
                if (!frame._began) this._begin(frame);
                if (this.time <= frame._endTime) this._run(frame);
            }

            if (this.time > frame._endTime) {
                if (frame._began && !frame._completed) this._complete(frame);
            }
        });

        if (this.time <= 0) {
            this.emit('begin');
        }
        this.emit('update', dt);

        if (this.time >= this.duration) {
            if (--this.repeat > 0) {
                return this.replay();
            }
            this.stop();
            this.emit('complete');
            return;
        }

        this.time += dt;
    }

    _begin(frame) {
        if (frame.preCalculate) frame.preCalculate(frame);
        if (frame.animate) {
            frame.animate.forEach((anim) => {
                anim._target = typeof anim.target === 'function' ? anim.target() : anim.target;
                if (!anim._target) return console.warn('Animation target is not defined', anim, frame, this);
                if (!anim.from) anim.from = {};
                anim._delta = {};

                if (anim.by) { 
                    for (let k in anim.by) { 
                        if (anim.from[k] == null) anim.from[k] = anim._target[k]; 
                        anim._delta[k] = anim.by[k]; 
                    } 
                } 
                if (anim.to) { 
                    for (let k in anim.to) { 
                        if (anim.from[k] == null) anim.from[k] = anim._target[k]; 
                        anim._delta[k] = anim.to[k] - anim.from[k]; 
                    } 
                }
            });
        }
        frame._began = true;
        if (frame.begin) frame.begin(frame);
    }

    _run(frame) {
        frame._time = (this.time - frame._startTime) / frame.duration;
        frame._time = clamp(frame._time, 0, frame.repeat);

        if (frame._time > 1) { // repeating. TODO: add yoyo
            frame._time -= Math.floor(frame._time);
            if (frame._time === 0) frame._time = 1;
        }

        // if (frame.animate) this._moveTo(frame, frame._time); 
        if (frame.animate) {
            this.__t = frame.easing(frame._time);
            frame.animate.forEach((anim) => {
                if (!anim._target) return;
                for (this.__k in anim._delta) {
                    // anim._target[this.__k] = anim.to[this.__k] - (1 - this.__t) * anim._delta[this.__k];
                    anim._target[this.__k] = anim.from[this.__k] + this.__t * anim._delta[this.__k];
                }
                if (anim.setter) anim.setter(anim._target);
            });
        }
        if (frame.run) frame.run(frame);
    }

    _moveTo(frame, t) { 
        // if (t == null) t = frame._time; //? not necessary mb 
        t = frame.easing(t); 
        frame.animate.forEach((anim) => { 
            if (!anim._target) return; 
            for (this.__k in anim._delta) { 
                anim._target[this.__k] = anim.from[this.__k] + t * anim._delta[this.__k]; 
            } 
            if (anim.setter) anim.setter(anim._target); 
        }); 
    }

    _complete(frame) {
        this._run(frame);
        frame._completed = true;
        if (frame.complete) frame.complete(frame);
    }
}

Timeline.items = new Set();
Timeline.defaultAnimation = Timeline.defaultAnimation.bind(Timeline);

mixin(EventEmitter)(Timeline); // TODO: decorator

Timeline.defaultAnimation();

// if (!'Timeline' in window) window.Timeline = Timeline;






// PlayCanvas

// if ('pc' in window) {
//     let pc = window.pc;
//     class TimelinePC extends Timeline {
//         constructor(options = {}) {
//             super(options);
//             this.app = options.app || pc.Application.getApplication();
//         }

//         animationLoop() {
//             this.app.on('update', (dt) => this._update(dt * 1000), this);
//         }
//     }

//     if (pc.Timeline) console.warn('pc.Timeline is already exists!');
//     pc.Timeline = TimelinePC;
// }
