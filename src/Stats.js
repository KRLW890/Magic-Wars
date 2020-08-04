const STAT_NAMES_SHORT = ["Atk","Skl","Def","Strd"];
const STAT_NAMES_FULL = ["Attack","Skill","Defense","Sturdiness"];

var Stats = function(atk, skl, def, strd)
{
    if (typeof atk == "object")
    {
        this.atk = atk.atk;
        this.skl = atk.skl;
        this.def = atk.def;
        this.strd = atk.strd;
    }
    else {
        this.atk = atk || 1;
        this.skl = skl || this.atk;
        this.def = def || this.atk;
        this.strd = strd || this.atk;
    }
};

Stats.prototype.getStatById = function(id)
{
    switch (id)
    {
        case 0: return this.atk; break;
        case 1: return this.skl; break;
        case 2: return this.def; break;
        case 3: return this.strd; break;
    };
};

Stats.prototype.changeStatById = function(id, val)
{
    switch (id)
    {
        case 0: this.atk = val; break;
        case 1: this.skl = val; break;
        case 2: this.def = val; break;
        case 3: this.strd = val; break;
    };
};

Stats.prototype.multiply = function(right)
{
    this.atk *= right.atk;
    this.skl *= right.skl;
    this.def *= right.def;
    this.strd *= right.strd;
};

Stats.prototype.floor = function()
{
    this.atk = Math.floor(this.atk+0.00000000001);
    this.skl = Math.floor(this.skl+0.00000000001);
    this.def = Math.floor(this.def+0.00000000001);
    this.strd = Math.floor(this.strd+0.00000000001);
};

