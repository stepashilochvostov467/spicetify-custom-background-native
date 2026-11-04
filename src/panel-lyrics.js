    function panelLines(payload) {
        if(typeof payload==='string'){try{payload=JSON.parse(payload);}catch{return [];}}
        const data=payload?.lyrics;if(!Array.isArray(data?.lines))return [];
        const synced=data.syncType==='LINE_SYNCED';
        return data.lines.slice(0,2500).map(line=>{
            const raw=Number(line?.startTimeMs);
            return {text:String(line?.words||'').slice(0,10000),start:synced&&line?.startTimeMs!=null&&Number.isFinite(raw)&&raw>=0?raw:null};
        }).filter(line=>line.text.trim());
    }
    Object.assign(APP,{
        panelLines,lyricRequest:0,
        updateLyricsClock() {
            if(this.clockLineSource!==this.panelLyricLines){this.clockLineSource=this.panelLyricLines;this.clockHasTimings=!!this.panelLyricLines?.some(line=>line.start!==null);}
            const active=this.clockHasTimings&&this.settings?.lyricsSource==='spotify'&&!document.hidden&&playerValue('isPlaying',false);
            if(!active&&this.lyricsTimer){clearInterval(this.lyricsTimer);this.lyricsTimer=null;}
            if(active&&!this.lyricsTimer)this.lyricsTimer=setInterval(()=>this.syncPanelLyrics(),200);
        },
        async spotifyPanelData(uri) {
            if(!Spicetify.CosmosAsync?.get)throw Error('Источник Spotify пока недоступен');
            let timer;try{return await Promise.race([Spicetify.CosmosAsync.get(`https://spclient.wg.spotify.com/color-lyrics/v2/track/${uri.split(':')[2]}?format=json&vocalRemoval=false&market=from_token`),new Promise((_,reject)=>timer=setTimeout(()=>reject(Error('Источник не ответил')),10000))]);}finally{clearTimeout(timer);}
        },
        async loadPanelLyrics(force=false) {
            if(!this.lyricsPanel)return;
            const source=this.settings.lyricsSource,uri=Spicetify.Player.data?.item?.uri||'',key=source+':'+uri;
            if(!force&&this.panelLyricKey===key){this.updatePanelTranslation();return;}this.panelLyricKey=key;
            this.cancelPanelTranslation();
            const token=++this.lyricRequest;this.panelLyricLines=[];this.panelLyricIndex=-1;this.clockLineSource=null;this.panelTimelineSource=null;this.panelTimeline=[];this.panelRowNodes=[];this.panelStateIndex=undefined;this.translationIdleLines=null;
            const status=this.lyricsPanel.querySelector('[role="status"]'),list=this.lyricsPanel.querySelector('.cbp-lines');list.replaceChildren();list.scrollTop=0;this.updateLyricsClock();
            if(source!=='spotify')return;
            if(!/^spotify:track:[a-zA-Z0-9]+$/.test(uri)){status.textContent='Включи песню, чтобы увидеть текст';return;}
            status.textContent='Загружаю текст Spotify…';
            const current=()=>token===this.lyricRequest&&this.settings.lyricsSource===source&&Spicetify.Player.data?.item?.uri===uri;
            try{
                const data=await this.spotifyPanelData(uri);
                if(!current())return;
                this.panelLyricLines=panelLines(data);
                this.panelLyricLanguage=/^[a-z]{2,3}(?:-[a-z]{2})?$/i.test(data?.lyrics?.language||'')?data.lyrics.language.toLowerCase():'autodetect';
                status.textContent=!this.panelLyricLines.length?'Для этой песни текст не найден':this.panelLyricLines.some(line=>line.start!==null)?'Spotify · синхронизация по строкам':'Spotify · текст без синхронизации';
                const fragment=document.createDocumentFragment();
                for(const line of this.panelLyricLines){
                    const el=document.createElement(line.start===null?'p':'button');el.className='cbp-line';el.dir='auto';
                    const original=document.createElement('span');original.className='cbp-original';original.textContent=line.text;
                    const translated=document.createElement('span');translated.className='cbp-translation';translated.lang='ru';translated.dir='ltr';translated.hidden=true;el.append(original,translated);
                    if(line.start!==null)el.onclick=()=>Spicetify.Player.seek(line.start);
                    fragment.append(el);
                }
                list.append(fragment);
                this.syncPanelLyrics();this.updateLyricsClock();
                this.updatePanelTranslation();
            }catch(error){if(current())status.textContent='Текст недоступен. '+(error.message||'Попробуй другой трек.');}
        },
        syncPanelLyrics(progress=playerValue('getProgress')) {
            if(this.settings?.lyricsSource!=='spotify'||!this.panelLyricLines?.length)return;
            this.syncPanelTimeline(progress);
        }
    });
