/* Visual-only RNG. It never reads or mutates physics, coins or enemy state. */
export const WORLD_SCENES=['greek','wallstreet','cyberpunk','punkstreet','exchange','reserve','harbor','moon'];
export const WORLD_SCENE_NAMES={greek:'Ancient Greece',wallstreet:'Wall Street',cyberpunk:'Cyberpunk',punkstreet:'Punk Street',exchange:'The Exchange',reserve:'Reserve Works',harbor:'Tariff Harbor',moon:'Moon Market'};
export const SCENE_MASTER_FILES=Object.fromEntries(WORLD_SCENES.map(id=>[id,({reserve:'reserve-dollar-background.png',harbor:'harbor-tariff-background.png',moon:'moon-trading-background.png'})[id]||id+'-background.png']));
export const SCENE_TEXT_PANELS=['reserve','harbor','moon'];
export const WORLD_NOTES={
  greek:'石柱、海岸与花园。古典面罩的来处。',wallstreet:'黄昏金融街，暖石立面与旧资本的秩序。',cyberpunk:'夜城、桥梁与远处的数据灯光。',punkstreet:'砖墙、卷帘门与独立街区。',
  exchange:'玻璃顶交易所、开市钟与成排终端。现实金融，带一点空椅子过多的荒诞。',reserve:'央行门面连接印钞车间，美元纹样的大纸卷从屋顶露出。',harbor:'货轮、集装箱与海关，关税计费牌和收费关卡标出港口的另一层成本。',moon:'股票行情大屏与报价带环绕月面交易厅；交易大厅旁边就是气闸。'
};
export const EGG_META=[
  {id:'fomc',name:'FOMC window',title:'发布会还没结束',sheet:'memes-market',index:0,meaning:'讲台、双麦克风、灰发发言人和背后的钟。',detail:'一扇小发布会窗口，不触发市场事件，也不改变敌人。'},
  {id:'tariff',name:'Tariff / TACO',title:'关税窗口，顺便卖 taco',sheet:'memes-market',index:1,meaning:'海关盖章、栏杆、货箱，旁边挂着 taco 招牌。',detail:'靠形状讲清来回折腾的政策感；可在任何背景里偶遇。'},
  {id:'printer',name:'Money printer',title:'印钞员还在加班',sheet:'memes-market',index:2,meaning:'戴眼镜的央行小人、滚筒印钞机与成叠纸币。',detail:'安静的小银行橱窗，纸币是背景装饰。'},
  {id:'stonks',name:'Stonks',title:'方向正确，拼写随意',sheet:'memes-market',index:3,meaning:'光头 Meme Man、西装与一根上扬箭头。',detail:'做成交易室橱窗，保留熟悉的轮廓。'},
  {id:'fine',name:'This is fine',title:'咖啡照喝',sheet:'memes-market',index:4,meaning:'帽子小狗、白咖啡杯与房间里的火。',detail:'火焰是静态橱窗内容，与游戏里的危险清楚分层。'},
  {id:'diamond',name:'Diamond hand',title:'钻石手珠宝店',sheet:'memes-market',index:5,meaning:'一只钻石手居中放在深色展示台上。',detail:'一个适合街区或金融城的安静视觉双关。'},
  {id:'sisyphus',name:'Sisyphus / BTC',title:'再推一次，就到顶了',sheet:'memes-world',index:0,meaning:'把巨石换成 Bitcoin，古希腊小人继续向上推。',detail:'把无尽跑酷和反复研究市场连接起来。'},
  {id:'diogenes',name:'Diogenes',title:'住进桶里，继续找 alpha',sheet:'memes-world',index:1,meaning:'陶瓮、灯、卷轴和淡定的哲学家。',detail:'古典 persona 的幽默延伸，也能出现在现代街角。'},
  {id:'doge',name:'Doge / Moon',title:'登月前先修火箭',sheet:'memes-world',index:3,meaning:'柴犬从复古火箭里探头，旁边是月亮车库招牌。',detail:'保留 Doge 的表情，把登月变成街边维修生活。'},
  {id:'bagholder',name:'Bagholder',title:'这班车还会来吗',sheet:'memes-world',index:4,meaning:'候车人、空时刻表和几个过大的市场袋子。',detail:'不加对白也能读懂的等待感。'}
];
export const EGG_IDS=EGG_META.map(x=>x.id);
// The last two sprite rows tuck behind the foreground lip at y=264.
// Sprite definitions are already tightly cropped to their opaque bounds.
export const EGG_FOOT=266;
function visualHash(text){let h=2166136261;for(const c of String(text)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function visualRandom(seed){let s=visualHash(seed);return()=>{s+=0x6d2b79f5;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
export function createVisualWorld(seed){
  const cache=new Map();
  function rawBag(domain,number,pool){
    const key=domain+':'+number;if(cache.has(key))return cache.get(key);
    const rng=visualRandom(seed+':visual:'+key),bag=pool.slice();
    for(let i=bag.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]];}
    cache.set(key,bag);if(cache.size>6)cache.delete(cache.keys().next().value);return bag;
  }
  function item(domain,index,pool){
    const i=Math.max(0,Math.floor(index)),n=Math.floor(i/pool.length),at=i%pool.length,bag=rawBag(domain,n,pool);
    // Only the first two entries are swapped, so a preceding bag's final
    // entry always remains its raw final entry. Random access stays bounded.
    if(n>0&&bag[0]===rawBag(domain,n-1,pool).at(-1)&&at<2)return bag[1-at];
    return bag[at];
  }
  return{
    scene(index){return item('scenes',Math.floor(Math.max(0,index)/4),WORLD_SCENES);},
    egg(slot){return item('eggs',slot,EGG_IDS);},
    nearby(camera,width){
      const offset=Math.max(0,camera)*.30,first=Math.floor(offset/560)-1,last=Math.ceil((offset+width+110)/560),result=[];
      for(let slot=Math.max(0,first);slot<=last;slot++){
        const rng=visualRandom(seed+':visual:position:'+slot),x=slot*560+200+Math.round((rng()-.5)*84)-offset,w=88+Math.floor(rng()*17);
        if(x+w/2<0||x-w/2>width)continue;
        result.push({slot,id:item('eggs',slot,EGG_IDS),x,foot:EGG_FOOT,width:w,height:84});
      }
      return result;
    },
    cacheSize(){return cache.size;}
  };
}
export function paintEgg(q,images,definitions,id,x,foot,width=104,height=84){
  const s=definitions[id];if(!s||!images[s.sheet])return 0;
  const scale=Math.min(width/s.w,height/s.h),w=Math.round(s.w*scale),h=Math.round(s.h*scale);
  q.save();q.globalAlpha=1;q.imageSmoothingEnabled=false;
  q.drawImage(images[s.sheet],s.x,s.y,s.w,s.h,Math.round(x-w/2),Math.round(foot-h),w,h);q.restore();return 1;
}
