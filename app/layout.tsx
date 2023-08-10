// import ExternPredictionParamsProvider, { ComparisonContext } from '@/context/ComparisonParamProvider'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import logo from 'public/enpal-logo.svg'
import { URL_EXTERN_PREDICTION_PARAMS } from '@/utils/Urls'
import { worker } from '@/mocks/browser'
import ProviderProxy from '@/context/ProviderProxy'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

if (process.env.NODE_ENV === 'development') {
    worker.listen({ onUnhandledRequest: 'bypass' })
}

export default async function RootLayout({
  children
}) {
  // const externPredictionParams = await fetchExternPredictionParams();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ProviderProxy >
          {children}
        </ProviderProxy>
        <div id="banner">
          <Image id="enpal-logo" src={logo} alt="Enpal ." />
        </div>
      </body>
    </html>
  )
}

async function fetchExternPredictionParams() {
  try {
    const res = await fetch(URL_EXTERN_PREDICTION_PARAMS);
    return await res.json();
  } catch (e) {
    console.error(e)
    return null;
  }
}
