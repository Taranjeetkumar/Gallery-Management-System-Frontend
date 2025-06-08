"use client";

import { persistor, store } from "@/store";
import { Box, CircularProgress } from "@mui/material";
import type React, from "react";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "@/store/slices/authSlice";

interface ReduxProviderProps {
  children: React.ReactNode;
}

const LoadingComponent = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

// New inner component for bootstrapping
function InnerBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return <>{children}</>;
}

export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingComponent />} persistor={persistor}>
        {/** After rehydration, bootstrap current user */}
        <InnerBootstrap>{children}</InnerBootstrap>
      </PersistGate>
    </Provider>
  );
};
