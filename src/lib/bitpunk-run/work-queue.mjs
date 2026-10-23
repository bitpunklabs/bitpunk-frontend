/* Cooperative browser work: one bounded quantum at a time, gameplay first. */
export function createWorkQueue({budgetMs=2,canRun=()=>true}={}){
  const jobs=[];
  let scheduled=null,kind='',draining=false;
  const runnable=()=>jobs.find(job=>canRun(job));
  function unschedule(){
    if(scheduled!==null){
      if(kind==='idle')cancelIdleCallback(scheduled);else clearTimeout(scheduled);
      scheduled=null;
    }
  }
  function remove(job){const at=jobs.indexOf(job);if(at>=0)jobs.splice(at,1);}
  function wake(){
    if(scheduled!==null||draining||!runnable())return;
    if(typeof requestIdleCallback==='function'){
      kind='idle';scheduled=requestIdleCallback(drain,{timeout:100});
    }else{kind='timer';scheduled=setTimeout(()=>drain(null),8);}
  }
  function drain(deadline){
    scheduled=null;draining=true;
    const begin=performance.now();
    try{
      while(performance.now()-begin<budgetMs){
        if(deadline&&!deadline.didTimeout&&deadline.timeRemaining()<.5)break;
        const job=runnable();if(!job)break;
        try{
          const result=job.iterator.next();
          if(result.done){remove(job);job.onComplete(result.value);}
        }catch(error){remove(job);job.onError(error);}
      }
    }finally{draining=false;wake();}
  }
  function add(iterator,{priority=1,onComplete=()=>{},onError=()=>{},onCancel=()=>{}}={}){
    const job={iterator,priority,onComplete,onError,onCancel};
    jobs.push(job);jobs.sort((a,b)=>a.priority-b.priority);wake();
    return{
      promote(){job.priority=0;jobs.sort((a,b)=>a.priority-b.priority);wake();},
      cancel(){
        if(!jobs.includes(job))return;
        remove(job);job.iterator.return?.();job.onCancel();
        if(!runnable())unschedule();
      }
    };
  }
  return{
    add,wake,
    clear(){
      unschedule();
      for(const job of jobs.splice(0)){job.iterator.return?.();job.onCancel();}
    }
  };
}
