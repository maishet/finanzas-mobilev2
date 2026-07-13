import { Paragraph, XStack, type XStackProps } from 'tamagui'

interface FintSheetSelectProps extends XStackProps {
  label: string
  value?: string
}

export function FintSheetSelect({ label, value, ...props }: FintSheetSelectProps) {
  return (
    <XStack items="center" justify="space-between" bg="$muted" borderColor="$input" borderWidth={1} rounded={14} p="$3" {...props}>
      <Paragraph color="$mutedForeground">{label}</Paragraph>
      <Paragraph fontWeight="700">{value ?? 'Seleccionar'}</Paragraph>
    </XStack>
  )
}
