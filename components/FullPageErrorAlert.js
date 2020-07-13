import ErrorAlert from "./ErrorAlert";
import Head from "next/head";

const FullPageErrorAlert = ({ title, message }) => {
  return (
    <div>
      <Head>
        <title>Error </title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>

      <div className="container mx-auto m-10">
        <ErrorAlert title={title} message={message} />
      </div>
    </div>
  );
};
export default FullPageErrorAlert;
