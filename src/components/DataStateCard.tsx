import { Paragraph } from 'tamagui'
import { FintCard } from '../ui'

export function DataStateCard({ message }: { message: string }) {
  return (
    <FintCard bg="$accent1" borderColor="$accent4">
      <Paragraph color="$accent11" text="center" fontWeight="600">{message}</Paragraph>
    </FintCard>
  )
}
