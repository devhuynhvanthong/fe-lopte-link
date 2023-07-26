import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ClientLayout from "~/component/ClientLayout";

export default function App({ Component, pageProps }: any) {

  const Layout: any = Component?.layout || ClientLayout

  return <Layout>
    <Component {...pageProps} />
  </Layout>
}
