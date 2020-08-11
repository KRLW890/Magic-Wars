var spellTickDown = function(spell)
{
    if (players[spell.target].sustain == false)
    {
        spell.turns--;
        if (players[spell.target].decay)
            spell.turns--;
        if (spell.turns <= 0)
            spell.release();
        else
            spell.updateElement();
    }
    return true;
};

var Spell = function(name, id, turns, burden, statMods, desc, stackable) {
    this.name = name;
    this.id = id;
    this.turns = turns;
    this.burden = burden;
    this.statMods = statMods;
    this.desc = desc || "None.";
    this.stackable = stackable || false;
    this.used = false;
    this.outcome = 0;
    this.onCast = function() {};
    this.onTurnChange = spellTickDown;
    this.onRelease = function() {};
    this.onHpUpdate = function() {};
    this.infoType = "spell";
};

Spell.prototype.cast = function(user, target, offset)
{
    var stacked = false;
    if (!this.stackable)
    {
        for (var i = 0; i < players[target].activeSpells.length; i++)
        {
            if (players[target].activeSpells[i] != undefined && this.id == players[target].activeSpells[i].id)
            {
                stacked = true;
                break;
            }
        }
    }
    if (players[target].currentEndur >= this.burden && !stacked)
    {
        players[target].activeSpells.push(new CastedSpell(this.id, user, target));
        this.onCast(players[target].activeSpells[players[target].activeSpells.length-1]);
        players[target].currentEndur -= this.burden;
        players[target].updateStats(target);
        var tempName = this.name.toUpperCase();
        setTimeout(function() { memos.push(new Memo("+" + tempName, target, memos.length-1)); }, textPause/1.8*offset);
    }
};

var CastedSpell = function(id, caster, target)
{
    this.id = id;
    this.placeId = players[target].activeSpells.length;
    this.caster = caster;
    this.target = target;
    this.statMods = new Stats(spells[id].statMods);
    this.turns = spells[id].turns;
    this.infoType = "castedspell";
    this.element = document.createElement("p");
    this.updateElement = function()
    {
        this.element.innerText = spells[this.id].name + " ";
        if (this.turns != Infinity)
            this.element.innerText += " (" + this.turns + "/" + spells[this.id].turns + " turns left)";
    };
    this.updateElement();
    var pointer = this;
    this.element.addEventListener("click", function() {
        showInfo();
        generateCastedSpellInfo(pointer);
        
        if (actions[selected].category == "release" && !turnIsRunning)
        {
            var allowed = true;
            for (var i = 0; i < 3; i++)
            {
                if (i != selected && actions[i].category == "release")
                {
                    if (actions[i].target == pointer.target && actions[i].id == pointer.placeId)
                    {
                        allowed = false;
                        document.getElementById("infobox").innerText = "You are already releasing that spell with another action.";
                        break;
                    }
                    else if (players[pointer.target].activeSpells[pointer.placeId].caster != turn && players[actions[i].target].activeSpells[actions[i].id].caster != turn)
                    {
                        allowed = false;
                        document.getElementById("infobox").innerText = "You can only release one spell cast by your opponent in a turn.";
                        break;
                    }
                }
            }
            if (allowed)
            {
                actions[selected].target = pointer.target;
                actions[selected].id = pointer.placeId;
                document.getElementById("infobox").innerText = "";
                if (selected != 2 && !tutorialRunning && (!players[pointer.target].lockdown || pointer.id == 8))
                    actionSelect(selected+1);
                else if (players[pointer.target].lockdown && pointer.id != 8)
                    document.getElementById("infobox").innerText = "This action will fail if Lockdown is not released first.";
                updateDetails();
                if (tutorialRunning && (tutorialPhase == 25))
                {
                    document.getElementById("releasebutton").classList.remove("blink");
                    document.getElementById("runturn").classList.add("blink");
                    document.getElementById("runturn").innerText = "Release =>";
                }
            }
         }
    });
    document.getElementById("spellbox"+this.target).appendChild(this.element);
    this.element.classList.add("castedSpell"+this.caster);
};

CastedSpell.prototype.release = function()
{
    if (!players[this.target].lockdown || this.turns >= 0 || this.id == 8)
    {
        spells[this.id].onRelease(this);
        document.getElementById("spellbox"+this.target).removeChild(this.element);
        players[this.target].currentEndur += spells[this.id].burden;
        players[this.target].activeSpells[this.placeId] = undefined;
    }
};

