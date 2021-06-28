var farm_monsters = ['squig', 'squigtoad'];
var monster_hunt_whitelist = [farm_monsters[0], 'goo', 'bee', 'crab'];
var potion_data = ['hpot0', 'mpot0', 200];
var party_list = ['Lawson', 'Garrus', 'Wrex', 'Mordin'];
// 'Alphae'];
var sell_whitelist = ['ringsj', 'hpamulet', 'hpbelt']; // watch out for shiny items
var keep_whitelist = [potion_data[0], potion_data[1]];
var farmer_gold_keep = 50000;
var pot_stack = 200;

initiate_code();

setInterval(function() {

    // custom function that uses potions based on values we define. Currently smallest potions.
    handle_use_potions(200, 300);
    handle_monsterhunts();
    ranger_skills();
    priest_skills();
    loot();
    open_close_stand();
    handle_party();
    handle_inventory();
    handle_respawn();
}, 250); // 1/4th second (250 mililiseconds)

var last_use_hp_potion = null;
var last_use_mp_potion = null;
function handle_use_potions(hp_amt, mp_amt) {
        if(character.mp <= character.mp_cost * 5) {
            if(last_use_mp_potion == null || new Date() - last_use_mp_potion >= parent.G.skills.use_mp.cooldown) {
                // use an mp potion.
                use('mp');
                last_use_mp_potion = new Date();
            }
        } else if(character.hp <= character.max_hp - hp_amt) {
            if(last_use_hp_potion == null || new Date() - last_use_hp_potion >= parent.G.skills.use_hp.cooldown) {
                // use an hp potion.
                use('hp');
                last_use_hp_potion = new Date();
            }
        } else if(character.mp <= character.max_mp - mp_amt) {
            if(last_use_mp_potion == null || new Date() - last_use_mp_potion >= parent.G.skills.use_mp.cooldown) {
                // use an mp potion.
                use('mp');
                last_use_mp_potion = new Date();
            }
        }
}

function ranger_skills() {
    if(character.ctype == 'ranger') {
        if(can_use('huntersmark')) {
            use_skill('huntersmark');
        }

        if(can_use('supershot')) {
            use_skill('supershot');
        }
    }
}

function priest_skills() {
    if(character.ctype == 'priest') {
        var wrex = get_player("Wrex")
	    var garrus = get_player("Garrus")

        if(can_use('curse')) {
            use_skill('curse');
        }

        if((wrex != null) && (wrex.hp < wrex.max_hp - character.attack) && !is_on_cooldown("heal")) {
            use_skill('heal',wrex)
            console.log("I healed for: " + character.attack)
        }

        if(garrus != null && (garrus.hp < (garrus.max_hp - character.attack)) && !is_on_cooldown("heal")) {
                use_skill('heal',garrus)
        }
    }
}

function open_close_stand() {
    if(character.ctype != 'merchant') return;
    if(character.moving) {
        // we close the stand with a socket emit
        parent.socket.emit('merchant', { close: 1});
    } else {
        // we open the stand, and have to use the 'locate_item(name)' function to locate the slot the stand is in
        parent.socket.emit('merchant', { num: locate_item('stand0') });
    }
}

var last_respawn = null;
function handle_respawn() {
    if(character.rip) {
		if(last_respawn == null || new Date() - last_respawn >= 10000) {
			respawn();
			last_respawn = new Date();
		}
		return;
	}
}

function distance_to_target(target) {
    if(target) {
        var dist = distance(character,target);
    } else {
        var dist = null;
    }
    return dist;
}

function attack_monsters() {
    if(smart.moving) return;
    // if character is merchant then return.
    if(character.name == party_list[0]) return;
    // target only exists if we are actually targeting something alive
    var target = get_targeted_monster();
    // if we are not targeting anything at all.
    if(!target) {
        // update our target variable with arguments.
        // target = get_nearest_monster({no_target: true, type: farm_monsters[0]});
        target = find_viable_targets()[0];
        if(target) {
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
        } else if(!parent.is_disabled(character) && !is_on_cooldown("attack")) {
            set_message("Attacking");
            attack(target);
        }
    }
    send_to_merchant();
}

function handle_inventory() {
    var hpot_amt = quantity(potion_data[0]);
    var mpot_amt = quantity(potion_data[1]);
    var stack_amt = potion_data[2];

    if(hpot_amt < 5 || mpot_amt < 5 || character.esize < 5){
        if(!smart.moving) {
            smart_move({to:"potions",return:true},function(){ 
                sell_items();
                var hpot_buy = stack_amt - hpot_amt;
                var mpot_buy = stack_amt - mpot_amt;
                // buy_with_gold makes sure that you buy with gold and not shells.
                buy_with_gold(potion_data[0], hpot_buy); 
                buy_with_gold(potion_data[1], mpot_buy); 
            });
        }
    }
}

function sell_items() {
    for(let i in character.items) {
        let slot = character.items[i];
        if(slot != null) {
            let item_name = slot.name;
            if(sell_whitelist.includes(item_name)) {
                if(!slot.p) { // is not shiny
                    sell(i, 9999);
                }
            }
        }
    }
}

function initiate_code() {
    if(character.name == party_list[0]) {
        start_character(party_list[1], 'master');
        start_character(party_list[2], 'master');
        start_character(party_list[3], 'master');
    }
}

function handle_party() {
    // this if for our party leader aka merchant to use
    if(character.name == party_list[0]) {
        // send out invites to everyone
        if(Object.keys(parent.party).length < party_list.length) {
            for(let i in party_list) {
                let player = party_list[i];
                if(player != party_list[0] && player != null) {
                    // send invite to this player
                    send_party_invite(player);
                }
            }
        }
    }

    // this is for our farmers
    if(!character.party) {
        if(character.name != party_list[0]) {
            accept_party_invite(party_list[0]);
        }
    } else { // if we are in a party...
        if(character.party != party_list[0]) {
            // we are in the wrong party and need to leave our current party
           leave_party(); 
        }
    }
}

function send_to_merchant() {
    if(character.ctype != 'merchant') {
        let merchant = get_player(party_list[0]);
        if(merchant != null) {
            // send gold and send items
            if(character.gold > farmer_gold_keep * 2) {
                send_gold(party_list[0], character.gold - farmer_gold_keep);
            }
            for(let i in character.items) {
                let item = character.items[i];
                if(item) {
                    // if not an item we should keep
                    if(!keep_whitelist.includes(item.name)) {
                        // find the slot of the item we were looking up
                        var slot = locate_item(item.name);
                        // send the item to the merchant
                        send_item(party_list[0], slot, 9999);
                    }
                }
            }
        }
    }
}

function handle_monsterhunts() {
    if(character.ctype != 'merchant') {
        // Pulled monster hunter npc location from maps information.
        // Set up smart_move friendly variable to navigate there.
        var monster_hunter_location = {
            x: parent.G.maps.main.npcs[23].position[0], 
            y: parent.G.maps.main.npcs[23].position[1],
            map: 'main'
        };
        if(character.s.monsterhunt) {
            // how many left to kill?
            if(character.s.monsterhunt.c > 0) {
                // if more than 0, need to continue killing'
                var hunt_type = character.s.monsterhunt.id;
                if(monster_hunt_whitelist.includes(hunt_type)) {
                    var nearest = get_nearest_monster({no_target: true, type: hunt_type});
                    var target = get_targeted_monster();
                    if(!target) {
                        if(nearest) {
                            change_target(nearest);
                        } else { 
                            if(!smart.moving) {
                                smart_move(hunt_type);
                            }
                        }
                    }
                } else { // if we have a monster hunt but can't handle the monster's difficulty then attack normally
                    attack_monsters();
                }     
            } else { // we are done, we can turn the quest in!
                if(!smart.moving) {
                    smart_move(monster_hunter_location,function(){ 
                        parent.socket.emit('monsterhunt');
                    });
                }
            }
        } else {
            // go get a quest from daisy
            if(!smart.moving) {
                smart_move(monster_hunter_location,function(){ 
                    // need to interact with her twice
                    parent.socket.emit('monsterhunt');
                    // after first interaction wait for ping to catchup then interact second time
                    setTimeout(function() {
                        parent.socket.emit('monsterhunt');
                    }, character.ping);
                });
            }
        }
    }
}

//Returns an ordered array of all relevant targets as determined by the following:
////1. The monsters' type is contained in the 'monsterTargets' array.
////2. The monster is attacking you or a party member.
////3. The monster is not targeting someone outside your party.
//The order of the list is as follows:
////Monsters attacking you or party members are ordered first.
////Monsters are then ordered by distance.
function find_viable_targets() {
    var monsters = Object.values(parent.entities).filter(
        mob => (mob.target == null
            || parent.party_list.includes(mob.target)
            || mob.target == character.name)
            && (mob.type == "monster"
            && (parent.party_list.includes(mob.target)
            || mob.target == character.name))
            || farm_monsters.includes(mob.mtype)
    );

    for (id in monsters) {
        var monster = monsters[id];

        if (parent.party_list.includes(monster.target) || monster.target == character.name) {
            monster.targeting_party = 1;
        } else {
            monster.targeting_party = 0;
        }
    }

    //Order monsters by whether they're attacking us, then by distance.
    monsters.sort(function (current, next) {
        if (current.targeting_party > next.targeting_party) {
            return -1;
        }
        var dist_current = distance(character, current);
        var dist_next = distance(character, next);
        // Else go to the 2nd item
        if (dist_current < dist_next) {
            return -1;
        } else if (dist_current > dist_next) {
            return 1
        } else {
            return 0;
        }
    });
    return monsters;
}