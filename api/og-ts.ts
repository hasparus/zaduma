import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "experimental-edge",
};

// Note: `vercel dev` doesn't run `.tsx` endpoints
//        and it can't run @vercel/og because of
//        > Invalid URL: ../vendor/noto-sans-v27-latin-regular.ttf

export default function og() {
  return new ImageResponse(
    // <div
    //   style={{
    //     fontSize: 128,
    //     background: "white",
    //     width: "100%",
    //     height: "100%",
    //     display: "flex",
    //     textAlign: "center",
    //     alignItems: "center",
    //     justifyContent: "center",
    //   }}
    // >
    //   Hello world!
    // </div>
    {
      type: "div",
      props: {
        style: {
          fontSize: 128,
          background: "blue",
          color: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
        },
      },
      children: "Hello world!",
    } as any,
    {
      width: 1200,
      height: 600,
    }
  );
}
