const me = character
var attack_mode=true

//Test
setInterval(function(){

	if(me.rip) respawn()

	use_hp_or_mp();
	loot();i

	//accept_party_invite("D3lphes")
	if (me.party !== "Garrus") {
		accept_party_request("D3lphes")
	}

	if (!attack_mode || character.rip)) return;
	//if (!attack_mode || character.rip || is_moving(character)) return;

	//var target= get_targeted_monster();
	var specificTarget=get_nearest_monster({type:"goo"})
	if (!specificTarget)
	{
		specificTarget=get_nearest_monster({min_xp:100,max_att:120});
		if (specificTarget) change_target(specificTarget);
		else
		{
			set_message("No Monsters");
			return;
		}
	}

	if (!is_in_range(specificTarget))
	{
		move(
			character.x+(specificTarget.x-character.x)/2,
			character.y+(specificTarget.y-character.y)/2
			);
		// Walk half the distance
	}
	else if (can_attack(specificTarget))
	{
		set_message("Attacking");
		attack(specificTarget);
	}

},1000/4); // Loops every 1/4 seconds.
