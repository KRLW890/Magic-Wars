var selected = 0;

var actionSelect = function(id)
{
    if (id != selected && (!tutorialRunning || turnIsRunning)) //(!tutorialRunning || tutorialPhase == 3 || tutorialPhase == 10 || tutorialPhase == 23 || tutorialPhase == 26 || tutorialPhase == 30))
    {
        if (!tutorialRunning)
        {
            document.getElementById("action"+selected).classList.remove("selected");
            document.getElementById("action"+id).classList.add("selected");
        }
        selected = id;
        updateDetails();
    }
};

var updateDetails = function()
{
    document.getElementById("action-intro").innerHTML = "???";
    document.getElementById("id0").innerHTML = "";
    document.getElementById("id1").innerHTML = "";
    document.getElementById("id2").innerHTML = "";
    document.getElementById("comp-intro").innerHTML = "";
    document.getElementById("composite0").innerHTML = "";
    document.getElementById("composite1").innerHTML = "";
    document.getElementById("composite2").innerHTML = "";
    document.getElementById("action-target").innerHTML = "";
    
    switch (actions[selected].category)
    {
    case "not playing":
    case "empty":
        document.getElementById("action-intro").innerText = "Empty.";
    break;
    case "weapon":
        document.getElementById("action-intro").innerText = "Attacking with the";
        document.getElementById("id0").innerText = weapons[actions[selected].id].name + ".";
    break;
    case "spell":
        document.getElementById("action-intro").innerText = "Casting:";
        for (var i = 0; i < 3; i++)
            if (actions[selected].id[i] != undefined)
                document.getElementById("id"+i).innerText = spells[actions[selected].id[i]].name;
        if (!tutorialRunning || tutorialPhase >= 18)
        {
            document.getElementById("comp-intro").innerText = "(which becomes)";
            for (var i = 0; i < 3; i++)
                if (actions[selected].compositeIds[i] != undefined)
                    document.getElementById("composite"+i).innerText = spells[actions[selected].compositeIds[i]].name;
        }
        document.getElementById("action-target").innerText = "on ";
        if (actions[selected].target == -1)
            document.getElementById("action-target").innerText += " (no target selected)";
        else
            document.getElementById("action-target").innerText += " " + players[actions[selected].target].name + ".";
    break;
    case "release":
        document.getElementById("action-intro").innerText = "Releasing";
        if (actions[selected].target == -1 || actions[selected].id == -1)
            document.getElementById("id0").innerText = "(no target selected)";
        else
            document.getElementById("id0").innerText = players[actions[selected].target].name + "'s " + spells[players[actions[selected].target].activeSpells[actions[selected].id].id].name + ".";
    break;
    case "stagger":
        document.getElementById("action-intro").innerText = "The opponent's attack causes you to stagger for this action.";
    break;
    case "turn1":
        document.getElementById("action-intro").innerText = "You can only use your first action on turn 1.";
    break;
    }
}

var Action = function(num)
{
    this.num = num;
    this.button = document.getElementById("action"+num);
    this.category = "not playing"; // empty, weapon, spell, release, stagger
    this.id = [];
    this.target = 0;
    this.compositeIds = [];
};

Action.prototype.weapon = function(id)
{
    if (this.category != "stagger" && this.category != "turn1" && this.category != "not playing" && !turnIsRunning && (!tutorialRunning || tutorialPhase == 2 || tutorialPhase == 31))
    {
        if (this.category != "weapon")
        {
            if (this.category == "spell")
            {
                for (var i = 0; i < this.id.length; i++)
                    spells[this.id[i]].used = false;
            }
            this.category = "weapon";
            this.target = 0;
            if (!tutorialRunning)
            {
                this.button.classList = ["actionbutton"];
                this.button.classList.add("selected");
                this.button.classList.add("weapon");
            }
        }
        this.id = id;
        document.getElementById("infobox").innerText = "";
        if (selected != 2 && !tutorialRunning)
            actionSelect(selected+1);
        else
            updateDetails();
    }
};

Action.prototype.findComposites = function()
{
    this.compositeIds = [];
    var temp = [];
    for (var i = 0; i < this.id.length; i++)
        if (this.id[i] != undefined)
            temp.push(this.id[i]);
    this.id = JSON.parse(JSON.stringify(temp));
    
    if (this.id.length == 3 && findComposite(pow(2,this.id[0])+pow(2,this.id[1])+pow(2,this.id[2])) != -1)
        this.compositeIds.push(findComposite(pow(2,this.id[0])+pow(2,this.id[1])+pow(2,this.id[2])));
    else
    {
        for (var i = 0; i < this.id.length-1; i++)
        {
            for (var j = i+1; j < this.id.length; j++)
            {
                if (findComposite(pow(2,this.id[i])+pow(2,this.id[j])) != -1)
                {
                    this.compositeIds.push(findComposite(pow(2,this.id[i])+pow(2,this.id[j])));
                    temp[i] = -1;
                    temp[j] = -1;
                 }
            }
        }
        for (var i = 0; i < temp.length; i++)
            if (temp[i] != -1)
                this.compositeIds.push(temp[i]);
    }
};

Action.prototype.spell = function(spell, id)
{
    if (this.category != "stagger" && this.category != "turn1" && this.category != "not playing" && id != undefined && spells[id].used != true && !turnIsRunning)
    {
        if (this.category != "spell")
        {
            this.category = "spell";
            if (!tutorialRunning)
            {
                this.button.classList = ["actionbutton"];
                this.button.classList.add("selected");
                this.button.classList.add("spell");
            }
            this.target = -1;
            this.id = [];
        }
        var fullFlag = true;
        if (tutorialRunning && tutorialPhase < 15 && this.id[0] != undefined)
        {
            spells[this.id[0]].used = false;
            this.id = [];
        }
        for (var i = 0; i < 3; i++)
        {
           if (this.id[i] == undefined)
           {
               this.id[i] = id;
               this.findComposites();
               updateDetails();
               spells[id].used = true;
               fullFlag = false;
               if (this.target == -1)
                   document.getElementById("infobox").innerText = "Choose a target.";
               else
                   document.getElementById("infobox").innerText = "";
               break;
           }
        }
        if (fullFlag && !tutorialRunning)
            document.getElementById("infobox").innerText = "You can't cast any more spells with this action.";
    }
    else if (id != undefined && spells[id].used == true && !turnIsRunning && !tutorialRunning)
        document.getElementById("infobox").innerText = "You can't use that spell again this turn.";
};

Action.prototype.release = function()
{
    if (this.category != "stagger" && this.category != "turn1" && this.category != "not playing" && !turnIsRunning && (!tutorialRunning || tutorialPhase == 25 || tutorialPhase == 31))
    {
        if (this.category != "release")
        {
            if (this.category == "spell")
            {
                for (var i = 0; i < this.id.length; i++)
                    spells[this.id[i]].used = false;
            }
            this.category = "release";
            if (!tutorialRunning)
            {
                this.button.classList = ["actionbutton"];
                this.button.classList.add("selected");
                this.button.classList.add("release");
            }
            else if (tutorialPhase == 25)
                document.getElementById("infobox").innerText = "Now click on the name of the spell you want to release.";
            this.target = -1;
            this.id = -1;
            updateDetails();
        }
    }
};

var cancelSelection = function(id)
{
    if (!turnIsRunning)
    {
        if (actions[selected].category == "spell")
        {
            spells[actions[selected].id[id]].used = false;
            actions[selected].id[id] = undefined;
            actions[selected].findComposites();
        }
        if (actions[selected].category == "weapon" || actions[selected].category == "release" || actions[selected].compositeIds.length == 0)
        {
            actions[selected].category = "empty";
            if (!tutorialRunning)
            {
                actions[selected].button.classList = ["actionbutton"];
                actions[selected].button.classList.add("selected");
            }
        }
        updateDetails();
    }
};

Action.prototype.run = function()
{
    switch (this.category)
    {
    case "turn1":
    case "empty":
        continueTurn(currentTurn);
    break;
    case "stagger":
        document.getElementById("infobox").innerText = players[turn].name + " staggered from the opponent's attack!";
        memos.push(new Memo("STAGGER", turn, memos.length-1));
        players[turn].animations.stagger();
    break;
    case "weapon":
        document.getElementById("infobox").innerText = players[turn].name + " attacked with the " + weapons[this.id].name + "!";
        weapons[this.id].attack(turn);
    break;
    case "spell":
        document.getElementById("infobox").innerText = players[turn].name + " cast ";
        for (var i = 0; i < this.compositeIds.length; i++)
        {
            if (i > 0)
                document.getElementById("infobox").innerText += ", ";
            if (i == this.compositeIds.length-1 && i != 0)
                document.getElementById("infobox").innerText += " and ";
            document.getElementById("infobox").innerText += " " + spells[this.compositeIds[i]].name;
        }
        document.getElementById("infobox").innerText += " on " + players[this.target].name + "!";
        players[turn].animations.cast();
    break;
    case "release":
        document.getElementById("infobox").innerText = players[turn].name + " released ";
        document.getElementById("infobox").innerText += " " + players[this.target].name + "'s " + spells[players[this.target].activeSpells[this.id].id].name + "!";
        players[turn].animations.cast();
    break;
    };
};

