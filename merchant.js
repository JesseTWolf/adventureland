import { check_party, number_of_empty_slots } from 'http://192.168.0.95/jesse/universal.js' 
//import * as universal from 'http://192.168.0.95/jesse/universal.js'

const me = character
var attack_mode=true
var currentHunt="bigbird"
var acceptingItems=false

var gabrielle_items
var gabriella_items
var ledia_items
var lidia_items

var working=false

var bank_items
var bank_counts

setInterval(function(){

	if(me.rip) respawn()

	// Check my open space in inventory
	var total_empty_slots = number_of_empty_slots(me.items)
	
	// Use update_bank_arrays function to gather all current items in the bank
	// Then use the search_for_item function to see if a particular item is in the bank or not.
	console.log(working)
	if(!working) {
		console.log("Inside of if")
		count_items_in_bank()
		print_bank_items_and_counts()
		pickup_specific_items("slimestaff")
		/*
		for(var i = 0; i < gabrielle_items.length;i++) {
			console.log(gabrielle_items[i])
		}
		*/
	}

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
		for(var i = 0; i < gabrielle_items.length;i++) {
			console.log("Test: " + i)
			if(gabrielle_items[i] === null) 
				return
			//console.log(gabrielle_items[i])
			//console.log(gabrielle_items[i].name)
			if(gabrielle_items[i].name === item_name) {
				console.log("Item, " + item_name + "found at index: " + i)
				// -pack is the actual bank character. Corresponds to character.bank.
 				// -str is the slot inside of the bank. 0 being the first one and 41 being the last
 				// -inv being -1 means put it anywhere where there is an empty slot. If you put a a number it will 
				//  instead swap with that item.
				//  
				//  In this case pack is items0 since we are pulling from gabrielle
				parent.socket.emit("bank", { operation: "swap", pack: "items0", str: i, inv: -1})
			}
		}
		for(var i = 0; i < gabriella_items.length;i++) {
			if(gabriella_items[i].name === item_name) {
				parent.socket.emit("bank", { operation: "swap", pack: "items1", str: i, inv: -1})
			}
		}
		for(var i = 0; i < ledia_items.length;i++) {
			if(ledia_items[i].name === item_name) {
				parent.socket.emit("bank", { operation: "swap", pack: "items2", str:i, inv: -1})
			}
		}
		for(var i = 0; i < lidia_items.length;i++) {
			if(lidia_items[i].name === item_name) {
				parent.socket.emit("bank", { operation: "swap", pack: "items3", str:i, inv: -1})
			}
		}
	}
}

function count_items_in_bank() {
	update_bank_arrays()
	bank_items = []
	bank_counts = []
	var item

	for(var i = 0; i < 42;i++) {
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
		if(lidia_items != null) {
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
