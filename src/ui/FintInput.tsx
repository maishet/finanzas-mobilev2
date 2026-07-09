import { Input, type InputProps } from 'tamagui'

export function FintInput(props: InputProps) {
  return (
    <Input
      bg="$color2"
      borderColor="$color5"
      color="$color12"
      placeholderTextColor="$color9"
      focusStyle={{ borderColor: '$accent8' }}
      rounded="$5"
      size="$4"
      {...props}
    />
  )
}
