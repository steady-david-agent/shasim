'use strict';
const CACHE='shasim-v19';
const ASSETS=['./','./index.html','./style.css','./NotoSansHebrew-Bold.ttf','./data.js','./app.js','./hero.jpg','./icon-v11-192.png','./icon-v11-512.png','./icon-v11-maskable-512.png','./apple-touch-v11.png','./manifest.webmanifest'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  // Versioned network requests bypass a previous cache-first worker during upgrade.
  await Promise.all(ASSETS.map(async asset=>{const original=new URL(asset,self.registration.scope);const fresh=new URL(original);fresh.searchParams.set('shasim-build','19');const response=await fetch(fresh,{cache:'reload'});if(!response.ok)throw new Error(`Could not cache ${asset}`);await cache.put(original,response)}));
  await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('shasim-')&&key!==CACHE)await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)))});
