// app/providers.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

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


    return (
        <CacheProvider>
            <ChakraProvider theme={theme}>
                {children}
            </ChakraProvider>
        </CacheProvider>
    )
}