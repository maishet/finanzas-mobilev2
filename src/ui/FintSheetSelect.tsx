import { Paragraph, XStack, type XStackProps } from 'tamagui'

interface FintSheetSelectProps extends XStackProps {
  label: string
  value?: string
}

export function FintSheetSelect({ label, value, ...props }: FintSheetSelectProps) {
  return (
    <XStack items="center" justify="space-between" borderColor="$color5" borderWidth={1} rounded="$5" p="$3" {...props}>
      <Paragraph color="$color10">{label}</Paragraph>
      <Paragraph fontWeight="700">{value ?? 'Seleccionar'}</Paragraph>
    </XStack>
  )
}
