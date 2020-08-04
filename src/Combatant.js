var Combatant = function(name, stats, pos, id)
{
    this.name = name;
    this.id = id;
    
    this.maxHP = 100;
    this.currentHP = this.maxHP;
    this.maxEndur = 100;
    this.currentEndur = this.maxEndur;
    this.baseStats = new Stats(stats);
    this.modStats = new Stats(stats);
    this.statModifiers = new Stats();
    
    this.usableSpells = [1, 2, 3, 8, 0, 4];
    this.activeSpells = [];
    this.weapons = [0, 1, 3];

    this.sustain = false;
    this.lockdown = false;
    this.decay = false;
    
    this.animations = new PlayerAnimations(pos);
    
    this.emptySlots = 0;
    this.greenlight = true
};

Combatant.prototype.damageHP = function(amount)
{
    this.currentHP -= Math.floor(amount);
    if (this.currentHP < 0)
    {
        this.currentHP = 0;
        if (!tutorialRunning)
            victor = (this.id-1)*-1;
    }
    else if (this.currentHP > this.maxHP)
        this.currentHP = this.maxHP;
    for (var i = 0; i < this.activeSpells.length; i++)
        if (this.activeSpells[i] != undefined)
            spells[this.activeSpells[i].id].onHpUpdate(this.activeSpells[i]);
    this.updateStats();
    
    if (this.currentHP <= 0)
    {
        if (tutorialRunning)
        {
            tutorialPhase++;
            continuePhases = true;
            continueTutorial();
        }
    }
};

Combatant.prototype.updateStats = function()
{
    this.statModifiers = new Stats();
    this.modStats = new Stats(this.baseStats);
    for (var i = 0; i < this.activeSpells.length; i++)
    {
        if (this.activeSpells[i] != undefined)
            this.statModifiers.multiply(this.activeSpells[i].statMods);
    }
    this.modStats.multiply(this.statModifiers);
    this.modStats.floor();
    for (var i = 0; i < 4; i++)
        document.getElementById("stats"+this.id+i).innerText = STAT_NAMES_SHORT[i] + ": " + this.modStats.getStatById(i);
};

Combatant.prototype.maintainSpells = function(activeTurn, i, currTurn)
{
    this.greenlight = true;
    if (turnIsRunning)
    {
        var pointer = this;
        nextMaintain = function() { pointer.maintainSpells(activeTurn, i+1, currTurn); };
    }
    if (i == 0)
        this.emptySlots = 0;
    if (i < this.activeSpells.length)
    {
        if (this.activeSpells[i] == undefined)
        {
            this.emptySlots++;
            if (this.greenlight)
                continueTurn(currTurn);
        }
        else
        {
            if (activeTurn == this.id){
                this.greenlight = spells[this.activeSpells[i].id].onTurnChange(this.activeSpells[i]);}
            if (this.activeSpells[i] == undefined)
                this.emptySlots++;
            else if (this.emptySlots > 0)
            {
                this.activeSpells[i].placeId = i-this.emptySlots;
                this.activeSpells[i-this.emptySlots] = this.activeSpells[i];
                this.activeSpells[i] = undefined;
            }
        }
    }
    if (turnIsRunning)
    {
        if (i >= this.activeSpells.length)
        {
            for (var j = 0; j < this.emptySlots; j++)
                this.activeSpells.pop();
            this.emptySlots = 0;
            if (selected == 2 && nextMaintain != "spells")
                nextMaintain = "endurance";
        }
        if (this.greenlight && animsActive == 0)
            continueTurn(currTurn);
    }
    else if (i < this.activeSpells.length && activeTurn != this.id)
        this.maintainSpells(activeTurn, i+1, currTurn);
    else
    {
        for (var j = 0; j < this.emptySlots; j++)
            this.activeSpells.pop();
        this.emptySlots = 0;
    }
};

