// @ts-nocheck
/* 診断の動き（入場演出・質問・集計・結果表示）。元の HTML 版のロジックをそのまま移植しています。 */
import { BASE, LINKS, img, BRANDS, brandUrl, CASES, caseUrl, TYPES, ORDER, QUESTIONS } from "@/data/diagnosis";
import { geoOrthographic, geoPath, geoGraticule10 } from "d3-geo";
import { GEO_COAST, GEO_BORDERS, GEO_BRAND, GEO_PINS } from "@/data/geo";

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
  // 写真は最後に、右下の大きな線画の地球儀の上で「取扱ブランドの国」へ。地球儀はゆっくり回り、写真もピンについていく
  const canAnim = typeof Element!=="undefined" && typeof Element.prototype.animate==="function";
  let introTimers=[], pics=[], labels=[], marks=[], labSize=[], stageReady=false;
  const BRAND_PAGE = BASE + "/brand/";
  function later(fn,ms){ introTimers.push(setTimeout(fn,ms)); }
  const COUNTRIES = GEO_PINS.map(pin=>{
    const brands = Object.values(BRANDS).filter(b=>b.country===pin.name).map(b=>b.name);
    const imgs = Object.values(CASES).filter(c=>c.used.some(u=>brands.includes(u))).flatMap(c=>c.imgs.filter(f=>!/_ext_06_/.test(f)));
    return {...pin, brands, imgs};
  });
  const EU_BRANDS = COUNTRIES.reduce((n,c)=>n+c.brands.length,0);
  // ピンからラベルまでのずらし（単位の幅を 1 とした値）。ラベルどうしが重ならない向き
  const OFFSET = {DK:[-.1,-1.95], NL:[-1.75,-1.2], DE:[2.15,-.95], FR:[-1.8,.3], CH:[-1.35,1.35], IT:[.95,1.75], TR:[-.2,-1.45]};
  const BASE_ROT = [-38,-22,0];                       // 地球儀の正面（経度38°・緯度22°）→ ヨーロッパが左上に来る
  const GRAT = geoGraticule10();
  let G = null, rot = [...BASE_ROT], spinT0 = 0, raf = 0;
  const frame = fn => (typeof requestAnimationFrame==="function" ? requestAnimationFrame(fn) : setTimeout(()=>fn(performance.now()),16));
  const cancelFrame = id => (typeof cancelAnimationFrame==="function" ? cancelAnimationFrame(id) : clearTimeout(id));
  function layoutFor(W,H){
    const mobile = W<700;
    const pw = mobile ? Math.round(Math.max(38, Math.min(W*.11, 46))) : Math.round(Math.max(58, Math.min(W*.048, 76)));
    let R, cx, cy;
    if(mobile){
      // タイトルの下から地球儀が始まるように大きさを決める
      const en=$("entry"), eb = en ? en.offsetTop + en.offsetHeight : H*.42;
      R = Math.max(W*.8, Math.min(W*1.6, (H - eb - 14)/0.92));
      cx = W*.5 + R*.3; cy = H + R*.08;
    } else {
      R = Math.min(H*.98, W*.5); cx = W*.86; cy = H*1.04;
    }
    return {pw, ph:Math.round(pw*4/3), R, cx, cy, mobile, W, H, mk: mobile ? 15 : 20};
  }
  function makeGlobe(L){
    const proj = geoOrthographic().scale(L.R).translate([L.cx,L.cy]).clipAngle(90).precision(.6);
    return {L, proj, path:geoPath(proj)};
  }
  function buildGlobe(){
    const g=$("globe"); if(g.dataset.built) return;
    g.innerHTML = `<svg aria-hidden="true"><defs><pattern id="gHatch" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" class="g-hl"/></pattern><radialGradient id="gGlass" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".7" stop-color="#f2f0ec" stop-opacity=".7"/><stop offset="1" stop-color="#dcd8d1" stop-opacity=".7"/></radialGradient></defs>
      <path class="g-sphere" fill="url(#gGlass)"/><path class="g-grat"/><path class="g-hatch" fill="url(#gHatch)"/><path class="g-land"/><path class="g-border"/><path class="g-rim"/>
</svg>`;
    g.dataset.built="1";
    $("gcap").textContent = `${EU_BRANDS} European Brands — ${COUNTRIES.length} Countries`;
  }
  // 現在の回転で地球儀を描き、写真・線・ラベルをピンに合わせる
  function render(){
    if(!G) return;
    const {proj,path,L}=G; proj.rotate(rot);
    const sv=$("globe").firstElementChild, ps=sv.querySelectorAll("path");
    const sphere=path({type:"Sphere"});
    ps[0].setAttribute("d",sphere); ps[1].setAttribute("d",path(GRAT)||"");
    ps[2].setAttribute("d",path(GEO_BRAND)||""); ps[3].setAttribute("d",path(GEO_COAST)||"");
    ps[4].setAttribute("d",path(GEO_BORDERS)||""); ps[5].setAttribute("d",sphere);
    let lines="";
    COUNTRIES.forEach((c,i)=>{
      const [px,py]=proj(c.ll), [ox,oy]=OFFSET[c.code];
      if(marks[i]) marks[i].style.transform=`translate(${(px).toFixed(1)}px,${(py).toFixed(1)}px)`;
      const x=px+ox*L.pw, y=py+oy*L.pw, [lw,lh]=labSize[i]||[60,24];
      if(labels[i]) labels[i].style.transform=`translate(${(x-lw/2).toFixed(1)}px,${(y-lh/2).toFixed(1)}px)`;
      // ピンの少し上（アイコンの頭）からラベルの縁まで線を引く
      const ay=py-L.mk*1.1, dx=px-x, dy=ay-y, k=Math.min((lw/2+4)/Math.abs(dx||1e-6),(lh/2+4)/Math.abs(dy||1e-6),1);
      const sx=x+dx*k, sy=y+dy*k, len=Math.hypot(px-sx,ay-sy);
      lines+=`<line x1="${sx.toFixed(1)}" y1="${sy.toFixed(1)}" x2="${px.toFixed(1)}" y2="${ay.toFixed(1)}" style="--len:${len.toFixed(0)};transition-delay:${(.15+i*.07).toFixed(2)}s"/>`;
    });
    $("leaders").innerHTML=lines;
  }
  // 写真の着地点（指定した回転のとき）
  function targetsAt(r){
    G.proj.rotate(r);
    return COUNTRIES.map(c=>{ const [px,py]=G.proj(c.ll); return [px-G.L.pw/2, py-G.L.ph/2]; });
  }
  // ゆっくり左右に回り続ける（ヨーロッパは常に見える範囲）
  function spin(){
    cancelFrame(raf);
    if(reduceMotion) return;
    spinT0 = 0;
    const loop = t => {
      if(!$("s-intro").classList.contains("active")) { raf=0; return; }
      if(!spinT0) spinT0=t;
      const e=(t-spinT0)/1000;
      rot=[BASE_ROT[0]+Math.sin(e/6)*9, BASE_ROT[1]+Math.sin(e/9)*2.5, 0];
      render(); raf=frame(loop);
    };
    raf=frame(loop);
  }
  // 入場：地球儀が回りながら止まる
  function spinIn(ms){
    cancelFrame(raf);
    const from=[BASE_ROT[0]+150, BASE_ROT[1]+10, 0], t0=performance.now();
    const loop = t => {
      const p=Math.min(1,(t-t0)/ms), e=1-Math.pow(1-p,3);
      rot=[from[0]+(BASE_ROT[0]-from[0])*e, from[1]+(BASE_ROT[1]-from[1])*e, 0];
      render();
      if(p<1 && !stageReady) raf=frame(loop);
    };
    raf=frame(loop);
  }
  const tf=(x,y,r,s)=>`translate(${x}px,${y}px) rotate(${r}deg) scale(${s})`;
  function stageSize(){ const st=$("stage"); return [st.clientWidth||innerWidth, st.clientHeight||innerHeight]; }
  function buildPics(){
    const st=$("stage"); st.querySelectorAll(".pic,.plabel,.gmark").forEach(p=>p.remove());
    buildGlobe();
    const [W,H]=stageSize(), L=layoutFor(W,H); G=makeGlobe(L);
    st.style.setProperty("--pw",L.pw+"px");
    const used=new Set();
    pics = COUNTRIES.map((c,i)=>{
      const pool = shuffle(c.imgs.length?c.imgs:POOL.map(p=>p.src)).filter(f=>!used.has(f));
      const f = pool[0] || c.imgs[0]; used.add(f);
      const el=document.createElement("div"); el.className="pic"; el.style.zIndex=4+i;
      el.innerHTML=`<img src="${/^https?:/.test(f)?f:img(f)}" alt="">`; st.appendChild(el); return el;
    });
    // 国ごとの位置アイコンとラベル（ブランド一覧ページへのリンク）
    const PIN_SVG=`<svg viewBox="0 0 20 28" aria-hidden="true"><path d="M10 27.5C10 27.5 1 16.4 1 9.9a9 9 0 0 1 18 0C19 16.4 10 27.5 10 27.5Z"/><circle cx="10" cy="10" r="3.2"/></svg>`;
    marks = COUNTRIES.map((c,i)=>{
      const a=document.createElement("a"); a.className="gmark"; a.href=BRAND_PAGE; a.target="_blank"; a.rel="noopener";
      a.setAttribute("aria-label",`${c.name}：${c.brands.join("、")}`); a.style.setProperty("--d",(i*.07).toFixed(2)+"s");
      a.innerHTML=`<span>${PIN_SVG}</span>`; st.appendChild(a); return a;
    });
    labels = COUNTRIES.map((c,i)=>{
      const a=document.createElement("a"); a.className="plabel"; a.href=BRAND_PAGE; a.target="_blank"; a.rel="noopener";
      a.style.transitionDelay=(.3+i*.07).toFixed(2)+"s";
      a.innerHTML=`<b>${c.name}</b><span>${c.brands.join(" · ")}</span>`;
      st.appendChild(a); return a;
    });
    measureLabels();
    rot=[...BASE_ROT]; render();
    return L;
  }
  function measureLabels(){ labSize=labels.map(el=>[el.offsetWidth||60, el.offsetHeight||24]); }
  function settle(){
    const [W,H]=stageSize(), L=layoutFor(W,H);
    G=makeGlobe(L);
    $("stage").style.setProperty("--pw",L.pw+"px");
    pics.forEach(el=>{ if(el.getAnimations) el.getAnimations().forEach(a=>a.cancel()); el.style.opacity=0; });
    measureLabels(); render();
  }
  function finishIntro(){
    introTimers.forEach(clearTimeout); introTimers=[];
    stageReady=true; rot=[...BASE_ROT]; settle();
    $("stage").classList.add("name-in","name-out","globe-in","ready");
    setTimeout(()=>$("stage").classList.add("lines-in"),60);
    spin();
  }
  function runIntro(){
    introTimers.forEach(clearTimeout); introTimers=[]; cancelFrame(raf);
    const st=$("stage"); stageReady=false; st.classList.remove("name-in","name-out","globe-in","lines-in","ready");
    const L=buildPics();
    if(reduceMotion || !canAnim){ finishIntro(); return; }
    const [W,H]=stageSize(), n=pics.length;
    const S=Math.min(2.6,(H*.48)/L.ph);              // 重なっている時の拡大率
    const sx=W/2-L.pw/2, sy=H/2-L.ph/2;               // 中央
    const rots=pics.map((_,i)=> i===n-1 ? 0 : Math.random()*10-5);
    const loads=pics.map(el=>{ const im=el.querySelector("img"); return im.complete?Promise.resolve():new Promise(r=>{ im.onload=im.onerror=r; }); });
    later(()=>st.classList.add("name-in"), 100);       // 社名・スローガン表示
    later(()=>st.classList.add("name-out"), 2300);     // 渐隐
    later(()=>{
      Promise.race([Promise.all(loads), new Promise(r=>setTimeout(r,2000))]).then(()=>{
        if(stageReady) return;
        // ① 右上から飛来し、中央に重なる
        pics.forEach((el,i)=>el.animate([
          {transform:tf(W*.62,-H*.6-L.ph,24,S),opacity:0},
          {opacity:.55,offset:.45},
          {transform:tf(sx,sy,rots[i],S),opacity:i===n-1?1:.9}
        ],{duration:950,delay:i*130,easing:"cubic-bezier(.22,.9,.3,1)",fill:"both"}));
        // ② 地球儀が回りながら現れ、写真はそれぞれの国へ
        later(()=>{
          if(stageReady) return;
          const SPIN=1900, T=targetsAt(BASE_ROT);
          st.classList.add("globe-in"); spinIn(SPIN);
          pics.forEach((el,i)=>{
            el.getAnimations().forEach(a=>a.cancel());
            el.animate([
              {transform:tf(sx,sy,rots[i],S),opacity:i===n-1?1:.9},
              {transform:tf(T[i][0],T[i][1],0,.55),opacity:1,offset:.82},
              {transform:tf(T[i][0],T[i][1],0,.05),opacity:0}
            ],{duration:1400,delay:500+(n-1-i)*70,easing:"cubic-bezier(.7,0,.2,1)",fill:"both"});
          });
          later(finishIntro, Math.max(SPIN, 500+(n-1)*70+1400)+40);
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
  const onResize=()=>{ clearTimeout(resizeT); resizeT=setTimeout(()=>{ if($("s-intro").classList.contains("active")){ if(stageReady) settle(); else { const [W,H]=stageSize(); G=makeGlobe(layoutFor(W,H)); render(); } } },150); };

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

  // UI ボード（全画面一覧）用：画面を直接切り替えるためのフック
  if (typeof window!=="undefined" && window.__DIAG_DEBUG) window.__diag={start,show,finishIntro,renderQ,renderResult,runLoader,setAnswers:a=>{answers=a},go:n=>{cur=n;renderQ();}};

  return () => {
    removeEventListener("resize",onResize);
    cancelFrame(raf);
    introTimers.forEach(clearTimeout);
    clearTimeout(loaderT);
  };
}
