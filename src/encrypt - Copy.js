var base64 = {
    byId: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "-", "_"],
    byChar: {}
};
for (var i = 0; i < base64.byId.length; i++)
    base64.byChar[base64.byId[i]] = i;

var replayCode = "0";
var replaying = false;

var convertTo64 = function(val)
{
    output = "";
    while (val > 0)
    {
        output = base64.byId[val%64] + output;
        val = Math.floor(val/64);
    }
    return output;
};

var convertFrom64 = function(val)
{
    var output = 0;
    for (var i = 0; i < val.length; i++)
    {
        output *= 64;
        output += base64.byChar[val.charAt(i)];
    }
    return output;
};

var substring = function(string, start, length)
{
    var output = "";
    for (var i = start; i < string.length && i < start+length; i++)
        output += string.charAt(i);
    return output;
};

var encryptAction = function(action)
{
    var output = constrain(action.target, 0, 1);
    if (action.category == "spell")
    {
        for (var i = 0; i < 3; i++)
        {
            output *= 32;
            if (action.id[i] == undefined || action.id[i] < 0)
                output += 31;
            else
                output += action.id[i];
        }
    }
    else
    {
        output *= 1024;
        //output += Math.floor(random()*1024);
        output *= 32;
        if (action.id == undefined || action.id < 0 || typeof action.id == "object")
            output += 31;
        else
            output += action.id;
    }
    output *= 8;
    switch (action.category)
    {
        case "turn1":
        case "empty": output += 0; break;
        case "stagger": output += 1; break;
        case "weapon": output += 2; break;
        case "spell": output += 3; break;
        case "release": output += 4; break;
    };
    output = convertTo64(output);
    while (output.length < 4)
        output = "0" + output;
    
    return output;
};

var decryptAction = function(val, destination)
{
    val = convertFrom64(val);
    destination.button.classList = ["actionbutton"];
    switch (val%8)
    {
        case 0:
            destination.category = "empty";
        break;
        case 1:
            destination.category = "stagger";
            destination.button.classList.add("stagger");
        break;
        case 2:
            destination.category = "weapon";
            destination.button.classList.add("weapon");
        break;
        case 3:
            destination.category = "spell";
            destination.button.classList.add("spell");
        break;
        case 4:
            destination.category = "release";
            destination.button.classList.add("release");
        break;
        default: destination.category = "invalid"; break;
    };
    val = Math.floor(val/8);
    if (destination.category == "spell")
    {
        destination.id = [];
        for (var i = 2; i >= 0; i--)
        {
            if (val%32 != 31)
                destination.id[i] = (val%32);
            val = Math.floor(val/32);
        }
        destination.findComposites();
    }
    else if (destination.category != "empty" && destination.category != "stagger")
    {
        destination.id = val%32;
        val = Math.floor(val/32768);
    }
    destination.target = val%2;
};

var printReplay = function()
{
    document.getElementById("current-match-replay").value = replayCode;
};

var replayGame = function(code)
{
    turn = 0;
    for (var i = 0; i < 2; i++)
    {
        for (var j = 0; j < players[i].activeSpells.length; j++)
            if (players[i].activeSpells[j] != undefined)
                players[i].activeSpells[j].release();
        players[i].currentHP = players[i].maxHP;
        players[i].currentEndur = players[i].maxEndur;
        players[i].updateStats();
    }
    replaying = true;
    replayCode = substring(code, 1, code.length-1);
    runTurn();
};


