import React from "react";
import { ConfigProvider } from "antd";

import theme from "@/theme/themeConfig";
import "@/styles/globals.css";
import { AppLayout } from "@/shared/ui/core/ui/layout";
import StartPocketBase from "@/components/StartPocketBase";

export default function App({ Component, pageProps }) {
  return (
    <ConfigProvider theme={theme}>
      <AppLayout>
        <StartPocketBase />
        <Component {...pageProps} />
      </AppLayout>
    </ConfigProvider>
  );
}
