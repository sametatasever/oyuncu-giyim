import "semantic-ui-css/semantic.min.css";
import "../styles/bootstrap-grid.css";
import "../styles/reset.css";
import "../styles/variables.scss";
import "../styles/header.scss";
import "../styles/homepage.scss";
import "../styles/footer.scss";
import "../styles/adminLayout.scss";
import "../styles/index.scss";

import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "swiper/components/scrollbar/scrollbar.scss";

import { wrapper } from "../store";
import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import clsx from "clsx";
import Cookie from "js-cookie";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../apollo/client";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import Header from "../components/Header";
import Footer from "../components/Footer";
import LeftMenu from "../components/LeftMenu";
import ModalCloser from "../components/ModalCloser";
import CartReview from "../components/CartReview";
import MobileMenu from "../components/MobileMenu";
import MobileSearch from "../components/MobileSearch";

import AdminHeader from "../components/admin/Header";
import AdminModalCloser from "../components/admin/ModalCloser";
import AdminLeftMenu from "../components/admin/LeftMenu";

import { toggleIconMode } from "../store/reducers/theme";

import {
  disablePageScroll,
  enablePageScroll,
  setFillGapMethod,
  clearQueueScrollLocks,
} from "scroll-lock";

function MyApp({ Component, pageProps }) {
  const {
    modals: {
      mobileSearchVisible,
      cartReviewVisible,
      notificationsVisible,
      desktopSearchVisible,
      loginFormVisible,
    },
    theme: { iconMode },
    admin: { mobileMenuVisible: adminMobileMenuVisible },
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [isTabletMenuClosed, setIsTabletMenuClosed] = useState(false);
  const router = useRouter();
  console.log(router);
  const apolloClient = useApollo(pageProps.initialApolloState);
  useEffect(() => {
    Cookie.set("iconMode", iconMode);

    function checkMenu() {
      if (
        window.innerWidth < 1199 &&
        !iconMode &&
        router.asPath.slice(0, 6) !== "/admin"
      ) {
        dispatch(toggleIconMode());
      }
    }
    if (!isTabletMenuClosed) {
      checkMenu();
      setIsTabletMenuClosed(true);
    }
    window.addEventListener("resize", checkMenu);
    return () => {
      window.removeEventListener("resize", checkMenu);
    };
  }, [iconMode]);

  useEffect(() => {
    const scrollableEl = document.querySelector("body");
    setFillGapMethod("max-width");
    if (
      cartReviewVisible ||
      mobileSearchVisible ||
      notificationsVisible ||
      loginFormVisible ||
      desktopSearchVisible
    ) {
      disablePageScroll(scrollableEl);
    } else {
      clearQueueScrollLocks();
      enablePageScroll(scrollableEl);
    }
  }, [
    cartReviewVisible,
    mobileSearchVisible,
    notificationsVisible,
    loginFormVisible,
    desktopSearchVisible,
  ]);

  const NormalLayout = useMemo(() => {
    return (
      <ApolloProvider client={apolloClient}>
        <div
          className={clsx({
            "main-wrapper": true,
            "cart-review-active": cartReviewVisible,
            "mobile-search-active": mobileSearchVisible,
            "desktop-search-active": desktopSearchVisible,
            "theme-icon-mode-active": iconMode,
          })}
        >
          <Header />
          <main className="content-wrapper">
            <div className="row">
              <div className="page-left-wrapper">
                <LeftMenu />
              </div>
              <div className="page-right-wrapper">
                <Component {...pageProps} />
              </div>
            </div>
            <ModalCloser />
            <CartReview />
            <MobileMenu />
            <MobileSearch />
          </main>
          <Footer />
        </div>
      </ApolloProvider>
    );
  });

  const AdminLayout = useMemo(() => {
    return (
      <ApolloProvider client={apolloClient}>
        <div
          className={clsx({
            "main-wrapper": true,
            "admin-layout": true,
            "theme-icon-mode-active": iconMode,
            "mobile-menu-visible": adminMobileMenuVisible,
          })}
        >
          <AdminHeader />
          <main className="content-wrapper">
            <div className="row">
              <div className="page-left-wrapper">
                <AdminLeftMenu />
              </div>
              <div className="page-right-wrapper">
                <Component {...pageProps} />
              </div>
            </div>
            <AdminModalCloser />
          </main>
          <Footer />
        </div>
      </ApolloProvider>
    );
  });

  if (router.route === "/404") {
    return NormalLayout;
  } else if (router.asPath.slice(0, 6) === "/admin") {
    return AdminLayout;
  } else {
    return NormalLayout;
  }
}

export default wrapper.withRedux(MyApp);
