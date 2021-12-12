import Head from "next/head";
import Image from "next/image";
import { useCallback } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const CallToAction = styled.h1`
  text-align: center;
`;

const CTAButton = styled.button`
  font-size: 1.2rem;
  cursor: pointer;
  background: #813eb7;
  color: #fff;
  padding: 14px 22px;
  border: 1px solid #813eb7;
  border-radius: 7px;
  display: block;
  margin: 0 auto;
`;

export default function Home() {
  const openMonoWidget = useCallback(async () => {
    const MonoConnect = (await import("@mono.co/connect.js")).default;

    const monoInstance = new MonoConnect({
      key: process.env.NEXT_PUBLIC_MONO_PUBLIC_KEY,
      onSuccess: async (data) => {
        console.log(data.code, "--- auth code ----");
        const response = await axios.post("/api/generateStatement", {
          authCode: data.code,
          period: "last4months",
        });
        console.log(response);
      },
      onLoad: () => console.log("Widget loaded"),
    });

    monoInstance.setup();
    monoInstance.open();
  }, []);

  return (
    <Container>
      <Head>
        <title>Money Health</title>
        <meta
          name="description"
          content="Generate your statements of account in minutes"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CallToAction>
        Hello👋, generate your account statements in minutes!
      </CallToAction>
      <CTAButton onClick={openMonoWidget}>Connect your account</CTAButton>
    </Container>
  );
}
