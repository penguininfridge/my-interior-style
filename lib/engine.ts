// @ts-nocheck
/* 診断の動き（入場演出・質問・集計・結果表示）。元の HTML 版のロジックをそのまま移植しています。 */
import { BASE, LINKS, img, BRANDS, brandUrl, CASES, caseUrl, TYPES, ORDER, QUESTIONS } from "@/data/diagnosis";

export function initDiagnosis(): () => void {
  /* =========================================================
     HELPERS
     ========================================================= */
  const $ = id => document.getElementById(id);
  const pad = n => String(n).padStart(2,"0");
  const shuffle = a => { a=[...a]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
  const reduceMotion = (()=>{ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } })();
  function setUrl(q){ try{ history.replaceState(null,"",q || location.pathname); }catch(e){} }
  function shareUrl(slug){
    try{ if(location.protocol.startsWith("http")) return `${location.origin}${location.pathname}?r=${slug}`; }catch(e){}
    return `?r=${slug}`;
  }
  function toast(msg){ const t=$("toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),1600); }
  function show(id){
    document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
    $(id).classList.add("active"); window.scrollTo(0,0);
  }
  // 全事例の画像プール
  const POOL = Object.entries(CASES).flatMap(([k,c]) => c.imgs.map(f=>({src:img(f), caseKey:k})));
  // 各タイプの主画像：性格のイメージに合う1枚を個別に指定
  const caseOfType = k => CASES[TYPES[k].hero[0]];
  const heroOf = k => img(TYPES[k].hero[1]);

  /* =========================================================
     INTRO / LANDING（写真が右上から飛来 → 中央に重なる → 四方へ散らばる）
     ========================================================= */
  // 散らばった後の位置（写真の中心、ステージに対する%）。中央の文字に重ならない配置
  const SPOTS_DESKTOP = [[42,14],[67,24],[88,31],[10,37],[21,67],[11,88],[64,84],[87,82],[44,91]];
  const SPOTS_MOBILE  = [[18,17],[50,13],[82,19],[16,86],[49,90],[82,85]];
  const canAnim = typeof Element!=="undefined" && typeof Element.prototype.animate==="function";
  let introTimers=[], pics=[], stageReady=false;
  function later(fn,ms){ introTimers.push(setTimeout(fn,ms)); }
  function layoutFor(W,H){
    const mobile = W<700;
    if(!mobile){
      const pw = Math.round(Math.max(84,Math.min(W*.085,140)));
      return {pw, ph:Math.round(pw*4/3), P:SPOTS_DESKTOP};
    }
    // スマホ：上部バーと中央のタイトルを避け、上下の余白に3枚ずつ収める
    const bar = document.querySelector("#stage .bar"), entry = document.querySelector("#stage .entry");
    const barB = (bar ? bar.offsetHeight : 56) + 10;
    const eh = Math.min(entry ? entry.offsetHeight : 320, H*.6);
    const topZ=[barB, H/2-eh/2-14], botZ=[H/2+eh/2+14, H-14];
    const zoneH = Math.min(topZ[1]-topZ[0], botZ[1]-botZ[0]);
    let pw = Math.round(Math.min(W*.24,110));
    if(pw*4/3 > zoneH) pw = Math.max(52, Math.round(zoneH*3/4));
    const ph = Math.round(pw*4/3);
    const slackT = Math.max(0,(topZ[1]-topZ[0]-ph)/2), slackB = Math.max(0,(botZ[1]-botZ[0]-ph)/2);
    const cT=(topZ[0]+topZ[1])/2, cB=(botZ[0]+botZ[1])/2;
    const xs=[.19,.5,.81], jt=[.4,-.5,.7], jb=[-.6,.5,-.3];
    const P = [...xs.map((x,i)=>[x*W, cT+jt[i]*slackT]), ...xs.map((x,i)=>[x*W, cB+jb[i]*slackB])];
    return {pw, ph, P, abs:true};
  }
  const tf=(x,y,r,s)=>`translate(${x}px,${y}px) rotate(${r}deg) scale(${s})`;
  function stageSize(){ const st=$("stage"); return [st.clientWidth||innerWidth, st.clientHeight||innerHeight]; }
  function finalPos(i,L,W,H){ const [px,py]=L.P[i]; return L.abs ? [px-L.pw/2, py-L.ph/2] : [W*px/100-L.pw/2, H*py/100-L.ph/2]; }
  function buildPics(){
    const st=$("stage"); st.querySelectorAll(".pic").forEach(p=>p.remove());
    const [W,H]=stageSize(), L=layoutFor(W,H);
    st.style.setProperty("--pw",L.pw+"px");
    pics = shuffle(POOL).slice(0,L.P.length).map((p,i)=>{
      const el=document.createElement("div"); el.className="pic"; el.style.zIndex=2+i;
      el.innerHTML=`<img src="${p.src}" alt="">`; st.appendChild(el); return el;
    });
    return L;
  }
  function settle(){
    const [W,H]=stageSize(), L=layoutFor(W,H);
    if(L.P.length!==pics.length) buildPics();
    $("stage").style.setProperty("--pw",L.pw+"px");
    pics.forEach((el,i)=>{
      if(el.getAnimations) el.getAnimations().forEach(a=>a.cancel());
      const [x,y]=finalPos(i,L,W,H);
      el.style.transform=tf(x,y,0,1); el.style.opacity=1;
    });
  }
  function finishIntro(){
    introTimers.forEach(clearTimeout); introTimers=[];
    stageReady=true; settle();
    $("stage").classList.add("name-in","name-out","ready");
  }
  function runIntro(){
    introTimers.forEach(clearTimeout); introTimers=[];
    const st=$("stage"); stageReady=false; st.classList.remove("name-in","name-out","ready");
    const L=buildPics();
    if(reduceMotion || !canAnim){ finishIntro(); return; }
    const [W,H]=stageSize(), n=pics.length;
    const S=Math.min(2.4,(H*.52)/L.ph);              // 重なっている時の拡大率
    const sx=W/2-L.pw/2, sy=H/2-L.ph/2;               // 中央
    const rots=pics.map((_,i)=> i===n-1 ? 0 : Math.random()*10-5);
    const loads=pics.map(el=>{ const im=el.querySelector("img"); return im.complete?Promise.resolve():new Promise(r=>{ im.onload=im.onerror=r; }); });
    later(()=>st.classList.add("name-in"), 100);       // 社名・スローガン表示
    later(()=>st.classList.add("name-out"), 2300);     // 渐隐
    later(()=>{
      Promise.race([Promise.all(loads), new Promise(r=>setTimeout(r,2000))]).then(()=>{
        if(stageReady) return;
        // ① 右上から半透明で飛来し、中央に重なる
        pics.forEach((el,i)=>el.animate([
          {transform:tf(W*.62,-H*.6-L.ph,24,S),opacity:0},
          {opacity:.55,offset:.45},
          {transform:tf(sx,sy,rots[i],S),opacity:i===n-1?1:.9}
        ],{duration:950,delay:i*130,easing:"cubic-bezier(.22,.9,.3,1)",fill:"both"}));
        // ② 四方へ散らばる
        later(()=>{
          if(stageReady) return;
          pics.forEach((el,i)=>{
            const [x,y]=finalPos(i,L,W,H);
            el.getAnimations().forEach(a=>a.cancel());
            el.animate([
              {transform:tf(sx,sy,rots[i],S),opacity:i===n-1?1:.9},
              {transform:tf(x,y,0,1),opacity:1}
            ],{duration:1150,delay:(n-1-i)*55,easing:"cubic-bezier(.7,0,.2,1)",fill:"both"});
          });
          later(finishIntro,(n-1)*55+1200);
        },(n-1)*130+950+350);
      });
    },3100);                                           // 文字が消えてから写真が入場
  }
  // タイトル演出から最初に戻る
  function replay(){
    answers=[]; cur=0; setUrl();
    show("s-intro"); runIntro();
  }
  let resizeT;
  const onResize=()=>{ clearTimeout(resizeT); resizeT=setTimeout(()=>{ if(stageReady && $("s-intro").classList.contains("active")) settle(); },150); };

  /* =========================================================
     QUIZ
     ========================================================= */
  let answers=[], order=[], cur=0, qImgs=[];
  function start(){
    answers=[]; cur=0;
    order = QUESTIONS.map(q=>shuffle(q.o.map((_,i)=>i)));
    // 質問ごとに異なる事例写真（各事例の主画像以外から）
    const seen=new Set();
    qImgs = shuffle(POOL.filter(p=>!/_ext_06_/.test(p.src))).filter(p=>{ if(seen.has(p.caseKey)&&seen.size<Object.keys(CASES).length) return false; seen.add(p.caseKey); return true; });
    qImgs = [...qImgs, ...shuffle(POOL)].slice(0,QUESTIONS.length);
    $("qimg").innerHTML = "";
    setUrl(); show("s-quiz"); renderQ(true);
  }
  function setQImg(){
    const p=qImgs[cur], box=$("qimg");
    const im=new Image(); im.src=p.src; im.alt="";
    box.appendChild(im);
    requestFrame(()=>im.classList.add("on"));
    [...box.querySelectorAll("img")].slice(0,-1).forEach(o=>{ o.classList.remove("on"); setTimeout(()=>o.remove(),900); });
    const c=CASES[p.caseKey];
    $("qcap").textContent = `Case — ${c.title}`;
  }
  function requestFrame(fn){ setTimeout(fn,30); }
  function renderQ(first){
    const q=QUESTIONS[cur];
    const paint=()=>{
      $("qNo").textContent=pad(cur+1);
      $("qOf").textContent=`/ ${QUESTIONS.length}`;
      $("bar").style.width=(cur/QUESTIONS.length*100)+"%";
      $("topprog").setAttribute("aria-valuenow",cur);
      $("backBtn").disabled = cur===0;
      $("qText").textContent=q.q;
      const box=$("options"); box.innerHTML="";
      order[cur].forEach((idx,n)=>{
        const [label,type]=q.o[idx];
        const b=document.createElement("button");
        b.className="opt"+(answers[cur]===type?" picked":"");
        b.innerHTML=`<span class="k">${pad(n+1)}</span><span>${label}</span>`;
        b.onclick=()=>pick(type,b);
        box.appendChild(b);
      });
      setQImg();
    };
    const a=$("qanim");
    if(first){ paint(); return; }
    a.classList.add("leave");
    setTimeout(()=>{ paint(); a.classList.remove("leave"); a.classList.add("enter"); requestFrame(()=>a.classList.remove("enter")); },300);
  }
  let picking=false;
  function pick(type,el){
    if(picking) return; picking=true;
    answers[cur]=type;
    document.querySelectorAll(".opt").forEach(o=>o.classList.remove("picked"));
    el.classList.add("picked");
    setTimeout(()=>{
      picking=false;
      if(cur<QUESTIONS.length-1){ cur++; renderQ(); } else finish();
    },320);
  }
  function score(){
    const s=Object.fromEntries(ORDER.map(k=>[k,0]));
    answers.forEach(t=>s[t]++);
    const max=Math.max(...Object.values(s));
    for(let i=answers.length-1;i>=0;i--) if(s[answers[i]]===max) return {top:answers[i],s};
    return {top:"A",s};
  }
  function finish(){
    $("bar").style.width="100%";
    show("s-loading");
    const {top,s}=score();
    const pre=new Image(); pre.src=heroOf(top);
    runLoader(2600, ()=>renderResult(top,s));
  }
  // 0→100% の進捗リングと「計算中」メッセージ
  const LOAD_MSGS=["回答を集計しています…","あなたのスタイルを計算中…","似合うブランドを選んでいます…","納品事例を探しています…"];
  let loaderT;
  function runLoader(ms,done){
    clearTimeout(loaderT);
    const C=2*Math.PI*45, fg=$("ringFg"), pct=$("pct"), txt=$("ltext"), ring=$("ring");
    fg.style.strokeDasharray=C; fg.style.strokeDashoffset=C;
    let shown=-1; const t0=Date.now();
    const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
    (function tick(){
      const p=Math.min(1,(Date.now()-t0)/ms), v=ease(p), n=Math.round(v*100);
      fg.style.strokeDashoffset=C*(1-v);
      pct.innerHTML=`${n}<small>%</small>`; ring.setAttribute("aria-valuenow",n);
      const mi=Math.min(LOAD_MSGS.length-1,Math.floor(p*LOAD_MSGS.length));
      if(mi!==shown){
        shown=mi; txt.classList.add("fade");
        setTimeout(()=>{ txt.textContent=LOAD_MSGS[mi]; txt.classList.remove("fade"); }, shown===0?0:180);
      }
      if(p<1) loaderT=setTimeout(tick,30);
      else { txt.textContent="診断完了"; loaderT=setTimeout(done,450); }
    })();
  }

  /* =========================================================
     RESULT
     ========================================================= */
  function renderResult(key,s){
    const T=TYPES[key];
    document.documentElement.style.setProperty("--type",T.color);
    const url=shareUrl(T.slug); setUrl(`?r=${T.slug}`);
    const total=answers.length||1;

    const bars = s ? `
      <div class="sec"><h3>Your Mix<small class="mini">あなたの成分</small></h3><div class="bars">
        ${ORDER.map(k=>({k,v:s[k]})).sort((a,b)=>b.v-a.v).map(({k,v})=>`
          <div class="brow ${k===key?"me":""}"><span>${TYPES[k].name}</span><div class="tr"><i data-w="${v/total*100}"></i></div><span class="p">${Math.round(v/total*100)}%</span></div>`).join("")}
      </div></div>` : "";

    const brands = T.brands.map(b=>{ const B=BRANDS[b.key]; return `
      <a class="brand" href="${brandUrl(B.id)}" target="_blank" rel="noopener">
        <div class="nm">${B.name}${b.main?'<span class="main-mark" title="代表ブランド"></span>':""}<small class="mini">${B.country}${b.main?" · Main":""}</small></div>
        <p>${b.note}</p><span class="ar">→</span></a>`; }).join("");

    const designers = T.designers.length ? `
      <div class="sec"><h3>Designers<small class="mini">あなたに近いデザイナー</small></h3><div class="designers">
        ${T.designers.map(([n,sl,why])=>`<div class="dz"><a href="${BASE}/designer/${sl}/" target="_blank" rel="noopener">${n}</a><p>${why||""}</p></div>`).join("")}
      </div></div>` : "";

    const cases = T.cases.map(ck=>{ const C=CASES[ck]; return `
      <a class="case" href="${caseUrl(C.id)}" target="_blank" rel="noopener">
        <div class="im"><img src="${img(C.imgs[0])}" alt="${C.title}" loading="lazy"></div>
        <div class="t1">${C.title}</div><div class="t2">${C.area}</div>
        <div class="used mini">使用ブランド — <b>${C.used.join(" / ")}</b></div></a>`; }).join("");
    const stripImgs = T.cases.flatMap(ck=>CASES[ck].imgs.slice(1)).slice(0,4);
    const strip = stripImgs.length ? `<div class="strip">${stripImgs.map(f=>`<img src="${img(f)}" alt="" loading="lazy">`).join("")}</div>` : "";

    const others = ORDER.filter(k=>k!==key).map(k=>`
      <button class="oth" data-k="${k}"><div class="im"><img src="${heroOf(k)}" alt="" loading="lazy"></div><div class="n">${TYPES[k].name}</div></button>`).join("");

    const shareText=encodeURIComponent(`私は「${T.name}」タイプでした！\n#ヨーロッパインテリア診断`);

    $("result").innerHTML = `
      <div class="bar"><span class="logo">セラトレーディング</span><button class="lb mini" id="resReplay">↺ はじめから</button></div>
      <div class="res">
        <div class="rhero" id="rhero">
          <div class="ph"><img src="${heroOf(key)}" alt="${caseOfType(key).title}"></div>
          <div class="txt">
            <div class="you mini">あなたのスタイルは</div>
            <h2>${T.name.replace(/(の|・)/,"$1<wbr>")}</h2>
            <div class="en">${T.en}</div>
            <div class="catch">${T.catch}</div>
            <div class="origin mini">${T.origin} — Photo: ${caseOfType(key).title}</div>
          </div>
        </div>
        <div class="sec"><h3>Your Style<small class="mini">あなたのタイプ</small></h3><div>
          <p class="desc">${T.desc}</p></div></div>
        ${bars}
        <div class="sec"><h3>Brands<small class="mini">あなたに似合うブランド</small></h3><div class="brands">${brands}</div></div>
        ${designers}
        <div class="sec"><h3>Case Study<small class="mini">このスタイルの納品事例</small></h3><div><div class="cases">${cases}</div>${strip}</div></div>
        <div class="cta">
          <div class="q">実物の質感は、ぜひショールームで。</div>
          <div class="btns">
            <a class="btn" href="${LINKS.showroom}" target="_blank" rel="noopener">ショールームを予約する →</a>
            <a class="btn ghost" href="${LINKS.catalogue}" target="_blank" rel="noopener">カタログを請求する</a>
          </div>
          <div class="share">
            <a class="mini" href="https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(url)}" target="_blank" rel="noopener">Share on X</a>
            <a class="mini" href="https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}" target="_blank" rel="noopener">LINE</a>
            <button class="mini" id="copyBtn">Copy Link</button>
          </div>
        </div>
        <div class="sec"><h3>Other Styles<small class="mini">ほかのタイプ</small></h3><div class="others">${others}</div></div>
        <div class="retry"><button class="btn ghost" id="retryBtn">もう一度診断する</button></div>
      </div>
      <footer class="mini"><span>見つけよう！あなたのヨーロッパインテリアスタイル診断</span><span>※本診断はエンターテインメントです ／ 写真：セラトレーディング納品事例より</span></footer>`;

    show("s-result");
    setTimeout(()=>{
      $("rhero").classList.add("show");
      document.querySelectorAll(".tr i").forEach(i=>i.style.width=i.dataset.w+"%");
    },80);
    $("retryBtn").onclick=start;
    $("resReplay").onclick=replay;
    $("copyBtn").onclick=()=>{ try{ navigator.clipboard.writeText(url).then(()=>toast("リンクをコピーしました"),()=>toast("コピーできませんでした")); }catch(e){ toast("コピーできませんでした"); } };
    document.querySelectorAll(".oth").forEach(b=>b.onclick=()=>renderResult(b.dataset.k,null));
  }

  /* INIT */
  $("startBtn").onclick=start;
  $("backBtn").onclick=()=>{ if(cur>0){ cur--; renderQ(); } };
  $("restartBtn").onclick=replay;
  $("skipBtn").onclick=e=>{ e.stopPropagation(); finishIntro(); };
  $("stage").addEventListener("click",()=>{ if(!stageReady) finishIntro(); });
  addEventListener("resize",onResize);

  let sharedKey=null;
  try{ const r=new URLSearchParams(location.search).get("r"); sharedKey=ORDER.find(k=>TYPES[k].slug===r)||null; }catch(e){}
  if(sharedKey){ renderResult(sharedKey,null); }
  else runIntro();

  return () => {
    removeEventListener("resize",onResize);
    introTimers.forEach(clearTimeout);
    clearTimeout(loaderT);
  };
}
