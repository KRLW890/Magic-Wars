var spellTree = new Root();

var Spell = function(name, id, turns, burden, statMods, stackable) {
    this.name = name;
    this.id = id;
    this.turns = turns;
    this.burden = burden;
    this.statMods = statMods;
    this.stackable = stackable || false;
    if (this.name != "")
        spellTree.add(this.name, this.id);
};



