import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppProps, type AppType } from "next/app";
import { Geist, Geist_Mono } from "next/font/google";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={session}>
      <main className={`${geist.variable} ${geistMono.variable}`}>
        {getLayout(<Component {...pageProps} />)}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
