var aiSelectionTutorial = function()
{
    if (players[0].currentEndur <= 20)
    {
        var highestEndur = 0;
        for (var i = 1; i < players[0].activeSpells.length; i++)
            if (spells[players[0].activeSpells[i].id].burden > spells[players[0].activeSpells[highestEndur].id].burden)
                highestEndur = i;
        actions[0].category = "release";
        actions[0].target = 0;
        actions[0].id = highestEndur;
    }
    else if (players[1].currentEndur <= 20)
    {
        var highestEndur = 0;
        for (var i = 1; i < players[1].activeSpells.length; i++)
            if (spells[players[1].activeSpells[i].id].burden > spells[players[1].activeSpells[highestEndur].id].burden)
                highestEndur = i;
        actions[0].category = "release";
        actions[1].target = 1;
        actions[1].id = highestEndur;
    }
    else if (players[0].currentEndur <= 41)
    {
        var highestEndur = 0;
        for (var i = 1; i < players[0].activeSpells.length; i++)
            if (spells[players[0].activeSpells[i].id].burden > spells[players[0].activeSpells[highestEndur].id].burden)
                highestEndur = i;
        actions[0].category = "release";
        actions[0].target = 0;
        actions[0].id = highestEndur;
    }
    else if (players[1].currentEndur <= 41)
    {
        var highestEndur = 0;
        for (var i = 1; i < players[1].activeSpells.length; i++)
            if (spells[players[1].activeSpells[i].id].burden > spells[players[1].activeSpells[highestEndur].id].burden)
                highestEndur = i;
        actions[0].category = "release";
        actions[1].target = 1;
        actions[1].id = highestEndur;
    }
    else
    {
        var selectableOptions = [0, 1];
        if (players[0].currentEndur >= 49)
            selectableOptions.push(2);
        if (players[0].activeSpells.length > 0)
            selectableOptions.push(3);
        if (players[1].activeSpells.length > 0)
            selectableOptions.push(4);
console.log("start tests");
        if (weapons[1].formula(players[1].modStats, players[0].modStats) < players[0].currentHP-10)
        {
            selectableOptions.push(5);
            selectableOptions.push(6);
            selectableOptions.push(7);
            selectableOptions.push(8);
            selectableOptions.push(9);
            //selectableOptions.push(10);
        }
        else if (weapons[0].formula(players[1].modStats, players[0].modStats) < players[0].currentHP-10)
        {
            selectableOptions.push(11);
            selectableOptions.push(12);
            selectableOptions.push(13);
            selectableOptions.push(14);
            selectableOptions.push(15);
            //selectableOptions.push(16);
        }
        console.log("end tests");
        switch (selectableOptions[Math.floor(Math.random()*selectableOptions.length)])
        {
        case 0:
            actions[0].category = "spell";
            actions[0].compositeIds = [21];
            actions[0].target = 1;
        break;
        case 1:
            actions[0].category = "spell";
            actions[0].compositeIds = [29];
            actions[0].target = 1;
        break;
        case 2:
            actions[0].category = "spell";
            actions[0].compositeIds = [29];
            actions[0].target = 1;
        break;
        case 3:
            actions[0].category = "release";
            actions[0].id = Math.floor(Math.random()*players[0].activeSpells.length);
            actions[0].target = 0;
        break;
        case 4:
            actions[0].category = "release";
            actions[0].id = Math.floor(Math.random()*players[1].activeSpells.length);
            actions[1].target = 0;
        break;
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
            actions[0].category = "weapon";
            actions[0].id = 1;
            actions[0].target = 0;
        break;
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
        case 16:
            actions[0].category = "weapon";
            actions[0].id = 0;
            actions[0].target = 0;
        break;
        };
    }
};





