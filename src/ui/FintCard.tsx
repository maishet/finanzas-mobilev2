import { Card, type CardProps } from 'tamagui'

export function FintCard(props: CardProps) {
  return (
    <Card
      bg="$card"
      borderColor="$borderColor"
      borderWidth={1}
      p="$4"
      rounded={14}
      {...props}
    />
  )
}
