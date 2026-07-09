import { Globe2, LogOut, Moon, Sun } from '@tamagui/lucide-icons-2'
import { useState } from 'react'
import { Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { Paragraph, Separator, Sheet, XStack, YStack } from 'tamagui'
import { useAuth } from '../auth/AuthProvider'
import { useThemeMode } from '../theme/ThemeMode'

interface AppHeaderProps {
  title: string
}

export function AppHeader({ title }: AppHeaderProps) {
  const { t, i18n } = useTranslation()
  const { themeMode, toggleThemeMode } = useThemeMode()
  const { session, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const initial = session?.user.email?.slice(0, 1).toUpperCase() || 'F'

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en')
  }

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
      <XStack bg="$color1" borderBottomColor="$color4" borderBottomWidth={1} px="$4" py="$3" items="center" justify="space-between" gap="$3">
        <XStack items="center" gap="$3" flex={1} minW={0}>
          <YStack width={38} height={38} rounded="$8" overflow="hidden" bg="$accent9">
            <Image source={require('../../assets/images/icon.png')} style={{ width: 38, height: 38 }} resizeMode="cover" />
          </YStack>
          <YStack flex={1} minW={0}>
            <Paragraph color="$color9" fontSize="$1" fontWeight="800">Fint</Paragraph>
            <Paragraph color="$color12" fontSize="$5" fontWeight="800" lineHeight="$5" numberOfLines={1}>{title}</Paragraph>
          </YStack>
        </XStack>

        <YStack
          width={40}
          height={40}
          rounded="$10"
          bg="$accent3"
          borderColor="$accent6"
          borderWidth={1}
          items="center"
          justify="center"
          pressStyle={{ bg: '$accent4' }}
          onPress={() => setIsMenuOpen(true)}
          aria-label={t('header.openMenu')}
        >
          <Paragraph color="$accent11" fontWeight="900" fontSize="$3">{initial}</Paragraph>
        </YStack>
      </XStack>

      <Sheet modal open={isMenuOpen} onOpenChange={setIsMenuOpen} snapPoints={[36]} dismissOnSnapToBottom zIndex={100_000}>
        <Sheet.Overlay bg="rgba(0,0,0,0.4)" />
        <Sheet.Handle bg="$color6" />
        <Sheet.Frame bg="$color2" gap="$1" p="$4" rounded="$7">
          <Paragraph color="$color9" fontWeight="800" fontSize="$2" mb="$1">
            {t('header.menuTitle')}
          </Paragraph>

          <MenuRow
            icon={themeMode === 'dark' ? <Moon size={18} color="$accent10" /> : <Sun size={18} color="$accent10" />}
            label={themeMode === 'dark' ? t('header.darkMode') : t('header.lightMode')}
            onPress={toggleThemeMode}
          />
          <MenuRow icon={<Globe2 size={18} color="$color10" />} label={i18n.language === 'en' ? 'English' : 'Español'} onPress={toggleLanguage} />

          <Separator my="$2" />

          <MenuRow
            icon={<LogOut size={18} color="$red10" />}
            label={t('actions.signOut')}
            labelColor="$red10"
            onPress={() => {
              setIsMenuOpen(false)
              signOut()
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </SafeAreaView>
  )
}

function MenuRow({
  icon,
  label,
  labelColor = '$color12',
  onPress,
}: {
  icon: React.ReactNode
  label: string
  labelColor?: string
  onPress: () => void
}) {
  return (
    <XStack items="center" gap="$3" p="$3" rounded="$5" hoverStyle={{ bg: '$color3' }} pressStyle={{ bg: '$color4' }} onPress={onPress}>
      {icon}
      <Paragraph color={labelColor as never} fontWeight="700" fontSize="$4">
        {label}
      </Paragraph>
    </XStack>
  )
}
