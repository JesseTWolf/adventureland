import { checkParty } from 'http://192.168.0.95/jesse/universal.js' 
//import * as universal from 'http://192.168.0.95/jesse/universal.js'

const me = character
var attack_mode=true
var currentHunt="bigbird"

checkParty(me);

setInterval(function(){

	if(me.rip) respawn()
	
	if(me.hp < (me.max_hp - 200) || me.mp < (me.max_mp-200)) 
		use_hp_or_mp();
	
	loot();
	//send cm will send a message to anyone.
	//Ask for position, if you get a position request on the receiving end then send a message with your position.
	

	if (!attack_mode || character.rip || is_moving(me)) return;
	//if (!attack_mode || character.rip || is_moving(character)) return;

	/*
	var target
	if (!target)
	{
		target=get_nearest_monster({type:"goo"}) 
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
	*/

},1000/4); // Loops every 1/4 seconds.

function print_out_inventory() {
	for (var i = 0; i < me.items.length; i++) {
		console.log(me.items[i].name)
	}
}
