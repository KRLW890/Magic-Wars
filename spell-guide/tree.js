const ALPHABET = [" ", "-", "'", ".", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

var substring = function(string, start, length)
{
    var output = "";
    for (var i = start; i < string.length && i < start+length; i++)
        output += string.charAt(i);
    return output;
};

var Root = function()
{
    this.type = "root";
    for (var i = 0; i < ALPHABET.length; i++)
        this[ALPHABET[i]] = undefined;
    this.previous = "";
    this.current = "";
};

var Leaf = function(previous, next, id)
{
    this.type = "leaf";
    this.previous = previous;
    this.current = next;
    this.id = id;
};

var Branch = function(previous, next1, next2, oldId, newId)
{
    Root.call(this);
    if (next1.length == 0)
    {
        Leaf.call(this, previous, "", oldId);
        this[next2.charAt(0).toLowerCase()] = new Leaf(previous+next2.charAt(0), substring(next2, 1, next2.length-1), newId);
    }
    else if (next2.length == 0)
    {
        Leaf.call(this, previous, "", newId);
        this[next1.charAt(0).toLowerCase()] = new Leaf(previous+next1.charAt(0), substring(next1, 1, next1.length-1), oldId);
    }
    else if (next1.charAt(0).toLowerCase() != next2.charAt(0).toLowerCase())
    {
        Leaf.call(this, previous, "", undefined);
        this[next1.charAt(0).toLowerCase()] = new Leaf(previous+next1.charAt(0), substring(next1, 1, next1.length-1), oldId);
        this[next2.charAt(0).toLowerCase()] = new Leaf(previous+next2.charAt(0), substring(next2, 1, next2.length-1), newId);
    }
    else
    {
        Leaf.call(this, previous, "", undefined);
        this[next1.charAt(0).toLowerCase()] = new Branch(previous+next1.charAt(0), substring(next1, 1, next1.length-1), substring(next2, 1, next2.length-1), oldId, newId);
    }
    this.type = "branch";
};

Leaf.prototype.search = function()
{
    return this;
};

Branch.prototype.search = function(previous, next)
{
    if ((previous+next).toLowerCase() == (this.previous+this.current).toLowerCase() ||
        this[next.charAt(0).toLowerCase()] == undefined)
        return this;
    else
        return this[next.charAt(0).toLowerCase()].search(previous+next.charAt(0), substring(next, 1, next.length-1));
};

Root.prototype.search = function(string)
{
    if (this[string.charAt(0).toLowerCase()] == undefined)
        return this;
    else
        return this[string.charAt(0).toLowerCase()].search(string.charAt(0), substring(string, 1, string.length-1));
};

Branch.prototype.add = function(previous, next, id)
{
    if (this[next.charAt(0).toLowerCase()] == undefined)
        this[next.charAt(0).toLowerCase()] = new Leaf(previous+next.charAt(0), substring(next, 1, next.length-1), id);
    else if ((this[next.charAt(0).toLowerCase()].previous+this[next.charAt(0).toLowerCase()].current).toLowerCase() == (previous+next).toLowerCase())
        this[next.charAt(0).toLowerCase()].id = id;
    else if (this[next.charAt(0).toLowerCase()].type == "leaf")
    {
        var temp = this[next.charAt(0).toLowerCase()];
        this[next.charAt(0).toLowerCase()] = null;
        this[next.charAt(0).toLowerCase()] = new Branch(temp.previous, temp.current, substring(next, 1, next.length-1), temp.id, id);
    }
    else
        this[next.charAt(0).toLowerCase()].add(previous+next.charAt(0), substring(next, 1, next.length-1), id);
};

Root.prototype.add = function(string, id)
{
    if (this[string.charAt(0).toLowerCase()] == undefined)
        this[string.charAt(0).toLowerCase()] = new Leaf(string.charAt(0), substring(string, 1, string.length-1), id);
    else if ((this[string.charAt(0).toLowerCase()].previous+this[string.charAt(0).toLowerCase()].current).toLowerCase() == string.toLowerCase())
        this[string.charAt(0).toLowerCase()].id = id;
    else if (this[string.charAt(0).toLowerCase()].type == "leaf")
    {
        var temp = this[string.charAt(0).toLowerCase()];
        this[string.charAt(0).toLowerCase()] = null;
        this[string.charAt(0).toLowerCase()] = new Branch(temp.previous, temp.current, substring(string, temp.previous.length, string.length), temp.id, id);
    }
    else //revise
        this[string.charAt(0).toLowerCase()].add(string.charAt(0), substring(string, 1, string.length-1), id);
};

Root.prototype.suggest = function()
{
    var output = [];
    for (var i = 0; i < ALPHABET.length; i++)
    {
        if (this[ALPHABET[i]] != undefined)
        {
            var temp = this[ALPHABET[i]].suggest();
            for (var j = 0; j < temp.length; j++)
                output.push(temp[j]);
        }
    }
    return output;
};

Branch.prototype.suggest = function()
{
    var output = [];
    if (this.id != undefined)
        output.push(this.previous);
    for (var i = 0; i < ALPHABET.length; i++)
    {
        if (this[ALPHABET[i]] != undefined)
        {
            var temp = this[ALPHABET[i]].suggest();
            for (var j = 0; j < temp.length; j++)
                output.push(temp[j]);
        }
    }
    return output;
};

Leaf.prototype.suggest = function()
{
    return [this.previous+this.current];
};

