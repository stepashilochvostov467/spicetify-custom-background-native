    function panelLines(payload) {
        if(typeof payload==='string'){try{payload=JSON.parse(payload);}catch{return [];}}
        const data=payload?.lyrics;if(!Array.isArray(data?.lines))return [];
        const synced=data.syncType==='LINE_SYNCED';
        return data.lines.slice(0,2500).map(line=>{
            const raw=Number(line?.startTimeMs);
            const start=synced&&line?.startTimeMs!=null&&Number.isFinite(raw)&&raw>=0?raw:null;
            const end=Number(line?.endTimeMs);
            return {text:String(line?.words||'').slice(0,10000),start,end:start!==null&&Number.isFinite(end)&&end>start?end:null};
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
        async fetchSpotifyPanelData(uri) {
            if(!Spicetify.CosmosAsync?.get)throw Error('Источник Spotify пока недоступен');
            let timer;try{return await Promise.race([Spicetify.CosmosAsync.get(`https://spclient.wg.spotify.com/color-lyrics/v2/track/${uri.split(':')[2]}?format=json&vocalRemoval=false&market=from_token`),new Promise((_,reject)=>timer=setTimeout(()=>reject(Error('Источник не ответил')),10000))]);}finally{clearTimeout(timer);}
        },
        async spotifyPanelData(uri,force=false) {return await this.preparedLyrics?.('spotify',uri,force)||this.fetchSpotifyPanelData(uri);},
        async loadPanelLyrics(force=false) {
            if(!this.lyricsPanel)return;
            const source=this.settings.lyricsSource,playingURI=Spicetify.Player.data?.item?.uri;
            if(source!=='off'&&this.panelAudioURI()===playingURI&&this.isPanelVideoTrack()){
                await this.restorePanelVideoEdition(playingURI);
                if(this.settings.lyricsSource!==source||Spicetify.Player.data?.item?.uri!==playingURI)return;
            }
            const uri=this.panelAudioURI(),key=source+':'+uri+(playingURI&&playingURI!==uri?':'+playingURI:'');
            const sync=playingURI!==uri?this.preparePanelClipTiming(playingURI,uri):null;
            if(!force&&this.panelLyricKey===key){this.updatePanelTranslation();return;}
            this.panelClipAnchorArmed=false;this.panelLyricTimingURI=null;this.panelLyricKey=key;this.setLyricReading("",false);this.lyricsPanel.style.removeProperty('--cbp-visible-lyrics-height');
            this.cancelPanelTranslation();
            this.prefetchTranslation?.controller.abort();
            const token=++this.lyricRequest;this.panelLyricLines=[];this.panelLyricIndex=-1;this.clockLineSource=null;this.panelTimelineSource=null;this.panelTimeline=[];this.panelRowNodes=[];this.panelStateIndex=undefined;this.translationIdleLines=null;
            const status=this.lyricsPanel.querySelector('[role="status"]'),list=this.lyricsPanel.querySelector('.cbp-lines');this.lyricsPanel.dataset.cinemaMotion='false';this.lyricsPanel.dataset.cinematic='false';status.dataset.error='false';list.replaceChildren();list.scrollTop=0;this.updateLyricsClock();
            if(source!=='spotify')return;
            if(!/^spotify:track:[a-zA-Z0-9]+$/.test(uri)){status.textContent='Включи песню, чтобы увидеть текст';return;}
            status.textContent='Загружаю текст Spotify…';
            const current=()=>token===this.lyricRequest&&this.settings.lyricsSource===source&&this.panelAudioURI()===uri&&Spicetify.Player.data?.item?.uri===playingURI;
            try{
                const {data,timingURI}=await this.panelSpotifyTiming(uri,playingURI,force);
                if(sync)await sync;
                if(!current())return;
                this.panelLyricTimingURI=timingURI;
                this.panelLyricLines=panelLines(data);
                this.panelLyricLanguage=this.lyricLanguage(data?.lyrics?.language,this.panelLyricLines);
                status.textContent=!this.panelLyricLines.length?'Для этой песни текст не найден':this.panelLyricLines.some(line=>line.start!==null)?'Spotify · синхронизация по строкам':'Spotify · текст без синхронизации';
                status.dataset.error=String(!this.panelLyricLines.length);this.lyricsPanel.dataset.timed=String(this.panelLyricLines.some(line=>line.start!==null));
                const fragment=document.createDocumentFragment();
                for(const line of this.panelLyricLines){
                    const el=document.createElement(line.start===null?'p':'button');el.className='cbp-line';el.dir='auto';
                    const original=document.createElement('span');original.className='cbp-original';original.textContent=line.text;
                    const translated=document.createElement('span');translated.className='cbp-translation';translated.lang='ru';translated.dir='ltr';translated.hidden=true;el.append(original,translated);
                    if(line.start!==null){el.dataset.startMs=line.start;el.onclick=()=>this.seekPanelLyric(line.start);}
                    fragment.append(el);
                }
                list.append(fragment);
                this.syncPanelLyrics();this.updateLyricsClock();
                this.updatePanelTranslation();this.updatePanelMediaPicker?.();
            }catch(error){if(current()){status.dataset.error='true';status.textContent='Текст недоступен. '+(error.message||'Попробуй другой трек.');}}
        },
        syncPanelLyrics(progress=playerValue('getProgress')) {
            if(this.lyricsPanel?.dataset.reading==='hold')return;
            if(this.settings?.lyricsSource!=='spotify'||!this.panelLyricLines?.length)return;
            this.syncPanelTimeline(this.panelLyricProgress(progress));
        }
    });
