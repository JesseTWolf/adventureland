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

//export function send_to_merchant(me,numOpenSlots) {
		
//}
