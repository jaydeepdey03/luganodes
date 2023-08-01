'use client'

import { useAccount, useNetwork, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'
import { Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

function SignInButton({
    onSuccess,
    onError,
}) {
    const [state, setState] = useState({})

    const fetchNonce = async () => {
        try {
            const nonceRes = await fetch('/api/nonce')
            const nonce = await nonceRes.text()
            setState((x) => ({ ...x, nonce }))
        } catch (error) {
            setState((x) => ({ ...x, error: error }))
        }
    }

    // Pre-fetch random nonce when button is rendered
    // to ensure deep linking works for WalletConnect
    // users on iOS when signing the SIWE message
    useEffect(() => {
        fetchNonce()
    }, [])

    const { address } = useAccount()
    const { chain } = useNetwork()
    const { signMessageAsync } = useSignMessage()

    const signIn = async () => {
        try {
            const chainId = chain?.id
            if (!address || !chainId) return

            setState((x) => ({ ...x, loading: true }))
            // Create SIWE message with pre-fetched nonce and sign with wallet
            const message = new SiweMessage({
                domain: window.location.host,
                address,
                statement: 'Sign in with Ethereum to the app.',
                uri: window.location.origin,
                version: '1',
                chainId,
                nonce: state.nonce,
            })
            const signature = await signMessageAsync({
                message: message.prepareMessage(),
            })

            // Verify signature
            const verifyRes = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, signature }),
            })
            if (!verifyRes.ok) throw new Error('Error verifying message')

            setState((x) => ({ ...x, loading: false }))
            onSuccess({ address })
        } catch (error) {
            setState((x) => ({ ...x, loading: false, nonce: undefined }))
            onError({ error: error })
            fetchNonce()
        }
    }

    return (
        <Button disabled={!state.nonce || state.loading} onClick={signIn} w="full">
            Sign-In with Ethereum
        </Button>
    )
}


export default SignInButton