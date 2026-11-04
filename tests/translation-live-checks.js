async () => {
    const a=CBP.app;
    Spicetify.Player.data.item={uri:'spotify:track:TRANSLATELIVE',metadata:{image_url:testImage}};
    Spicetify.CosmosAsync={get:async()=>({lyrics:{language:'en',syncType:'LINE_SYNCED',lines:[{startTimeMs:'0',words:'The small blue bird flies over the quiet city.'}]}})};
    a.settings.lyricsSource='spotify';a.settings.lyricsTranslation=true;await a.render();
    for(let i=0;i<300;i++){
        const el=a.lyricsPanel.querySelector('.cbp-translation');
        if(el&&!el.hidden&&/[а-яё]/i.test(el.textContent)){
            a.settings.lyricsSource='off';await a.render();
            return ['Live browser request returned a Russian translation under its original line'];
        }
        await new Promise(resolve=>setTimeout(resolve,50));
    }
    throw Error('Live translation failed: '+a.lyricsPanel.querySelector('.cbp-translation-status').textContent);
}
