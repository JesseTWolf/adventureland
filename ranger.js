import { check_party, empty_inventory } from 'http://192.168.0.95/jesse/universal.js'	
//import * as universal from 'http://192.168.0.95/jesse/universal.js'

const me = character
var attack_mode=true
var currentHunt="bigbird"
var merchant_space=0

check_party(me);



setInterval(function(){

	if(me.rip) respawn()

	var open_space = me.items.length
	//console.log("Current Open Space: " + open_space)
	if(open_space == 1)
		empty_inventory(me)

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



	use_hp_or_mp();

	loot();
	
	//send cm will send a message to anyone.
	//Ask for position, if you get a position request on the receiving end then send a message with your position.
	

	if (!attack_mode || character.rip) return;
	//if (!attack_mode || character.rip || is_moving(character)) return;

	var target
	if (!target || target.dead)
	{
		target=get_nearest_monster({type:"squig"}) 
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
		move(target.real_x , (target.real_y+safeDistance));
	}
	else if (can_attack(target))
	{
		attack(target);
		move(target.real_x, (target.real_y-safeDistance));
		if(is_in_range(target,"supershot") && !is_on_cooldown("supershot") && me.mp >= G.skills.supershot.mp) {
			use_skill("supershot",target);
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
