import { ComponentProps } from "react";
import styles from "./Link.module.scss";
import { Link as IntlLink } from "@/i18n/navigation";
import cn from "classnames";

interface LinkProps extends ComponentProps<typeof IntlLink> {
  appearance?: "primary" | "secondary";
}

export const Link = ({
  appearance,
  children,
  className,
  ...rest
}: LinkProps) => {
  return (
    <IntlLink
      {...rest}
      className={cn(
        styles.default,
        {
          [styles.primary]: appearance === "primary",
          [styles.secondary]: appearance === "secondary",
        },
        className,
      )}
    >
      {children}
    </IntlLink>
  );
};
