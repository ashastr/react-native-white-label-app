import { isAriesOutOfBandInvitation } from "./invitation/kinds/aries-out-of-band-invitation"
import { convertAriesOutOfBandInvitationToAppInvitation } from "./invitation/kinds/aries-out-of-band-invitation";
import { handleInvitation } from "./invitation/invitation-store";

export const processCredentials = async (url) => {
    const outOfBandInvite = isAriesOutOfBandInvitation(url);
    console.log('********* outOfBandInvite', outOfBandInvite);
    if (outOfBandInvite) {
        const invitation = await convertAriesOutOfBandInvitationToAppInvitation(outOfBandInvite);
        console.log('********* invitation', invitation);
        handleInvitation(invitation);
        console.log('********* handle invitation called');
    } else {
        console.log('********* not an Aries invitation url');
    }
}