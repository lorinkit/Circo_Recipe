import "../styles/globals.css";
import type { AppProps } from "next/app";

function Circo({ Component, pageProps }: AppProps) {
  return (
    <div className="font-sans">
      <Component {...pageProps} />
    </div>
  );
}

export default Circo;