const C='aufnahme-v3';
const F=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('aufnahme-')&&x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
// Nur eigene Dateien: Netz zuerst (damit Updates ankommen), offline aus dem Cache.
// Anfragen an Microsoft (Anmeldung, OneDrive) werden nicht angefasst.
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==self.location.origin)return;
 const nav=r.mode==='navigate';
 e.respondWith(fetch(r).then(res=>{if(res.ok&&!nav){const k=res.clone();caches.open(C).then(c=>c.put(r,k))}else if(res.ok&&nav){const k=res.clone();caches.open(C).then(c=>c.put('index.html',k))}return res})
  .catch(()=>caches.match(nav?'index.html':r,{ignoreSearch:true}).then(x=>x||caches.match('index.html'))))});
