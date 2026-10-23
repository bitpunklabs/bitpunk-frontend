/** The browser and validator share all movement, enemies and procedural rules. */
export const RUN=Object.freeze({width:640,height:320,chunk:640,floor:264,speed:168,
  gravity:1200,jump:-400,doubleJump:-370,dt:1/120,playerW:18,playerH:30,coyote:.08});
export const VALUES=Object.freeze({btc:10,eth:5,sol:1});
export const FLOW=['garden','gallery','terrace','split','arcade'];
export const CHALLENGE=['ravine','islands','bear','swan','redwick','greenwick','gauntlet'];
export const KINDS=[...FLOW,...CHALLENGE];
export const KIND_NAMES={garden:'花园支线',gallery:'三层长廊',terrace:'阶梯石台',split:'上下分流',arcade:'高架拱廊',
  ravine:'深谷断桥',islands:'连续孤岛',bear:'巡逻熊群',swan:'天鹅与断桥',redwick:'大实体红阴线',greenwick:'长上影绿阳线',gauntlet:'高低台与断崖'};
export const BIOMES=['greek','wallstreet','cyberpunk','punkstreet'];
export const BIOME_NAMES={greek:'Ancient Greece',wallstreet:'Wall Street',cyberpunk:'Cyberpunk',punkstreet:'Punk Street'};
export function seedNumber(value){let h=2166136261;for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
export function randomFor(seed,index){let s=(seedNumber(seed)^Math.imul(index+1,0x9e3779b9))>>>0;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return(s>>>0)/4294967296;};}
function shuffle(items,rng){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function kindFor(seed,index){
  if(index===0)return'garden';if(index===1)return'gallery';
  const bag=Math.floor((index-2)/12),slot=(index-2)%12,rng=randomFor(seed+'-bag',bag);
  const f=shuffle(FLOW,rng),c=shuffle(CHALLENGE,rng);
  if(bag===0&&f[0]==='gallery')[f[0],f[1]]=[f[1],f[0]];
  // All 12 are different within the bag; disjoint end/start groups also protect its seam.
  return[f[0],c[0],f[1],c[1],f[2],c[2],f[3],c[3],f[4],c[4],c[5],c[6]][slot];
}
export function biomeFor(seed,index){
  const chapter=Math.floor(index/4),bag=Math.floor(chapter/4),slot=chapter%4,rng=randomFor(seed+'-scenes',bag);
  const a=shuffle(['greek','wallstreet'],rng),b=shuffle(['cyberpunk','punkstreet'],rng);
  if(bag===0&&a[0]!=='greek')a.reverse();
  return[a[0],b[0],a[1],b[1]][slot];
}
export const difficultyFor=index=>Math.min(4,1+Math.floor(index/8));
export function newPlayer(x=80){return{x,y:RUN.floor-RUN.playerH,vy:0,w:RUN.playerW,h:RUN.playerH,jumps:0,grounded:true,coyote:RUN.coyote,blocked:false};}
export function jumpPlayer(p){
  if(p.grounded||p.coyote>0){p.vy=RUN.jump;p.jumps=1;}
  else if(p.jumps<2){p.vy=RUN.doubleJump;p.jumps=2;}
  else return false;
  p.grounded=false;p.coyote=0;return true;
}
export const WICK_CYCLES=Object.freeze({
  redwick:Object.freeze({period:3,rest:1.50,warning:.50,attack:.14,hold:.42,recovery:.44,minBody:14,maxBody:74,lower:6,upper:8,height:88}),
  greenwick:Object.freeze({period:2.8,rest:1.45,warning:.45,attack:.16,hold:.40,recovery:.34,body:10,lower:4,minUpper:8,maxUpper:76,height:90})
});
const smoothStep=t=>t*t*(3-2*t),unitClamp=t=>Math.max(0,Math.min(1,t));
function patrolPosition(e,time){
  const t=(time-e.origin)*e.frequency+e.phase;
  const wave=Math.sin(t),shift=e.motion==='lunge'?wave*wave*wave:wave;
  return{x:e.x+shift*e.ampX,y:e.y+Math.sin(t*(e.type==='swan'?1.13:.8)+.6)*e.ampY};
}
export function wickState(e,time){
  const rule=WICK_CYCLES[e.type];if(!rule)throw Error('Not a wick enemy: '+e.type);
  const clock=time-e.origin+(e.actionPhase||0),age=((clock%rule.period)+rule.period)%rule.period;
  const warnEnd=rule.rest+rule.warning,attackEnd=warnEnd+rule.attack,holdEnd=attackEnd+rule.hold;
  let phase,progress,extension;
  if(age<rule.rest){phase=e.type==='redwick'?'hover':'short';progress=age/rule.rest;extension=0;}
  else if(age<warnEnd){phase='warning';progress=(age-rule.rest)/rule.warning;extension=0;}
  else if(age<attackEnd){phase=e.type==='redwick'?'slam':'pierce';progress=(age-warnEnd)/rule.attack;extension=e.type==='redwick'?progress*progress:1-(1-progress)**2;}
  else if(age<holdEnd){phase='hold';progress=(age-attackEnd)/rule.hold;extension=1;}
  else{phase='recover';progress=(age-holdEnd)/rule.recovery;extension=1-smoothStep(unitClamp(progress));}
  let x=patrolPosition(e,time).x,body,upper,lower=rule.lower,foot=e.y;
  if(e.type==='redwick'){
    if(age>=rule.rest){
      const locked=patrolPosition(e,time-(age-rule.rest)).x;
      x=phase==='recover'?locked+(x-locked)*smoothStep(unitClamp(progress)):locked;
    }
    body=rule.minBody+(rule.maxBody-rule.minBody)*extension;upper=rule.upper;
    // The upper edge stays fixed: the body grows DOWN into the ground.
    const bob=phase==='hover'?Math.sin(progress*Math.PI*2)*2:0;
    foot=e.y-rule.height+upper+body+lower+bob;
  }else{body=rule.body;upper=rule.minUpper+(rule.maxUpper-rule.minUpper)*extension;}
  body=Math.round(body);upper=Math.round(upper);foot=Math.round(foot);
  const height=upper+body+lower;
  return{type:e.type,x:Math.round(x),foot,ground:e.y,top:foot-height,width:e.w,body,upper,lower,height,phase,progress,extension,age,period:rule.period,warning:phase==='warning',impactAge:age-attackEnd,cycle:Math.floor(clock/rule.period)};
}
export function enemyPosition(e,time){
  if(WICK_CYCLES[e.type]){const s=wickState(e,time);return{x:s.x,y:s.foot};}
  return patrolPosition(e,time);
}
export function enemyRect(e,time){
  if(WICK_CYCLES[e.type]){const s=wickState(e,time);return{x:s.x-e.w/2,y:s.top,w:e.w,h:s.height};}
  const p=enemyPosition(e,time);return{x:p.x-e.w/2,y:p.y-e.h,w:e.w,h:e.h};
}
export function enemyBoxes(e,time){
  if(WICK_CYCLES[e.type]){const s=wickState(e,time);return[
    {x:s.x-e.w/2,y:s.foot-s.lower-s.body,w:e.w,h:s.body},
    {x:s.x-1,y:s.top,w:2,h:s.height}
  ];}
  const p=enemyPosition(e,time);
  return[{x:p.x-e.w/2,y:p.y-e.h,w:e.w,h:e.h}];
}
export function overlaps(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
export function stepPlayer(p,surfaces,dt=RUN.dt){
  const oldFoot=p.y+p.h,oldRight=p.x+p.w/2,wasGrounded=p.grounded;
  p.x+=RUN.speed*dt;p.vy=Math.min(700,p.vy+RUN.gravity*dt);p.y+=p.vy*dt;p.grounded=false;p.blocked=false;
  // Raised ground has a real front face. Floating platforms stay one-way.
  for(const s of surfaces)if(s.solid&&oldRight<=s.x+.1&&p.x+p.w/2>s.x&&p.y+p.h>s.y+2&&p.y<s.y+s.depth)p.blocked=true;
  if(p.vy>=0){
    let landing=null;
    for(const s of surfaces)if(p.x+p.w/2>s.x&&p.x-p.w/2<s.x+s.w&&oldFoot<=s.y+.7&&p.y+p.h>=s.y&&(!landing||s.y<landing.y))landing=s;
    if(landing){p.y=landing.y-p.h;p.vy=0;p.grounded=true;p.jumps=0;}
  }
  p.coyote=p.grounded?RUN.coyote:Math.max(0,p.coyote-dt);
  return !wasGrounded&&p.grounded;
}
export function deathReason(p,enemies,time,margin=0){
  if(p.y>RUN.height+32)return'pit';if(p.blocked)return'wall';
  const r={x:p.x-p.w/2+2,y:p.y+3,w:p.w-4,h:p.h-4};
  for(const e of enemies){
    if(Math.abs(p.x-e.x)>e.ampX+e.w/2+p.w/2+margin)continue;
    for(const box of enemyBoxes(e,time)){
    const b=margin?{x:box.x-margin,y:box.y-margin,w:box.w+2*margin,h:box.h+2*margin}:box;
    if(overlaps(r,b))return e.type;
  }
  }
  return null;
}
export function touchesCoin(p,c){const x=Math.max(p.x-p.w/2,Math.min(c.x,p.x+p.w/2)),y=Math.max(p.y,Math.min(c.y,p.y+p.h));return(x-c.x)**2+(y-c.y)**2<=7.5**2;}
export function takeCoin(p,c,counts){if(c.taken||!touchesCoin(p,c))return 0;c.taken=true;counts[c.type]++;return VALUES[c.type];}
function enemy(type,x,base,level,rng){
  const e={type,x,y:RUN.floor,w:30,h:24,ampX:20+level*5,ampY:0,frequency:1.7,phase:rng()*Math.PI*2,origin:base/RUN.speed,motion:'patrol'};
  if(type==='bear'){e.ampX=22+level*5;e.frequency=1.6+level*.08;}
  if(type==='swan'){Object.assign(e,{y:202,w:34,h:22,ampX:36+level*5,ampY:22+level*2,frequency:1.35+level*.08,motion:'swoop'});}
  if(type==='redwick')Object.assign(e,{w:26,h:88,body:74,lower:6,ampX:10+level*3,frequency:1.4,motion:'patrol',actionPhase:rng()*WICK_CYCLES.redwick.period});
  if(type==='greenwick')Object.assign(e,{w:16,h:90,body:10,lower:4,ampX:24+level*3,frequency:2.2,motion:'lunge',actionPhase:rng()*WICK_CYCLES.greenwick.period});
  return e;
}
export function geometry(kind,index,rng,canonical=false){
  const start=index*RUN.chunk,level=difficultyFor(index),surfaces=[],enemies=[];
  const d=canonical?0:(Math.floor(rng()*3)-1)*8;
  const floor=(x,w,y=RUN.floor)=>surfaces.push({x:start+x,w,y,ground:true,solid:y<RUN.floor,depth:RUN.height-y});
  const platform=(x,w,y)=>surfaces.push({x:start+x,w,y,ground:false,solid:false,depth:12});
  const spawn=(type,x)=>{const e=enemy(type,start+x,start,level,rng);if(canonical){e.phase=0;e.actionPhase=0;e.ampX*=.4;}enemies.push(e);return e;};
  let base=[],upper=[],other=[];
  if(kind==='ravine'){
    const a=200+d,w=canonical?120:[104,120,136][Math.floor(rng()*3)];floor(0,a);floor(a+w,640-a-w);
    base=[a-32,a+16];upper=[a-24,a+24];
    if(level>1&&rng()<.75){platform(a+52,28,224);other=[a-20,a+76];}
    platform(a+160,80,208);
  }else if(kind==='islands'){
    const a=176+d,w=canonical?88:80+Math.floor(rng()*3)*8,m=canonical?72:64+Math.floor(rng()*3)*8,b=a+w+m;
    floor(0,a);floor(a+w,m);floor(b+w,640-b-w);base=[a-12,b-12];upper=[a-8,b-8];
    if(level>2)platform(a+w+12,40,208);
  }else if(kind==='swan'){
    const a=392+d,w=88;floor(0,a);floor(a+w,640-a-w);spawn('swan',216+d);
    if(level>2){const e=spawn('swan',532+d);e.y=144;e.ampY=24;e.ampX=26;}
    base=[a-14];upper=[a-28,a+20];platform(284+d,56,184);
  }else if(kind==='gauntlet'){
    floor(0,168+d);floor(168+d,80,240);floor(248+d,72,216);floor(320+d,112);floor(520+d,120-d);
    base=[132+d,180+d,406+d];upper=[124+d,180+d,410+d];
    const bird=spawn('swan',352+d);bird.y=148;bird.ampY=16;bird.ampX=30;
    platform(460+d,32,204);
  }else{
    floor(0,640);
    if(kind==='garden'){platform(196+d,72,220);platform(398+d,80,216);upper=[148+d,352+d];other=[132+d,180+d,380+d];}
    if(kind==='gallery'){platform(160+d,104,216);platform(312+d,104,176);platform(456+d,80,212);upper=[116+d,236+d,374+d];other=[100+d,148+d,356+d];}
    if(kind==='terrace'){platform(136+d,96,224);platform(268+d,96,184);platform(404+d,104,152);platform(500+d,52,204);upper=[100+d,220+d,356+d];other=[104+d,152+d,344+d];}
    if(kind==='split'){platform(160+d,160,212);platform(340+d,144,160);platform(512+d,56,212);upper=[116+d,288+d];other=[104+d,152+d,320+d];}
    if(kind==='arcade'){platform(200+d,120,184);platform(392+d,80,160);platform(504+d,64,208);upper=[104+d,152+d,304+d];other=[112+d,160+d,312+d];}
    if(kind==='bear'){
      spawn('bear',224+d);if(level>1)spawn('bear',464+d);
      platform(320+d,72,216);platform(500+d,64,196);
      base=level>1?[144+d,184+d,384+d,424+d]:[144+d,184+d];
      upper=level>1?[144+d,184+d,380+d,428+d]:[148+d];
    }
    if(kind==='redwick'||kind==='greenwick'){
      spawn(kind,252+d);if(level>2)spawn(kind,480+d);
      base=level>2?[150+d,198+d,378+d,426+d]:[150+d,198+d];
      upper=level>2?[154+d,202+d,382+d,430+d]:[154+d,202+d];
      platform(352+d,56,220);
    }
  }
  return{index,kind,level,biome:biomeFor('geometry',index),start,end:start+640,surfaces,enemies,coins:[],base,upper,other,variant:d};
}
function finishSteps(iterator){let next;do{next=iterator.next();}while(!next.done);return next.value;}
export function* traceRouteSteps(chunk,actions,margin=0){
  const p=newPlayer(chunk.start);let at=0,dead=null,invalid=false,landings=0;
  const samples=[];
  for(let tick=0;tick<520&&p.x<chunk.end;tick++){
    while(at<actions.length&&p.x>=chunk.start+actions[at]){if(!jumpPlayer(p))invalid=true;at++;}
    if(stepPlayer(p,chunk.surfaces))landings++;
    dead=deathReason(p,chunk.enemies,p.x/RUN.speed,margin);
    samples.push({x:p.x,y:p.y+p.h/2,foot:p.y+p.h,grounded:p.grounded});
    if(dead)break;
    if((tick+1)%64===0)yield;
  }
  return{ok:!dead&&!invalid&&at===actions.length&&p.x>=chunk.end&&p.grounded,dead,invalid,samples,landings,exit:{x:p.x,y:p.y,grounded:p.grounded}};
}
export function traceRoute(chunk,actions,margin=0){return finishSteps(traceRouteSteps(chunk,actions,margin));}
function sampleAt(trace,x){const offset=Math.max(0,Math.min(trace.samples.length-1,Math.round((x-trace.samples[0].x)/(RUN.speed*RUN.dt))));return trace.samples[offset];}
function candidates(plan){
  if(!plan.length)return[[]];
  const all=[];
  for(const shift of [0,-4,4,-8,8,-16,16,-24,24,-32,32])all.push(plan.map(x=>x+shift));
  return all;
}
function* findRouteSteps(chunk){
  const routes=[],traces=[],seen=new Set();
  const plans=[['base',chunk.base],['upper',chunk.upper],['alternate',chunk.other]];
  if(chunk.kind==='redwick')plans.push(['underpass',[]]);
  if(chunk.kind==='greenwick')plans.push(['short-wick',chunk.enemies.map(e=>e.x-chunk.start-56)]);
  for(const [label,plan]of plans){
    if(label!=='base'&&label!=='underpass'&&!plan.length)continue;
    let accepted=0;
    for(const actions of (label==='short-wick'?candidates(plan).slice(0,3):candidates(plan))){
      const signature=actions.join(',');if(seen.has(signature))continue;
      seen.add(signature);
      const trace=yield* traceRouteSteps(chunk,actions,2);
      yield;
      if(trace.ok){routes.push({id:label,actions});traces.push(trace);accepted++;break;}
    }
    if(label==='base'&&!accepted)return null;
  }
  return{routes,traces};
}
function highestSample(trace,minX,maxX){
  let peak=null;
  for(const point of trace.samples)if(point.x>minX&&point.x<maxX&&!point.grounded&&(!peak||point.y<peak.y))peak=point;
  return peak;
}
export function* makeChunkSteps(seed,index,forceKind){
  const rng=randomFor(seed,index),kind=forceKind||kindFor(seed,index);
  let chunk,found,attempt=0;
  for(;attempt<4;attempt++){chunk=geometry(kind,index,rng);found=yield* findRouteSteps(chunk);if(found)break;}
  let fallback=false;
  if(!found){chunk=geometry(kind,index,randomFor('CANONICAL-'+kind,index),true);found=yield* findRouteSteps(chunk);fallback=true;}
  if(!found)throw Error('No playable variant: '+kind+' / '+seed+' / '+index);
  chunk.routes=found.routes;chunk.low=found.routes[0].actions;
  chunk.high=found.routes.find(r=>r.id.startsWith('upper'))?.actions||found.routes[1]?.actions||null;
  chunk.biome=biomeFor(seed,index);chunk.fallback=fallback;chunk.attempts=attempt+1;
  const primary=found.traces[0],add=(point,type,route)=>{
    if(!point||point.x<chunk.start+96||point.x>chunk.end-64||chunk.coins.length>=24)return;
    if(chunk.coins.some(c=>Math.hypot(c.x-point.x,c.y-point.y)<21))return;
    // Both the collection position and a little space around the coin must be clear.
    const proxy={x:point.x,y:point.y-RUN.playerH/2,w:RUN.playerW,h:RUN.playerH};
    if(deathReason(proxy,chunk.enemies,point.x/RUN.speed,4))return;
    chunk.coins.push({id:index+'-'+chunk.coins.length,x:point.x,y:point.y,type,route,taken:false});
  };
  const pattern=Math.floor(rng()*3);
  for(let x=108+pattern*8;x<chunk.end-chunk.start-70;x+=32+pattern*4){
    const p=sampleAt(primary,chunk.start+x),raised=p.foot<RUN.floor-30;
    add(p,raised?(rng()<.30?'eth':'sol'):(rng()<.12?'eth':'sol'),found.routes[0].id);
  }
  // A chain follows each distinct upper route. Peaks carry BTC; branches compete with the low line.
  for(let i=1;i<found.routes.length;i++){
    const route=found.routes[i],trace=found.traces[i];
    if(route.id.includes('-1'))continue;
    for(let x=128;x<550;x+=36){
      const p=sampleAt(trace,chunk.start+x),low=sampleAt(primary,chunk.start+x);
      if(p.foot<RUN.floor-30&&Math.abs(p.y-low.y)>24)add(p,rng()<.35?'eth':'sol',route.id);
    }
    const peak=highestSample(trace,chunk.start+112,chunk.end-104);
    if(peak&&peak.foot<RUN.floor-72)add(peak,'btc',route.id);
    yield;
  }
  // Required jumps still offer a reward even when there is no alternate upper route.
  const peak=highestSample(primary,chunk.start+120,chunk.end-96);
  if(peak&&peak.foot<RUN.floor-54){
    const existing=chunk.coins.find(c=>Math.hypot(c.x-peak.x,c.y-peak.y)<21);
    if(existing){existing.type='btc';}else add(peak,'btc',found.routes[0].id);
  }
  // Reuse accepted traces in the optional map, retaining only its drawing samples.
  chunk.routePreviews=found.traces.map(trace=>trace.samples.filter((_,i)=>i%4===0));
  chunk.coins.sort((a,b)=>a.x-b.x);
  delete chunk.base;delete chunk.upper;delete chunk.other;
  return chunk;
}
export function makeChunk(seed,index,forceKind){return finishSteps(makeChunkSteps(seed,index,forceKind));}
export function routeCoinsReachable(chunk){
  const traces=new Map(chunk.routes.map(r=>[r.id,traceRoute(chunk,r.actions)]));
  return chunk.coins.every(c=>{const trace=traces.get(c.route);return trace?.ok&&trace.samples.some(s=>touchesCoin({x:s.x,y:s.y-RUN.playerH/2,w:RUN.playerW,h:RUN.playerH},c));});
}
