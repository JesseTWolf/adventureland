const me = character
var attack_mode=true

const base_url = "https://raw.githubusercontent.com/JesseTWolf/adventureland/master/main.js"
const script_name = "Ranger"

function update_script() {
    fetch(base_url+"?"+Date.now()).then(resp => resp.text()).then(script => {
        parent.api_call("save_code", { code: script, slot: 1, name: script_name, auto: true, electron: true }, { promise: true });
    })
}

function kite(target) {
  if(target) {
    let safeDistance = target.range * 1.1;
    let unsafeDistance = target.range * 0.5;
    let targetDistance = distance(me, target);

    if (targetDistance < safeDistance && targetDistance > unsafeDistance) {
      xmove(me.real_x + (me.real_x - target.x),
        me.real_y + (me.real_y - target.y));
    }
    if (distance(me, target) < unsafeDistance) {
      xmove(me.real_x - (me.real_x - target.x) + minTargetDist,
        me.real_y - (me.real_y - target.y) + minTargetDist)
    }
  }
}

setInterval(function(){

	if(me.rip) respawn()
	
	if (!me.party) {
		send_party_request("D3lphes")
	}

	use_hp_or_mp();
	loot();i

	//accept_party_invite("D3lphes")
	//if (me.party !== "Garrus") {
	//	accept_party_request("D3lphes")
	//}

	if (!attack_mode || character.rip) return;
	//if (!attack_mode || character.rip || is_moving(character)) return;

	//var target= get_targeted_monster();
	var specificTarget=get_nearest_monster({type:"squig"})
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

	//kite(specificTarget);
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

