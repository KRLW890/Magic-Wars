var tutorialRunning = false;
var tutorialPhase = 0;
var continuePhases = true;
var targetForTutorial;

var startTutorial = function()
{
    tutorialRunning = true;
    hideStandard();
    actions[0].category = "empty";
    actions[1].category = "empty";
    actions[2].category = "empty";
    document.getElementById("action0").classList.add("hidden");
    document.getElementById("action1").classList.add("hidden");
    document.getElementById("action2").classList.add("hidden");
    document.getElementById("player-turn").innerText = "Tutorial";
    
    document.getElementById("releasebutton").innerText = "";
    document.getElementById("runturn").innerText = "Next =>";
    document.getElementById("runturn").classList.add("blink");
    document.getElementById("runturn").addEventListener("click", continueTutorial);
    tutorialPhase = 0;
    players[0].usableSpells = [];
    players[1].usableSpells = [];
    document.getElementById("infobox").innerText = "In Magic Wars, you play as a FEROCIOUS MAGE WARRIOR, battling other FEROCIOUS MAGE WARRIORS to the death.";
};

var continueTutorial = function()
{
    if (!turnIsRunning)
    {
        document.getElementById("runturn").classList.remove("blink");
        if (continuePhases && !turnIsRunning)
            tutorialPhase++;
        
        switch (tutorialPhase)
        {
        case 1:
            stroke(0);
            strokeWeight(2);
            line(300, 40, 340, 20);
            line(340, 20, 330, 17);
            line(340, 20, 335, 30);
            strokeWeight(1);
            
            document.getElementById("infobox").innerText = "The goal is to reduce your opponent's HP to 0. The most direct way to do this is by attacking with a weapon.";
            document.getElementById("weaponbox").classList.add("blink");
            document.getElementById("weapon0").classList.remove("hidden");
            document.getElementById("weapon1").classList.remove("hidden");
            document.getElementById("weapon0").addEventListener("click", weaponSelectedTutorial);
            document.getElementById("weapon1").addEventListener("click", weaponSelectedTutorial);
            tutorialPhase = 2;
            continuePhases = false;
        break;
        case 2:
            document.getElementById("infobox").innerText = "Click one of the weapons below to select it.";
            runTurnTutorial();
        break;
        case 3:
            document.getElementById("runturn").innerText = "Next =>";
            document.getElementById("infobox").innerText = "That didn't do very much. This is because the FEROCIOUS MAGE WARRIORS are a durable clan.";
        break;
        case 4:
            document.getElementById("infobox").innerText = "(either that, or you're just a very weak exception)";
        break;
        case 5:
            document.getElementById("infobox").innerText = "In any case, this is where magic comes in.";
        break;
        case 6:
            document.getElementById("infobox").innerText = "In this game, the primary focus of magic is for applying buffs and debuffs, rather than dealing damage directly.";
        break;
        case 7:
            document.getElementById("infobox").innerText = "You can cast spells onto either yourself or your opponent. Try clicking one of the spells below.";
            players[0].usableSpells = [9, 5, 2];
            for (var i = 0; i < 3; i++)
            {
                spells[players[0].usableSpells[i]].used = false;
                document.getElementById("spell"+i).innerText = spells[players[turn].usableSpells[i]].name;
                document.getElementById("spell"+i).classList.add("blink");
                document.getElementById("spell"+i).addEventListener("click", spellSelectedTutorial);
            }
            tutorialPhase = 8;
            continuePhases = false;
        break;
        case 8:
            runTurnTutorial();
        break;
        case 9:
            players[0].usableSpells = [];
            document.getElementById("runturn").innerText = "Next =>";
            document.getElementById("infobox").innerText = "The first thing to note is the cut to your ";
            if (targetForTutorial == 1)
                document.getElementById("infobox").innerText += " opponent's ";
            document.getElementById("infobox").innerText += " endurance.";
            
            setTimeout(function()
            {
                translate(250, 0);
                scale(targetForTutorial*-2+1, 1);
                stroke(0);
                strokeWeight(2);
                line(-50, 70, -90, 50);
                line(-90, 50, -80, 47);
                line(-90, 50, -85, 60);
                strokeWeight(1);
                scale(targetForTutorial*-2+1, 1);
                translate(-250, 0);
            }, 100);
        break;
        case 10:
            document.getElementById("infobox").innerText = "Magic is a powerful force. There's only so much a person can take before it'll start to tear them apart.";
        break;
        case 11:
            document.getElementById("infobox").innerText = "When your endurance gets too low, you'll start losing large amounts of HP at the end of your turns.";
        break;
        case 12:
            document.getElementById("infobox").innerText = "The second thing to note is the change to your ";
            if (targetForTutorial == 1)
                document.getElementById("infobox").innerText += " opponent's ";
            document.getElementById("infobox").innerText += " stats.";
            
            translate(250, 0);
            scale(targetForTutorial*-2+1, 1);
            noStroke();
            fill(255);
            rect(-95, 42, 48, 33);
            stroke(0);
            strokeWeight(2);
            line(-210, 260, -240, 290);
            line(-240, 290, -225, 287);
            line(-240, 290, -237, 275);
            strokeWeight(1);
            scale(targetForTutorial*-2+1, 1);
            translate(-250, 0);
        break;
        case 13:
            document.getElementById("stats"+targetForTutorial+""+0).classList.add("blink");
            document.getElementById("stats"+targetForTutorial+""+1).classList.add("blink");
            document.getElementById("infobox").innerText = "Attack (Atk) and Skill (Skl) are the offensive stats.";
            tutorialPhase++;
        break;
        case 14:
            document.getElementById("infobox").innerText = "Different weapons will favor one over the other, but many weapons still use both for damage calculation.";
        break;
        case 15:
            document.getElementById("stats"+targetForTutorial+""+0).classList.remove("blink");
            document.getElementById("stats"+targetForTutorial+""+1).classList.remove("blink");
            document.getElementById("stats"+targetForTutorial+""+2).classList.add("blink");
            document.getElementById("stats"+targetForTutorial+""+3).classList.add("blink");
            document.getElementById("infobox").innerText = "Defense (Def) and Sturdiness (Strd) are the defensive stats.";
            tutorialPhase++;
        break;
        case 16:
            document.getElementById("infobox").innerText = "Once again, different weapons will target one more than the other, but many weapons still use both.";
        break;
        case 17:
            translate(250, 0);
            scale(targetForTutorial*-2+1, 1);
            noStroke();
            fill(255);
            rect(-250, 250, 50, 50);
            scale(targetForTutorial*-2+1, 1);
            translate(-250, 0);
            document.getElementById("stats"+targetForTutorial+""+2).classList.remove("blink");
            document.getElementById("stats"+targetForTutorial+""+3).classList.remove("blink");
            document.getElementById("infobox").innerText = "You've casted one spell, but you don't have to cast spells one at a time. Up to three spells can be casted at once.";
        break;
        case 18:
            ctx.drawImage(images.diagram, 125, 50);
            players[0].usableSpells = [9, 5, 2];
            document.getElementById("infobox").innerText = "Additionally, some spells are compatible with each other, and will fuse into a new spell when used together.";
            tutorialPhase = 19;
            continuePhases = false;
        break;
        case 19:
            document.getElementById("infobox").innerText = "Try casting three spells at once.";
            if (actions[0].id.length == 3)
                runTurnTutorial();
        break;
        case 20:
            players[0].usableSpells = [];
            document.getElementById("runturn").innerText = "Next =>";
            document.getElementById("infobox").innerText = "While most spells affect stats, not all do.";
        break;
        case 21:
            document.getElementById("infobox").innerText = "Some spells ignore stats and do other things instead. For example...";
            turn = 1;
            actions[0].category = "spell";
            actions[0].id = [3, 4];
            actions[0].findComposites();
            actions[0].target = 1;
        break;
        case 22:
            runTurnTutorial();
        break;
        case 23:
            turn = 0;
            document.getElementById("infobox").innerText = "Your opponent just cast a spell that heals him gradually over time. This could be troublesome.";
        break;
        case 24:
            document.getElementById("infobox").innerText = 'Luckily, you can remove any spell that you or your opponent casts by "releasing" it.';
            document.getElementById("releasebutton").innerText = "Release a Spell";
            document.getElementById("releasebutton").classList.add("blink");
            tutorialPhase = 25;
            continuePhases = false;
        break;
        case 25:
            runTurnTutorial();
        break;
        case 26:
            document.getElementById("runturn").innerText = "Next =>";
            var regenReleased = true;
            for (var i = 0; i < players[1].activeSpells.length; i ++)
                if (players[1].activeSpells[i].id == 22)
                    regenReleased = false;
            if (regenReleased)
                continueTutorial();
            else
                document.getElementById("infobox").innerText = "Bit of an odd choice to release that spell, but fine. You still learned how to release a spell, I guess.";
        break;
        case 27:
            document.getElementById("infobox").innerText = "You can cast up to three spells at once, but you can only release one spell at a time.";
        break;
        case 28:
            document.getElementById("infobox").innerText = "You must be able to adapt to your opponent's spells, rather than being too reliant on releasing.";
        break;
        case 29:
            document.getElementById("infobox").innerText = "Before continuing with the tutorial, let's see if you can defeat this opponent with what you've learned so far.";
        break;
        case 30:
            document.getElementById("infobox").innerText = "If you need help, try clicking on the list of spells under Resources. Good luck!";
            document.getElementById("runturn").innerText = "Run Turn =>";
            players[0].usableSpells = [9, 5, 2, 1, 3, 6];
            document.getElementById("spell-link").classList.add("blink");
            document.getElementById("r-head-text").classList.add("blink");
            document.getElementById("spell3").innerText = spells[1].name;
            document.getElementById("spell4").innerText = spells[3].name;
            document.getElementById("spell5").innerText = spells[6].name;
            document.getElementById("spell0").removeEventListener("click", spellSelectedTutorial);
            document.getElementById("spell1").removeEventListener("click", spellSelectedTutorial);
            document.getElementById("spell2").removeEventListener("click", spellSelectedTutorial);
            document.getElementById("weapon0").removeEventListener("click", weaponSelectedTutorial);
            document.getElementById("weapon1").removeEventListener("click", weaponSelectedTutorial);
            tutorialPhase = 31;
            continuePhases = false;
        break;
        case 31:
            document.getElementById("spell-link").classList.remove("blink");
            document.getElementById("r-head-text").classList.remove("blink");
            runTurnTutorial();
            continuePhases = false;
        break;
        case 33:
            players[0].usableSpells = [];
            turn = 0;
            document.getElementById("runturn").innerText = "Next =>";
            document.getElementById("infobox").innerText = "Congratulations on your first victory! But we're not quite done here yet.";
        break;
        case 34:
            document.getElementById("infobox").innerText = "So far, you've only been doing one action per turn.";
        break;
        case 35:
            document.getElementById("action0").classList.remove("hidden");
            document.getElementById("action1").classList.remove("hidden");
            document.getElementById("action2").classList.remove("hidden");
            document.getElementById("infobox").innerText = "In real games, however, you can perform three actions per turn. There are a few restrictions, though.";
        break;
        case 36:
            document.getElementById("infobox").innerText = "1) You cannot cast the same spell twice in the same turn, even across separate actions.";
        break;
        case 37:
            document.getElementById("infobox").innerText = "2) You can only release one spell that was casted by your opponent in a turn, even across separate actions.";
        break;
        case 38:
            document.getElementById("infobox").innerText = "3) To reduce the first turn advantage, the first player to move only has access to one action on turn one.";
        break;
        case 39:
            document.getElementById("infobox").innerText = "You've now completed the tutorial! Please fill out the play tester survey so that we can improve the game.";
            document.getElementById("ptsurvey").classList.add("blink");
            document.getElementById("r-head-text").classList.add("blink");
        break;
        case 40:
            document.getElementById("ptsurvey").classList.remove("blink");
            document.getElementById("discord").classList.add("blink");
            document.getElementById("infobox").innerText = "If you want to continue playing and improve your skills, please consider joining our Discord server.";
        break;
        case 41:
            document.getElementById("infobox").innerText = "You can find others to learn from and play against there.";
        break;
        case 42:
            document.getElementById("discord").classList.remove("blink");
            document.getElementById("r-head-text").classList.remove("blink");
            document.getElementById("infobox").innerText = "Thanks for playing :) \n(reload the page to play a proper match)";
            document.getElementById("runturn").innerText = "Run Turn =>";
            continuePhases = false;
        break;
        };
    }
};


var weaponSelectedTutorial = function()
{
    if (tutorialPhase == 2)
    {
        document.getElementById("runturn").innerText = "Attack =>";
        document.getElementById("weaponbox").classList.remove("blink");
        document.getElementById("runturn").classList.add("blink");
    }
};

spellSelectedTutorial = function()
{
    if (actions[0].target == -1)
        document.getElementById("infobox").innerText = "Click the player you want to cast the spell on.";
};

var spellTargetSelectedTutorial = function(target)
{
    targetForTutorial = target;
    document.getElementById("runturn").innerText = "Cast =>";
    document.getElementById("spell0").classList.remove("blink");
    document.getElementById("spell1").classList.remove("blink");
    document.getElementById("spell2").classList.remove("blink");
    document.getElementById("runturn").classList.add("blink");
};

var runTurnTutorial = function()
{
    if (actions[0].category != "empty" && actions[0].target != -1)// && (tutorialPhase == 2 || tutorialPhase == 9 || tutorialPhase == 22 || tutorialPhase == 25 || tutorialPhase == 29))
    {
        continuePhases = true;
        runTurn();
    }
};


