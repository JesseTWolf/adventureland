const me = character
var attack_mode=true
var currentHunt="bigbird"

setInterval(function(){

	if(me.rip) respawn()

	use_hp_or_mp();
	loot();

	if (!me.party) {
		send_party_request("D3lphes")
	}

	//send cm will send a message to anyone.
	//Ask for position, if you get a position request on the receiving end then send a message with your position.
	

	if (!attack_mode || character.rip) return;
	//if (!attack_mode || character.rip || is_moving(character)) return;


	var target
	if (!target)
	{
		target=get_nearest_monster({type:"squig"})
		if (target) change_target(target);
		else
		{
			//party_say("No Monsters");
			move_and_target("squig");
			return;
		}
	}
	
	// Figure out a safe distance from the monster. If not at least 50 will set to 50.
	var safeDistance = (target.range * 1.5)
	if (safeDistance < 50) {
		safeDistance = 50;
	}

	if(is_in_range(target,"supershot") && !is_on_cooldown("supershot") && me.mp>=G.skills.supershot.mp) {
		use_skill("supershot",target);
	}


	if (!is_in_range(target))
	{
		move((target.real_x+safeDistance) , (target.real_y));
		
	}
	else if (can_attack(target))
	{
		move((target.real_x+safeDistance), (target.real_y));
		attack(target);
	}

},1000/4); // Loops every 1/4 seconds.

function move_and_target(monster) {
	if(monster == "squig") {
		smart_move({
			x:-1062.2602289765225,
			y:427.9200331671049,
			map:"main"
		})
	}
}


