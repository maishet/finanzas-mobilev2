import { Card, type CardProps } from 'tamagui'

export function FintCard(props: CardProps) {
  return (
    <Card
      bg="$color1"
      borderColor="$color4"
      borderWidth={1}
      p="$4"
      rounded="$7"
      {...props}
    />
  )
}
