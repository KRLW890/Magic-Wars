var turn = 0;
var currentTurn = 0;
var turnIsRunning = false;
var textPause = 540;
var nextMaintain = "spells";
var victor = -1;
var onlineOpp = -1;

var changeTextSpeed = function(milli)
{
    textPause = milli;
    frameRate(Math.floor((1080-textPause)/12));
};

var setTurn = function()
{
    turnIsRunning = false;
    players[(turn-1)*-1].maintainSpells(turn, 0, currentTurn);
    players[0].updateStats();
    players[1].updateStats();
    if (!tutorialRunning)
    {
        currentTurn++;
        turn = (turn-1)*-1;
        document.getElementById("turn-counter").innerText = "Turn " + currentTurn;
        document.getElementById("player-turn").innerText = players[turn].name + "'s turn";
    }
    else if (tutorialPhase == 31)
        turn = (turn-1)*-1;
    
    if (!replaying)
        spells[1].setRandomAtTurnStart();
    
    if (onlineOpp == turn)
        document.getElementById("infobox").innerText = "Waiting for opponent.";
    else
        document.getElementById("infobox").innerText = players[turn].name + "'s turn.";
    for (var i = 0; i < 3; i++)
    {
        if (!tutorialRunning)
            document.getElementById("action"+i).classList = ["actionbutton"];
        if (onlineOpp != turn)
        {
            actions[i].category = "empty";
            actions[i].target = 0;
            actions[i].id = 0;
        }
        else
            actions[i].category = "not playing";
    }
    document.getElementById("action0").classList.add("selected");
    selected = 0;
    if (!tutorialRunning && currentTurn == 1)
    {
        actions[1].category = "turn1";
        actions[2].category = "turn1";
        document.getElementById("action1").classList.add("stagger");
        document.getElementById("action2").classList.add("stagger");
    }
    else if (staggering && !tutorialRunning && onlineOpp != turn)
    {
        actions[0].category = "stagger";
        document.getElementById("action0").classList.add("stagger");
    }
    staggering = false;
    updateDetails();
    /*
    for (var i = 0; i < weapons.length; i++)
        document.getElementById("weapon"+i).classList.add("hidden");
    for (var i = 0; i < players[turn].weapons.length; i++)
        document.getElementById("weapon"+players[turn].weapons[i]).classList.remove("hidden");*/
    
    for (var i = 0; i < 6; i++)
    {
        if (players[turn].usableSpells[i] == undefined && !tutorialRunning && onlineOpp != turn)
            document.getElementById("spell"+i).innerText = "Empty";
        else if (!tutorialRunning && onlineOpp != turn)
        {
            spells[players[turn].usableSpells[i]].used = false;
            document.getElementById("spell"+i).innerText = spells[players[turn].usableSpells[i]].name;
        }
        else if (players[turn].usableSpells[i] != undefined)
            spells[players[turn].usableSpells[i]].used = false;
    }
    if (replaying)
        setTimeout(runTurn, 100);
    if (aiOpponent >= 0 && turn == 1)
    {
        actionSelect(0);
        var lastHP;
        if (proj.length == 2)
            lastHP = proj[0].lastHP;
        proj = [new Projection(players[turn], lastHP), new Projection(players[(turn-1)*-1])];
        releasedOppSpell = false;
        spellCasted = false;
        aiSelection();
        runTurn();
    }
    else if (tutorialRunning && tutorialPhase != 31)
        continueTutorial();
    else if (tutorialRunning && turn == 1)
    {
        aiSelectionTutorial();
        runTurn();
    }
};

var runTurn = function()
{
    if (replaying && replayCode.length > 0)
    {
        for (var i = 0; i < 3; i++)
        {
            decryptAction(substring(replayCode, 0, 4), actions[i]);
            replayCode = substring(replayCode, 4, replayCode.length);
        }
    }
    else if (onlineOpp == turn)
    {
        if (document.getElementById("online-input").value.length == 12)
        {
            for (var i = 0; i < 3; i++)
            {
                decryptAction(substring(document.getElementById("online-input").value, 0, 4), actions[i]);
                document.getElementById("online-input").value = substring(document.getElementById("online-input").value, 4, replayCode.length);
            }
        }
    }
    turnIsRunning = true;
    for (var i = 0; i < 3; i++)
    {
        if ((actions[i].category == "spell" || actions[i].category == "release") && actions[i].target == -1)
        {
            document.getElementById("infobox").innerText = "Action " + (i+1) + " does not have a target.";
            turnIsRunning = false;
            break;
        }
    }
    if (turnIsRunning)
    {
        if (!replaying)
            for (var i = 0; i < 3; i++)
                replayCode += encryptAction(actions[i]);
        if (onlineOpp == (turn-1)*-1)
        {
        document.getElementById('online-output').value = "";
            for (var i = 0; i < 3; i++)
                document.getElementById('online-output').value += encryptAction(actions[i]);
        }
        actionSelect(0);
        actions[selected].run();
    }
};

var continueTurn = function(currTurn)
{
    if (victor == -1 && currTurn == currentTurn)
    {
        if (selected == 2 && turnIsRunning)
        {
            if (nextMaintain == "spells")
            {
                nextMaintain = "";
                players[turn].maintainSpells(turn, 0, currentTurn);
            }
            else if (typeof nextMaintain == "function")
            {
                nextMaintain();
            }
            else if (nextMaintain == "endurance" && players[turn].currentEndur <= players[turn].maxEndur*0.2)
            {
                document.getElementById("infobox").innerText = players[turn].name + " was damaged by the burden of magic!";
                players[turn].damageHP(Math.floor(60-players[turn].currentEndur/players[turn].maxEndur*200));
                nextMaintain = "postendur";
                players[turn].animations.damage();
                memos.push(new Memo("ENDURANCE", turn, memos.length-1));
            }
            else if (nextMaintain == "endurance" || nextMaintain == "postendur")
            {
                nextMaintain = "spells";
                if (replayCode.length <= 0)
                    replaying = false;
                setTurn();
                loop();
            }
        }
        else if (turnIsRunning)
        {
            actionSelect(selected+1);
            actions[selected].run();
        }
    }
    else
        document.getElementById("infobox").innerText = players[victor].name + " wins!";
};

var startEffect = function()
{
    if (actions[selected].category == "weapon")
    {
        players[(turn-1)*-1].animations.damage();
        if (weapons[actions[selected].id].stagger(players[turn].modStats, players[(turn-1)*-1].modStats))
            staggering = true;
        players[(turn-1)*-1].damageHP(Math.floor(weapons[actions[selected].id].formula(players[turn].modStats, players[(turn-1)*-1].modStats)));
    }
    else if (actions[selected].category == "spell")
    {
        players[actions[selected].target].animations.spell();
        for (var i = 0; i < actions[selected].compositeIds.length; i++)
            spells[actions[selected].compositeIds[i]].cast(turn, actions[selected].target, i);
    }
    else if (actions[selected].category == "release")
    {
        if (!players[actions[selected].target].lockdown || players[actions[selected].target].activeSpells[actions[selected].id].id == 8)
        {
            players[actions[selected].target].animations.release();
            memos.push(new Memo("-" + spells[players[actions[selected].target].activeSpells[actions[selected].id].id].name.toUpperCase(), actions[selected].target, memos.length-1));
            players[actions[selected].target].activeSpells[actions[selected].id].release();
            players[actions[selected].target].updateStats(actions[selected].target);
        }
        else
        {console.log(players[actions[selected].target]);
            memos.push(new Memo("LOCKDOWN", actions[selected].target, memos.length-1));
            document.getElementById("infobox").innerText = "The release attempt was blocked by Lockdown.";
        }
    }
};

