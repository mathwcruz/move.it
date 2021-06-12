import { AppProps } from "next/app";
import Router from "next/router";
import { Provider as NextAuthProvider } from "next-auth/client";
import Nprogress from "nprogress";

import "../styles/global.css";

Router.events.on("routeChangeStart", () => Nprogress.start());
Router.events.on("routeChangeComplete", () => Nprogress.done());
Router.events.on("routeChangeError", () => Nprogress.done());

function App({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps?.session}>
      <Component {...pageProps} />
    </NextAuthProvider>
  );
}

export default App;
