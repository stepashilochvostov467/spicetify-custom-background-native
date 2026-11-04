    const translationCacheKey='cbp_ru_translation_cache_v1';
    const translationTTL=30*24*60*60*1000;
    const translationPlain=value=>String(value).replace(/&(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);/gi,entity=>{
        const named={'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'"};
        if(named[entity.toLowerCase()])return named[entity.toLowerCase()];
        const code=entity[2].toLowerCase()==='x'?parseInt(entity.slice(3,-1),16):Number(entity.slice(2,-1));
        return code>0&&code<=0x10ffff&&!(code>=0xd800&&code<=0xdfff)?String.fromCodePoint(code):entity;
    });
    Object.assign(APP,{
        translationChunks(text) {
            const chunks=[],encoder=new TextEncoder();let chunk='';
            for(const char of text){
                while(encoder.encode(chunk+char).length>480){
                    const space=chunk.lastIndexOf(' ');
                    if(space>0){chunks.push(chunk.slice(0,space));chunk=chunk.slice(space+1);}else{chunks.push(chunk);chunk='';}
                }
                chunk+=char;
            }
            if(chunk.trim())chunks.push(chunk.trim());return chunks;
        },
        cancelPanelTranslation() {
            this.panelTranslationAbort?.abort();this.panelTranslationAbort=null;this.panelTranslationKey=null;
            const status=this.lyricsPanel?.querySelector('.cbp-translation-status');if(status){status.textContent='';status.hidden=true;}
        },
        async getTranslationCache() {
            if(this.translationCache)return this.translationCache;
            if(!this.translationCachePromise)this.translationCachePromise=(async()=>{
                let saved;try{saved=await images.run('readonly',undefined,translationCacheKey);}catch{}
                const cache=new Map(),now=Date.now();
                if(Array.isArray(saved))for(const entry of saved.slice(-500)){
                    if(!Array.isArray(entry)||typeof entry[0]!=='string'||entry[0].length>11000)continue;
                    const value=entry[1];if(value&&typeof value.text==='string'&&value.text.length<=15000&&Number.isFinite(value.at)&&now-value.at<translationTTL)cache.set(entry[0],value);
                }
                this.translationCache=cache;return cache;
            })();
            return this.translationCachePromise;
        },
        rememberTranslation(key,text) {
            const cache=this.translationCache;if(!cache)return;
            cache.delete(key);cache.set(key,{text,at:Date.now()});
            while(cache.size>500)cache.delete(cache.keys().next().value);
            clearTimeout(this.translationSaveTimer);
            this.translationSaveTimer=setTimeout(()=>{this.translationSaveTimer=null;images.run('readwrite',[...cache],translationCacheKey).catch(()=>{});},500);
        },
        async requestRussianTranslation(text,language,signal) {
            const parts=[];
            for(const chunk of this.translationChunks(text)){
                const query=new URLSearchParams({q:chunk,langpair:language+'|ru',mt:'1'});
                const response=await fetch('https://api.mymemory.translated.net/get?'+query,{signal:AbortSignal.any([signal,AbortSignal.timeout(10000)]),credentials:'omit',referrerPolicy:'no-referrer'});
                if(response.status===429){const error=Error('Дневной лимит переводчика исчерпан');error.quota=true;throw error;}
                if(!response.ok)throw Error('Сервис перевода недоступен');
                const data=await response.json();
                if(data.quotaFinished||Number(data.responseStatus)===429){const error=Error('Дневной лимит переводчика исчерпан');error.quota=true;throw error;}
                if(Number(data.responseStatus)!==200||typeof data.responseData?.translatedText!=='string'||!data.responseData.translatedText.trim()||data.responseData.translatedText.length>15000)throw Error('Сервис не вернул перевод');
                parts.push(translationPlain(data.responseData.translatedText));
            }
            return parts.join(' ');
        },
        async updatePanelTranslation() {
            const enabled=this.settings?.lyricsTranslation===true&&this.settings.lyricsSource==='spotify';
            const button=this.lyricsPanel?.querySelector('[data-translation]');if(button)button.setAttribute('aria-pressed',String(this.settings?.lyricsTranslation===true));
            const nodes=this.lyricsPanel?.querySelectorAll('.cbp-translation');
            if(!enabled){this.cancelPanelTranslation();nodes?.forEach(el=>el.hidden=true);return;}
            if(document.hidden){this.cancelPanelTranslation();return;}
            const lines=this.panelLyricLines;if(!lines?.length)return;
            const language=this.panelLyricLanguage||'autodetect',key=this.lyricRequest+':'+language;
            if(this.panelTranslationKey===key)return;
            this.cancelPanelTranslation();this.panelTranslationKey=key;
            const controller=new AbortController();this.panelTranslationAbort=controller;const signal=controller.signal;
            const current=()=>!signal.aborted&&this.panelLyricLines===lines&&this.settings.lyricsTranslation===true&&this.settings.lyricsSource==='spotify';
            const status=this.lyricsPanel.querySelector('.cbp-translation-status');status.hidden=false;
            if(/^ru(?:-|$)/.test(language)){status.textContent='Песня уже на русском';return;}
            status.textContent='Перевожу на русский · MyMemory…';
            let completed=0,failed=0,quota=false;
            const apply=(text,translation)=>{if(!current())return;lines.forEach((line,i)=>{if(line.text!==text)return;const el=nodes[i];if(el){el.textContent=translation;el.hidden=!translation||translation===text;}});};
            try{
                const cache=await this.getTranslationCache();if(!current())return;
                const unique=[...new Set(lines.map(line=>line.text).filter(text=>/\p{L}/u.test(text)))];
                const pending=[];
                for(const text of unique){const cached=cache.get(language+'\n'+text);if(cached&&Date.now()-cached.at<translationTTL){apply(text,cached.text);completed++;}else pending.push(text);}
                // Translate near the playing line first, while keeping every result attached
                // to its original row. Chorus repetitions share one request and cache entry.
                const at=Math.max(0,this.panelLyricIndex),order=new Map(lines.map((line,i)=>[line.text,Math.abs(i-at)]));
                pending.sort((a,b)=>(order.get(a)||0)-(order.get(b)||0));
                let consumed=0;const queue=pending.filter(text=>{consumed+=text.length;return consumed<=16000;});
                failed+=pending.length-queue.length;
                let next=0,networkFailures=0;
                await Promise.all(Array.from({length:Math.min(2,queue.length)},async()=>{
                    while(next<queue.length&&current()&&!quota){
                        const text=queue[next++];
                        try{
                            const translated=await this.requestRussianTranslation(text,language,signal);if(!current())return;
                            this.rememberTranslation(language+'\n'+text,translated);apply(text,translated);completed++;
                        }catch(error){if(!current())return;failed++;networkFailures++;if(error.quota||networkFailures>=3){quota=!!error.quota;controller.abort();}}
                    }
                }));
                if(this.panelTranslationAbort!==controller||this.panelLyricLines!==lines||!this.settings.lyricsTranslation||this.settings.lyricsSource!=='spotify')return;
                status.textContent=quota?'Лимит MyMemory исчерпан. Готовые переводы сохранены.':failed?'Часть строк не переведена. Нажми ↻ для повторной попытки.':completed?'Машинный перевод · MyMemory':'Нет строк для перевода';
                // Translation changes row heights: re-center the active original/translation pair.
                this.panelLyricIndex=-1;this.syncPanelLyrics();
            }catch{if(current())status.textContent='Перевод недоступен. Нажми ↻ для повторной попытки.';}
        }
    });
