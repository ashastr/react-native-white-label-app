import { isAriesOutOfBandInvitation } from "./invitation/kinds/aries-out-of-band-invitation"
import { convertAriesOutOfBandInvitationToAppInvitation } from "./invitation/kinds/aries-out-of-band-invitation";
import { handleInvitation } from "./invitation/invitation-store";
import { isValidUrl } from "./components/qr-scanner/qr-code-types/qr-url";
import { isValidOpenIDLink } from "./components/qr-scanner/qr-code-types/qr-code-oidc";
import { flatJsonParse } from "./common/flat-json-parse";

export const processCredentials = async (url) => {
    let qrData = null;
    const urlQrCode = isValidUrl(event.data);
    if (urlQrCode) {
        const [urlError, urlData] = await getUrlData(urlQrCode, event.data)
        if (urlError) {
         console.log('****** isValidUrl error', urlError);
        }
        qrData = urlData
      }
  
      const openidLinkQrCode = isValidOpenIDLink(event.data)
      if (openidLinkQrCode) {
        const [urlError, urlData] = await getOpenidLinkData(event.data)
        if (urlError) {
          console.log('****** isValidOpenIDLink error', urlError);
        }
        qrData = urlData
      }
  
      if (!qrData) {
        const [parseError, parsedData] = flatJsonParse(event.data)
        if (parseError) {
          console.log('****** flatJsonParse error', urlError);
        }
        qrData = parsedData
      }

    const outOfBandInvite = isAriesOutOfBandInvitation(qrData);
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