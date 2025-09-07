"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type ReactQueryProviderProp = {
  children: React.ReactNode;
};

const ReactQueryProvider = ({ children }: ReactQueryProviderProp) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
