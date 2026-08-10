(() => {
  'use strict';

  const frame = document.getElementById('baselineFrame');
  if (!frame) return;

  const STORAGE_KEY = 'projection-v0-2-settings';
  let bgDataUrl = null;
  let mediaDataUrl = null;
  let mediaMime = null;
  let recorder = null;
  let recordedChunks = [];
  let toastTimer = null;

  const fmtSize = bytes => {
    if (!Number.isFinite(bytes)) return '';
    const u = ['B','KB','MB','GB'];
    let i = 0, n = bytes;
    while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
    return `${n.toFixed(i ? 1 : 0)} ${u[i]}`;
  };

  function onReady() {
    const w = frame.contentWindow;
    const d = frame.contentDocument;
    if (!w || !d) return;
    const $ = id => d.getElementById(id);
    const panel = d.querySelector('.panel');
    const scene = $('scene');
    if (!panel || !scene) return;

    d.title = 'Projection / Video Mapping Experience — V0.2 Stable';
    const version = d.querySelector('.brand span');
    if (version) version.textContent = '· V0.2';
    const topStatus = d.querySelector('.topbar .status');
    if (topStatus) topStatus.innerHTML = '<span class="dot"></span>stable V0 + additive tools';

    injectStyle(d);
    injectSceneLayers(d, scene);
    injectStatusUI(d, panel);
    injectControls(d, panel);
    wireStableUploads(d, $);
    wirePlaybackFeedback(d, $);
    wireGuide(d, $);
    wireAtmosphere(d, $);
    wireSaveRestore(d, $);
    wireOutput(d, $);

    setProjectStatus(d, 'READY', 'ok');
    toast(d, 'V0.2 loaded · stable V0 uploader preserved', 'ok');
  }

  function injectStyle(d) {
    const style = d.createElement('style');
    style.id = 'v0-2-style';
    style.textContent = `
      .v02-project-status{margin:10px 0 2px;padding:8px 10px;border:1px solid #2f332a;border-radius:5px;background:#0d100d;color:#9ed3aa;font-size:10px;letter-spacing:.12em;text-transform:uppercase;display:flex;align-items:center;gap:7px}.v02-project-status:before{content:'';width:7px;height:7px;border-radius:50%;background:#65d28b;box-shadow:0 0 10px rgba(101,210,139,.55)}.v02-project-status.busy{color:#e7c85d}.v02-project-status.busy:before{background:#d4af37}.v02-project-status.error{color:#f1a69f}.v02-project-status.error:before{background:#d7665c}
      .v02-asset{margin-top:8px;padding:8px 9px;border-radius:5px;border:1px solid #2f2d26;background:#0b0b09;color:#8a887f;font-size:10px;line-height:1.45}.v02-asset.ok{border-color:#2d4935;color:#a7d8b0}.v02-asset strong{display:block;color:#ddd;font-weight:600;margin-bottom:2px}
      .v02-toast{position:fixed;right:375px;top:18px;z-index:9999;min-width:230px;max-width:360px;padding:11px 13px;border-radius:6px;border:1px solid #3a3a34;background:rgba(12,12,10,.94);color:#eee;box-shadow:0 12px 35px rgba(0,0,0,.45);font-size:11px;line-height:1.4;opacity:0;transform:translateY(-8px);transition:.2s ease;pointer-events:none}.v02-toast.on{opacity:1;transform:translateY(0)}.v02-toast.ok{border-color:#35513d}.v02-toast.error{border-color:#693e39}
      .v02-guide{position:absolute;inset:0;z-index:18;pointer-events:none;display:none}.v02-guide.on{display:block}.v02-guide svg{width:100%;height:100%}.v02-guide polygon{fill:rgba(212,175,55,.035);stroke:#d4af37;stroke-width:2;stroke-dasharray:9 7;vector-effect:non-scaling-stroke}.v02-guide text{fill:#d4af37;font:700 12px Inter,Arial,sans-serif;letter-spacing:1.4px;paint-order:stroke;stroke:#000;stroke-width:4px}
      .v02-beam{position:absolute;z-index:2;left:-5%;top:19%;width:78%;height:64%;pointer-events:none;opacity:.20;filter:blur(18px);mix-blend-mode:screen;clip-path:polygon(0 44%,100% 2%,100% 98%,0 56%);background:linear-gradient(90deg,rgba(215,230,255,.035),rgba(210,230,255,.14) 56%,rgba(230,240,255,.24));transform:rotate(-2deg);transform-origin:left center;display:none}.v02-beam.on{display:block}
      .v02-dust-field{position:absolute;inset:0;z-index:6;pointer-events:none;overflow:hidden;display:none}.v02-dust-field.on{display:block}.v02-dust{position:absolute;border-radius:50%;background:rgba(235,242,255,.72);box-shadow:0 0 7px rgba(220,235,255,.28);animation:v02dust linear infinite}@keyframes v02dust{0%{transform:translate3d(0,14px,0);opacity:0}18%{opacity:.45}72%{opacity:.28}100%{transform:translate3d(22px,-78px,0);opacity:0}}
      .v02-check{display:flex;align-items:center;gap:8px;color:#aaa;font-size:11px;margin:8px 0}.v02-check input{accent-color:#d4af37}.v02-output-status{margin-top:8px;min-height:15px;color:#93c29d;font-size:10px;line-height:1.45}.v02-btn-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}.v02-recording{position:absolute;right:18px;bottom:18px;z-index:30;display:none;padding:7px 9px;background:rgba(115,0,0,.74);border:1px solid rgba(255,100,100,.5);font-size:10px;letter-spacing:.12em;text-transform:uppercase}.v02-recording.on{display:block}
      @media(max-width:760px){.v02-toast{right:18px;top:18px}}
    `;
    d.head.appendChild(style);
  }

  function injectSceneLayers(d, scene) {
    const beam = d.createElement('div'); beam.id='v02Beam'; beam.className='v02-beam';
    const dust = d.createElement('div'); dust.id='v02Dust'; dust.className='v02-dust-field';
    const guide = d.createElement('div'); guide.id='v02Guide'; guide.className='v02-guide';
    guide.innerHTML = `<svg viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><polygon points="130,50 750,250 740,750 120,540"></polygon><text x="145" y="90">DEFAULT PROJECTION TARGET</text></svg>`;
    const rec = d.createElement('div'); rec.id='v02Recording'; rec.className='v02-recording'; rec.textContent='● Recording';
    scene.insertBefore(beam, scene.children[1] || null);
    scene.appendChild(dust); scene.appendChild(guide); scene.appendChild(rec);
  }

  function injectStatusUI(d, panel) {
    const sub = panel.querySelector('.sub');
    const status = d.createElement('div'); status.id='v02ProjectStatus'; status.className='v02-project-status'; status.textContent='READY';
    sub.insertAdjacentElement('afterend', status);
    const toastEl=d.createElement('div'); toastEl.id='v02Toast'; toastEl.className='v02-toast'; d.body.appendChild(toastEl);

    const uploadBg = d.getElementById('uploadBgBtn');
    if (uploadBg) {
      const s=d.createElement('div'); s.id='v02BgStatus'; s.className='v02-asset'; s.textContent='No custom background loaded.';
      uploadBg.insertAdjacentElement('afterend', s);
    }
    const mediaGroup=d.getElementById('localUploadGroup');
    if(mediaGroup){const s=d.createElement('div');s.id='v02MediaStatus';s.className='v02-asset';s.textContent='No local media loaded.';mediaGroup.appendChild(s)}
  }

  function injectControls(d, panel) {
    const footer=panel.querySelector('.footer');
    const html=`
      <div class="section" id="v02GuideSection"><div class="section-title"><span>Projection guide</span><span>06</span></div><label class="v02-check"><input type="checkbox" id="v02GuideToggle"> Show default target guide</label><div class="tiny">Guide follows the default target used for AI-generated backgrounds: TL 13/5 · TR 75/25 · BL 12/54 · BR 74/75. It is authoring-only and never exported.</div></div>
      <div class="section"><div class="section-title"><span>Atmosphere</span><span>07</span></div><label class="v02-check"><input type="checkbox" id="v02BeamToggle"> Projector beam</label><div class="field"><label>Beam intensity <span class="value" id="v02BeamIntensityVal">0.20</span></label><input id="v02BeamIntensity" type="range" min="0" max="0.8" value="0.20" step="0.01"></div><div class="field"><label>Beam width <span class="value" id="v02BeamWidthVal">78%</span></label><input id="v02BeamWidth" type="range" min="35" max="115" value="78" step="1"></div><div class="field"><label>Beam softness <span class="value" id="v02BeamSoftnessVal">18px</span></label><input id="v02BeamSoftness" type="range" min="0" max="45" value="18" step="1"></div><label class="v02-check"><input type="checkbox" id="v02DustToggle"> Floating dust</label><div class="field"><label>Dust amount <span class="value" id="v02DustAmountVal">24</span></label><input id="v02DustAmount" type="range" min="0" max="80" value="24" step="1"></div><div class="field"><label>Dust speed <span class="value" id="v02DustSpeedVal">1.0x</span></label><input id="v02DustSpeed" type="range" min="0.3" max="2.3" value="1" step="0.1"></div><div class="field"><label>Dust size <span class="value" id="v02DustSizeVal">1.5</span></label><input id="v02DustSize" type="range" min="0.5" max="4" value="1.5" step="0.1"></div><div class="field"><label>Dust opacity <span class="value" id="v02DustOpacityVal">0.38</span></label><input id="v02DustOpacity" type="range" min="0" max="1" value="0.38" step="0.01"></div></div>
      <div class="section"><div class="section-title"><span>Project</span><span>08</span></div><div class="v02-btn-row"><button class="btn primary" id="v02Save">Save settings</button><button class="btn" id="v02Restore">Restore</button></div><div class="tiny">Settings are stored in this browser. Local MP4/image assets remain session-based; HTML export can embed the active local file.</div></div>
      <div class="section"><div class="section-title"><span>Output</span><span>09</span></div><div class="v02-btn-row"><button class="btn primary" id="v02Record">Record WebM</button><button class="btn" id="v02Stop">Stop</button></div><button class="btn primary" id="v02ExportHtml" style="margin-top:8px">Download standalone HTML</button><div class="v02-btn-row" style="margin-top:8px"><button class="btn" id="v02CopyEmbed">Copy embed</button><button class="btn" id="v02Screenshot">Screenshot PNG</button></div><div class="v02-output-status" id="v02OutputStatus"></div></div>
    `;
    footer.insertAdjacentHTML('beforebegin', html);
    footer.textContent='V0.2 · additive layer over verified V0 · stable uploader preserved · no merge.';
  }

  function wireStableUploads(d, $) {
    const bgInput=$('uploadBg'), mediaInput=$('uploadMedia');
    if(bgInput){
      bgInput.addEventListener('change', e=>{
        const file=e.target.files && e.target.files[0]; if(!file)return;
        setProjectStatus(d,'LOADING BACKGROUND…','busy');
        const r=new FileReader();
        r.onload=()=>{bgDataUrl=r.result;const s=$('v02BgStatus');if(s){s.className='v02-asset ok';s.innerHTML=`<strong>✓ BACKGROUND LOADED</strong>${escapeHtml(file.name)} · ${fmtSize(file.size)}`;}setProjectStatus(d,'BACKGROUND LOADED','ok');toast(d,`✓ Background loaded · ${file.name}`,'ok');};
        r.onerror=()=>{setProjectStatus(d,'BACKGROUND ERROR','error');toast(d,'Background could not be read','error')};
        r.readAsDataURL(file);
        setTimeout(()=>{try{bgInput.value=''}catch{}},0);
      });
    }
    if(mediaInput){
      mediaInput.addEventListener('change', e=>{
        const file=e.target.files && e.target.files[0]; if(!file)return;
        setProjectStatus(d,'LOADING MEDIA…','busy');
        mediaMime=file.type;
        const r=new FileReader();
        r.onload=()=>{mediaDataUrl=r.result;const kind=file.type.startsWith('video/')?'VIDEO':'IMAGE';const s=$('v02MediaStatus');if(s){s.className='v02-asset ok';s.innerHTML=`<strong>✓ ${kind} LOADED</strong>${escapeHtml(file.name)} · ${fmtSize(file.size)}`;}setProjectStatus(d,`${kind} LOADED`,'ok');toast(d,`✓ ${kind.toLowerCase()} loaded · ${file.name}`,'ok');};
        r.onerror=()=>{setProjectStatus(d,'MEDIA ERROR','error');toast(d,'Media could not be read','error')};
        r.readAsDataURL(file);
        setTimeout(()=>{try{mediaInput.value=''}catch{}},0);
      });
    }
  }

  function wirePlaybackFeedback(d,$){
    [['playBtn','PLAYING'],['pauseBtn','PAUSED'],['restartBtn','RESTARTED']].forEach(([id,msg])=>{const b=$(id);if(b)b.addEventListener('click',()=>{setProjectStatus(d,msg,'ok');toast(d,msg==='PLAYING'?'▶ Video playing':msg==='PAUSED'?'Ⅱ Video paused':'↻ Video restarted','ok')})});
  }

  function wireGuide(d,$){const t=$('v02GuideToggle'),g=$('v02Guide');if(t&&g)t.addEventListener('change',()=>g.classList.toggle('on',t.checked))}

  function wireAtmosphere(d,$){
    const beam=$('v02Beam'),dust=$('v02Dust');
    const renderDust=()=>{dust.innerHTML='';if(!$('v02DustToggle').checked)return;const n=+$('v02DustAmount').value,speed=+$('v02DustSpeed').value,size=+$('v02DustSize').value,op=+$('v02DustOpacity').value;for(let i=0;i<n;i++){const p=d.createElement('i');p.className='v02-dust';const z=Math.max(.4,size*(.6+Math.random()*.8));p.style.cssText=`left:${Math.random()*100}%;top:${8+Math.random()*84}%;width:${z}px;height:${z}px;opacity:${op};animation-duration:${(9+Math.random()*12)/speed}s;animation-delay:${-Math.random()*16}s`;dust.appendChild(p)}};
    $('v02BeamToggle').addEventListener('change',e=>beam.classList.toggle('on',e.target.checked));
    $('v02BeamIntensity').addEventListener('input',e=>{beam.style.opacity=e.target.value;$('v02BeamIntensityVal').textContent=(+e.target.value).toFixed(2)});
    $('v02BeamWidth').addEventListener('input',e=>{beam.style.width=e.target.value+'%';$('v02BeamWidthVal').textContent=e.target.value+'%'});
    $('v02BeamSoftness').addEventListener('input',e=>{beam.style.filter=`blur(${e.target.value}px)`;$('v02BeamSoftnessVal').textContent=e.target.value+'px'});
    $('v02DustToggle').addEventListener('change',e=>{dust.classList.toggle('on',e.target.checked);renderDust()});
    ['v02DustAmount','v02DustSpeed','v02DustSize','v02DustOpacity'].forEach(id=>$(id).addEventListener('input',()=>{const map={v02DustAmount:'v02DustAmountVal',v02DustSpeed:'v02DustSpeedVal',v02DustSize:'v02DustSizeVal',v02DustOpacity:'v02DustOpacityVal'};const v=+$(id).value;$(map[id]).textContent=id==='v02DustSpeed'?v.toFixed(1)+'x':id==='v02DustSize'?v.toFixed(1):id==='v02DustOpacity'?v.toFixed(2):Math.round(v);renderDust()}));
  }

  function collectSettings(d,$){const ids=['opacity','brightness','contrast','blend','spill','reflection','bgBrightness','scale','offsetX','offsetY','rotate','scenePreset','mediaMode','v02GuideToggle','v02BeamToggle','v02BeamIntensity','v02BeamWidth','v02BeamSoftness','v02DustToggle','v02DustAmount','v02DustSpeed','v02DustSize','v02DustOpacity'];const out={};ids.forEach(id=>{const el=$(id);if(el)out[id]=el.type==='checkbox'?el.checked:el.value});return out}
  function applySettings(d,$,settings){Object.entries(settings||{}).forEach(([id,v])=>{const el=$(id);if(!el)return;if(el.type==='checkbox')el.checked=!!v;else el.value=v;el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}))});}
  function wireSaveRestore(d,$){
    $('v02Save').onclick=()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(collectSettings(d,$)));setProjectStatus(d,'SETTINGS SAVED','ok');toast(d,'✓ Project settings saved','ok')}catch{toast(d,'Could not save settings','error')}};
    $('v02Restore').onclick=()=>{try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw){toast(d,'No saved settings found','error');return}applySettings(d,$,JSON.parse(raw));setProjectStatus(d,'SETTINGS RESTORED','ok');toast(d,'✓ Settings restored','ok')}catch{toast(d,'Saved settings are invalid','error')}};
  }

  function wireOutput(d,$){
    $('v02Record').onclick=()=>recordScreen(d,$);
    $('v02Stop').onclick=()=>{if(recorder&&recorder.state==='recording')recorder.stop()};
    $('v02ExportHtml').onclick=()=>{const html=buildStandalone(d,$);downloadBlob(new Blob([html],{type:'text/html'}),'projection-experience-v0-2.html');$('v02OutputStatus').textContent='✓ Standalone HTML downloaded';toast(d,'✓ Standalone HTML downloaded','ok')};
    $('v02CopyEmbed').onclick=async()=>{const html=buildStandalone(d,$);const blob=new Blob([html],{type:'text/html'});const url=URL.createObjectURL(blob);const code=`<iframe src="${url}" style="width:100%;aspect-ratio:16/9;border:0" allow="autoplay;fullscreen"></iframe>`;try{await navigator.clipboard.writeText(code);$('v02OutputStatus').textContent='✓ Temporary local embed copied';toast(d,'✓ Embed copied','ok')}catch{$('v02OutputStatus').textContent='Clipboard blocked';toast(d,'Clipboard blocked by browser','error')}};
    $('v02Screenshot').onclick=()=>screenshot(d,$);
  }

  async function recordScreen(d,$){
    if(recorder&&recorder.state==='recording')return;
    try{const stream=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:30},audio:true});recordedChunks=[];const mime=MediaRecorder.isTypeSupported('video/webm;codecs=vp9')?'video/webm;codecs=vp9':'video/webm';recorder=new MediaRecorder(stream,{mimeType:mime});recorder.ondataavailable=e=>{if(e.data.size)recordedChunks.push(e.data)};recorder.onstop=()=>{downloadBlob(new Blob(recordedChunks,{type:mime}),'projection-v0-2.webm');stream.getTracks().forEach(t=>t.stop());$('v02Recording').classList.remove('on');$('v02OutputStatus').textContent='✓ WebM downloaded';toast(d,'✓ Recording downloaded','ok')};recorder.start(250);$('v02Recording').classList.add('on');setProjectStatus(d,'RECORDING…','busy');$('v02OutputStatus').textContent='Recording · choose this browser tab';toast(d,'● Recording started · select this tab','ok')}catch{toast(d,'Recording cancelled or unavailable','error')}
  }

  function screenshot(d,$){
    const script=d.createElement('script');script.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';script.onload=()=>{frame.contentWindow.html2canvas($('scene'),{useCORS:true,backgroundColor:'#000'}).then(c=>c.toBlob(b=>{downloadBlob(b,'projection-v0-2.png');$('v02OutputStatus').textContent='✓ Screenshot downloaded';toast(d,'✓ Screenshot downloaded','ok')})).catch(()=>toast(d,'Screenshot blocked by cross-origin media','error'))};script.onerror=()=>toast(d,'Screenshot helper unavailable','error');d.head.appendChild(script);
  }

  function buildStandalone(d,$){
    const sourceMatrix='matrix3d(0.614952,0.147049,0,0.000199706,-0.0178567,0.487847,0,-0.0000312429,0,0,1,0,137,29,0,1)';
    const bg=bgDataUrl||$('sceneBg').src;
    let mediaType='youtube',mediaSrc=$('ytMedia').src;
    if(!$('videoMedia').classList.contains('hidden')){mediaType='video';mediaSrc=mediaDataUrl||$('videoMedia').src}else if(!$('imageMedia').classList.contains('hidden')){mediaType='image';mediaSrc=mediaDataUrl||$('imageMedia').src}
    const s={bg,mediaType,mediaSrc,opacity:$('opacity').value,brightness:$('brightness').value,contrast:$('contrast').value,blend:$('blend').value,spill:$('spill').value,reflection:$('reflection').value,bgBrightness:$('bgBrightness').value,scale:$('scale').value,x:$('offsetX').value,y:$('offsetY').value,rot:$('rotate').value,beam:$('v02BeamToggle').checked,beamIntensity:$('v02BeamIntensity').value,beamWidth:$('v02BeamWidth').value,beamSoftness:$('v02BeamSoftness').value,dust:$('v02DustToggle').checked,dustAmount:$('v02DustAmount').value,dustSpeed:$('v02DustSpeed').value,dustSize:$('v02DustSize').value,dustOpacity:$('v02DustOpacity').value};
    const safe=JSON.stringify(s).replace(/</g,'\\u003c');
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Projection Experience</title><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#000}.scene{position:fixed;inset:0;overflow:hidden;isolation:isolate}.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1}.box{position:absolute;inset:0;z-index:4;transform-origin:0 0;pointer-events:none}.media{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border:0;background:#000}.spill{position:absolute;inset:-10%;z-index:3;transform-origin:0 0;pointer-events:none;background:radial-gradient(ellipse at 48% 48%,rgba(180,210,255,.34),rgba(120,160,255,.13) 24%,transparent 63%);filter:blur(34px);mix-blend-mode:screen}.reflection{position:absolute;left:8%;right:2%;bottom:-6%;height:43%;z-index:5;pointer-events:none;background:linear-gradient(180deg,rgba(188,220,255,.22),rgba(128,172,255,.08) 32%,transparent 82%);clip-path:polygon(0 26%,18% 14%,37% 22%,55% 5%,74% 19%,100% 0,100% 100%,0 100%);filter:blur(30px) brightness(2.4);mix-blend-mode:hard-light}.beam{position:absolute;z-index:2;left:-5%;top:19%;height:64%;pointer-events:none;mix-blend-mode:screen;clip-path:polygon(0 44%,100% 2%,100% 98%,0 56%);background:linear-gradient(90deg,rgba(215,230,255,.035),rgba(210,230,255,.14) 56%,rgba(230,240,255,.24));transform:rotate(-2deg);transform-origin:left center}.dust{position:absolute;border-radius:50%;background:rgba(235,242,255,.72);animation:f linear infinite}@keyframes f{0%{transform:translate(0,14px);opacity:0}18%{opacity:.45}72%{opacity:.28}100%{transform:translate(22px,-78px);opacity:0}}.dustField{position:absolute;inset:0;z-index:6;pointer-events:none}.vig{position:absolute;inset:0;z-index:7;pointer-events:none;background:radial-gradient(circle at center,transparent 38%,rgba(0,0,0,.2) 70%,rgba(0,0,0,.62))}</style></head><body><div class="scene"><img class="bg" id="bg"><div class="beam" id="beam"></div><div class="spill" id="spill"></div><div class="box" id="box"></div><div class="reflection" id="ref"></div><div class="dustField" id="df"></div><div class="vig"></div></div><script>const S=${safe},M='${sourceMatrix}';bg.src=S.bg;bg.style.filter='brightness('+S.bgBrightness+') contrast(1.3)';const tr=M+' translate('+S.x+'px,'+S.y+'px) scale('+S.scale+') rotate('+S.rot+'deg)';box.style.transform=tr;spill.style.transform=tr;spill.style.opacity=S.spill;ref.style.opacity=S.reflection;beam.style.display=S.beam?'block':'none';beam.style.opacity=S.beamIntensity;beam.style.width=S.beamWidth+'%';beam.style.filter='blur('+S.beamSoftness+'px)';let m;if(S.mediaType==='youtube'){m=document.createElement('iframe');m.src=S.mediaSrc;m.allow='autoplay;fullscreen'}else if(S.mediaType==='video'){m=document.createElement('video');m.src=S.mediaSrc;m.autoplay=true;m.loop=true;m.muted=true;m.playsInline=true}else{m=document.createElement('img');m.src=S.mediaSrc}m.className='media';m.style.opacity=S.opacity;m.style.filter='brightness('+S.brightness+') contrast('+S.contrast+')';m.style.mixBlendMode=S.blend;box.appendChild(m);if(S.dust){for(let i=0;i<S.dustAmount;i++){const p=document.createElement('i');p.className='dust';const z=Math.max(.4,S.dustSize*(.6+Math.random()*.8));p.style.cssText='left:'+Math.random()*100+'%;top:'+(8+Math.random()*84)+'%;width:'+z+'px;height:'+z+'px;opacity:'+S.dustOpacity+';animation-duration:'+((9+Math.random()*12)/S.dustSpeed)+'s;animation-delay:'+(-Math.random()*16)+'s';df.appendChild(p)}}<\/script></body></html>`;
  }

  function downloadBlob(blob,name){const a=document.createElement('a'),u=URL.createObjectURL(blob);a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000)}
  function setProjectStatus(d,text,kind='ok'){const el=d.getElementById('v02ProjectStatus');if(!el)return;el.textContent=text;el.className='v02-project-status '+(kind==='busy'?'busy':kind==='error'?'error':'')}
  function toast(d,text,kind='ok'){const el=d.getElementById('v02Toast');if(!el)return;clearTimeout(toastTimer);el.textContent=text;el.className='v02-toast '+kind+' on';toastTimer=setTimeout(()=>el.classList.remove('on'),2600)}
  function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

  frame.addEventListener('load', onReady, { once:true });
})();