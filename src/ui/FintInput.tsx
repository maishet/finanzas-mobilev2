import { Input, type InputProps } from 'tamagui'

export function FintInput(props: InputProps) {
  return (
    <Input
      bg="$muted"
      borderColor="$input"
      color="$color"
      placeholderTextColor="$mutedForeground"
      focusStyle={{ borderColor: '$ring' }}
      rounded="$5"
      size="$4"
      {...props}
    />
  )
}
