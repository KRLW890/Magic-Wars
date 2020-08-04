function preload() {
    initAll();
}

function setup() {
    canvas = createCanvas(500, 300);
    canvas.parent("canvas");
    frameRate(45);
    ctx = document.getElementsByTagName("canvas")[0].getContext('2d');
    //setTurn();
    players[0].animations.color = color(221, 129, 0);
    players[1].animations.color = color(0, 50, 200);
    textSize(10);
    textAlign(CENTER, BOTTOM);
    background(255);
    fill(players[0].animations.color);
    players[0].animations.drawImg();
    players[0].updateStats(0);
    fill(players[1].animations.color);
    players[1].animations.drawImg();
    players[1].updateStats(1);
}

function drawHP(i) {
    textSize(10);
    textAlign(CENTER, BOTTOM);
    noStroke();
    fill(255);
    rect(0+250, 0, 250, 60);
    fill(0);
    text("HP", 100+300*i, 10);
    rect(50+300*i, 10, 100, 15, 3);
    text("Endurance", 100+300*i, 40);
    rect(50+300*i, 40, 100, 15, 3);
    fill(0, 200, 0);
    rect(50+300*i, 10, constrain(players[i].currentHP/players[i].maxHP*100, 0, 100), 15, 3);
    fill(0, 150, 255);
    if (players[i].currentEndur/players[i].maxEndur <= 0.2)
        fill(255, 0, 0);
    rect(50+300*i, 40, constrain(players[i].currentEndur/players[i].maxEndur*100, 0, 100), 15, 3);
};

function draw() {
    background(255);
    for (var i = 0; i < 2; i++)
    {
        drawHP(i);
        fill(players[i].animations.color);
        if (players[i].animations.playing.casting)
            players[i].animations.drawCasting();
        else if (players[i].animations.playing.spell)
            players[i].animations.drawSpell();
        else if (players[i].animations.playing.release)
            players[i].animations.drawRelease();
        else if (players[i].animations.playing.damage)
            players[i].animations.drawDamage();
        else if (images.loaded && !players[i].animations.playing.attack)
        {
            players[i].animations.drawImg();
            cutLoop();
        }
    }
    for (var i = 0; i < 2; i++)
    {
        if (players[i].animations.playing.attack)
        {
            fill(players[i].animations.color);
            weapons[actions[selected].id].drawAttack();
        }
    }
    for (var i = 0; i < memos.length; i++)
        memos[i].draw();
};

function mouseMoved()
{
    if (actions[selected].category == "spell" && !turnIsRunning && tutorialPhase != 25)
    {
        for (var i = 0; i < 2; i++)
        {
            noStroke();
            fill(255);
            rect(40+300*i, 110, 120, 160);
            fill(players[i].animations.color);
            players[i].animations.drawImg();
            if (mouseY >= 110 && mouseY <= 260 && mouseX >= 50+300*i && mouseX <= 140+300*i)
            {
                stroke(0);
                strokeWeight(3);
                noFill();
                rect(50+300*i, 110, 100, 160, 3);
                strokeWeight(1);
            }
        }
        if (tutorialRunning && (tutorialPhase == 18 || tutorialPhase == 19))
            ctx.drawImage(images.diagram, 125, 50);
    }
};
function mousePressed()
{
    if (actions[selected].category == "spell" && !turnIsRunning)
    {
        for (var i = 0; i < 2; i++)
        {
            if (mouseY >= 110 && mouseY <= 270 && mouseX >= 50+300*i && mouseX <= 140+300*i)
            {
                actions[selected].target = i;
                updateDetails();
                document.getElementById("infobox").innerText = "";
                if (tutorialRunning && tutorialPhase < 30)
                    spellTargetSelectedTutorial(i);
            }
        }
    }
};
