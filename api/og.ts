import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "experimental-edge",
};

export default function og() {
  return new ImageResponse(
    { key: "1", type: "div", props: { style: { backgroundColor: "red" } } },
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
      width: 1200,
      height: 600,
    }
  );
}
