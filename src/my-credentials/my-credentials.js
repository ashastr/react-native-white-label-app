// @flow
import React, { useMemo, useCallback, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect, useSelector, useDispatch } from 'react-redux'
import type { MyCredentialsProps, CredentialItem } from './type-my-credentials'

import { CameraButton } from '../components'
import { CredentialsCards } from './cards/credentials-cards'
import { myCredentialsRoute, qrCodeScannerTabRoute } from '../common'
import { colors } from '../common/styles/constant'
import { getReceivedCredentials } from '../store/store-selector'
import { EmptyState } from '../home/empty-state'
import {
  credentialsHeadline,
  credentialsShowCameraButton,
  CustomMyCredentialsScreen,
  MyCredentialsViewEmptyState,
} from '../external-imports'
import { deleteClaim } from '../claim-offer/claim-offer-store'
import { handleInvitation } from '../invitation/invitation-store'
import { proofRequestReceived } from '../proof-request/proof-request-store'

export const headlineForCredentialRoute =
  credentialsHeadline || 'MY Credentials'
const showCameraButton =
  typeof credentialsShowCameraButton === 'boolean'
    ? credentialsShowCameraButton
    : true

const MyCredentialsScreen = (props: MyCredentialsProps) => {
  const { route, navigation } = props;
  const receivedCredentials = useSelector(getReceivedCredentials)
  const dispatch = useDispatch()
  const deleteCredential = useCallback(
    (uuid: string) => dispatch(deleteClaim(uuid)),
    [dispatch]
  )

  const credentials = useMemo(() => {
    const credentials: Array<CredentialItem> = receivedCredentials.map(
      (credential) => ({
        claimOfferUuid: credential.uid,
        credentialName: credential.data.name,
        issuerName: credential.issuer.name,
        date: credential.issueDate,
        attributes: credential.data.revealedAttributes,
        logoUrl: credential.senderLogoUrl,
        remoteDid: credential.remotePairwiseDID,
        colorTheme: credential.colorTheme,
        claimDefinitionId: credential.data.claimDefinitionId,
      })
    )

    credentials.sort((a, b) =>
      a.credentialName
        .toLowerCase()
        .localeCompare(b.credentialName.toLowerCase())
    )

    return credentials
  }, [receivedCredentials])

  const hasNoCredentials = credentials.length === 0

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {hasNoCredentials &&
          (MyCredentialsViewEmptyState ? (
            <MyCredentialsViewEmptyState {...props}/>
          ) : (
            <EmptyState />
          ))}
        {!hasNoCredentials && (
          <CredentialsCards
            credentials={credentials}
            deleteClaim={deleteCredential}
            navigation={navigation}
            route={route}
          />
        )}
      </View>

      {showCameraButton && (
        <CameraButton
          onPress={() => navigation.navigate(qrCodeScannerTabRoute)}
        />
      )}
    </View>
  )
}

export const MyCredentials = CustomMyCredentialsScreen || MyCredentialsScreen

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      handleInvitation,
      proofRequestReceived,
    },
    dispatch
  )

export const myCredentialsScreen = {
  routeName: myCredentialsRoute, 
  screen: connect(mapStateToProps, mapDispatchToProps)(MyCredentials),
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
