(function(){
"use strict";
var D=window.FAD, $=function(s,r){return (r||document).querySelector(s)},
    $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))},
    el=function(t,c,x){var n=document.createElement(t);if(c)n.className=c;if(x!=null)n.textContent=x;return n};

/* ---------- storage ---------- */
var KEY="fad.v1", S=load();
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return{}}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function def(k,v){if(S[k]===undefined){S[k]=v;save()}return S[k]}

def("tier",1);
def("party",[1,2,3,4].map(function(i){return{name:"PC "+i,cls:"",lv:1,hp:5,max:5,mad:0,clue:0,notes:""}}));
def("foes",0); def("log",[]); def("map",{w:28,h:20,cells:{}});
def("camp",{hex:"",rows:[["","","",""],["","","",""],["","","",""],["","","",""],["","","",""]],threads:""});
def("checks",{});

/* ---------- tabs ---------- */
$$("nav button").forEach(function(b){
  b.onclick=function(){
    $$("nav button").forEach(function(x){x.classList.remove("on")});
    $$("main section").forEach(function(x){x.classList.remove("on")});
    b.classList.add("on"); $("#"+b.dataset.t).classList.add("on");
    S.tab=b.dataset.t; save();
    if(b.dataset.t==="map") drawMap();
  };
});
(function(){var t=S.tab||"order"; var b=$('nav button[data-t="'+t+'"]')||$("nav button"); b.click();})();

/* ---------- 1. adventure order ---------- */
(function(){
  var w=$("#orderBody");
  D.ORDER.forEach(function(ph){
    var box=el("div","phase"); box.appendChild(el("b",null,ph[0]));
    ph[1].forEach(function(st){
      var r=el("div","chk"),
          cb=el("input"); cb.type="checkbox"; cb.checked=!!S.checks[st[0]];
      cb.onchange=function(){S.checks[st[0]]=cb.checked;save()};
      r.appendChild(cb); r.appendChild(el("span","id",st[0]));
      var m=el("div"); m.appendChild(el("div",null,st[1]));
      if(st[2]) m.appendChild(el("div","lk",st[2]));
      r.appendChild(m); box.appendChild(r);
    });
    w.appendChild(box);
  });
  $("#clearChecks").onclick=function(){S.checks={};save();$$("#orderBody input").forEach(function(c){c.checked=false})};
})();

/* ---------- 2. dice ---------- */
function rollDie(n){return 1+Math.floor(Math.random()*n)}
function tierInfo(){return D.TIERS[(S.tier||1)-1]}
function explode(){
  var t=tierInfo(), steps=[], total=0, r;
  do{ r=rollDie(t.die); steps.push(r); total+=r; }while(r>=t.exp && steps.length<20);
  return {total:total,steps:steps};
}
function doRoll(){
  var mod=parseInt($("#mod").value||0,10)||0,
      L=parseInt($("#foeL").value,10),
      kind=$("#foeKind").value,
      e=explode(), tot=e.total+mod,
      o=$("#diceOut"), v=$("#verdict");
  o.textContent=tot;
  $("#steps").textContent=e.steps.join(" + ")+(mod?"  "+(mod<0?"-":"+")+" "+Math.abs(mod):"")
    +(e.steps.length>1?"   (exploded x"+(e.steps.length-1)+")":"");
  if(isNaN(L)){ o.className="out"; v.textContent=""; return; }
  var hit=tot>=L;
  o.className="out "+(hit?"win":"lose");
  if(!hit){ v.textContent="MISS — needed "+L; v.style.color="var(--bad)"; return; }
  v.style.color="var(--ok)";
  if(kind==="minor"){ var k=Math.floor(tot/L); v.textContent="HIT — kills "+k+" minor foe"+(k===1?"":"s"); }
  else { var dmg=Math.floor(tot/L); v.textContent="HIT — "+dmg+" damage"; }
}
$("#roll").onclick=doRoll;
$("#tier").onchange=function(){S.tier=+this.value;save();syncTier()};
function syncTier(){var t=tierInfo();$("#tier").value=t.t;
  $("#tierNote").textContent="d"+t.die+" · explodes on "+t.exp+"+ · levels "+t.lv+" · "+t.book;}
D.TIERS.forEach(function(t){var o=el("option",null,"Tier "+t.t+" — L"+t.lv+" (d"+t.die+")");o.value=t.t;$("#tier").appendChild(o)});
syncTier();
$$(".quick [data-q]").forEach(function(b){ b.onclick=function(){
  var n=+b.dataset.q, r=rollDie(n), o=$("#diceOut");
  o.className="out"; o.textContent=r; $("#steps").textContent="d"+n;
  $("#verdict").textContent=b.dataset.lbl||""; $("#verdict").style.color="var(--dim)";
};});

/* tables */
(function(){
  var w=$("#tablesBody");
  Object.keys(D.TABLES).forEach(function(k){
    var t=D.TABLES[k], c=el("div","card");
    var h=el("h2"); h.textContent=t.name;
    if(t.ref){var s=el("span","ref","  "+t.ref); h.appendChild(s);}
    c.appendChild(h);
    var tb=el("table"); t.rows.forEach(function(r){
      var tr=el("tr"); tr.appendChild(el("td",null,r[0])); tr.appendChild(el("td",null,r[1]||""));
      tb.appendChild(tr);
    });
    c.appendChild(tb);
    if(t.note) c.appendChild(el("div","note",t.note));
    w.appendChild(c);
  });
})();

/* ---------- 3. map ---------- */
var CELL=22, mode="wall";
function drawMap(){
  var m=S.map, cv=$("#mapCanvas");
  cv.width=m.w*CELL; cv.height=m.h*CELL;
  var g=cv.getContext("2d");
  g.fillStyle="#0e1014"; g.fillRect(0,0,cv.width,cv.height);
  g.strokeStyle="#242a35"; g.lineWidth=1;
  for(var x=0;x<=m.w;x++){g.beginPath();g.moveTo(x*CELL+.5,0);g.lineTo(x*CELL+.5,cv.height);g.stroke()}
  for(var y=0;y<=m.h;y++){g.beginPath();g.moveTo(0,y*CELL+.5);g.lineTo(cv.width,y*CELL+.5);g.stroke()}
  Object.keys(m.cells).forEach(function(k){
    var p=k.split(","), cx=+p[0]*CELL, cy=+p[1]*CELL, v=m.cells[k];
    if(v==="wall"){g.fillStyle="#cfd6e2";g.fillRect(cx+1,cy+1,CELL-1,CELL-1)}
    else if(v==="cav"){g.fillStyle="#6ea97f";g.fillRect(cx+1,cy+1,CELL-1,CELL-1)}
    else if(v==="ruin"){g.fillStyle="#c08a4e";g.fillRect(cx+1,cy+1,CELL-1,CELL-1)}
    else if(v==="door"){g.fillStyle="#e0a44a";g.fillRect(cx+4,cy+4,CELL-8,CELL-8)}
    else if(v==="s"){g.fillStyle="#14161b";g.fillRect(cx+1,cy+1,CELL-1,CELL-1);
      g.fillStyle="#45b4c9";g.font="bold 13px sans-serif";g.textAlign="center";g.textBaseline="middle";
      g.fillText("S",cx+CELL/2,cy+CELL/2+1)}
    else if(v==="foe"){g.fillStyle="#14161b";g.fillRect(cx+1,cy+1,CELL-1,CELL-1);
      g.fillStyle="#e05b50";g.font="bold 13px sans-serif";g.textAlign="center";g.textBaseline="middle";
      g.fillText("X",cx+CELL/2,cy+CELL/2+1)}
  });
}
function paint(ev){
  var cv=$("#mapCanvas"), r=cv.getBoundingClientRect(),
      sc=cv.width/r.width,
      t=ev.touches?ev.touches[0]:ev,
      x=Math.floor((t.clientX-r.left)*sc/CELL), y=Math.floor((t.clientY-r.top)*sc/CELL);
  if(x<0||y<0||x>=S.map.w||y>=S.map.h) return;
  var k=x+","+y;
  if(mode==="erase") delete S.map.cells[k]; else S.map.cells[k]=mode;
  save(); drawMap();
}
var painting=false;
$("#mapCanvas").addEventListener("pointerdown",function(e){painting=true;paint(e);e.preventDefault()});
$("#mapCanvas").addEventListener("pointermove",function(e){if(painting)paint(e)});
window.addEventListener("pointerup",function(){painting=false});
$$("#tools button[data-m]").forEach(function(b){ b.onclick=function(){
  $$("#tools button[data-m]").forEach(function(x){x.classList.remove("on")});
  b.classList.add("on"); mode=b.dataset.m;
};});
$('#tools button[data-m="wall"]').classList.add("on");
$("#mapClear").onclick=function(){ if(confirm("Clear the whole map?")){S.map.cells={};save();drawMap()} };
$("#mapSize").onchange=function(){
  var p=this.value.split("x"); S.map.w=+p[0]; S.map.h=+p[1]; save(); drawMap();
};

/* ---------- 4. party ---------- */
function renderParty(){
  var w=$("#partyBody"); w.innerHTML="";
  S.party.forEach(function(p,i){
    var c=el("div","pc");
    var h=el("h4"); var nm=el("input"); nm.value=p.name;
    nm.oninput=function(){p.name=nm.value;save()}; h.appendChild(nm); c.appendChild(h);
    function stat(lbl,key,min,max){
      var r=el("div","stat"); r.appendChild(el("span",null,lbl));
      var inp=el("input"); inp.type="number"; inp.value=p[key]; if(min!=null)inp.min=min; if(max!=null)inp.max=max;
      inp.oninput=function(){p[key]=+inp.value;save();if(key==="max")renderParty()};
      r.appendChild(inp); return r;
    }
    var cl=el("div","stat"); cl.appendChild(el("span",null,"Class"));
    var ci=el("input"); ci.value=p.cls; ci.oninput=function(){p.cls=ci.value;save()};
    ci.style.width="auto"; ci.style.flex="1"; cl.appendChild(ci); c.appendChild(cl);
    c.appendChild(stat("Level","lv",1));
    c.appendChild(stat("Max life","max",1));
    var lr=el("div","stat"); lr.appendChild(el("span",null,"Life"));
    var pips=el("div","pips");
    for(var j=1;j<=Math.max(p.max,p.hp);j++){ (function(j){
      var d=el("div","pip"+(j<=p.hp?" on":""));
      d.onclick=function(){ p.hp = (p.hp===j? j-1 : j); save(); renderParty(); };
      pips.appendChild(d);
    })(j); }
    lr.appendChild(pips); c.appendChild(lr);
    [["Madness","mad"],["Clues","clue"]].forEach(function(x){
      var r=el("div","stat"); r.appendChild(el("span",null,x[0]));
      var ct=el("div","counter");
      var m=el("button",null,"−"); m.onclick=function(){p[x[1]]=Math.max(0,p[x[1]]-1);save();renderParty()};
      var b=el("b",null,p[x[1]]);
      var pl=el("button",null,"+"); pl.onclick=function(){p[x[1]]++;save();renderParty()};
      ct.appendChild(m);ct.appendChild(b);ct.appendChild(pl); r.appendChild(ct); c.appendChild(r);
    });
    var nt=el("textarea"); nt.placeholder="gear, spells used, traits…"; nt.value=p.notes;
    nt.oninput=function(){p.notes=nt.value;save()}; nt.style.minHeight="48px"; c.appendChild(nt);
    w.appendChild(c);
  });
  var tot=S.party.reduce(function(a,p){return a+p.clue},0);
  $("#clueTotal").textContent=tot+" clues = "+Math.floor(tot/3)+" secret(s)";
  $("#foeCount").textContent=S.foes;
}
$("#foeMinus").onclick=function(){S.foes=Math.max(0,S.foes-1);save();renderParty()};
$("#foePlus").onclick=function(){S.foes++;save();renderParty()};
$("#bossRoll").onclick=function(){
  var r=rollDie(6), t=r+S.foes;
  $("#bossOut").textContent="d6 "+r+" + "+S.foes+" = "+t+(t>=6?"  → THIS IS THE FINAL BOSS":"  → not yet");
  $("#bossOut").style.color = t>=6 ? "var(--bad)" : "var(--dim)";
};
$("#newDive").onclick=function(){
  if(!confirm("New dive: reset Major Foe tally, checklist and map?")) return;
  S.foes=0; S.checks={}; S.map.cells={}; save(); renderParty(); drawMap();
  $$("#orderBody input").forEach(function(c){c.checked=false});
};
renderParty();

/* ---------- 5. log ---------- */
function renderLog(){
  var w=$("#logBody"); w.innerHTML="";
  S.log.slice().reverse().forEach(function(e,ri){
    var i=S.log.length-1-ri, d=el("div","entry");
    var t=el("time",null,e.t); d.appendChild(t);
    d.appendChild(el("div",null,e.x));
    var x=el("button",null,"✕"); x.onclick=function(){S.log.splice(i,1);save();renderLog()};
    d.appendChild(x); w.appendChild(d);
  });
  if(!S.log.length) w.appendChild(el("div","note","Nothing logged yet."));
}
function addLog(txt){
  if(!txt.trim())return;
  var n=new Date();
  S.log.push({t:("0"+n.getHours()).slice(-2)+":"+("0"+n.getMinutes()).slice(-2),x:txt.trim()});
  save(); renderLog();
}
$("#logAdd").onclick=function(){addLog($("#logIn").value);$("#logIn").value=""};
$("#logIn").addEventListener("keydown",function(e){if(e.key==="Enter"){addLog(this.value);this.value=""}});
renderLog();

/* ---------- 6. lookup ---------- */
var INDEX=[];
Object.keys(D.TABLES).forEach(function(k){var t=D.TABLES[k];
  INDEX.push({a:t.name,b:t.ref||"",c:"table"});
  t.rows.forEach(function(r){INDEX.push({a:r[0]+" — "+(r[1]||""),b:t.ref||"",c:t.name})});
});
D.ENVIRONMENTS.forEach(function(e){INDEX.push({a:e[0],b:e[1]+" "+e[2],c:"environment"})});
D.TOWN.forEach(function(e){INDEX.push({a:e[0],b:e[1],c:"town"})});
D.TIERUP.forEach(function(e){INDEX.push({a:e[0],b:e[1],c:"above tier 1"})});
D.ORDER.forEach(function(ph){ph[1].forEach(function(s){INDEX.push({a:s[1],b:s[2],c:ph[0]})})});
Object.keys(D.BOOKS).forEach(function(k){var b=D.BOOKS[k];INDEX.push({a:k+" — "+b.n,b:b.f,c:"book"})});
function search(q){
  var w=$("#lookBody"); w.innerHTML=""; q=q.trim().toLowerCase();
  var hits=q? INDEX.filter(function(i){return (i.a+" "+i.b+" "+i.c).toLowerCase().indexOf(q)>=0}) : [];
  if(!q){ w.appendChild(el("div","note","Type a rule, a book code, or a page — e.g. door, morale, clue, TDoor, 152.")); return; }
  if(!hits.length){ w.appendChild(el("div","note","No match.")); return; }
  hits.slice(0,60).forEach(function(h){
    var d=el("div","hit"); d.appendChild(el("b",null,h.a));
    var s=el("span"); s.textContent=h.c+(h.b?"  ·  ":""); 
    if(h.b){var r=el("span","ref",h.b); s.appendChild(r);} d.appendChild(s); w.appendChild(d);
  });
}
$("#look").addEventListener("input",function(){search(this.value)});
search("");

/* env + town + tierup tables */
function fill(id,rows,heads){
  var t=el("table"), hr=el("tr");
  heads.forEach(function(h){hr.appendChild(el("th",null,h))}); t.appendChild(hr);
  rows.forEach(function(r){ var tr=el("tr");
    r.forEach(function(c,i){ var td=el("td",null,c); if(i>0)td.className="ref"; tr.appendChild(td); });
    t.appendChild(tr);
  });
  $(id).appendChild(t);
}
fill("#envBody",D.ENVIRONMENTS,["Environment","Open","Pages"]);
fill("#townBody",D.TOWN,["Need","Page"]);
fill("#tierBody",D.TIERUP,["Need","Page"]);
(function(){var o=el("ol","thumbs");D.THUMBS.forEach(function(x){o.appendChild(el("li",null,x))});$("#thumbs").appendChild(o)})();

/* ---------- 7. campaign ---------- */
(function(){
  var h=$("#hex"); h.value=S.camp.hex; h.oninput=function(){S.camp.hex=h.value;save()};
  var th=$("#threads"); th.value=S.camp.threads; th.oninput=function(){S.camp.threads=th.value;save()};
  var t=el("table"), hr=el("tr");
  ["Dive","Environment","Bestiary","Spice","Authored?"].forEach(function(x){hr.appendChild(el("th",null,x))});
  t.appendChild(hr);
  S.camp.rows.forEach(function(row,ri){
    var tr=el("tr"); tr.appendChild(el("td",null,String(ri+1)));
    row.forEach(function(_,ci){
      var td=el("td"), i=el("input"); i.value=row[ci]; i.style.padding="4px 6px";
      i.oninput=function(){S.camp.rows[ri][ci]=i.value;save()};
      td.appendChild(i); tr.appendChild(td);
    });
    t.appendChild(tr);
  });
  $("#rotBody").appendChild(t);
  $("#addRow").onclick=function(){S.camp.rows.push(["","","",""]);save();location.reload()};
})();

/* ---------- backup ---------- */
$("#export").onclick=function(){
  var b=new Blob([JSON.stringify(S,null,2)],{type:"application/json"}),
      a=el("a"); a.href=URL.createObjectURL(b);
  a.download="4ad-save-"+new Date().toISOString().slice(0,10)+".json"; a.click();
};
$("#importFile").onchange=function(){
  var f=this.files[0]; if(!f)return; var r=new FileReader();
  r.onload=function(){ try{ S=JSON.parse(r.result); save(); location.reload(); }
    catch(e){ alert("Could not read that file.") } };
  r.readAsText(f);
};
})();
