import SEO from "../components/Seo";
import { wrapper } from "../store";
import { handleIconMode } from "../utils";

export default function GirisYap() {
  return (
    <SEO title="Giriş Yap - Oyuncu Giyim">
      <h1>Giriş Yap Veya Kayıt Ol</h1>
    </SEO>
  );
}

export const getServerSideProps = wrapper.getStaticProps(
  async ({ store, req, res, ...etc }) => {
    handleIconMode(store, req);
    //store.dispatch();
    return {
      props: {
        asd: "asd",
      },
    };
  }
);
