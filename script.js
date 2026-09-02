(function(){
'use strict';
var EMAIL='nahelehawaiian@gmail.com';
var IG_URL='https://www.instagram.com/nahele.hawaii';

function $(s,c){return (c||document).querySelector(s);}
function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));}

/* ---------- toast ---------- */
var toastEl=$('#toast'),toastTimer;
function toast(t){
  if(!toastEl)return;
  toastEl.textContent=t;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(function(){toastEl.classList.remove('show');},3800);
}

/* ---------- header, mobile menu, to-top ---------- */
var header=$('#header'),toTop=$('#toTop');
if(header){
  window.addEventListener('scroll',function(){
    var y=window.scrollY||window.pageYOffset;
    header.classList.toggle('scrolled',y>8);
    if(toTop)toTop.classList.toggle('show',y>640);
  },{passive:true});
}
if(toTop){
  toTop.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
}
var burger=$('#burger');
if(burger){
  burger.addEventListener('click',function(){
    var open=header.classList.toggle('open');
    burger.setAttribute('aria-expanded',open?'true':'false');
  });
  $$('#mobilePanel a').forEach(function(a){
    a.addEventListener('click',function(){
      header.classList.remove('open');
      burger.setAttribute('aria-expanded','false');
    });
  });
}

/* ---------- scroll reveal ---------- */
var revealEls=$$('.reveal');
if('IntersectionObserver' in window && revealEls.length){
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}
    });
  },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  revealEls.forEach(function(el){io.observe(el);});
}else{
  revealEls.forEach(function(el){el.classList.add('in');});
}

/* ---------- decorative branches ---------- */
function branchSVG(){
  var leaves=[[268,-55],[268,55],[230,-50],[230,50],[190,-45],[190,45],[150,-40],[150,40],[110,-33],[110,33],[72,-25],[72,25]];
  return '<svg viewBox="0 0 140 320" aria-hidden="true">'
    +'<path d="M70,312 C66,240 70,120 70,8" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'
    +leaves.map(function(l){return '<ellipse cx="70" cy="'+l[0]+'" rx="31" ry="12.5" fill="currentColor" transform="rotate('+l[1]+' 70 '+l[0]+')"/>';}).join('')
    +'</svg>';
}
 $$('.deco').forEach(function(d){d.innerHTML=branchSVG();});

/* ============================================================
   MAIN PAGE — products, filters, modal
   ============================================================ */
var grid=$('#grid');
if(grid){

  var PETAL={
    plumeria:'M0,0 C-14,-26 -18,-58 0,-92 C18,-58 14,-26 0,0 Z',
    blossom:'M0,0 C-16,-22 -20,-52 0,-78 C20,-52 16,-22 0,0 Z'
  };
  function flower(grad,shape){
    var p=PETAL[shape]||PETAL.plumeria;
    var s=[0,72,144,216,288].map(function(a){
      return '<path d="'+p+'" fill="url(#'+grad+')" stroke="rgba(60,30,45,.16)" stroke-width="1.4" transform="rotate('+a+')"/>';
    }).join('');
    return s+'<circle r="4" fill="rgba(255,252,238,.9)"/>';
  }
  function orchid(grad,spot){
    spot=spot||'#41265e';
    return '<g fill="url(#'+grad+')" stroke="rgba(45,25,60,.18)" stroke-width="1.4">'
      +'<path d="M0,-10 C-8,-42 -6,-72 0,-94 C6,-72 8,-42 0,-10 Z"/>'
      +'<path d="M-7,2 C-42,-16 -76,-12 -90,4 C-84,28 -46,36 -9,20 Z"/>'
      +'<path d="M7,2 C42,-16 76,-12 90,4 C84,28 46,36 9,20 Z"/>'
      +'<path d="M-7,10 C-26,32 -38,54 -40,76 C-22,76 -8,54 -3,22 Z"/>'
      +'<path d="M7,10 C26,32 38,54 40,76 C22,76 8,54 3,22 Z"/>'
      +'</g>'
      +'<path d="M0,4 C-7,10 -8,24 -3,32 C0,36 3,35 5,30 C9,22 7,10 0,4 Z" fill="'+spot+'"/>'
      +'<g fill="'+spot+'" opacity=".5">'
      +'<circle cx="-56" cy="0" r="2.6"/><circle cx="-38" cy="10" r="1.9"/><circle cx="-64" cy="14" r="1.7"/><circle cx="-44" cy="-6" r="1.5"/>'
      +'<circle cx="56" cy="0" r="2.6"/><circle cx="38" cy="10" r="1.9"/><circle cx="64" cy="14" r="1.7"/><circle cx="44" cy="-6" r="1.5"/>'
      +'<circle cx="-22" cy="46" r="1.8"/><circle cx="22" cy="46" r="1.8"/><circle cx="0" cy="-60" r="1.7"/>'
      +'</g>';
  }
  function pearl(x,y,r){return '<circle cx="'+x+'" cy="'+y+'" r="'+(r||4.6)+'" fill="url(#g-pearl)" stroke="rgba(120,110,90,.4)" stroke-width=".5"/>';}
  function hook(x){
    return '<path d="M'+x+',44 C'+(x-11)+',44 '+(x-12)+',26 '+x+',24 C'+(x+12)+',26 '+(x+11)+',42 '+x+',50 L'+x+',60" fill="none" stroke="url(#g-gold)" stroke-width="2.4" stroke-linecap="round"/>'
      +'<circle cx="'+x+'" cy="64" r="3.2" fill="none" stroke="url(#g-gold)" stroke-width="2"/>';
  }
  function artPendant(grad,kind){
    var bloom=(kind==='orchid')?orchid(grad):flower(grad,'plumeria');
    return '<svg class="art" viewBox="0 0 320 360" aria-hidden="true">'
      +'<ellipse cx="160" cy="350" rx="76" ry="8" fill="rgba(35,55,40,.1)"/>'
      +'<path d="M52,16 C72,108 112,158 160,160 C208,158 248,108 268,16" fill="none" stroke="url(#g-gold)" stroke-width="2.4" stroke-linecap="round"/>'
      +'<path d="M52,16 C72,108 112,158 160,160 C208,158 248,108 268,16" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="1" stroke-dasharray="1 4"/>'
      +pearl(58,48)+pearl(66,90)+pearl(82,122)+pearl(104,144)+pearl(130,156)
      +pearl(262,48)+pearl(254,90)+pearl(238,122)+pearl(216,144)+pearl(190,156)
      +'<circle cx="160" cy="158" r="4" fill="none" stroke="url(#g-gold)" stroke-width="2"/>'
      +'<g transform="translate(160,254)">'+bloom+'</g>'
      +'</svg>';
  }
  function artDrops(grad,shape){
    function e(x){return hook(x)
      +'<g transform="translate('+x+',100) scale(.38)">'+flower(grad,shape)+'</g>'
      +'<circle cx="'+x+'" cy="140" r="2.7" fill="none" stroke="url(#g-gold)" stroke-width="1.8"/>'
      +'<g transform="translate('+x+',212) scale(.6)">'+flower(grad,shape)+'</g>';}
    return '<svg class="art" viewBox="0 0 320 340" aria-hidden="true">'
      +'<ellipse cx="160" cy="306" rx="88" ry="8" fill="rgba(35,55,40,.1)"/>'
      +e(106)+e(214)+'</svg>';
  }
  function artSingle(grad){
    function e(x){return hook(x)
      +'<g transform="translate('+x+',158) scale(.74)">'+orchid(grad)+'</g>';}
    return '<svg class="art" viewBox="0 0 320 340" aria-hidden="true">'
      +'<ellipse cx="160" cy="290" rx="80" ry="8" fill="rgba(35,55,40,.1)"/>'
      +e(106)+e(214)+'</svg>';
  }
  function artSet(grad,shape){
    function earring(x){return hook(x)
      +'<g transform="translate('+x+',104) scale(.34)">'+flower(grad,shape)+'</g>'
      +'<circle cx="'+x+'" cy="140" r="2.6" fill="none" stroke="url(#g-gold)" stroke-width="1.8"/>'
      +'<g transform="translate('+x+',206) scale(.56)">'+flower(grad,shape)+'</g>';}
    return '<svg class="art" viewBox="0 0 340 360" aria-hidden="true">'
      +'<ellipse cx="170" cy="332" rx="106" ry="8" fill="rgba(35,55,40,.1)"/>'
      +earring(66)+earring(274)
      +'<path d="M128,30 C142,86 156,116 170,118 C184,116 198,86 212,30" fill="none" stroke="url(#g-gold)" stroke-width="2.2" stroke-linecap="round"/>'
      +pearl(136,52,3.4)+pearl(150,88,3.4)+pearl(190,88,3.4)+pearl(204,52,3.4)
      +'<circle cx="170" cy="124" r="3.4" fill="none" stroke="url(#g-gold)" stroke-width="1.8"/>'
      +'<g transform="translate(170,212) scale(.74)">'+flower(grad,shape)+'</g>'
      +'</svg>';
  }
  function artFor(p){
    if(p.photo){return '<img class="art" src="'+p.photo+'" alt="'+p.name+'">';}
    switch(p.style){
      case 'pendant':return artPendant(p.grad,p.shape);
      case 'drops2':return artDrops(p.grad,p.shape);
      case 'drop1':return artSingle(p.grad);
      case 'set':return artSet(p.grad,p.shape);
    }
    return '';
  }
  function bloomSVG(grad,size){
    return '<svg viewBox="-100 -100 200 200" width="'+size+'" height="'+size+'" aria-hidden="true">'+flower(grad,'plumeria')+'</svg>';
  }

  /* ---------- product data ----------
     Add  photo:'photos/file.jpg'  to any product to use a real photo. */
  var PRODUCTS=[
    {id:'plumeria-pearl',name:'Plumeria & Pearl Necklace',type:'necklace',price:58,badge:'Best Seller',grad:'g-pink',style:'pendant',
     desc:'A pink plumeria gathered at peak bloom, hand-preserved and strung on a necklace of tiny freshwater pearls — the piece our market table is known for.',
     details:['Real pink plumeria','Freshwater pearl strand','Gold-filled chain & clasp','18" length with 2" extender']},
    {id:'sunset-plumeria',name:'Sunset Plumeria Necklace',type:'necklace',price:58,grad:'g-sunset',style:'pendant',
     desc:'Golden-orange petals with all the warmth of a Hawaiian sunset, sealed by hand and finished on a delicate gold-filled chain.',
     details:['Real orange plumeria','Gold-filled chain','Featherlight to wear','One of a kind']},
    {id:'spotted-orchid',name:'Spotted Orchid Necklace',type:'necklace',price:62,grad:'g-violet',shape:'orchid',style:'pendant',
     desc:'A speckled violet orchid preserved in full bloom — dramatic, weightless, and impossible to duplicate.',
     details:['Real orchid bloom','Gold-filled chain','Statement size, barely-there feel','One of a kind']},
    {id:'berry-drops',name:'Berry Plumeria Drop Earrings',type:'earrings',price:42,grad:'g-berry',style:'drops2',
     desc:'Twin berry-pink plumeria on simple gold hooks — a favorite for weddings, graduations, and every sunny day in between.',
     details:['Real pink plumeria','Gold-filled ear wires','Featherlight','Hypoallergenic']},
    {id:'deep-orchid',name:'Deep Orchid Earrings',type:'earrings',price:48,grad:'g-eggplant',style:'drop1',
     desc:'Velvety eggplant orchids with moody, dusk-toned depth — statement blooms that carry from morning to moonlight.',
     details:['Real orchid bloom','Gold-filled ear wires','Statement size, featherlight','One of a kind']},
    {id:'blush-plumeria',name:'Blush Plumeria Necklace',type:'necklace',price:54,grad:'g-blush',style:'pendant',
     desc:'Soft blush petals with a sunlit center — the everyday bloom that goes with absolutely everything.',
     details:['Real blush plumeria','Sterling silver or gold-filled chain','Adjustable length','One of a kind']},
    {id:'plumeria-set',name:'Plumeria Gift Set',type:'set',price:95,badge:'Gift Ready',grad:'g-berry',shape:'blossom',style:'set',
     desc:'A matching pendant-and-earring pair in deep berry, boxed with a pressed-flower note card — our most-gifted piece.',
     details:['Pendant + matching earrings','Real berry plumeria','Gift-boxed with care card','Ready to give']},
    {id:'double-blossom',name:'Double Blossom Earrings',type:'earrings',price:46,grad:'g-magenta',style:'drops2',
     desc:'Two hand-preserved blossoms stacked on each hook — magenta plumeria with serious swing and shine.',
     details:['Real magenta plumeria','Double-drop style','Gold-filled ear wires','One of a kind']}
  ];
  var TYPE_LABEL={necklace:'Necklace',earrings:'Earrings',set:'Gift Set'};

  /* ---------- render grid ---------- */
  grid.innerHTML=PRODUCTS.map(function(p){
    return '<article class="card reveal" data-type="'+p.type+'" data-id="'+p.id+'" tabindex="0" role="button" aria-label="'+p.name+', $'+p.price+' — view details">'
      +'<div class="card-media">'
      +(p.badge?'<span class="badge">'+p.badge+'</span>':'')
      +artFor(p)
      +'<span class="quickview">Quick view</span>'
      +'</div>'
      +'<div class="card-info"><h3>'+p.name+'</h3>'
      +'<p class="card-meta"><span>'+TYPE_LABEL[p.type]+'</span><span class="price">$'+p.price+'</span></p></div>'
      +'</article>';
  }).join('');

  /* ---------- hero & story art ---------- */
  var fb1=$('#fb1'),fb2=$('#fb2');
  if(fb1)fb1.innerHTML=bloomSVG('g-sunset',88);
  if(fb2)fb2.innerHTML=bloomSVG('g-blush',62);
  var heroArt=$('#heroArt');
  if(heroArt)heroArt.innerHTML=artPendant('g-pink','plumeria');
  var storyArt=$('#storyArt');
  if(storyArt)storyArt.innerHTML=artSet('g-pink','blossom');
  var storyBranch=$('#storyBranch');
  if(storyBranch)storyBranch.innerHTML=branchSVG();
  var storyDeco=$('#storyDeco');
  if(storyDeco)storyDeco.innerHTML=branchSVG();

  /* ---------- filters ---------- */
  $$('.filters button').forEach(function(btn){
    btn.addEventListener('click',function(){
      $$('.filters button').forEach(function(b){b.classList.toggle('active',b===btn);});
      var f=btn.dataset.filter;
      $$('.card').forEach(function(c){c.classList.toggle('hide',f!=='all'&&c.dataset.type!==f);});
    });
  });

  /* ---------- modal ---------- */
  var modal=$('#modal'),lastFocus=null;
  function openModal(id){
    var p=null;
    for(var i=0;i<PRODUCTS.length;i++){if(PRODUCTS[i].id===id){p=PRODUCTS[i];break;}}
    if(!p)return;
    $('#modalArt').innerHTML=artFor(p);
    $('#modalName').textContent=p.name;
    $('#modalPrice').textContent='$'+p.price;
    $('#modalDesc').textContent=p.desc;
    $('#modalDetails').innerHTML=p.details.map(function(d){return '<li>'+d+'</li>';}).join('');
    /* "Order This Piece" → contact page with the piece pre-filled */
    $('#modalOrder').href='contact.html?piece='+encodeURIComponent(p.name);
    $('#modalIg').href=IG_URL;
    lastFocus=document.activeElement;
    modal.classList.add('open');
    document.body.style.overflow='hidden';
    $('#modalClose').focus();
  }
  function closeModal(){
    modal.classList.remove('open');
    document.body.style.overflow='';
    if(lastFocus)lastFocus.focus();
  }
  grid.addEventListener('click',function(e){
    var card=e.target.closest('.card');
    if(card)openModal(card.dataset.id);
  });
  grid.addEventListener('keydown',function(e){
    if(e.key==='Enter'||e.key===' '){
      var card=e.target.closest('.card');
      if(card){e.preventDefault();openModal(card.dataset.id);}
    }
  });
  $('#modalClose').addEventListener('click',closeModal);
  $('.modal-backdrop').addEventListener('click',closeModal);
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&modal.classList.contains('open'))closeModal();
  });
}

/* ============================================================
   CONTACT PAGE — order form (opens email app, no backend)
   ============================================================ */
var form=$('#contactForm');
if(form){
  /* Prefill from main page: contact.html?piece=Product+Name */
  var piece=new URLSearchParams(location.search).get('piece');
  if(piece){
    $('#fInterest').value='collection';
    $('#fPiece').value=piece;
    toast('Mahalo! We\u2019ve noted \u201C'+piece+'\u201D \u2014 just add your name and a message.');
  }

  form.addEventListener('submit',function(e){
    e.preventDefault();
    var name=$('#fName').value.trim(),
        email=$('#fEmail').value.trim(),
        interest=$('#fInterest'),
        interestText=interest.options[interest.selectedIndex].text,
        pieceTxt=$('#fPiece').value.trim(),
        msg=$('#fMsg').value.trim();
    if(!name||!msg){toast('Please add your name and a short message.');return;}
    var subject=encodeURIComponent('Order inquiry \u2014 N\u0101hele Hawai\u2018i');
    var body=encodeURIComponent(
      'Aloha N\u0101hele!\n\n'
      +'Name: '+name+'\n'
      +'Email: '+(email||'\u2014')+'\n'
      +'Interested in: '+interestText+'\n'
      +(pieceTxt?('Piece: '+pieceTxt+'\n'):'')
      +'\n'+msg+'\n\nMahalo!'
    );
    window.location.href='mailto:'+EMAIL+'?subject='+subject+'&body='+body;
    toast('Mahalo! Opening your email app\u2026');
    form.reset();
  });
}

/* ---------- year ---------- */
var yearEl=$('#year');
if(yearEl)yearEl.textContent=new Date().getFullYear();
})();