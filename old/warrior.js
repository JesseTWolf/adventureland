import { check_party } from 'http://192.168.0.95/jesse/universal.js'
//import * as universal from 'http://192.168.0.95/jesse/universal.js'

const me = character
var attack_mode=true
var currentHunt="bigbird"

check_party(me);

setInterval(function(){

	if(me.rip) respawn()
	
	if(me.hp < (me.max_hp - 200) || me.mp < (me.max_mp-200)) 
		use_hp_or_mp();
	
	loot();

	//send cm will send a message to anyone.
	//Ask for position, if you get a position request on the receiving end then send a message with your position.
	

	if (!attack_mode || character.rip || is_moving(me)) return;
	//if (!attack_mode || character.rip || is_moving(character)) return;


	var target
	if (!me.ctarget || me.ctarget.dead)
	{
		target=get_nearest_monster()
		//console.log("My target is : " + me.target)
		if (target) change_target(target);
		else
		{
			//party_say("No Monsters");
			//move_and_target("squig");
			return;
		}
	}

	if (!is_in_range(target))
	{	
		move(target.real_x , (target.real_y));
	}
	else if (can_attack(target))
	{
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
