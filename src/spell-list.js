var spells;

var initSpells = function() {
    spells = [
        new Spell("Soften", 0, 5, 10, new Stats(0.7, 0.9, 1.4, 1)),
        new Spell("Erratic", 1, 5, 5, new Stats("?"), "Randomly raises one stat while lowering another.", true),
        new Spell("Blaze", 2, 5, 8, new Stats(1.15, 0.9, 0.9, 1)),
        new Spell("Sustain", 3, Infinity, 15, new Stats(), "Pauses the turn counter for all spells on the affected player."),
        new Spell("Health Boost", 4, 2, 15, new Stats(), "Temporarily restores 20% HP. The extra HP disappears when the spell releases.", true),
        new Spell("Dexterity", 5, 3, 10, new Stats(1.1, 1.3, 0.9, 0.8)),
        new Spell("Fortify", 6, 4, 13, new Stats(0.8, 0.7, 1.2, 1.4)),
        new Spell("", 7, 4, 10, new Stats()),
        new Spell("Lockdown", 8, Infinity, 15, new Stats(), "Prevents both players from releasing other spells on the affected player."),
        new Spell("Levitation", 9, 5, 8, new Stats(1.1, 1.1, 1, 0.7)),
        new Spell("Frost", 10, 4, 10, new Stats(1, 0.9, 1, 1.2)),
        new Spell("", 11, 4, 10, new Stats()),
        new Spell("", 12, 4, 10, new Stats()),
        new Spell("", 13, 4, 10, new Stats()),
        new Spell("", 14, 4, 10, new Stats()),
        new Spell("", 15, 4, 10, new Stats()),
        new Spell("", 16, 4, 10, new Stats()),
        new Spell("", 17, 4, 10, new Stats()),
        new Spell("", 18, 4, 10, new Stats()),
        new Spell("", 19, 4, 10, new Stats()),
        new Spell("Liquify", 20, 4, 15, new Stats(0.6, 0.8, 1.7, 0.9)),
        new Spell("Hyperactivity", 21, 3, 20, new Stats(1.7, 1, 1, 0.7)),
        new Spell("Regeneration", 22, 4, 15, new Stats(), "The affected player regains 8% HP at the end of their turns."),
        new Spell("Boil", 23, 3, 20, new Stats(2, 0.8, 1.4, 0.7), "The affected player loses 15% HP at the end of their turns."),
        new Spell("", 24, 4, 10, new Stats()),//new Spell("Dark Shroud", 24, 4, 17, new Stats()),
        new Spell("Aviary", 25, 4, 17, new Stats(1.4, 1.7, 0.8, 0.5)),
        new Spell("Ignite", 26, 4, 10, new Stats(1.35, 0.9, 0.8, 0.9)),
        new Spell("Mystic Armor", 27, 3, 18, new Stats(0.85, 0.65, 1.35, 1.6)),
        new Spell("Stalwart", 28, 3, 30, new Stats(1.6, 1, 1, 1.6)),
        new Spell("Glass Edge", 29, 3, 13, new Stats("?", 1, 0.6, 0.8), "The affected player's Atk raises exponentially the lower their current HP."),
        new Spell("Decay", 30, Infinity, 15, new Stats(1, 1, 1, 1), "The turn counter for spells on the affected player moves twice as fast."),
        //new Spell("Northern Wind", 40, 4, 10, new Stats()),
        //new Spell("Unstoppable", 50, Infinity, 35, new Stats(4, 0.7, 0.9, Infinity)),
        //new Spell("Immovable", 51, Infinity, 35, new Stats(1, 0.4, 4, Infinity)),
        //new Spell(),
    ];
    spells[1].setRandomAtTurnStart = function()
    {
        var rand1 = Math.floor(Math.random()*4);
        var rand2 = Math.floor(Math.random()*4);
        while (rand1 == rand2)
            rand2 = Math.floor(Math.random()*4);
        this.outcome = rand1*4 + rand2;
    };
    spells[1].onCast = function(spell)
    {
        spell.statMods = new Stats();
        spell.statMods.changeStatById(this.outcome%4, 4/3);
        this.outcome = Math.floor(this.outcome/4);
        spell.statMods.changeStatById(this.outcome%4, 0.75);
    }
    spells[3].onCast = function(spell)
    {
        players[spell.target].sustain = true;
    };
    spells[3].onRelease = function(spell)
    {
        players[spell.target].sustain = false;
    };
    spells[4].onCast = function(spell)
    {
        spell.boost = Math.floor(players[spell.target].maxHP*0.2);
        if (players[spell.target].maxHP-players[spell.target].currentHP <= spell.boost)
            spell.boost = players[spell.target].maxHP-players[spell.target].currentHP;
        players[spell.target].damageHP(-spell.boost);
    };
    spells[4].onRelease = function(spell)
    {
        players[spell.target].damageHP(spell.boost);
    };
    spells[29].onCast = function(spell)
    {
        spell.statMods.atk = 1 / (1-3/4*(1-players[spell.target].currentHP/players[spell.target].maxHP));
    };
    spells[29].onHpUpdate = function(spell)
    {
        spell.statMods.atk = 1 / (1-3/4*(1-players[spell.target].currentHP/players[spell.target].maxHP));
        players[spell.target].updateStats();
    };
    spells[8].onCast = function(spell)
    {
        players[spell.target].lockdown = true;
    };
    spells[8].onRelease = function(spell)
    {
        players[spell.target].lockdown = false;
    };
    spells[22].onTurnChange = function(spell)
    {
        if (players[spell.target].currentHP < players[spell.target].maxHP)
        {
            players[spell.target].damageHP(-Math.floor(players[spell.target].maxHP*0.08));
            document.getElementById("infobox").innerText = players[spell.target].name + " regained a little HP from Regeneration.";
            players[spell.target].animations.heal();
            memos.push(new Memo("REGENERATE", spell.target, memos.length-1));
            spellTickDown(spell);
            return false;
        }
        else
            return spellTickDown(spell);
    };
    spells[23].onTurnChange = function(spell)
    {
        players[spell.target].damageHP(Math.floor(players[spell.target].maxHP*0.15));
        document.getElementById("infobox").innerText = players[spell.target].name + " was damaged by Boil!";
        players[spell.target].animations.damage();
        memos.push(new Memo("BOIL", spell.target, memos.length-1));
        spellTickDown(spell);
        return false;
    };
    spells[30].onCast = function(spell)
    {
        players[spell.target].decay = true;
    };
    spells[30].onRelease = function(spell)
    {
        players[spell.target].decay = false;
    };
};


var findComposite = function(value)
{
    var output = -1;
    switch (value)
    {
        case 3:    output = 20; break;
        case 10:   output = 21; break;
        case 24:   output = 22; break;
        case 7:    output = 23; break;
        case 544:  output = 25; break;
        case 6:    output = 26; break;
        case 320:  output = 27; break;
        case 74:   output = 28; break;
        case 1028: output = 29; break;
        case 264:  output = 30; break;
        //case 328: output = "immovable"; break;
    };
    return output;
};
