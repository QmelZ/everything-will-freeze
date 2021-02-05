let zero = new Packages.java.lang.Integer(0);
Core.settings.put("musicvol", zero);
Core.settings.put("sfxvol", zero);
Core.settings.put("ambientvol", zero);

let timeFreeze = loadMusic("everything-will-freeze");
Events.on(ClientLoadEvent, () => {
    timeFreeze.setLooping(true);
    timeFreeze.play();
    timeFreeze.setVolume(1);
});

Events.on(WorldLoadEvent, () => {
    Timer.schedule(() => {
        Events.run(Trigger.update, () => {
            if(Vars.net.active()){
                Time.setDeltaProvider(() => 0.5);
            }else{
                Time.setDeltaProvider(() => 0);
                Vars.control.input.block = null;
            };
        });
    }, Mathf.random(60) + 30);
});
