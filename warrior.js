import { 
    farm_monsters, 
    monster_hunt_whitelist, 
    potion_data, 
    party_list, 
    sell_whitelist, 
    keep_whitelist, 
    farmer_gold_keep, 
    pot_stack
} from "./universal.js";

import {
    check_party, 
    distance_to_target, 
    empty_inventory, 
    find_item, 
    find_and_move_to_leader, 
    find_viable_targets, 
    player_in_party,
    handle_inventory_farmer, 
    handle_monsterhunts, 
    handle_party, 
    handle_respawn, 
    handle_use_potions, 
    number_of_empty_slots, 
    open_space_message, 
    sell_items, 
    send_to_merchant, 
    store_pots, 
    store_position, 
    retrieve_position
} from "./universal.js"

if(!character.party) {
    send_party_request("D3lphes")
}

setInterval(function() {
    store_position();
    store_pots();
    // custom function that uses potions based on values we define. Currently smallest potions.
    handle_use_potions(200, 300);
    // handle_monsterhunts();
    attack_monsters();
    warrior_skills();
    loot();
    // handle_party();
    // handle_inventory();
    handle_respawn();
}, 250); // 1/4th second (250 miliseconds)

function warrior_skills() {
    if(character.ctype !== 'warrior') return;
    if(can_use('charge') && !is_on_cooldown('charge')) {
        use_skill('charge');
    }

    if(can_use('taunt') && !is_on_cooldown('charge') && get_targeted_monster(character).target != 'Wrex') {
        use_skill('taunt', character.target);
    }

    // if(can_use('stomp') && !is_on_cooldown('stomp')) {
    //     use_skill('stomp');
    // }

    // if(can_use('cleave') && !is_on_cooldown('cleave')) {
    //     use_skill('cleave');
    // }
}

function attack_monsters() {
    let wrex = get_player("Wrex");

    if(smart.moving) return;
    // if character is merchant then return.
    // if(character.name == party_list[0]) return;
    // target only exists if we are actually targeting something alive
    var target = get_targeted_monster();

    // var safeDistance = (target.range + 20)
	// if (safeDistance < 100) {
	// 	safeDistance = 100;
	// }
    // if we are not targeting anything at all.
    if(!target) {
        // update our target variable with arguments.
        // target = get_nearest_monster({no_target: true, type: farm_monsters[0]});
        target = find_viable_targets()[0];
        if(character.name != 'Wrex' && wrex !== null) {
            target = get_entity(wrex.target);
        }
        if(target !== null) {
            // switches to the target desired
            change_target(target);
        } else {
            set_message("No Monsters");
            // if we are not already attempting to, or smart moving
            if(!smart.moving) {
                // pathfind to the desired monster spawn
                smart_move(farm_monsters[0]);
            }
        }
    } else { // if we do have a target...
        // if our attack distance is too far from the target
        if(distance_to_target(target) > character.range * 0.9) { 
            // if we are not already moving
            if(!character.moving) {
                var half_x = character.real_x + (target.real_x - character.real_x)/2;
                var half_y = character.real_y + (target.real_y - character.real_y)/2;
                // move half way between ourself and the monster position
                move(half_x, half_y);
            }
        // if we are close enough to attack 
        // we need to make sure we are not disabled (freeze, stun, etc)
        // and, make sure our attack is not on a cooldown
        // } else if(is_in_range(target) && can_attack(target) && !parent.is_disabled(character) && !is_on_cooldown("attack")) {
        } else if(can_attack(target)) {
            set_message("Attacking");
            attack(target);
        }
    }
    send_to_merchant();
}