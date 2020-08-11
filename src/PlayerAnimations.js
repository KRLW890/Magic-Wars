var animsActive = 0;
var cutLoop = function()
{
    if (animsActive == 0)
    {
        noLoop();
    }
};


var PlayerAnimations = function(pos)
{
    this.pos = pos;
    this.color;
    this.x = 0;
    this.y = 0;
    this.xMomentum = 0;
    this.yMomentum = 0;
    this.frames = 0;
    this.playing = {
        damage: false,
        casting: false,
        spell: false,
        release: false,
        attack: false
    };
    this.turnStarted = {
        damage: 0,
        casting: 0,
        spell: 0,
        release: 0,
        attack: 0
    };
    this.isDamaged = false;
    this.healing = false;
    this.drawImg = function(weapon)
    {
        translate(250, 0);
        scale(this.pos, 1);
        this.x += this.xMomentum;
        this.y += this.yMomentum;
        rect(-190+this.x, 110+this.y, 80, 160);
        ctx.drawImage(images.p_white, -200+this.x, 100+this.y);
        if (weapon != undefined)
            ctx.drawImage(weapon, -200+this.x, 100+this.y);
        ctx.drawImage(images.p_outline, -200+this.x, 100+this.y);
        scale(this.pos, 1);
        translate(-250, 0);
    };
};

PlayerAnimations.prototype.damage = function()
{
    if (!this.playing.damage)
    {
        animsActive++;
        this.xMomentum = -3;
        this.yMomentum = -10;
        this.playing.damage = true;
        this.turnStarted.damage = currentTurn;
        this.isDamaged = true;
        loop();
    }
    else
        console.log("ERROR: damage double call");
};

PlayerAnimations.prototype.stagger = function()
{
    if (!this.playing.damage)
    {
        animsActive++;
        this.xMomentum = -3;
        this.yMomentum = -10;
        this.playing.damage = true;
        this.turnStarted.damage = currentTurn;
        this.isDamaged = false;
        loop();
    }
    else
        console.log("ERROR: damage double call (stagger)");
};

PlayerAnimations.prototype.drawDamage = function()
{
    if (this.xMomentum < 0 && this.isDamaged)
        fill(255, 0, 0);
    this.drawImg();
    if (this.y >= 0)
    {
        this.y = 0;
        this.xMomentum = 3;
        this.yMomentum = 0;
        if (this.x >= 0)
        {
            this.x = 0;
            this.xMomentum = 0;
            this.playing.damage = false;
            animsActive--;
            if (animsActive == 0)
            {
                var turnStarted = this.turnStarted.damage;
                setTimeout(function() { continueTurn(turnStarted); }, textPause);
            }
        }
    }
    else
        this.yMomentum += 2;
};

PlayerAnimations.prototype.cast = function()
{
    animsActive++;
    this.y = 0;
    this.yMomentum = -10;
    this.playing.casting = true;
    this.turnStarted.casting = currentTurn;
    this.effect = false;
    loop();
};

PlayerAnimations.prototype.drawCasting = function()
{
    if (this.yMomentum >= 0 && !this.effect)
    {
        this.effect = true;
        startEffect();
    }
    if (this.playing.spell)
        this.drawSpell();
    else if (this.playing.release)
        this.drawRelease();
    else
        this.drawImg();
    this.yMomentum += 1.5;
    if (this.y >= 0)
    {
        this.yMomentum = 0;
        this.y = 0;
        this.playing.casting = false;
        animsActive--;
        if (animsActive == 0)
        {
            var turnStarted = this.turnStarted.casting;
            setTimeout(function() { continueTurn(turnStarted); }, textPause);
        }
    }
};

PlayerAnimations.prototype.spell = function()
{
    animsActive++;
    this.frames = 0;
    this.playing.spell = true;
    this.turnStarted.spell = currentTurn;
    this.healing = false;
    loop();
};

PlayerAnimations.prototype.heal = function()
{
    animsActive++;
    this.frames = 0;
    this.playing.spell = true;
    this.turnStarted.spell = currentTurn;
    this.healing = true;
    loop();
};

PlayerAnimations.prototype.drawSpell = function()
{
    if (this.healing)
        fill(0, 255, 0);
    else
        fill(255, 215, 0);
    this.drawImg();
    noFill();
    stroke(170, 170, 255, 100);
    strokeWeight(10);
    for (var i = 0; i < 3; i++)
    {
        translate(250, 100);
        scale(this.pos, 1);
        if (this.frames > i*10 && this.frames < (i+2)*10)
            ellipse(this.x-150, this.y+90, 200-(this.frames-i*12)*10, 200-(this.frames-i*12)*10);
        scale(this.pos, 1);
        translate(-250, -100);
    }
    strokeWeight(1);
    if (this.frames >= 40)
    {
        this.frames = 0;
        this.playing.spell = false;
        animsActive--;
        if (animsActive == 0)
        {
            var turnStarted = this.turnStarted.spell;
            setTimeout(function() { continueTurn(turnStarted); }, textPause);
        }
    }
    this.frames++;
};

PlayerAnimations.prototype.release = function()
{
    animsActive++;
    this.frames = 0;
    this.playing.release = true;
    this.turnStarted.release = currentTurn;
    loop();
};

PlayerAnimations.prototype.drawRelease = function()
{
    fill(0, 200, 255);
    this.drawImg();
    noFill();
    stroke(255, 215, 0, 100);
    strokeWeight(10);
    translate(250, 100);
    scale(this.pos, 1);
    ellipse(this.x-150, this.y+90, 50*Math.sqrt(this.frames), 50*Math.sqrt(this.frames));
    scale(this.pos, 1);
    translate(-250, -100);
    strokeWeight(1);
    this.frames++;
    if (this.frames >= 25)
    {
        this.frames = 0;
        this.playing.release = false;
        animsActive--;
        if (animsActive == 0)
        {
            var turnStarted = this.turnStarted.release;
            setTimeout(function() { continueTurn(turnStarted); }, textPause);
        }
    }
};

PlayerAnimations.prototype.attack = function()
{
    animsActive++;
    this.x = 0;
    this.xMomentum = 7;
    this.playing.attack = true;
    this.turnStarted.attack = currentTurn;
    loop();
};

PlayerAnimations.prototype.drawAttack = function()
{
    this.drawImg(weapons[actions[selected].id].img);
    if (this.xMomentum > 0)
    {
        if (this.x >= 180)
        {
            this.xMomentum = -10;
            startEffect();
        }
        else
            this.xMomentum*=1.3;
    }
    if (this.x <= 0)
    {
        this.xMomentum = 0;
        this.x = 0;
        this.playing.attack = false;
        animsActive--;
        if (animsActive == 0)
        {
            var turnStarted = this.turnStarted.attack;
            setTimeout(function() { continueTurn(turnStarted); }, textPause);
        }
    }
};


var memos = [];

var Memo = function(m, pos, place)
{
    this.string = m;
    this.turnStarted = currentTurn;
    this.pos = pos;
    this.place = place;
    this.frames = 0;
    animsActive++;
    loop();
};
Memo.prototype.draw = function()
{
    fill(0, 0, 0, 200-this.frames*5);
    textSize(20);
    text(this.string, 100+300*this.pos, 160-this.frames*3);
    this.frames++;
    if (this.frames > 40)
    {
        animsActive--;
        if (animsActive == 0)
        {
            var turnStarted = this.turnStarted;
            setTimeout(function() { continueTurn(turnStarted); }, textPause);
        }
        memos[this.place] = memos[memos.length-1];
        memos.pop();
    }
};

