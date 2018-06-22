!function(t){var e={};function i(a){if(e[a])return e[a].exports;var n=e[a]={i:a,l:!1,exports:{}};return t[a].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=t,i.c=e,i.d=function(t,e,a){i.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:a})},i.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";i.r(e);class a{on(t,e,i){return t&&e?(this._callbacks||(this._callbacks={}),this._callbacks[t]||(this._callbacks[t]=[]),i&&(e=e.bind(i)),this._callbacks[t].push(e),this):this}emit(t,...e){return t&&this._callbacks&&this._callbacks[t]?(this._callbacks[t].forEach(t=>t.apply(null,e)),this):this}fire(t,...e){return this.emit(t,...e)}off(t,e){if(!t)return this;if(e){let i=this._callbacks[t].indexOf(e);~i&&this._callbacks[t].splice(i,1)}else this._callbacks[t].length=0;return this}static mixin(t){Object.getOwnPropertyNames(a.prototype).forEach(e=>{"constructor"!==e&&(t.prototype[e]=a.prototype[e])})}}var n={Linear:t=>t,QuadraticIn:t=>t*t,QuadraticOut:t=>t*(2-t),QuadraticInOut:t=>(t*=2)<1?.5*t*t:-.5*(--t*(t-2)-1),CubicIn:t=>t*t*t,CubicOut:t=>--t*t*t+1,CubicInOut:t=>(t*=2)<1?.5*t*t*t:.5*((t-=2)*t*t+2),QuarticIn:t=>t*t*t*t,QuarticOut:t=>1- --t*t*t*t,QuarticInOut:t=>(t*=2)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2),QuinticIn:t=>t*t*t*t*t,QuinticOut:t=>--t*t*t*t*t+1,QuinticInOut:t=>(t*=2)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2),SineIn:t=>0===t?0:1===t?1:1-Math.cos(t*Math.PI/2),SineOut:t=>0===t?0:1===t?1:Math.sin(t*Math.PI/2),SineInOut:t=>0===t?0:1===t?1:.5*(1-Math.cos(Math.PI*t)),ExponentialIn:t=>0===t?0:Math.pow(1024,t-1),ExponentialOut:t=>1===t?1:1-Math.pow(2,-10*t),ExponentialInOut:t=>0===t?0:1===t?1:(t*=2)<1?.5*Math.pow(1024,t-1):.5*(2-Math.pow(2,-10*(t-1))),CircularIn:t=>1-Math.sqrt(1-t*t),CircularOut:t=>Math.sqrt(1- --t*t),CircularInOut:t=>(t*=2)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1),ElasticIn(t){var e,i=.1;return 0===t?0:1===t?1:(!i||i<1?(i=1,e=.1):e=.4*Math.asin(1/i)/(2*Math.PI),-i*Math.pow(2,10*(t-=1))*Math.sin((t-e)*(2*Math.PI)/.4))},ElasticOut(t){var e,i=.1;return 0===t?0:1===t?1:(!i||i<1?(i=1,e=.1):e=.4*Math.asin(1/i)/(2*Math.PI),i*Math.pow(2,-10*t)*Math.sin((t-e)*(2*Math.PI)/.4)+1)},ElasticInOut(t){var e,i=.1;return 0===t?0:1===t?1:(!i||i<1?(i=1,e=.1):e=.4*Math.asin(1/i)/(2*Math.PI),(t*=2)<1?i*Math.pow(2,10*(t-=1))*Math.sin((t-e)*(2*Math.PI)/.4)*-.5:i*Math.pow(2,-10*(t-=1))*Math.sin((t-e)*(2*Math.PI)/.4)*.5+1)},BackIn(t){var e=1.70158;return t*t*((e+1)*t-e)},BackOut(t){var e=1.70158;return--t*t*((e+1)*t+e)+1},BackInOut(t){var e=2.5949095;return(t*=2)<1?t*t*((e+1)*t-e)*.5:.5*((t-=2)*t*((e+1)*t+e)+2)},BounceIn:t=>1-BounceOut(1-t),BounceOut:t=>t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375,BounceInOut:t=>t<.5?.5*BounceIn(2*t):.5*BounceOut(2*t-1)+.5};i.d(e,"default",function(){return s});class s{static get version(){return"0.2.1"}static get easing(){return n}constructor(t={}){this.active=!1,this.__name=t.name,this.keyframes=[],this.time=0,this.timeEnd=0,this.timeScale=t.timeScale||1,this.repeat=t.repeat||1,this.duration=0,setTimeout(this.startAnimationLoop.bind(this))}get lastKeyframe(){return this.keyframes[this.keyframes.length-1]||null}startAnimationLoop(){this._tickBound=this._tick.bind(this),requestAnimationFrame(t=>{this._lastTick=t,this._tick(t)})}_tick(t=this._lastTick){requestAnimationFrame(this._tickBound),this._update(t-this._lastTick||16),this._lastTick=t}add(t){return t instanceof s?t.keyframes.forEach(t=>this._addFrame(t)):this._addFrame(t),this}_addFrame(t){null==t.delay&&(t.delay=0),null==t.duration&&(t.duration=1e3),null==t.repeat&&(t.repeat=1),null==t.easing&&(t.easing=s.easing.QuadraticIn),this._timeline=this,this.keyframes.push(t)}checkFrames(){this.keyframes.forEach((t,e)=>{var i=this.keyframes[e-1]||{},a=i._endTime||0;null!=t.offset&&(a=t.offset),"prev"===t.offset&&(a=i._startTime||0),t.delay&&(a+=t.delay),t._startTime=a,t._endTime=a+t.duration*t.repeat,t._began=!1,t._completed=!1,this.duration=Math.max(t._endTime,this.duration)}),this.startTime=this.keyframes[0]._startTime,this.endTime=this.startTime+this.duration}play(){return this.checkFrames(),this.active=!0,this.fire("play"),this}pause(){return this.active=!1,this.fire("pause"),this}stop(){return this.active=!1,this.fire("stop"),this.time=0,this.keyframes.forEach(t=>{t._began=!1,t._completed=!1}),this}replay(){return this.keyframes.forEach(t=>{t._began=!1,t._completed=!1}),this.active=!0,this.time=0,this.fire("replay"),this}moveTo(t){return this}_update(t=0){if(this.active){if(t*=this.timeScale,this.keyframes.forEach(t=>{t._completed||(this.time>=t._startTime&&(t._began||this._begin(t),this.time<=t._endTime&&this._run(t)),this.time>t._endTime&&t._began&&!t._completed&&this._complete(t))}),this.time<=0&&this.fire("begin"),this.fire("update",t),this.time>=this.endTime)return this.repeat--,this.repeat?this.replay():(this.stop(),void this.fire("complete"));this.time+=t}}_begin(t){t.preCalculate&&t.preCalculate(t),t.animate&&t.animate.forEach(e=>{if(e._target="function"==typeof e.target?e.target():e.target,!e._target)return console.warn("Animation target is not defined",e,t,this);e.from||(e.from={}),e._delta={},e.by&&Object.assign(e._delta,e.delta);for(let t in e.to||{}){let i=null!=e.from[t]?e.from[t]:e._target[t];e._delta[t]=e.to[t]-i}}),t._began=!0,t.begin&&t.begin(t)}_run(t){t._time=(this.time-t._startTime)/t.duration,t._time=Math.clamp(t._time,0,t.repeat),t._time>1&&(t._time-=Math.floor(t._time),0===t._time&&(t._time=1)),t.animate&&(this.__t=t.easing(t._time),t.animate.forEach(t=>{if(t._target){for(this.__k in t._delta)t._target[this.__k]=t.to[this.__k]-(1-this.__t)*t._delta[this.__k];t.setter&&t.setter(t._target)}})),t.run&&t.run(t)}_complete(t){this._run(t),t._completed=!0,t.complete&&t.complete(t)}static __test(){var t={position:{x:10}},e=(new s).add({delay:1e3,animate:[{target:t.position,to:{x:20}}],begin(){console.log("frame 0 begin",t.position.x,e.time.toFixed(2))},complete(){console.log("frame 0 complete",t.position.x,e.time.toFixed(2))},run(){console.log("frame 0 run",t.position.x,e.time.toFixed(2))}}).add({duration:500,animate:[{target:t.position,to:{x:0}}],begin(){console.log("frame 1 begin",t.position.x,e.time.toFixed(2))},complete(){console.log("frame 1 complete",t.position.x,e.time.toFixed(2))},run(){console.log("frame 1 run",t.position.x,e.time.toFixed(2))}}).play()}}if(a.mixin(s),window.Animated||(window.Animated=s),window.pc){let t=window.pc;class e extends s{constructor(e={}){super(e),this.app=e.app||t.script.app}startAnimationLoop(){this.app.on("update",t=>this._update(1e3*t),this)}_tick(){}}t.Animated&&console.warn("pc.Animated is already exists!"),t.Animated=e}Math.clamp||(Math.clamp=function(t,e,i){return t>=i?i:t<=e?e:t})}]);