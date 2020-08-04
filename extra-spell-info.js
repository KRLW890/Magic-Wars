var addInfoToSpell = function(id, components, desc)
{
    spells[id].desc = desc;
    spells[id].components = components;
    switch (components.length)
    {
        case 0: spells[id].compositeType = "Base spell"; break;
        case 2: spells[id].compositeType = "Two-way composite"; break;
        case 3: spells[id].compositeType = "Three-way composite"; break;
    };
};

var initInfo = function()
{
    addInfoToSpell(0, [], "The target's body is made more elastic, allowing it to absorb shock better.");
    addInfoToSpell(1, [], "Rapid, unpredictable magic is sent into the target. One of the target's stats is randomly raised by 1.33x, another is randomly lowered by 0.75x.");
    addInfoToSpell(2, [], "The target's body is heated a little bit. Their attacks are now hotter.");
    addInfoToSpell(3, [], "For as long as this spell is active, other spells on the affected player will not naturally wear off over time. All spells can still be released manually by either player.");
    addInfoToSpell(4, [], "The target regains 20% of their maximum HP for as long as this spell is active. When this spell is released, the target loses the HP boost.");
    addInfoToSpell(5, [], "The target becomes more agile and skillful.");
    addInfoToSpell(6, [], "The target becomes bulkier and more solid.");
    addInfoToSpell(8, [], "For as long as this spell is active, neither player can release any of the target's spells except for this one. Spells can still wear off naturally over time.");
    addInfoToSpell(9, [], "The target becomes suspended in midair. They now have the high ground.");
    addInfoToSpell(10, [], "The target's body is cooled a little bit.");
    addInfoToSpell(20, [0,1], "The rapid energy from Erratic exaggerates the effect of Soften, making the target's body almost liquid-like.");
    addInfoToSpell(21, [1,3], "The unpredictability from Erratic was stabilized by Sustain, focusing its rapid energy into a destructive force.");
    addInfoToSpell(22, [3,4], "The target regains 8% of their maximum HP at the end of their turn. Unlike Health Boost, HP regained through this spell stays even after the spell is released.");
    addInfoToSpell(23, [0,1,2], "The target's liquid-like body becomes superheated, significantly increasing the target's attack while also raising their ability to absorb shock. The target loses 15% of their HP at the end of their turn, though.");
    addInfoToSpell(24, [3,8], "A veil of darkness envelops the target, hiding any changes made to their spells while the spell is active.");
    addInfoToSpell(25, [9,5], "With the skill to master its movements while suspended in midair, the target gains raptor-like instincts.");
    addInfoToSpell(26, [1,2], "It's kind of a more powerful version of Blaze, I guess");
    addInfoToSpell(27, [6,8], "An invisible but thick armor of magic surrounds the target.");
    addInfoToSpell(28, [1,3,6], "A sharpening of body and mind, the sheer power of Hyperactivity has been tamed and grounded.");
    addInfoToSpell(29, [2,10], "The target's body becomes glass-like. This cuts their defenses, but exponentially raises their attack stat the lower their current HP is.");
    addInfoToSpell(30, [3,8], "For as long as this spell is active, the turn counter for other spells on the affected player will tick down twice as fast.");
};
