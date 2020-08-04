var findAllComposites = function()
{
    var anything = false;
    document.getElementById("composites").innerHTML = "";
    for (var i = 0; i < builds[selected].length-1; i++)
    {
        for (var j = i+1; j < builds[selected].length; j++)
        {
            var compVal = findComposite(Math.pow(2, builds[selected][i])+Math.pow(2,builds[selected][j]));
            if (compVal != -1)
            {
                anything = true;
                var p = document.createElement("p");
                p.innerText = spells[compVal].name;
                document.getElementById("composites").appendChild(p);
            }
            for (var k = j+1; k < builds[selected].length; k++)
            {
                compVal = findComposite(Math.pow(2,builds[selected][i])+Math.pow(2,builds[selected][j])+Math.pow(2,builds[selected][k]));
                if (compVal != -1)
                {
                    anything = true;
                    var p = document.createElement("p");
                    p.innerText = spells[compVal].name;
                    document.getElementById("composites").appendChild(p);
                }
            }
        }
    }
    if (!anything)
        document.getElementById("composites").innerText = "None";
};

var addSpell = function(id)
{
    if (builds[selected].length < 6)
    {
        var dupe = false;
        for (var i = 0; i < builds[selected].length; i++)
        {
            if (builds[selected][i] == id)
            {
                dupe = true;
                break;
            }
        }
        if (!dupe)
        {
            document.getElementById("spell"+builds[selected].length).innerText = spells[id].name;
            builds[selected].push(id);
            findAllComposites();
        }
    }
};

var removeSpell = function(id)
{
    if (builds[selected].length > id)
    {
        for (var i = id+1; i < builds[selected].length; i++)
        {
            builds[selected][i-1] = builds[selected][i];
            document.getElementById("spell"+(i-1)).innerText = spells[builds[selected][i]].name;
        }
        builds[selected].pop();
        document.getElementById("spell"+builds[selected].length).innerText = "Empty";
        findAllComposites();
    }
};

