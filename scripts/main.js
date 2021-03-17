importPackage(java.lang);
let int = (i) => Integer.valueOf(i);
let float = (f) => Float.valueOf(f);

let frozen = false;
let vol = {
    music: int(100),
    sfx: int(100),
    ambient: int(100)
}

Core.settings.defaults(
    "timeskip-skipspeed", float(1)
);

function skipDialog(){
    let dialog = new BaseDialog("timeskip");
    dialog.addCloseButton();
    
    let c = dialog.cont;
    c.label(() => "minutes to skip: " + Core.settings.getFloat("timeskip-skipspeed"));
    c.row();
    c.slider(
        1, 20, 1, Core.settings.getFloat("timeskip-skipspeed"),
        e => Core.settings.put("timeskip-skipspeed", float(e))
    ).size(320, 64);
    
    c.row();
    if(frozen){
        c.button("unfreeze", () => unfreeze());
    }else{
        c.button("freeze time", () => freezeTime());
    }
    
    dialog.buttons.button("skip", Icon.rightOpenOut, () => {
        Core.scene.dialog.hide();
        skipTime();
    });
    
    return dialog;
}

function resetTime(){
    Time.setDeltaProvider(() => Math.min(Core.graphics.getDeltaTime() * 60, 3));
}

function setTime(secs){
    Time.setDeltaProvider(() => Math.abs(secs) * Math.min(Core.graphics.getDeltaTime() * 60, 3));
}

function skipTime(){
    let autosave = Core.settings.getInt("saveinterval");
    Core.settings.put("saveinterval", int(99999));
    setTime(Core.settings.getFloat("timeskip-skipspeed") * 60);
    Timer.schedule(() => {
        resetTime();
        Core.settings.put("saveinterval", int(autosave));
    }, 1);
}

let timeFreeze = loadMusic("everything-will-freeze");
function freezeTime(){
    let zero = int(0);
    Core.settings.put("musicvol", zero);
    Core.settings.put("sfxvol", zero);
    Core.settings.put("ambientvol", zero);
    
    timeFreeze.setVolume(1);
    timeFreeze.play();
    
    setTime(0);
    Core.scene.dialog.hide();
}

function unfreeze(){
    Core.settings.put("musicvol", vol.music);
    Core.settings.put("sfxvol", vol.sfx);
    Core.settings.put("ambientvol", vol.ambient);
    
    if(timeFreeze.isPlaying()) timeFreeze.stop();
    
    resetTime();
    Core.scene.dialog.hide();
}

Events.on(ClientLoadEvent, () => {
    let dialog = skipDialog();
    
    Vars.ui.paused.buttons.button("timeskip", Icon.rightOpen, () => {
        Core.scene.dialog.hide();
        dialog.show();
    }).size(210, 64);
    Vars.ui.paused.buttons.button("quick skip", Icon.rightOpenOut, () => {
        Core.scene.dialog.hide();
        skipTime();
    }).size(210, 64);
});
