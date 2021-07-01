// import { check_party, empty_inventory, number_of_empty_slots } from 'http://192.168.0.95/jesse/universal.js'	
//import * as universal from 'http://192.168.0.95/jesse/universal.js'

const { checkParty, openSpaceMessage, emptyInventory, numberOfEmptySlots} = require('./universal.js')

const me = character
var attack_mode=true
var currentHunt="bigbird"
var target

checkParty(me);

setInterval(function(){

	var delphes = get_player("D3lphes")

	if(me.rip) respawn()

	var total_empty_slots = numberOfEmptySlots(me.items)
	if(total_empty_slots == 0) {
		if(smart.moving)
			console.log("Still working on it")
		else {
			console.log("Made it to the bank")
			emptyInventory(me)
		}
	}
	
	character.on("cm", data => {
    	if (data.name === "D3lphes" && data.message.type === "position_answer") {
        		smart_move({
            		x: data.message.x,
            		y: data.message.y,
            		map: data.message.map
        		})
    		}
	})

	/*
	game.on("event", function(data) {
		if(data.name == "grinch") {
			let kane = get_entity_by_name('Kane')
		}
		else if(data.name == 'snowman') {
			smart_move(data)
		}
	})
	*/
	/*
	if(parent.S.hasOwnProperty('grinch') && parent.S['grinch'].live) {
		let kane = get_entity_by_name('Kane')
		if (kane) {
			await smart_move(kane)
		}
		else {
			await smare_move(parent.S['grinch'])
		}
	}
	*/
	//	console.log(open_space)
	//	send_cm("Lawson", {type: "open_space_request"})
	//}
	/*
	me.on("cm", function(data) {
		//console.log("Hoopla:" + data.message.message)
		if(data.message.message == "open_space") {
			merchant_space = data.message.value
			console.log(data.message.value)
			
			if(merchant_space > 1) {
				for(var i = 2; i < merchant_space;i++) {
					console.log("" + me.items[i])
					//send_item("Lawsom",i,1)
					merchant_space--
					if(merchant_space == 0)
						return
				}
			}
		}
	})
	*/
	//console.log("Merchant Space Out: " + merchant_space + "\n")

	/*
	if(merchant_space > 1) {
		for(var i = 2; i < me.items.length;i++) {
			send_item("Lawson",i,1);
			merchant_space--
			if(merchant_space == 0)
				return;
		}
	}
	*/


	if(me.mp < (me.max_mp) || (me.hp < (me.max_hp-200)))
		use_hp_or_mp();

	loot();
	
	//send cm will send a message to anyone.
	//Ask for position, if you get a position request on the receiving end then send a message with your position.
	

	if (!attack_mode || character.rip) return;
	//if (!attack_mode || character.rip || is_moving(character)) return;
	
	let target = get_target()
	//console.log(target)
	if (target == null)
	{
		/*
		if(!smart.moving)
			smart_move({x: -550,y: -1426, map: "desertland"})
		*/
		target=get_nearest_monster({type:"tortoise"})
		//target=get_target_of("D3lphes")
		if(delphes != null)
			target=get_entity(delphes.target)
		if (target) change_target(target);
		else
		{
			//party_say("No Monsters");
			//move_and_target("squig");
			return;
		}
	}
	
	
	// Figure out a safe distance from the monster. If not at least 50 will set to 50.
	var safeDistance = (target.range + 20)
	if (safeDistance < 100) {
		safeDistance = 100;
	}
	/*
	// If target is to the left in respect to character
	var targetX = target.real_x
	var targetY = target.real_y
	var myX = me.real_x
	var myY = me.real_y
	

	console.log("mX : " + myX)
	console.log("tX : " + targetX)
	console.log("mY : " + myY)
	console.log("tY : " + targetY)
	//console.log("mx - tX : " + (myX - targetX))
	//console.log("my - tY : " + (myY - targetY))
	console.log("tX - mX : " + (targetX - myX))
	console.log("tY - mY : " + (targetY - myY))

	console.log("\n")
	*/
	/*
	//In quadrant 1
	if((myX > targetX) & (myY > targetY)) {
		console.log("myX < targetX : " + myX + " < " + targetX);
		console.log("myY < targetY : " + myY + " < " + targetY);
		console.log("\n")
	}
	*/
	if (!is_in_range(target))
	{	
		if(distance(me,target) < 0) {
			
		}
		else
			move(target.real_x , (target.real_y+safeDistance));
	}
	//change_target(get_entity(delphes.target))
	//if(target.target) {
	else if (can_attack(target))
	{
		var x_center
		var y_center
		const radius = me.range/1.1
		const step = 0.35
		var  mobAngle = Math.atan2(character.y-target.y, character.x-target.x)
		const angle_speed = character.speed/radius *0.25

		if(!is_on_cooldown(attack)) {
			set_message("Attacking")
			attack(target)
		}

		if(distance(character,target)<(target.attack_range*1.5)) {
			x_center = (target.x - (target.x-character.x)*2)	
			y_center = (target.y - (target.y-character.y)*2)
		}
		else {
			x_center = target.x
			y_center = target.y
		}

		var next_x = x_center + radius * Math.cos(mobAngle + angle_speed)
		var next_y = y_center + radius * Math.sin(mobAngle + angle_speed)

		move(next_x,next_y)
		mobAngle += step

		attack(target);
		//move(target.real_x, (target.real_y-safeDistance));
		if(is_in_range(target,"huntersmark") && !is_on_cooldown("huntersmark") && me.mp >= 400) {
			use_skill("huntersmark",target)
		}
		if(is_in_range(target,"supershot") && !is_on_cooldown("supershot") && me.mp >= 240) {
			use_skill("supershot",target)
		}
	}
	//}

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
