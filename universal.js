export function check_party(me){
	if(!me.party) {
		send_party_request("D3lphes")
		send_party_request("Iriss")
		send_party_request("Lunaa")
	}
}

export function open_space_message(me,target) {
	send_cm(target, {type: "open_space_request"})
}

export function empty_inventory(me) {
	smart_move("bank", 0, -37)
	
	var openSpace = me.items.length
	var bankerVisited = 0
	while(bankerVisited < 3) {
		for(var i = 0; i < 42;i++) {
			bank_store(i)
		}	
		bankerVisited++
	}
}

//export function send_to_merchant(me,numOpenSlots) {
		
//}
