export function checkParty(me){
	if(!me.party) {
		send_party_request("D3lphes")
		send_party_request("Iriss")
		send_party_request("Lunaa")
	}
}
