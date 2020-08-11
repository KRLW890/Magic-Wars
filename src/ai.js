var Projection = function(p, last)
{
    this.id = p.id;
    this.hp = p.currentHP;
    this.lastHP = last;
    this.endur = p.currentEndur;
    this.stats = new Stats(p.modStats);
    this.lockdown = p.lockdown;
    this.glass = false;
    this.liquify = false;
    this.boil = false;
    this.hyper = false;
    this.ignite = false;
    for (var i = 0; i < p.activeSpells.length; i++)
    {
        if (p.activeSpells[i].id == 29)
            this.glass = true;
        else if (p.activeSpells[i].id == 20)
            this.liquify = true;
        else if (p.activeSpells[i].id == 23)
            this.boil = true;
        else if (p.activeSpells[i].id == 21)
            this.hyper = true;
        else if (p.activeSpells[i].id == 26)
            this.ignite = true;
    }
    this.cast = function(ids, target)
    {
        for (var i = 0; i < ids.length; i++)
            actions[selected].spell(ids[i]);
        actions[selected].target = proj[target].id;
        for (var i = 0; i < actions[selected].compositeIds.length; i++)
        {
            proj[0].endur -= spells[actions[selected].compositeIds[i]].burden;
            new fauxSpell(actions[selected].compositeIds[i], target);
        }
    };
};

var findId = function(id, activeSpells)
{
    var output = -1;
    for (var i = 0; i < activeSpells.length; i++)
    {
        if (activeSpells[i].id == id)
        {
            output = i;
            break;
        }
    }
    return output;
};

var fauxSpell = function(id, target)
{
    this.id = id;
    this.caster = proj[0].id;
    this.target = proj[target].id;
    this.statMods = new Stats(spells[id].statMods);
    if (id == 29 || id == 1)
        spells[id].onCast(this);
    proj[target].stats.multiply(this.statMods);
    proj[target].stats.floor();
};
var proj = [];
var releasedOppSpell = false, spellCasted = false;

var findBestWeapon = function()
{
    var orderedWeapons = [0];
    var uncertainty = 0;
    if (turnIsRunning)
        proj = [new Projection(players[turn]), new Projection(players[(turn-1)*-1])];
    for (var i = 1; i < weapons.length; i++)
    {
        if (proj[0].stats.greaterThanOrEqual(weapons[i].statReqs))
        {
            orderedWeapons.push(i);
            for (var j = orderedWeapons.length-2; j >= 0; j--)
            {
                if (weapons[orderedWeapons[j]].formula(proj[0].stats, proj[1].stats) < weapons[i].formula(proj[0].stats, proj[1].stats))
                {
                    orderedWeapons[j+1] = orderedWeapons[j];
                    orderedWeapons[j] = i;
                }
                else break;
            }
        }
    }
    
    for (var i = 1; i < orderedWeapons.length; i++)
    {
        if (weapons[orderedWeapons[i]].formula(proj[0].stats, proj[1].stats) >= weapons[orderedWeapons[0]].formula(proj[0].stats, proj[1].stats) - 2*aiOpponent)
            uncertainty++;
        else break;
    }
    
    return orderedWeapons[Math.floor(random()*uncertainty)];
};


var aiSelection = function()
{
    if (actions[selected].category == "empty")
    {
        var bestWeapon = findBestWeapon();
        var maxDamage = weapons[bestWeapon].formula(proj[0].stats, proj[1].stats) * (3-selected);
        if (maxDamage*(1-0.1*aiOpponent) >= proj[1].hp || maxDamage*(1+0.1*aiOpponent) >= proj[1].hp && random() > 0.5)
        { // if three hits kills the opponent, attack three times
            for (var i = selected; i < 3; i++)
                actions[i].weapon(bestWeapon);
        }
        else if (aiOpponent < 2 && !proj[0].glass && !spellCasted && proj[0].hp/players[proj[0].id].maxHP <= 0.2 && proj[0].endur >= 13 && maxDamage*2.5*(2-selected)/(3-selected) >= proj[1].hp)
        { // if hp is low enough, and glass edge + attacks kills opponent, do that. Disabled for beginners
            proj[0].cast([2,10], 0);
            proj[0].glass = true;
            spellCasted = true;
        }
        else if (aiOpponent == 0 && !proj[0].hyper && !proj[0].ignite && !spellCasted && proj[0].endur >= 30 && maxDamage*2.29*(2-selected)/(3-selected) >= proj[1].hp)
        { // if hyper/ignite + attacks kills opponent, do that. Expert only
            proj[0].cast([1,2,3], 0);
            proj[0].hyper = true;
            proj[0].ignite = true;
            spellCasted = true;
        }
        else if ((aiOpponent == 0 || aiOpponent == 1 && proj[0].hp/proj[0].lastHP <= 0.5) && !proj[0].boil && !spellCasted && proj[0].endur >= 20 && maxDamage*2*(2-selected)/(3-selected) >= proj[1].hp)
        { // if boil + attacks kills opponent, do that. Always active for Expert, only available for intermediate at low HP
            proj[0].cast([1,2,0], 0);
            proj[0].boil = true;
            spellCasted = true;
        }
        else if ((aiOpponent == 0 || aiOpponent == 1 && proj[0].hp/proj[0].lastHP <= 0.5) && !proj[0].hyper && !spellCasted && proj[0].endur >= 20 && maxDamage*1.7*(2-selected)/(3-selected) >= proj[1].hp)
        { // if hyper + attacks kills opponent, do that. Always active for Expert, only available for intermediate at low HP
            proj[0].cast([1,3], 0);
            proj[0].hyper = true;
            spellCasted = true;
        }
        else if (proj[0].hp/proj[0].lastHP <= 0.5 && !proj[1].liquify && !spellCasted && proj[1].endur >= 15)
        { // if HP is low, and none of the above strategies worked, weaken the opponent with Liquify (and Lockdown)
            var temp = selected;
            selected = 2;
            proj[0].cast([0,1,8], 1);
            proj[1].liquify = true;
            //proj[1].lockdown = true;
            spellCasted = true;
            selected = temp;
        }
        else if (proj[0].lockdown && proj[0].endur/players[proj[0].id].maxEndur <= 0.5)
        { // if affected by Lockdown and less than half endurance remaining, release Lockdown
            actions[selected].release();
            actions[selected].target = proj[0].id;
            actions[selected].id = findId(8, players[proj[0].id].activeSpells);
            proj[0].lockdown = false;
            proj[0].endur += spells[8].burden;
            if (players[proj[0].id].activeSpells[actions[selected].id].caster != proj[0].id)
                releasedOppSpell = true;
        }
        else if (proj[0].endur/players[proj[0].id].maxEndur <= 0.25 && !proj[0].lockdown && !releasedOppSpell)
        { // if not affected by Lockdown, but endurance is very low, release most taxing spell
            var highestEndur = 0;
            for (var i = 1; i < players[proj[0].id].activeSpells.length; i++)
                if (spells[players[proj[0].id].activeSpells[i].id].burden > spells[players[proj[0].id].activeSpells[highestEndur].id].burden)
                    highestEndur = i;
            actions[selected].release();
            actions[selected].target = proj[0].id;
            actions[selected].id = highestEndur;
            proj[0].endur += spells[players[proj[0].id].activeSpells[highestEndur].id].burden;
            if (players[proj[0].id].activeSpells[highestEndur].caster != proj[0].id)
                releasedOppSpell = true;
        }
        else if (aiOpponent == 0 && proj[1].endur/players[proj[1].id].maxEndur <= 25 && proj[1].endur/players[proj[1].id].maxEndur >= 15 && !proj[1].lockdown)
        { // if the opponent has low endurance, cast Lockdown on them. Expert only.
            actions[selected].spell(8);
            actions.target = proj[1].id;
            proj[1].endur -= spells[8].burden;
            proj[1].lockdown = true;
        }
        else if (proj[0].stats.atk < proj[1].stats.def * (1.5-0.2*Math.floor(aiOpponent)))
        {console.log(proj);
            if (aiOpponent < 2 && random() < (0.7-0.3*aiOpponent) && !spellCasted && !proj[0].hyper && !proj[0].ignite && proj[0].endur >= 60)
            {
                proj[0].cast([1,2,3], 0);
                proj[0].hyper = true;
                proj[0].ignite = true;
                spellCasted = true;
            }
            else if (aiOpponent < 2 && !spellCasted && !proj[0].boil && proj[0].endur >= 50)
            {
                proj[0].cast([1,2,0], 0);
                proj[0].boil = true;
                spellCasted = true;
            }
            else if (!releasedOppSpell && proj[0].liquify && !proj[0].lockdown)
            {
                actions[selected].release();
                actions[selected].target = proj[0].id;
                actions[selected].id = findId(20, players[proj[0].id].activeSpells);
                proj[0].endur += spells[20].burden;
                proj[0].stats.divideBy(players[proj[0].id].activeSpells[actions[selected].id].statMods);
                proj[0].stats.floor();
                proj[0].liquify = false;
                releasedOppSpell = true;
            }
            else if ((aiOpponent < 2 || random() < 0.3) && !spellCasted && !proj[0].hyper && proj[0].endur >= 45)
            {
                proj[0].cast([3,1], 0);
                proj[0].hyper = true;
                spellCasted = true;
            }
            else if (!spellCasted && !proj[0].ignite && proj[0].endur >= 45)
            {
                proj[0].cast([2,1], 0);
                proj[0].ignite = true;
                spellCasted = true;
            }
        }
        
        if (actions[selected].category == "empty" && aiOpponent < 2 && proj[0].stats.strd*2 <= proj[1].stats.strd && !proj[1].lockdown && !releasedOppSpell)
        {
            var highestStrd = 0;
            for (var i = 1; i < players[proj[1].id].activeSpells.length; i++)
                if (spells[players[proj[1].id].activeSpells[i].id].burden > spells[players[proj[1].id].activeSpells[highestEndur].id].burden)
                    highestStrd = i;
            actions[selected].release();
            actions[selected].target = proj[1].id;
            actions[selected].id = highestStrd;
            proj[1].endur += spells[players[proj[1].id].activeSpells[highestStrd].id].burden;
            if (players[proj[1].id].activeSpells[highestStrd].caster != proj[0].id)
                releasedOppSpell = true;
            
        }
        
        if (actions[selected].category == "empty")
        {console.log("empty test");
            actions[selected].weapon(bestWeapon);
            proj[1].hp -= weapons[bestWeapon].formula(proj[0].stats, proj[1].stats);
        }
    }
    
    if (selected < 2)
    {
        actionSelect(selected+1);
        aiSelection();
    }
    else
        proj[0].lastHP = proj[0].hp;
};


