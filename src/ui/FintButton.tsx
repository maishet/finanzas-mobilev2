import { Button, type ButtonProps } from "tamagui";

interface FintButtonProps extends Omit<ButtonProps, "variant"> {
  variant?: "solid" | "outlined";
}

export function FintButton({ variant = "solid", ...props }: FintButtonProps) {
  return (
    <Button
      bg={variant === "outlined" ? "transparent" : "$primary"}
      color={variant === "outlined" ? "$primary" : "$primaryForeground"}
      borderColor="$ring"
      borderWidth={variant === "outlined" ? 1 : 0}
      rounded={14}
      fontFamily="$body"
      fontWeight="700"
      hoverStyle={{ bg: variant === "outlined" ? "$secondary" : "$accent10" }}
      pressStyle={{
        bg: variant === "outlined" ? "$secondary" : "$accent10",
        opacity: variant === "outlined" ? 1 : 0.9,
      }}
      {...props}
    />
  );
}
