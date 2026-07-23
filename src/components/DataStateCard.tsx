import { useTranslation } from 'react-i18next'
import { Paragraph, YStack } from 'tamagui'
import { FintButton, FintCard } from '../ui'

export function DataStateCard({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const { t } = useTranslation()
  return (
    <FintCard bg="$accent1" borderColor="$accent4" items="center">
      <YStack gap="$3" items="center">
        <Paragraph color="$accent11" text="center" fontWeight="600">{message}</Paragraph>
        {onRetry ? <FintButton size="$3" variant="outlined" onPress={onRetry}>{t('actions.retry')}</FintButton> : null}
      </YStack>
    </FintCard>
  )
}
