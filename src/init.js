var images;
var ctx;
var players, weapons, actions;

function loadSprites() {
    images = {
        loaded: false,
        p_outline: new Image(),
        p_white: new Image(),
        rapier: new Image(),
        lance: new Image(),
        musket: [new Image(), new Image()],
        grisnersWarhammer: new Image(),
        sword: new Image(),
        diagram: new Image()
    };
    images.p_outline.src = "images/player-outline.png";
    images.p_white.src = "images/player-white.png";
    images.rapier.src = "images/rapier.png";
    images.lance.src = "images/lance.png";
    images.musket[0].src = "images/musket0.png";
    images.musket[1].src = "images/musket1.png";
    images.grisnersWarhammer.src = "images/grisners-warhammer.png";
    images.sword.src = "images/ghost-sword.png";
    images.diagram.src = "images/composite-diagram.png";
    images.diagram.onload = function()
    {
        images.loaded = true;
        loop();
    };
};

function initPlayers() {
    players = [
        new Combatant("Player 1", 100, 1, 0),
        new Combatant("Player 2", 100, -1, 1)
    ];
};

function initActions() {
    actions = [
        new Action(0),
        new Action(1),
        new Action(2)
    ];
};

function initAll()
{
    loadSprites();
    initPlayers();
    initWeapons();
    initSpells();
    initActions();
};

