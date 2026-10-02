import React from "react";
import { ConfigProvider } from "antd";
import { Authenticator } from "@aws-amplify/ui-react";

import "@aws-amplify/ui-react/styles.css";
import "@/shared/lib/amplify";
import theme from "@/theme/themeConfig";
import "@/styles/globals.css";
import { AppLayout } from "@/shared/ui/core/ui/layout";
import EnsureInitialData from "@/components/EnsureInitialData";

export default function App({ Component, pageProps }) {
  return (
    <ConfigProvider theme={theme}>
      {/* Users are created by an administrator, so sign-up is hidden. */}
      <Authenticator hideSignUp variation="modal">
        {({ signOut }) => (
          <AppLayout onSignOut={signOut}>
            <EnsureInitialData />
            <Component {...pageProps} />
          </AppLayout>
        )}
      </Authenticator>
    </ConfigProvider>
  );
}
