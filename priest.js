import { check_party, empty_inventory, number_of_empty_slots } from 'http://192.168.0.95/jesse/universal.js' 
//import * as universal from 'http://192.168.0.95/jesse/universal.js'

const me = character
var attack_mode=true
var currentHunt="bigbird"

check_party(me);

setInterval(function(){

	var wrex = get_player("Wrex")
	var garrus = get_player("Garrus")

	
	// Kind of for each loop shenanigans. Called an arrow function
	/*
	var number_of_empty_slots = me.items.filter((item) => {
		return item === null
	}).length
	*/

	var total_empty_slots = number_of_empty_slots(me.items)
	//console.log(total_empty_slots)
	if(total_empty_slots == 0) {
		if(smart.moving) 
			console.log("Still working on it")
		else	
			console.log("Made it to the bank")
			empty_inventory(me)
		//smart_move("bank", 0, -37).then(empty_inventory(me))
		//empty_inventory(me)
	}

	if(me.rip) respawn()
	
	if(me.mp < (me.max_mp-200)) 
		use_hp_or_mp();
	
	if((me.hp < (me.max_hp - me.attack)) && !is_on_cooldown("heal")
		heal(me)
	//console.log(me.attack)
	if((wrex != null) && (wrex.hp < wrex.max_hp - me.attack) && !is_on_cooldown("heal")) {
		heal(wrex)
		console.log("I healed for: " + me.attack)
	}
	//else {
		//send_cm("Wrex", {type: "position_request"})	
	//}
	if(garrus != null) {
		if(garrus.hp < (garrus.max_hp - me.attack))
			use_skill("heal",garrus)
	}
	//else {
		//send_cm("")
	//}
	loot();
	//send cm will send a message to anyone.
	//Ask for position, if you get a position request on the receiving end then send a message with your position.
	

	if (!attack_mode || character.rip || is_moving(me)) return;
	//if (!attack_mode || character.rip || is_moving(character)) return;
	

	if(wrex) {
		//console.log(distance(me,wrex))
		if(distance(me,wrex) > 50) {
			move(wrex.real_x + 40, wrex.real_y +40);
		}
		
		var target=get_entity(wrex.target)
		//if (target || (target != me.target))
		if (target != null)
		{
			change_target(target)
			//console.log("Wrex's Target is : " + wrex.target)
			//console.log("My target is: " + me.target)
		}

		if(can_use("curse") && (me.mp > 500)) {
			use_skill("curse",target);
		}
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

function print_out_inventory() {
	for (var i = 0; i < me.items.length; i++) {
		console.log(me.items[i].name)
	}
}
