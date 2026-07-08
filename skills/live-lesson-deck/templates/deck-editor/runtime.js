function installDeckEditor(host, config){
  config=config||{};
  var EDIT_SEL=config.editSelector||'';
  var accentClass=config.accentClass||'c-accent';
  var deck=host.deck;
  var AUTO_COLLECT=config.autoCollect!==false;
  var AUTO_EDIT_SEL=[
    '.slide p','.slide h1','.slide h2','.slide h3','.slide h4','.slide h5','.slide h6',
    '.slide li','.slide figcaption','.slide blockquote','.slide button','.slide a',
    '.slide div','.slide span','.slide b','.slide strong','.slide em','.slide i',
    '.slide code','.slide small','.slide label','.slide text','.slide tspan'
  ].join(',');
  var EDIT_SKIP_SEL=[
    '#edbar','#edbar *','#drawer','#drawer *','#tocOverlay','#tocFab','#bar','#pageNum',
    '.toc-overlay','.toc-overlay *','.bar-seg','.hotzone','.hotzone *'
  ].join(',')+(config.skipSelector?','+config.skipSelector:'');
  function editableQuery(){
    return EDIT_SEL?'[data-editable],'+EDIT_SEL:'[data-editable]';
  }
  function ownText(el){
    if(!el)return '';
    if(el.namespaceURI==='http://www.w3.org/2000/svg'&&(el.tagName||'').toLowerCase()==='text')return (el.textContent||'').replace(/\s+/g,' ').trim();
    return Array.prototype.slice.call(el.childNodes).filter(function(n){return n.nodeType===3;}).map(function(n){return n.nodeValue||'';}).join(' ').replace(/\s+/g,' ').trim();
  }
  function autoEditCandidate(el){
    if(!el||!el.closest||!el.closest('.slide'))return false;
    if(el.matches(EDIT_SKIP_SEL)||el.closest(EDIT_SKIP_SEL))return false;
    if(el.matches('script,style,defs,marker,path,line,rect,circle,ellipse,polygon,polyline,img,svg,section,main'))return false;
    if(el.hasAttribute('aria-hidden')&&el.getAttribute('aria-hidden')==='true'&&el.tagName.toLowerCase()!=='text')return false;
    return ownText(el).length>0;
  }
  function collectEditEls(root){
    var out=[],seen=new Set();
    function add(el){
      if(!el||seen.has(el))return;
      seen.add(el);out.push(el);
    }
    Array.prototype.slice.call(root.querySelectorAll(editableQuery())).forEach(add);
    if(AUTO_COLLECT){
      Array.prototype.slice.call(root.querySelectorAll(AUTO_EDIT_SEL)).forEach(function(el){
        if(autoEditCandidate(el))add(el);
      });
    }
    return out.filter(function(el){
      var p=el.parentElement;
      while(p&&p!==root&&p!==document.body){
        if(seen.has(p)&&p.closest&&p.closest('.slide'))return false;
        p=p.parentElement;
      }
      return true;
    });
  }
  var editEls=collectEditEls(document);
  editEls.forEach(function(el,i){el.setAttribute('data-ek',i);});

  var editing=false,moving=false,activeEditEl=null;
  var cleanDoc=null,cleanEls=null,cleanReady=false,fileHandle=null,connecting=false,saveTimer=null,dirty=false;
  var FS_OK=('showOpenFilePicker' in window);
  var edStatus=document.getElementById('edStatus');
  var undoStack=[],undoRestoring=false,textUndoArmed=false,textUndoTimer=null;

  document.documentElement.style.setProperty('--editor-accent',config.accent||'var(--accent)');
  document.documentElement.style.setProperty('--editor-on-accent',config.onAccent||'#1A1C22');
  document.documentElement.style.setProperty('--editor-selected-bg',config.selectedBg||'rgba(110,231,240,0.10)');

  function slides(){return host.getSlides();}
  function setSlides(v){host.setSlides(v);}
  function cur(){return host.getCur();}
  function setCur(v){host.setCur(v);}
  function total(){return host.getTotal();}
  function setTotal(v){host.setTotal(v);}
  function sections(){return host.getSections();}
  function setSections(v){if(host.setSections)host.setSections(v);}
  function noteList(){return host.getNotes?host.getNotes():null;}
  function setNotes(v){if(host.setNotes)host.setNotes(v);}
  function setStatus(t,warn){
    if(edStatus){
      edStatus.textContent=t;
      edStatus.style.color=warn?(config.warnColor||'#ffd2b3'):'rgba(255,255,255,0.6)';
    }
    updateEditorControls();
  }
  function updateEditorControls(){
    var saveLocked=!cleanReady;
    Array.prototype.slice.call(document.querySelectorAll('#edbar .requires-save')).forEach(function(btn){
      btn.disabled=saveLocked;
      btn.title=saveLocked?'先授权当前HTML文件，才能做删除和重排':btn.getAttribute('data-ready-title')||btn.title;
    });
  }
  Array.prototype.slice.call(document.querySelectorAll('#edbar .requires-save')).forEach(function(btn){
    btn.setAttribute('data-ready-title',btn.title||'');
  });
  function normText(t){return (t||'').replace(/\s+/g,' ').trim().slice(0,120);}
  function deckFingerprint(doc){
    var list=Array.prototype.slice.call(doc.querySelectorAll('.slide'));
    var first=list[0]?normText(list[0].textContent):'';
    var last=list[list.length-1]?normText(list[list.length-1].textContent):'';
    return [list.length,normText(doc.title),first,last].join('|');
  }
  var initialFingerprint=deckFingerprint(document);

  function cleanScript(){
    if(!cleanDoc)return null;
    return Array.prototype.slice.call(cleanDoc.querySelectorAll('script')).find(function(s){
      return s.textContent.indexOf('var SECTIONS=')>=0;
    })||null;
  }
  function readCleanArray(name){
    var script=cleanScript();
    if(!script)return null;
    var m=script.textContent.match(new RegExp('var '+name+'=(\\\\[[\\\\s\\\\S]*?\\\\]);'));
    if(!m)return null;
    try{return Function('return '+m[1])();}catch(e){return null;}
  }
  function pushUndo(label){
    if(undoRestoring)return;
    var snap={
      page:cur(),
      label:label||'编辑',
      sections:JSON.parse(JSON.stringify(sections())),
      notes:noteList()?noteList().slice():null
    };
    if(cleanDoc&&cleanReady)snap.html='<!DOCTYPE html>\n'+cleanDoc.documentElement.outerHTML;
    else snap.deckHTML=deck.innerHTML;
    undoStack.push(snap);
    if(undoStack.length>50)undoStack.shift();
  }
  function closeTextUndo(){
    textUndoArmed=false;
    if(textUndoTimer)clearTimeout(textUndoTimer);
    textUndoTimer=null;
  }
  function pushEditUndo(){
    if(!textUndoArmed){
      pushUndo('编辑');
      textUndoArmed=true;
    }
    if(textUndoTimer)clearTimeout(textUndoTimer);
    textUndoTimer=setTimeout(closeTextUndo,900);
  }
  function restoreUndoSnapshot(snap){
    undoRestoring=true;
    if(snap.html){
      cleanDoc=new DOMParser().parseFromString(snap.html,'text/html');
      cleanReady=true;
      var cleanDeck=cleanDoc.getElementById(deck.id||'deck')||cleanDoc.querySelector('.deck');
      if(cleanDeck)deck.innerHTML=cleanDeck.innerHTML;
    }else{
      cleanDoc=null;cleanEls=null;cleanReady=false;
      deck.innerHTML=snap.deckHTML||deck.innerHTML;
    }
    var nextSections=snap.sections||readCleanArray('SECTIONS');
    var nextNotes=snap.notes||readCleanArray('NOTES');
    if(nextSections)setSections(nextSections);
    if(nextNotes)setNotes(nextNotes);
    undoRestoring=false;
    if(rebuildDeckState(snap.page)){
      dirty=true;
      scheduleSave();
      if(!cleanReady)setStatus('已撤回 · 未授权文件，改动只在本页',true);
      else setStatus('已撤回');
    }
  }
  function undoLast(){
    closeTextUndo();
    var snap=undoStack.pop();
    if(!snap){setStatus('没有可撤回的操作',true);return;}
    setMove(false);
    var remaining=undoStack.length;
    restoreUndoSnapshot(snap);
    if(!cleanReady&&remaining===0)dirty=false;
  }

  function idbOpen(cb){
    try{
      var r=indexedDB.open('deckedit',1);
      r.onupgradeneeded=function(){try{r.result.createObjectStore('h');}catch(e){}};
      r.onsuccess=function(){cb(r.result);};
      r.onerror=function(){cb(null);};
    }catch(e){cb(null);}
  }
  function handleGet(cb){
    idbOpen(function(db){
      if(!db)return cb(null);
      try{
        var g=db.transaction('h').objectStore('h').get(location.pathname);
        g.onsuccess=function(){cb(g.result||null);};
        g.onerror=function(){cb(null);};
      }catch(e){cb(null);}
    });
  }
  function handleSet(h){
    idbOpen(function(db){
      if(!db)return;
      try{db.transaction('h','readwrite').objectStore('h').put(h,location.pathname);}catch(e){}
    });
  }
  function tryRestore(){
    return new Promise(function(res){
      handleGet(function(h){
        if(h&&h.queryPermission){
          h.queryPermission({mode:'readwrite'}).then(function(p){
            if(p==='granted')return res(h);
            h.requestPermission({mode:'readwrite'}).then(function(p2){res(p2==='granted'?h:null);},function(){res(null);});
          },function(){res(null);});
        }else res(null);
      });
    });
  }
  function buildClean(srcPromise){
    return srcPromise.then(function(txt){
      cleanDoc=new DOMParser().parseFromString(txt,'text/html');
      cleanEls=collectEditEls(cleanDoc);
      cleanReady=(cleanEls.length===editEls.length&&deckFingerprint(cleanDoc)===initialFingerprint);
      if(!cleanReady)cleanDoc=null;
    }).catch(function(){cleanDoc=null;cleanReady=false;});
  }
  function connectSave(){
    if(connecting||cleanReady)return;
    connecting=true;
    if(!FS_OK){setStatus('需要 Chrome 文件授权才能保存',true);connecting=false;return;}
    setStatus('选此文件并授权…');
    tryRestore().then(function(h){
      if(h){fileHandle=h;return h;}
      return window.showOpenFilePicker({types:[{description:'课件 HTML',accept:{'text/html':['.html']}}]}).then(function(a){
        return a[0].requestPermission({mode:'readwrite'}).then(function(p){
          if(p!=='granted')throw 0;
          fileHandle=a[0];
          handleSet(a[0]);
          return a[0];
        });
      });
    }).then(function(h){
      return buildClean(h.getFile().then(function(f){return f.text();})).then(function(){
        if(cleanReady&&dirty){
          syncLiveEditsToClean();
          scheduleSave();
          setStatus('已连文件 · 正在保存本页改动');
        }else{
          setStatus(cleanReady?'已连文件 · 改完直存':'文件不匹配或结构不一致',!cleanReady);
        }
        connecting=false;
      });
    }).catch(function(){
      fileHandle=null;cleanDoc=null;cleanReady=false;connecting=false;
      setStatus('未授权文件 · 改动不会落盘，点这里重连',true);
    });
  }
  function scheduleSave(){
    if(!cleanReady){setStatus('未授权文件 · 改动只在本页，离开会丢',true);return;}
    if(saveTimer)clearTimeout(saveTimer);
    setStatus('存盘中…');
    saveTimer=setTimeout(doSave,600);
  }
  function doSave(){
    if(!cleanDoc||!cleanReady||!fileHandle){setStatus('未授权文件 · 这次改动未落盘',true);return;}
    var html='<!DOCTYPE html>\n'+cleanDoc.documentElement.outerHTML;
    fileHandle.createWritable().then(function(w){
      return w.write(html).then(function(){return w.close();});
    }).then(function(){dirty=false;setStatus('已存盘 ✓');})
      .catch(function(){setStatus('存盘失败 · 这次改动未落盘，点这里重连',true);});
  }

  function sanitizeHTML(html){
    var d=document.createElement('div');d.innerHTML=html;
    d.querySelectorAll('font').forEach(function(f){var p=f.parentNode;while(f.firstChild)p.insertBefore(f.firstChild,f);p.removeChild(f);});
    d.querySelectorAll('div').forEach(function(v){var p=v.parentNode;while(v.firstChild)p.insertBefore(v.firstChild,v);p.removeChild(v);});
    d.querySelectorAll('[style]').forEach(function(e){
      if(/letter-spacing|text-wrap|color|font-family|background/i.test(e.getAttribute('style')||''))e.removeAttribute('style');
    });
    return d.innerHTML;
  }
  function syncLiveEditsToClean(){
    if(!cleanDoc||!cleanEls||!cleanReady)return;
    editEls.forEach(function(el,i){
      if(!cleanEls[i])return;
      cleanEls[i].innerHTML=sanitizeHTML(el.innerHTML);
      var tr=el.style.transform||'';
      if(tr)cleanEls[i].style.transform=tr;else cleanEls[i].style.removeProperty('transform');
      cleanEls[i].classList.toggle('ek-empty',ekEmptyCheck(el));
    });
  }
  function ekHost(node){
    var el=(node&&node.nodeType===1)?node:(node?node.parentNode:null);
    while(el&&el!==document.body){
      if(el.hasAttribute&&el.hasAttribute('data-ek'))return el;
      el=el.parentNode;
    }
    return null;
  }
  function editVisible(el){
    if(!el)return false;
    var r=el.getBoundingClientRect();
    var cs=getComputedStyle(el);
    return r.width>4&&r.height>4&&cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>0.01;
  }
  function pointNearEditEl(el,x,y,pad){
    if(!editVisible(el))return false;
    var r=el.getBoundingClientRect();
    pad=pad==null?18:pad;
    return !(x<r.left-pad||x>r.right+pad||y<r.top-pad||y>r.bottom+pad);
  }
  function editHostAtPoint(x,y,target){
    var direct=ekHost(target);
    if(direct&&direct.closest('.slide.current'))return direct;
    var current=slides()[cur()]||document.querySelector('.slide.current');
    if(!current)return null;
    var best=null,bestScore=Infinity,pad=18;
    Array.prototype.slice.call(current.querySelectorAll('[data-ek]')).forEach(function(el){
      if(!pointNearEditEl(el,x,y,pad))return;
      var r=el.getBoundingClientRect();
      var dx=Math.max(r.left-x,0,x-r.right);
      var dy=Math.max(r.top-y,0,y-r.bottom);
      var score=dx*dx+dy*dy;
      if(score<bestScore){bestScore=score;best=el;}
    });
    return best;
  }
  function focusEditHost(hostEl,x,y){
    if(!hostEl||!hostEl.isContentEditable)return;
    try{hostEl.focus({preventScroll:true});}catch(e){hostEl.focus();}
    if(x==null||y==null)return;
    var range=null,pos=null;
    if(document.caretRangeFromPoint){
      range=document.caretRangeFromPoint(x,y);
    }else if(document.caretPositionFromPoint){
      pos=document.caretPositionFromPoint(x,y);
      if(pos){
        range=document.createRange();
        range.setStart(pos.offsetNode,pos.offset);
      }
    }
    if(!range||!hostEl.contains(range.startContainer)){
      range=document.createRange();
      range.selectNodeContents(hostEl);
      var r=hostEl.getBoundingClientRect();
      range.collapse(x<r.left+r.width/2);
    }
    var s=window.getSelection&&window.getSelection();
    if(s){s.removeAllRanges();s.addRange(range);}
  }
  function selectEditHost(hostEl){
    if(activeEditEl&&activeEditEl!==hostEl)activeEditEl.classList.remove('ed-selected');
    activeEditEl=hostEl||null;
    if(activeEditEl)activeEditEl.classList.add('ed-selected');
  }
  function currentEditHost(){
    if(activeEditEl&&document.body.contains(activeEditEl)&&activeEditEl.closest('.slide.current'))return activeEditEl;
    var active=ekHost(document.activeElement);
    if(active&&active.closest('.slide.current'))return active;
    var s=window.getSelection&&window.getSelection();
    if(s&&s.anchorNode){
      var h=ekHost(s.anchorNode);
      if(h&&h.closest('.slide.current'))return h;
    }
    return null;
  }
  function ekEmptyCheck(el){
    if(!el)return false;
    var txt=(el.textContent||'').replace(/[\s ]/g,'');
    var media=!!el.querySelector('img,svg,canvas');
    var empty=txt===''&&!media;
    el.classList.toggle('ek-empty',empty);
    return empty;
  }
  function ekEmptyAll(){editEls.forEach(ekEmptyCheck);}
  function editSave(el){
    if(!el)return;
    dirty=true;
    var empty=ekEmptyCheck(el);
    if(cleanDoc&&cleanEls&&cleanReady){
      var i=parseInt(el.getAttribute('data-ek'),10);
      if(!isNaN(i)&&cleanEls[i]){
        pushEditUndo();
        var c=cleanEls[i];
        c.innerHTML=sanitizeHTML(el.innerHTML);
        var tr=el.style.transform||'';
        if(tr)c.style.transform=tr;else c.style.removeProperty('transform');
        c.classList.toggle('ek-empty',empty);
      }
    }
    scheduleSave();
  }

  function hasAccent(el){return !!(el&&el.nodeType===1&&el.classList&&el.classList.contains(accentClass));}
  function unwrapNode(el){
    var p=el&&el.parentNode;if(!p)return;
    while(el.firstChild)p.insertBefore(el.firstChild,el);
    p.removeChild(el);
  }
  function removeFontWeightStyle(el){
    if(!el||!el.style)return;
    el.style.removeProperty('font-weight');
    if(el.tagName==='SPAN'&&!el.getAttribute('style')&&!el.className)unwrapNode(el);
  }
  function stripExplicitWeight(root){
    Array.prototype.slice.call(root.querySelectorAll('b,strong')).forEach(unwrapNode);
    Array.prototype.slice.call(root.querySelectorAll('[style]')).forEach(removeFontWeightStyle);
  }
  function editWrap(){
    var s=window.getSelection();if(!s||s.isCollapsed)return;
    var r=s.getRangeAt(0);var hostEl=ekHost(r.commonAncestorContainer);if(!hostEl)return;
    if(!cleanReady)pushEditUndo();
    var sp=document.createElement('span');sp.className=accentClass;
    try{sp.appendChild(r.extractContents());r.insertNode(sp);}catch(e){return;}
    s.removeAllRanges();editSave(hostEl);
  }
  function cleanupAccentSpan(el){
    if(!hasAccent(el))return false;
    el.classList.remove(accentClass);
    if(el.tagName==='SPAN'&&el.className===''){
      unwrapNode(el);
    }
    return true;
  }
  function rangeTouchesNode(range,node){
    try{return range.intersectsNode(node);}catch(e){return false;}
  }
  function nearestAccent(node){
    var el=node&&node.nodeType===1?node:(node?node.parentNode:null);
    while(el&&el!==document.body&&!hasAccent(el))el=el.parentNode;
    return hasAccent(el)?el:null;
  }
  function editUnwrap(){
    var s=window.getSelection();if(!s||!s.anchorNode)return;
    var hostEl=currentEditHost()||ekHost(s.anchorNode);
    if(!hostEl){setStatus('先选中要清除高亮的文字',true);return;}
    var targets=[];
    if(!s.isCollapsed&&s.rangeCount){
      var r=s.getRangeAt(0);
      Array.prototype.slice.call(hostEl.querySelectorAll('.'+accentClass)).forEach(function(el){
        if(rangeTouchesNode(r,el))targets.push(el);
      });
      [nearestAccent(r.startContainer),nearestAccent(r.endContainer)].forEach(function(el){
        if(el&&targets.indexOf(el)<0)targets.push(el);
      });
    }else{
      var curAccent=nearestAccent(s.anchorNode);
      if(curAccent)targets.push(curAccent);
    }
    if(!targets.length){setStatus('选区里没有高亮',true);return;}
    if(!cleanReady)pushEditUndo();
    targets.forEach(cleanupAccentSpan);
    s.removeAllRanges();
    editSave(hostEl);
    setStatus('已清除高亮');
  }
  function editBold(){
    var s=window.getSelection();if(!s||s.isCollapsed){setStatus('先选中要加粗的文字',true);return;}
    var r=s.getRangeAt(0);var hostEl=ekHost(r.commonAncestorContainer);if(!hostEl)return;
    if(!cleanReady)pushEditUndo();
    var strong=document.createElement('strong');
    try{
      var frag=r.extractContents();
      stripExplicitWeight(frag);
      strong.appendChild(frag);
      r.insertNode(strong);
    }catch(e){return;}
    s.removeAllRanges();editSave(hostEl);
    setStatus('已加粗 · 点清粗可取消');
  }
  function editUnbold(){
    var hostEl=currentEditHost();
    if(!hostEl){setStatus('先点中一个文本框',true);return;}
    if(!cleanReady)pushEditUndo();
    stripExplicitWeight(hostEl);
    editSave(hostEl);
    setStatus('已清除编辑加粗 · 版式默认粗体会保留');
  }
  function editExec(cmd){
    if(!cleanReady&&currentEditHost())pushEditUndo();
    document.execCommand(cmd,false,null);
    var s=window.getSelection();
    if(s&&s.anchorNode){
      var h=ekHost(s.anchorNode);
      if(h)editSave(h);
    }
  }

  function sectionIndexForPageNo(n){
    var list=sections();
    for(var i=0;i<list.length;i++){
      if(n>=list[i].from&&n<=list[i].to)return i;
    }
    return -1;
  }
  function sectionCounts(){return sections().map(function(s){return s.to-s.from+1;});}
  function applySectionCounts(counts){
    var start=1;
    sections().forEach(function(s,i){
      var count=counts[i];
      s.from=start;s.to=start+count-1;s.pages='S'+s.from+'-S'+s.to;start=s.to+1;
    });
  }
  function updateSectionForPageMove(fromIdx,toIdx,kind){
    var counts=sectionCounts();
    var fromSec=sectionIndexForPageNo(fromIdx+1);
    var toSec=sectionIndexForPageNo(toIdx+1);
    if(fromSec<0)return false;
    if(kind==='delete')counts[fromSec]-=1;
    else if(fromSec!==toSec&&toSec>=0){counts[fromSec]-=1;counts[toSec]+=1;}
    if(kind==='delete'&&counts[fromSec]===0){
      if(counts.length<=1){
        setStatus('至少保留1个环节',true);
        return false;
      }
      sections().splice(fromSec,1);
      counts.splice(fromSec,1);
    }
    if(counts.some(function(c){return c<1;})){
      setStatus('每个环节至少保留1页',true);
      return false;
    }
    applySectionCounts(counts);
    return true;
  }
  function leadingComment(node){
    var n=node&&node.previousSibling;
    while(n&&n.nodeType===3&&!n.nodeValue.trim())n=n.previousSibling;
    return (n&&n.nodeType===8)?n:null;
  }
  function moveSlidePacket(parent,slide,before){
    var c=leadingComment(slide);
    if(c)parent.insertBefore(c,before);
    parent.insertBefore(slide,before);
  }
  function removeSlidePacket(slide){
    var c=leadingComment(slide);
    if(c)c.remove();
    slide.remove();
  }
  function syncCleanScriptData(){
    var script=cleanScript();
    if(!script)return;
    var txt=script.textContent;
    txt=txt.replace(/var SECTIONS=\[[\s\S]*?\];/,'var SECTIONS='+JSON.stringify(sections(),null,2)+';');
    if(noteList())txt=txt.replace(/var NOTES=\[[\s\S]*?\];/,'var NOTES='+JSON.stringify(noteList(),null,2)+';');
    script.textContent=txt;
  }
  function rebuildDeckState(targetIdx){
    setSlides(Array.prototype.slice.call(document.querySelectorAll('.slide')));
    setTotal(slides().length);
    selectEditHost(null);
    var s=window.getSelection&&window.getSelection();if(s)s.removeAllRanges();
    editEls=collectEditEls(document);
    editEls.forEach(function(el,i){
      el.setAttribute('data-ek',i);
      if(editing&&!moving){el.setAttribute('contenteditable','true');el.spellcheck=false;}
    });
    if(cleanDoc)cleanEls=collectEditEls(cleanDoc);
    if(cleanDoc&&cleanEls.length!==editEls.length){
      cleanDoc=null;cleanReady=false;setStatus('结构不一致，页面操作未保存',true);return false;
    }
    cleanReady=!!cleanDoc;
    if(host.renderBar)host.renderBar();
    if(host.renderBarSegments)host.renderBarSegments();
    if(host.renderToc)host.renderToc();
    ekEmptyAll();
    if(host.afterRebuild)host.afterRebuild({slides:slides(),total:total(),targetIdx:targetIdx});
    host.show(Math.max(0,Math.min(targetIdx,total()-1)),false);
    return true;
  }
  function canEditPageStructure(){
    if(!cleanDoc||!cleanReady){setStatus('先连存盘，再调整页面',true);connectSave();return false;}
    return true;
  }
  function moveCurrentSlide(step){
    if(!editing||!canEditPageStructure())return;
    var from=cur(),to=cur()+step;
    if(to<0||to>=total()){setStatus(step<0?'已经是第一页':'已经是最后一页',true);return;}
    closeTextUndo();
    var undoLen=undoStack.length;pushUndo(step<0?'页前移':'页后移');
    if(!updateSectionForPageMove(from,to,'move')){undoStack.length=undoLen;return;}
    setMove(false);
    var cleanSlides=Array.prototype.slice.call(cleanDoc.querySelectorAll('.slide'));
    var cleanDeck=cleanDoc.getElementById(deck.id||'deck')||cleanDoc.querySelector('.deck');
    var before=step<0?slides()[to]:slides()[to].nextSibling;
    var cleanBefore=step<0?cleanSlides[to]:cleanSlides[to].nextSibling;
    moveSlidePacket(deck,slides()[from],before);
    moveSlidePacket(cleanDeck,cleanSlides[from],cleanBefore);
    if(noteList()){
      var notes=noteList();
      var note=notes.splice(from,1)[0]||'';
      notes.splice(to,0,note);
    }
    syncCleanScriptData();
    if(rebuildDeckState(to))scheduleSave();
  }
  function goEditPage(step){
    closeTextUndo();
    setMove(false);
    var next=cur()+step;
    if(next<0||next>=total()){setStatus(step<0?'已经是第一页':'已经是最后一页',true);return;}
    host.show(next,false);
    setStatus('第'+(next+1)+' / '+total()+'页');
  }
  function deleteCurrentSlide(){
    if(!editing||!canEditPageStructure())return;
    if(total()<=1){setStatus('至少保留1页',true);return;}
    var idx=cur();
    var title=normText(slides()[idx]?slides()[idx].textContent:'');
    if(!window.confirm('删除当前第'+(idx+1)+'页？\n\n'+title+'\n\n会同步目录、进度和讲师注记，可用 Cmd/Ctrl+Z 撤回。'))return;
    closeTextUndo();
    var undoLen=undoStack.length;pushUndo('删本页');
    if(!updateSectionForPageMove(idx,idx,'delete')){undoStack.length=undoLen;return;}
    setMove(false);
    var cleanSlides=Array.prototype.slice.call(cleanDoc.querySelectorAll('.slide'));
    removeSlidePacket(slides()[idx]);
    removeSlidePacket(cleanSlides[idx]);
    if(noteList())noteList().splice(idx,1);
    syncCleanScriptData();
    if(rebuildDeckState(idx))scheduleSave();
  }
  function deleteEditBlock(){
    if(!editing)return;
    var hostEl=currentEditHost();
    if(!hostEl){setStatus('先点中一个文本框',true);return;}
    if(!cleanDoc||!cleanEls||!cleanReady){setStatus('先连存盘，再删文本框',true);return;}
    var i=parseInt(hostEl.getAttribute('data-ek'),10);
    if(isNaN(i)||!cleanEls[i]){setStatus('文本框索引失效，退出编辑再试',true);return;}
    closeTextUndo();
    pushUndo('删文本框');
    hostEl.remove();
    if(activeEditEl===hostEl)activeEditEl=null;
    cleanEls[i].remove();
    var s=window.getSelection&&window.getSelection();if(s)s.removeAllRanges();
    if(rebuildDeckState(cur()))scheduleSave();
    setStatus('已删文本框，可 Cmd+Z 撤回');
  }

  function enterEdit(){
    editing=true;document.body.classList.add('editing');
    setMove(false);
    editEls.forEach(function(el){el.setAttribute('contenteditable','true');el.spellcheck=false;});
    connectSave();
  }
  function exitEdit(){
    editing=false;document.body.classList.remove('editing');
    setMove(false);
    selectEditHost(null);
    editEls.forEach(function(el){el.removeAttribute('contenteditable');});
    var s=window.getSelection&&window.getSelection();if(s)s.removeAllRanges();
  }
  function curTr(el){
    var m=(el.style.transform||'').match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
    return m?{x:parseFloat(m[1]),y:parseFloat(m[2])}:{x:0,y:0};
  }
  function setMove(on){
    moving=on;document.body.classList.toggle('moving',on);
    var btn=document.getElementById('edMove');if(btn)btn.classList.toggle('on',on);
    if(on){editEls.forEach(function(el){el.removeAttribute('contenteditable');});}
    else if(editing){editEls.forEach(function(el){el.setAttribute('contenteditable','true');el.spellcheck=false;});}
  }

  document.addEventListener('keydown',function(e){
    if(editing){
      if((e.metaKey||e.ctrlKey)&&!e.shiftKey&&e.key.toLowerCase()==='z'){e.preventDefault();undoLast();return;}
      if((e.metaKey||e.ctrlKey)&&!e.shiftKey&&e.key.toLowerCase()==='b'){e.preventDefault();editBold();return;}
      if(e.key==='Escape'){e.preventDefault();exitEdit();}
      if(!ekHost(e.target)){
        if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();goEditPage(1);return;}
        if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();goEditPage(-1);return;}
        if(e.key==='Home'){e.preventDefault();host.show(0,false);setStatus('第1 / '+total()+'页');return;}
        if(e.key==='End'){e.preventDefault();host.show(total()-1,false);setStatus('第'+total()+' / '+total()+'页');return;}
      }
      return;
    }
    if(e.key==='e'||e.key==='E'){e.preventDefault();enterEdit();return;}
  });
  document.addEventListener('focusin',function(e){
    if(!editing)return;
    var h=ekHost(e.target);
    if(h)selectEditHost(h);
  });
  document.addEventListener('beforeinput',function(e){
    if(editing&&!cleanReady&&ekHost(e.target))pushEditUndo();
  });
  document.addEventListener('input',function(e){
    if(editing){
      var h=ekHost(e.target);
      editSave(h);ekEmptyCheck(h);
    }
  });

  var bar=document.getElementById('edbar');
  if(bar)bar.addEventListener('mousedown',function(e){if(e.target&&e.target.tagName==='BUTTON')e.preventDefault();});
  if(edStatus){edStatus.style.cursor='pointer';edStatus.addEventListener('click',function(){if(!cleanReady){connecting=false;connectSave();}});}
  document.getElementById('edHi').addEventListener('click',editWrap);
  document.getElementById('edClr').addEventListener('click',editUnwrap);
  document.getElementById('edBold').addEventListener('click',editBold);
  document.getElementById('edUnbold').addEventListener('click',editUnbold);
  document.getElementById('edItalic').addEventListener('click',function(){editExec('italic');});
  document.getElementById('edUnder').addEventListener('click',function(){editExec('underline');});
  document.getElementById('edPrev').addEventListener('click',function(){goEditPage(-1);});
  document.getElementById('edNext').addEventListener('click',function(){goEditPage(1);});
  document.getElementById('edTextDel').addEventListener('click',deleteEditBlock);
  document.getElementById('edPagePrev').addEventListener('click',function(){moveCurrentSlide(-1);});
  document.getElementById('edPageNext').addEventListener('click',function(){moveCurrentSlide(1);});
  document.getElementById('edPageDel').addEventListener('click',deleteCurrentSlide);
  document.getElementById('edExit').addEventListener('click',exitEdit);
  document.getElementById('edMove').addEventListener('click',function(){setMove(!moving);});

  var dragEl=null,dsx=0,dsy=0,dbx=0,dby=0;
  document.addEventListener('mousedown',function(e){
    if(!moving)return;
    var h=editHostAtPoint(e.clientX,e.clientY,e.target);if(!h)return;
    if(!cleanReady)pushUndo('挪位置');
    e.preventDefault();selectEditHost(h);dragEl=h;h.classList.add('dragging');
    var b=curTr(h);dbx=b.x;dby=b.y;dsx=e.clientX;dsy=e.clientY;
  });
  document.addEventListener('mousemove',function(e){
    if(!dragEl)return;
    dragEl.style.transform='translate('+(dbx+e.clientX-dsx)+'px,'+(dby+e.clientY-dsy)+'px)';
  });
  document.addEventListener('mouseup',function(){
    if(!dragEl)return;
    dragEl.classList.remove('dragging');editSave(dragEl);dragEl=null;
  });
  document.addEventListener('dblclick',function(e){
    if(!moving)return;
    var h=(activeEditEl&&activeEditEl.closest('.slide.current')&&pointNearEditEl(activeEditEl,e.clientX,e.clientY,26))?activeEditEl:editHostAtPoint(e.clientX,e.clientY,e.target);
    if(!h)return;
    h.style.transform='';editSave(h);
  });
  window.addEventListener('beforeunload',function(e){
    if(!dirty)return;
    e.preventDefault();
    e.returnValue='';
  });

  ekEmptyAll();
  updateEditorControls();
  return {
    enter:enterEdit,
    exit:exitEdit,
    undo:undoLast,
    reconnect:connectSave
  };
}
