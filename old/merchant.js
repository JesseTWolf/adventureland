// import { check_party, number_of_empty_slots } from 'http://192.168.0.95/jesse/universal.js' 
//import * as universal from 'http://192.168.0.95/jesse/universal.js'

const { checkParty, openSpaceMessage, emptyInventory, numberOfEmptySlots} = require('./CODE/universal.js')

const me = character

let compoundingAndUpgrading = true
let use_better_scrolls = false
const max_upgrade_level = 8
const max_compound_level = 3
const upgrade_whitelist = [ 
	'wshoes' 
]

const compound_whitelist = [ 
	'wbook0', 'intamulet', 'stramulet', 'dexamulet', 'intearring', 
	'strearring', 'dexearring', 'hpbelt', 'hpamulet', 'ringsj', 
	'amuletofm', 'orbofstr', 'orbofint', 'orbofres', 'orbofhp'
]

const selling_whitelist = [ 
	'bfur'
	// { name: "slimestaff", level: 0 },
	// { name: "iceskates", level: 0 },
]

var attack_mode=true
var currentHunt="bigbird"
var acceptingItems=false

var gabrielle_items
var gabriella_items
var ledia_items
var lidia_items

var working=false
var selling=true

var bank_items
var bank_counts

var total_empty_slots


setInterval(function(){

	if(me.rip) {
		respawn();
		return;
	}

	// Check my open space in inventory
	total_empty_slots = numberOfEmptySlots(me.items)
	
	// Use update_bank_arrays function to gather all current items in the bank
	// Then use the search_for_item function to see if a particular item is in the bank or not.
	
	//console.log(working)
	if(!working && me.map == "bank") {
		console.log("Inside of if")
		count_items_in_bank()
		console.log("Done counting items in bank")
		print_bank_items_and_counts()
		console.log("Done printing out bank items and counts ")
		for (const element of compound_whitelist) {
			pickup_specific_items(element)
		}
	}

	if(selling) {
		if(me.map != "bank")
			// TODO Add a smartmove to the bank here before picking things up and going then going to sell.
			await smart_move("bank", 0, -37)
		sell_items()
		selling=false
	}

	setInterval(function() {
		if(compoundingAndUpgrading) {
			compoundItems();
		}
	}, 1000 / 4)
	

	/*
	count_items_in_bank()
	for(var i = 0; i < bank_items.length;i++) {
		console.log(bank_items[i] + " : " + bank_counts[i])
	}
	*/
	// pack is the actual bank character. Corresponds to character.bank.
	// str is the slot inside of the bank. 0 being the first one and 41 being the last
	// inv being -1 means put it anywhere where there is an empty slot. If you put a a number it will instead swap with that item.
	//parent.socket.emit("bank", { operation: "swap", pack: "items0" })
	
	//TODO: Use locate_item method to find items in my inventory.
	//
	//


	// If have more then 5 spaces in my inventory let characters know.
	/*
	me.on("cm", data => {
		if(data.name === "Lawson" && data.message.type === "open_space_request") {
			console.log(data)
			send_cm("Garrus", {
			"message": "open_space",
			"value": openSpace})
		}
	})
	*/
	/*
	console.log(openSpace)
	if(openSpace > 5) {
		send_cm("Garrus", {
			"message": "open_space",
			"value": openSpace
		})
	}
	*/

	//send cm will send a message to anyone.
	//Ask for position, if you get a position request on the receiving end then send a message with your position.
	

	if (!attack_mode || character.rip || is_moving(me)) return;
	//if (!attack_mode || character.rip || is_moving(character)) return;

},1000/4); // Loops every 1/4 seconds.


function update_bank_arrays() {
	gabrielle_items = character.bank.items0
	gabriella_items = character.bank.items1
	ledia_items = character.bank.items2
	lidia_items = character.bank.items3
}

function pickup_specific_items(item_name) {
	if(bank_items.indexOf(item_name) != -1) {
		for(var i = 0; i < 42;i++) {
			if(gabrielle_items[i] != null)
				if(gabrielle_items[i].name === item_name)
					parent.socket.emit("bank", { operation: "swap", pack: "items0", str: i, inv: -1})
			if(gabriella_items[i] != null)
				if(gabriella_items[i].name === item_name)
					parent.socket.emit("bank", { operation: "swap", pack: "items1", str: i, inv: -1})
			if(ledia_items[i] != null)
				if(ledia_items[i].name === item_name) 
					parent.socket.emit("bank", { operation: "swap", pack: "items2", str:i, inv: -1})
			if(lidia_items[i] != null) 
				if(lidia_items[i].name === item_name)
					parent.socket.emit("bank", { operation: "swap", pack: "items3", str:i, inv: -1})	
		}
	}
	// Update counts for in the bank.
	// TODO: Figure out a cleaner way to do this instead of wiping out the arrays completely and refilling.
	count_items_in_bank()
}

function sell_items() {
	for(let i = 0; i < character.items.length; i++) {
		// console.log(character.items[i])
		let charItem = character.items[i];
		if(charItem) {
			if (charItem && selling_whitelist.includes(charItem.name)) {
				console.log("Going to sell: " + character.items[i].name +
						" at level: " + character.items[i].level)
				// sell(i);
			}
		}
	}
}

function count_items_in_bank() {
	update_bank_arrays()
	bank_items = []
	bank_counts = []
	var item

	for(var i = 0; i < 42;i++) {i
		//console.log("Before Gabrielle " + i)
		if(gabrielle_items[i] != null) {
			item = gabrielle_items[i].name
			//console.log(item)
			
			if(bank_items.indexOf(item) === -1) {
				bank_items.push(item)
				bank_counts.push(1)
			}
			else
				bank_counts[bank_items.indexOf(item)]++
		}
		if(gabriella_items[i] != null) {
			item = gabriella_items[i].name

			if(bank_items.indexOf(item) === -1) {
				bank_items.push(item)
				bank_counts.push(1)
			}
			else
				bank_counts[bank_items.indexOf(item)]++
		}
		if(ledia_items[i] != null) {
			item = ledia_items[i].name

			if(bank_items.indexOf(item) === -1) {
				bank_items.push(item)
				bank_counts.push(1)
			}
			else
				bank_counts[bank_items.indexOf(item)]++
		}
		if(lidia_items[i] != null) {
			item = lidia_items[i].name

			if(bank_items.indexOf(item) === -1) {
				bank_items.push(item)
				bank_counts.push(1)
			}
			else
				bank_counts[bank_items.indexOf(item)]++
		}
	}
	console.log("Done")
	working = true
}

function print_bank_items_and_counts() {
	for (var i = 0; i < bank_items.length;i++) {
		console.log(bank_items[i] + " : " + bank_counts[i])
	}
}

function print_out_inventory() {
	for (var i = 0; i < me.items.length; i++) {
		console.log(me.items[i].name)
	}
}

setInterval(function compoundItems() {
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

		for (let i = 1; i + 2 < c.length; i += 3) {
			let [scroll, _] = find_item(i => i.name == scroll_name);
			if (scroll == -1) {
			  parent.buy(scroll_name);
			  return;
			}
			
			if(!done) {
				compound(c[i], c[i+1], c[i+2],locate_item(scroll_name)).then(function(data){
					if(data.success) game_log("I have a +"+data.level+" accessory now!");
					else game_log("Rip accessories, you'll be missed.");
				});
				done = true; 
			}
		  }
	}
},200);

function find_item(filter) {
	for (let i = 0; i < character.items.length; i++) {
		let item = character.items[i];

		if (item && filter(item))
		return [i, character.items[i]];
	}

	return [-1, null];
}