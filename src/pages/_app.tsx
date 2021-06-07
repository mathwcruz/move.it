import { AppProps } from "next/app";
import { Provider as NextAuthProvider } from "next-auth/client";

import "../styles/global.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <Component {...pageProps} />
    </NextAuthProvider>
  );
}

export default App;
