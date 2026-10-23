/* Exact flat chart geometry, shared by the game and motion study. */
export function paintWick(q,s,x=s.x,foot=s.foot,scale=1,{particles=true}={}){
  const red=s.type==='redwick',color=red?'#F23645':'#089981',ground=s.ground-s.foot;
  q.save();q.translate(Math.round(x),Math.round(foot));q.scale(scale,scale);
  if(red){
    q.save();q.globalAlpha*=s.warning?.48:.14;q.fillStyle=color;
    q.fillRect(-s.width/2-3,ground-1,s.width+6,2);
    if(s.warning){
      q.globalAlpha*=.6;
      for(let y=6;y<ground-4;y+=10)q.fillRect(-1,y,2,3);
      q.globalAlpha=1;q.fillRect(-4,ground-8,3,2);q.fillRect(1,ground-8,3,2);q.fillRect(-1,ground-5,2,2);
    }
    q.restore();
  }else if(s.warning){
    q.fillStyle=color;const y=-s.height-7-Math.round(s.progress*3);
    q.fillRect(-1,y,2,2);q.fillRect(-4,y+3,3,2);q.fillRect(1,y+3,3,2);
    q.fillRect(-s.width/2-3,-s.lower-s.body,2,s.body);q.fillRect(s.width/2+1,-s.lower-s.body,2,s.body);
  }
  q.fillStyle=color;q.fillRect(-1,-s.height,2,s.height);
  q.fillRect(-s.width/2,-s.lower-s.body,s.width,s.body);
  if(red&&s.impactAge>=0&&s.impactAge<.64){
    const t=s.impactAge;q.save();q.globalAlpha*=1-t/.64;q.strokeStyle='#655e54';q.lineWidth=1;
    for(const sign of [-1,1]){
      q.beginPath();q.moveTo(sign*5,ground+1);q.lineTo(sign*15,ground+4);q.lineTo(sign*12,ground+7);q.lineTo(sign*25,ground+9);q.stroke();
      if(particles&&t<.30)for(let i=0;i<2;i++){
        q.fillStyle=i?'#8c806a':'#c9bea3';const dx=sign*(16+(26+i*16)*t),dy=ground-2-(50+i*12)*t+160*t*t;
        q.fillRect(Math.round(dx),Math.round(dy),2+i,2);
      }
    }
    q.restore();
  }
  q.restore();
}
