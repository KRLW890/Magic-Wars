var staggering = false;

var Weapon = function(name, img, baseDamage, atk, def, stagger, statReqs)
{
    this.name = name;
    this.img = img;
    this.baseDamage = baseDamage;
    this.atk =  atk;
    this.def = def;
    this.infoType = "weapon";
    this.formula = function(user, opp)
    {
        return constrain(Math.floor( this.baseDamage *
               (user.getStatById(this.atk) + user.atk/2) /
               (opp.getStatById(this.def) + opp.def/2)
               ), 1, Infinity);
    };
    //this.staggerChance = stagger || function() { return 0 };
    this.stagger = stagger || function() { return false; };
//function(userStats, oppStats) { return (random() <= constrain((userStats.strd-oppStats.strd)/oppStats.strd*, 0, 0.3)); }
    this.statReqs = statReqs || new Stats(0);
    this.pid;
    this.attack = function(pid) { this.pid = pid; players[pid].animations.attack(); };
    this.drawAttack = function() { players[this.pid].animations.drawAttack(); };
};

function initWeapons() {
    weapons = [
        new Weapon("Rapier", images.rapier, 9, 1, 2),
        new Weapon("Lance", images.lance, 12, 0, 3, function(userStats, oppStats) { return (random() <= constrain((userStats.strd-oppStats.strd)/oppStats.strd*0.3, 0, 0.3)); }),
        new Weapon("Musket", images.musket, 15, 1, 2, function() { return false; }, new Stats(0, 120, 0, 0)),
        new Weapon("Grisner's Warhammer", images.grisnersWarhammer, 25, 0, 3, function(userStats, oppStats) { return (random() <= constrain((userStats.strd-oppStats.strd)/oppStats.strd*0.2, 0, 0.2)); }, new Stats(0, 0, 0, 200)),
        new Weapon("Sword", images.sword, 12, 0, 2),
        //new Weapon("Bow & Arrow", images.lance, 12, new Stats(0, 0.2, 0.9, 0.3, 0.3, 0.4), 0),
    ];
    weapons[2].attack = function(pid)
    {
        animsActive++;
        this.pid = pid;
        players[pid].animations.playing.attack = true;
        players[pid].animations.turnStarted.attack = currentTurn;
        players[pid].animations.frames = 0;
        loop();
    };
    weapons[2].drawAttack = function()
    {
        players[this.pid].animations.frames++;
        if (players[this.pid].animations.frames < 10)
            players[this.pid].animations.drawImg(this.img[0]);
        else
            players[this.pid].animations.drawImg(this.img[1]);
        if (players[this.pid].animations.frames == 10)
            startEffect();
        if (players[this.pid].animations.frames >= 20)
        {
            players[this.pid].animations.playing.attack = false;
            animsActive--;
            if (animsActive == 0)
            {
                var turnStarted = players[this.pid].animations.turnStarted.attack;
                setTimeout(function() { continueTurn(turnStarted); }, textPause);
            }
        }
    };
};

