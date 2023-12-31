// app/providers.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { WagmiConfig, configureChains, createConfig, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { polygonMumbai } from 'wagmi/chains'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

export function Providers({
    children
}) {

    const theme = extendTheme({
        initialColorMode: "system",
        useSystemColorMode: false,
        fonts: {
            inter: 'Inter, sans-serif',
            poppins: 'Poppins, sans-serif',
        },
        colors: {
            primary: "#37306B",
            secondary: "#66347F",
            tertiary: "#9E4784",
            quaternary: "#D27685",
        },
    })

    const { chains, publicClient, webSocketPublicClient } = configureChains([polygonMumbai], [publicProvider()])

    const config = createConfig({
        connectors: [
            new MetaMaskConnector({ chains }),
        ],
        publicClient,
        webSocketPublicClient,
        autoConnect: true,
    })
    return (
        <WagmiConfig config={config}>
            <CacheProvider>
                <ChakraProvider theme={theme}>
                    {children}
                </ChakraProvider>
            </CacheProvider>
        </WagmiConfig>
    )
}