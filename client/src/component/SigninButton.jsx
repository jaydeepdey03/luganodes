'use client'
import { useAccount, useConnect, useNetwork, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'
import { Box, Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function SignInButton() {

    const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
    const [state, setState] = useState({})
    const router = useRouter()
    const [ethereumLoading, setEthereumLoading] = useState(false)

    const fetchNonce = async () => {
        try {
            const nonceRes = await fetch('http://localhost:5000/api/nonce')
            const nonce = await nonceRes.text()
            setState((prev) => ({ ...prev, nonce }))
        } catch (error) {
            setState((prev) => ({ ...prev, error: error }))
        }
    }

    // Pre-fetch random nonce when button is rendered
    // to ensure deep linking works for WalletConnect
    // users on iOS when signing the SIWE message
    useEffect(() => {
        fetchNonce()
        console.log(state)
    }, [])

    const { address, isConnected } = useAccount()
    const { chain } = useNetwork()
    const { signMessageAsync } = useSignMessage()

    const signIn = async () => {
        setEthereumLoading(true)
        try {
            const chainId = chain?.id
            if (!address || !chainId) return

            setState((prev) => ({ ...prev, loading: true }))
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
            const verifyRes = await fetch('http://localhost:5000/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, signature }),
                credentials : 'include',
                mode : 'cors'
            })
            const res = await verifyRes.json()
            console.log('res', res)
            if (!verifyRes.ok) throw new Error('Error verifying message')
            else if (verifyRes.ok) console.log('verified')
            setState((prev) => ({ ...prev, loading: false }))
            router.push('/dashboard')
        } catch (error) {
            setState((prev) => ({ ...prev, loading: false, nonce: undefined }))
            console.log(error)
            fetchNonce()
        }finally{
            setEthereumLoading(false)
        }
    }

    console.log(state, 'state')

    return (
        <Box suppressHydrationWarning>
            {
                address === undefined ? (
                    connectors.map((connector) => (
                        <Button
                            w="full"
                            disabled={!connector.ready}
                            key={connector.id}
                            onClick={() => connect({ connector })}
                            isLoading={isLoading}
                            loadingText="Connecting..."
                        >
                            Connect Wallet
                            {isLoading &&
                                connector.id === pendingConnector?.id &&
                                ' (connecting)'}
                        </Button>
                    ))
                )

                    : <Button isLoading={ethereumLoading} loadingText={'Signing in...'} isDisabled={!state.nonce || state.loading} onClick={signIn} w="full">
                        Sign-In with Ethereum
                    </Button>
            }
        </Box>
    )
}


export default SignInButton