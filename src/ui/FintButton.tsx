import { Button, type ButtonProps } from "tamagui";

interface FintButtonProps extends Omit<ButtonProps, "variant"> {
  variant?: "solid" | "outlined";
}

export function FintButton({ variant = "solid", ...props }: FintButtonProps) {
  return (
    <Button
      bg={variant === "outlined" ? "transparent" : "$accent9"}
      color={variant === "outlined" ? "$accent9" : "$color1"}
      borderColor="$accent8"
      borderWidth={variant === "outlined" ? 1 : 0}
      rounded="$6"
      fontWeight="700"
      hoverStyle={{ bg: variant === "outlined" ? "$accent1" : "$accent10" }}
      pressStyle={{
        bg: variant === "outlined" ? "$accent2" : "$accent10",
        opacity: variant === "outlined" ? 1 : 0.9,
      }}
      {...props}
    />
  );
}
