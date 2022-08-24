import { isAriesOutOfBandInvitation } from "./invitation/kinds/aries-out-of-band-invitation"
import { convertAriesOutOfBandInvitationToAppInvitation } from "./invitation/kinds/aries-out-of-band-invitation";
import { isValidUrl } from "./components/qr-scanner/qr-code-types/qr-url";
import { isValidOpenIDLink } from "./components/qr-scanner/qr-code-types/qr-code-oidc";
import { flatJsonParse } from "./common/flat-json-parse";
import { getUrlData } from "./components/qr-scanner/qr-code-types/qr-url";
import { validateEphemeralProofQrCode } from "./proof-request/proof-request-qr-code-reader";
import { QR_CODE_TYPES } from "./components/qr-scanner/type-qr-scanner";
import { GenericObject } from "./common/type-common";
import { proofRequestRoute } from "./common";

export const processVerification = async (url, proofRequestReceived, navigation) => {
    let qrData = null;
    const urlQrCode = isValidUrl(url);
    if (urlQrCode) {
        const [urlError, urlData] = await getUrlData(urlQrCode, url)
        if (urlError) {
         console.log('****** isValidUrl error', urlError);
        }
        qrData = urlData
      }

      const openidLinkQrCode = isValidOpenIDLink(url)
      if (openidLinkQrCode) {
        const [urlError, urlData] = await getOpenidLinkData(url)
        if (urlError) {
          console.log('****** isValidOpenIDLink error', urlError);
        }
        qrData = urlData
      }

      if (!qrData) {
        const [parseError, parsedData] = flatJsonParse(url)
        if (parseError) {
          console.log('****** flatJsonParse error', urlError);
        }
        qrData = parsedData
      }

      const [, ephemeralProofRequest] = await validateEphemeralProofQrCode(
        qrData.type === QR_CODE_TYPES.URL_NON_JSON_RESPONSE ||
          qrData.type === QR_CODE_TYPES.EPHEMERAL_PROOF_REQUEST_V1
          ? (qrData: GenericObject).data
          : JSON.stringify(qrData)
      )
          console.log('********* qrData scanned', qrData);
          console.log('********* ephemeralProofRequest scanned', ephemeralProofRequest);
      if (
        ephemeralProofRequest &&
        ephemeralProofRequest.type === QR_CODE_TYPES.EPHEMERAL_PROOF_REQUEST_V1
      ) {
        ephemeralProofRequest = ephemeralProofRequest.proofRequest;

        const uid = ephemeralProofRequest.ephemeralProofRequest['@id']
        proofRequestReceived(ephemeralProofRequest.proofRequestPayload, {
          uid,
          remotePairwiseDID:
            ephemeralProofRequest.ephemeralProofRequest['~service']
              .recipientKeys[0],
          senderLogoUrl: null,
          hidden: true,
        });
        navigation.navigate(proofRequestRoute, {
          uid,
          backRedirectRoute: this.props.route.params?.backRedirectRoute,
        })

      }
}
