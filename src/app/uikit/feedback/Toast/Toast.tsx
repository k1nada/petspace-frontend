"use client";

import { ToastContainer, cssTransition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPaw, FaExclamationCircle } from "react-icons/fa";
import styles from "./Toast.module.scss";

const toastTransition = cssTransition({
  enter: styles.toastEnter,
  exit: styles.toastExit,
});

const getToastIcon = (type: string) => {
  if (type === "success") {
    return <FaPaw />;
  }

  if (type === "error") {
    return <FaExclamationCircle />;
  }

  return null;
};

export const Toast = () => {
  return (
    <ToastContainer
      position="bottom-left"
      autoClose={3000}
      hideProgressBar={true}
      newestOnTop
      closeOnClick
      pauseOnHover
      closeButton={false}
      transition={toastTransition}
      icon={({ type }) => getToastIcon(type)}
      className={styles.container}
      toastClassName={styles.toast}
    />
  );
};
