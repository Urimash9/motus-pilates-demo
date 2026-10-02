(() => {
  const base = 'assets/motus-final/';
  let manifestPromise;
  const cache = new Map();
  async function getManifest(){
    if(!manifestPromise) manifestPromise = fetch(base + 'manifest.json', {cache:'force-cache'}).then(r => {
      if(!r.ok) throw new Error('Motus asset manifest failed: ' + r.status);
      return r.json();
    });
    return manifestPromise;
  }
  async function url(name){
    if(cache.has(name)) return cache.get(name);
    const p = (async()=>{
      const manifest = await getManifest();
      const asset = manifest.assets?.[name];
      if(!asset) throw new Error('Unknown Motus asset: ' + name);
      const parts = await Promise.all(asset.chunks.map(file => fetch(base + file, {cache:'force-cache'}).then(r => {
        if(!r.ok) throw new Error('Motus asset chunk failed: ' + file + ' (' + r.status + ')');
        return r.text();
      })));
      return `data:${asset.mime};base64,${parts.join('')}`;
    })();
    cache.set(name,p);
    return p;
  }
  async function apply(root=document){
    const nodes=[...root.querySelectorAll('img[data-motus-asset]')];
    await Promise.all(nodes.map(async img=>{
      const name=img.dataset.motusAsset;
      try { img.src = await url(name); }
      catch(err){ console.error(err); }
    }));
  }
  window.MotusAssets={url,apply};
})();
