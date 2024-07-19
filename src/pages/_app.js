import React from "react";
import { ConfigProvider } from "antd";

import theme from "@/theme/themeConfig";
import "@/styles/globals.css";
import { AppLayout } from "@/shared/ui/core/ui/layout";

export default function App({ Component, pageProps }) {
  return (
    <ConfigProvider theme={theme}>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </ConfigProvider>
  );
}
