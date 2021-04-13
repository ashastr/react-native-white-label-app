// @flow
import type {
  InvitationReceivedActionData,
  InvitationReceivedAction,
} from '../invitation/type-invitation'
import type { ReactNavigation } from '../common/type-common'
import type { Connection } from '../store/type-connection-store'
import type { OIDCAuthenticationRequest } from '../components/qr-scanner/type-qr-scanner'
import type { OpenIdConnectState } from '../open-id-connect/open-id-connect-actions'
import { claimOfferReceived } from '../claim-offer/claim-offer-store'
import { proofRequestReceived } from '../proof-request/proof-request-store'
import type { ClaimOfferPayload } from '../claim-offer/type-claim-offer'
import type { InvitationPayload } from '../invitation/type-invitation'
import type { ProofRequestPayload } from '../proof-request/type-proof-request'
import { proofProposalReceived } from '../verifier/verifier-store'
import type { VerifierData } from '../verifier/type-verifier'

export type QRCodeScannerScreenState = {
  isCameraEnabled: boolean,
  appState: ?string,
  permission: boolean,
}

export type QRCodeScannerScreenProps = {
  historyData: Object,
  currentScreen: string,
  allDid: { [publicDID: string]: Connection },
  allPublicDid: { [publicDID: string]: Connection },
  claimOffers: { [uid: string]: ClaimOfferPayload },
  proofRequests: { [uid: string]: ProofRequestPayload },
  verifiers: { [uid: string]: VerifierData },
  invitationReceived: (
    data: InvitationReceivedActionData
  ) => InvitationReceivedAction,
  changeEnvironmentUrl: (url: string) => void,
  openIdConnectUpdateStatus: (
    OIDCAuthenticationRequest,
    OpenIdConnectState
  ) => void,
  claimOfferReceived: typeof claimOfferReceived,
  proofRequestReceived: typeof proofRequestReceived,
  presentationProposalReceived: typeof proofProposalReceived,
} & ReactNavigation

export type OutOfBandNavigation = {
  mainRoute: string,
  backRedirectRoute: string,
  uid: string,
  invitationPayload: InvitationPayload,
  attachedRequest: any,
  senderName: string,
}

export const MESSAGE_NO_CAMERA_PERMISSION = 'No Camera permission'

export const MESSAGE_ALLOW_CAMERA_PERMISSION =
  'Please allow connect me to access camera from camera settings'
