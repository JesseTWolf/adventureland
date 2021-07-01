import { 
    keep_whitelist, 
    last_use_hp_potion,
    last_use_mp_potion,
    last_respawn,
    party_list, 
    pot_stack,
    potion_data, 
    scroll_data,
    sell_whitelist
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

const upgrade_whitelist = [
	'pyjamas', 'bunnyears', 'carrotsword', 'firestaff', 'fireblade', 
    'sshield', 'shield', 'gloves', 'coat', 'helmet', 'pants', 
    'gloves1', 'coat1', 'shoes1', 'harbinger', 'oozingterror', 
    'bataxe', 'spear', 'xmaspants', 'xmassweater', 'xmashat',
    'xmasshoes', 'xmace', 'mittens', 'ornamentstaff', 'candycanesword',
    'warmscarf', 't2bow', 'pmace', 'basher', 'harmor',
    'hgloves', 'wingedboots', 'gcape', 'iceskates', 'wattire',
    'wshoes', 'wcap', 'wgloves', 'pants1', 'stinger', 'swifty',
    'snowflakes', 'helmet1', 'merry',

    'shoes'
];

const compound_whitelist = [ 
	'wbook0', 'intamulet', 'stramulet', 'dexamulet', 'intearring', 
	'strearring', 'dexearring', 'hpbelt', 'hpamulet', 'ringsj', 
	'amuletofm', 'orbofstr', 'orbofint', 'orbofres', 'orbofhp',
    'vitring', 'intring', 'strring', 'dexring'
];

const keep_whitelist_merchant = [
    potion_data[0], potion_data[1], scroll_data[0], scroll_data[1],
    scroll_data[2], scroll_data[3], 'stand0', 'computer'
];

const max_upgrade_level = 5;
const max_compound_level = 3;
let compoundingAndUpgrading = true;
let use_better_scrolls = false;

// Shrinks the global chat down to super tiny.
parent.document.querySelector("#chatlog").style.height = "20px"

// initiate_code();
// const wrex = get_player("Wrex");
// const garrus = get_player("Garrus");
// var mordin = get_player("Mordin");
// var lawson = get_player("Lawson");

if(!character.party) {
    send_party_request("D3lphes");
}

setInterval(function() {
    find_and_move_to_leader();
    store_position();
    check__parties_pots();
    // custom function that uses potions based on values we define. Currently smallest potions.
    handle_use_potions(200, 300);
    // open_close_stand();
    // handle_party();
    loot();
    // provide_luck();
    handle_upgrade_and_compound();
    handle_inventory_merchant();
    handle_respawn();
}, 250); // 1/4th second (250 miliseconds)

function check__parties_pots() {
    for(let i = 1; i  < party_list.length; i++) {
        // if(party_list[i] === 'Garrus') {
        //     console.log(parseInt(localStorage.getItem(party_list[i]+'MPots'), 10) < 50);
        //     console.log(quantity('mpot0') >= 200);
        // }
        if(parseInt(localStorage.getItem(party_list[i]+'MPots'), 10) < 50 && quantity('mpot0') >= 200)  {
            // find the slot of the item we were looking up
            var slot = locate_item('mpot0');
            // send the item to the merchant
            send_item(party_list[i], slot, 200);
        }
        else if(parseInt(localStorage.getItem(party_list[i]+'HPots'), 10) < 50 && quantity('hpot0') >= 200) {
            // find the slot of the item we were looking up
            var slot = locate_item('hpot0');
            // send the item to the merchant
            send_item(party_list[i], slot, 200);
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

function handle_inventory_merchant() {
    sell_items_as_merchant();
    var hpot_amt = quantity(potion_data[0]);
    var mpot_amt = quantity(potion_data[1]);
    // var stack_amt = potion_data[2];

    if(hpot_amt < 1000) {
        var hpot_buy = 9999 - hpot_amt;
        buy_with_gold(potion_data[0], hpot_buy); 
    }

    if(mpot_amt < 1000) {
        var mpot_buy = 9999 - mpot_amt;
        buy_with_gold(potion_data[1], mpot_buy); 
    }
}

// function provide_luck() {
//     if (parent.party_list && character.mp > G.skills.mluck.mp && // Enough mana to cast it?
//     can_use('mluck')) {
//         parent.party_list.forEach(element => {
//             if(distance(character, get_player(element)) < G.skills.mluck.range &&
//                 !get_player(element).s.mluck) {
//                 // log('Buffing [' + element + "] with Merchant's Luck", 'red');
//                 use_skill('mluck', get_player(element));
//             }
//         });
//       }
// }

function initiate_code() {
    if(character.name == party_list[0]) {
        start_character(party_list[1], 'Farmer');
        start_character(party_list[2], 'Farmer');
        start_character(party_list[3], 'Farmer');
    }
}

// var last_upgrade_or_compound = null;
function handle_upgrade_and_compound() {
    // setInterval(function() {
        if(parent != null && parent.socket != null && character.bank == null) {
            // last_upgrade_or_compound === null || new Date() - last_upgrade_or_compound <= 10000) {
		    upgrade_items();
		    compound_items();
	    }
    // }, 10000);
}

// var last_upgrade = null;
async function upgrade_items() {
    let upgrade_scroll_slot;
    let upgrade_item_slot;
    // var done = true;
    // if(last_upgrade_or_compound === null || new Date() - last_upgrade_or_compound <= 20000) {
        // game_log("Trying to Upgrade");
        for (let i = 0; i < character.items.length; i++) {
            let c = character.items[i];
            if (c && upgrade_whitelist.includes(c.name) && c.level < max_upgrade_level) {
                let grades = get_grade(c);
                let scrollname;
    
                // let scroll_name = use_better_scrolls && c[0] > 1 ? 'cscroll1' : 'cscroll0'
                if (c.level < grades[0]) {
                    scrollname = 'scroll0';
                } else if (c.level < grades[1]) {
                    scrollname = 'scroll1';
                } else {
                    scrollname = 'scroll2';
                }
                
                let [scroll_slot, scroll] = find_item(i => i.name == scrollname);
                upgrade_scroll_slot = scroll_slot;
                if (!scroll) {
                    parent.buy(scrollname, 50);
                    return;
                }
    
                // if(last_upgrade == null || new Date() - last_upgrade >= parent.G.skills.massproduction.cooldown * 2 && can_use('massproduction')) {
                    // use_skill('massproduction');
                // if(!character.q.upgrade) {
    
                    // last_upgrade = new Date();
                    // parent.socket.emit('upgrade', {
                    //     item_num: i,
                    //     scroll_num: scroll_slot,
                    //     offering_num: null,
                    //     clevel: c.level
                    // });
                // }
                        
                // }
                // if(!character.q.upgrade) {
                    // && last_upgrade_or_compound === null || new Date() - last_upgrade_or_compound <= 20000) {
                    if(can_use('massproduction') && !is_on_cooldown('massproduction')) {
                        use_skill('massproduction');
                    }
                    // done = false;
                    await upgrade(i, upgrade_scroll_slot).then(function(data){
                        if(data.success) game_log("I have a +"+data.level+" armor/weapon now!");
                        else game_log("Rip armor/weapon, you'll be missed.");
                    });
                    // last_upgrade_or_compound = new Date();
                    // break;
                // }
                // break;
            }

            // if(last_upgrade_or_compound === null || new Date() - last_upgrade_or_compound <= 20000) {
            //     break;
            // }
            // if(!character.q.upgrade) {
            //     break;
            // }
        }
    // }
    // console.log(upgrade_item_slot + " " + upgrade_scroll_slot);
  }

async function compound_items() {
    let toCompound = character.items.reduce((collection, item, index) => {
		if (item && item.level < max_compound_level && compound_whitelist.includes(item.name)) {
			let key = item.name + item.level
			!collection.has(key) ? collection.set(key, [item.level, index]) : collection.get(key).push(index)
		}
		return collection
	}, new Map())

	var done = false;
    
        for (var c of toCompound.values()) {
            let scroll_name = use_better_scrolls && c[0] > 1 ? 'cscroll1' : 'cscroll0'

        // if(last_upgrade_or_compound === null || new Date() - last_upgrade_or_compound <= 20000) {
            for (let i = 1; i + 2 < c.length; i += 3) {
                let [scroll, _] = find_item(i => i.name == scroll_name);
                if (scroll == -1) {
                parent.buy(scroll_name);
                return;
                }
                
                if(!character.q.compound) {
                    // && last_upgrade_or_compound === null || new Date() - last_upgrade_or_compound <= 20000) {
                    if(can_use('massproduction') && !is_on_cooldown('massproduction')) {
                        use_skill('massproduction');
                    }
                    
                    await compound(c[i], c[i+1], c[i+2],locate_item(scroll_name)).then(function(data){
                        if(data.success) game_log("I have a +"+data.level+" accessory now!");
                        else game_log("Rip accessories, you'll be missed.");
                    });
                    // last_upgrade_or_compound = new Date();
                }
            }
        // }
    }
}

function get_grade(item) {
    return parent.G.items[item.name].grades;
}

export function sell_items_as_merchant() {
    for(let i in character.items) {
        let slot = character.items[i];
        if(slot != null) {
            let item_name = slot.name;
            if(sell_whitelist.includes(item_name) && !(keep_whitelist_merchant.includes(item_name))) {
                if(!slot.p) { // is not shiny
                    sell(i, 9999);
                    // console.log('Going to sell ' + i);
                }
            }
        }
    }
}