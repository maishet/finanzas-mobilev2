import { Globe2, LogOut, Mail, Moon, Sun } from '@tamagui/lucide-icons-2'
import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { Image, Text } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { Paragraph, Separator, Sheet, XStack, YStack } from 'tamagui'
import { useAuth } from '../auth/AuthProvider'
import { useThemeMode } from '../theme/ThemeMode'
import { useSheetBackHandler } from '../hooks/useSheetBackHandler'

interface AppHeaderProps {
  title: string
}

export function AppHeader({ title }: AppHeaderProps) {
  const { t, i18n } = useTranslation()
  const { themeMode, toggleThemeMode } = useThemeMode()
  const { session, signOut } = useAuth()
  const insets = useSafeAreaInsets()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const metadata = session?.user.user_metadata ?? {}
  const avatarUrl = typeof metadata.avatar_url === 'string' ? metadata.avatar_url : typeof metadata.picture === 'string' ? metadata.picture : null
  const displayName = typeof metadata.full_name === 'string' ? metadata.full_name : typeof metadata.name === 'string' ? metadata.name : typeof metadata.display_name === 'string' ? metadata.display_name : session?.user.email
  const initial = displayName?.slice(0, 1).toUpperCase() || 'F'
  const closeMenu = useCallback(() => setIsMenuOpen(false), [])
  useSheetBackHandler(isMenuOpen, closeMenu)

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en')
  }

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
      <XStack bg="$card" borderBottomColor="$borderColor" borderBottomWidth={1} px="$4" py="$3" items="center" justify="space-between" gap="$3">
        <XStack items="center" gap="$3" flex={1} minW={0}>
          <YStack width={38} height={38} rounded="$8" overflow="hidden" bg="$accent9">
            <Image source={require('../../assets/images/icon.png')} style={{ width: 38, height: 38 }} resizeMode="cover" />
          </YStack>
          <YStack flex={1} minW={0}>
            <Paragraph color="$color9" fontSize="$1" fontWeight="800">Fint</Paragraph>
            <Paragraph color="$color12" fontFamily="$heading" fontSize="$5" fontWeight="800" lineHeight="$5" numberOfLines={1}>{title}</Paragraph>
          </YStack>
        </XStack>

        <YStack
          width={40}
          height={40}
          rounded={999}
          overflow="hidden"
          bg="$accent3"
          borderColor="$accent6"
          borderWidth={1}
          items="center"
          justify="center"
          pressStyle={{ bg: '$accent4' }}
          onPress={() => setIsMenuOpen(true)}
          aria-label={t('header.openMenu')}
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: 40, height: 40, borderRadius: 999 }}
              resizeMode="cover"
              accessibilityLabel={displayName ?? undefined}
            />
          ) : (
            <Text style={{ color: '#0F505A', fontFamily: 'InterBold', fontSize: 16, fontWeight: '700', includeFontPadding: false, lineHeight: 40, textAlign: 'center', textAlignVertical: 'center', width: 40 }}>{initial}</Text>
          )}
        </YStack>
      </XStack>

      <Sheet modal open={isMenuOpen} onOpenChange={setIsMenuOpen} snapPointsMode="fit" dismissOnSnapToBottom zIndex={100_000}>
        <Sheet.Overlay bg="rgba(0,0,0,0.4)" />
        <Sheet.Handle bg="$color6" />
        <Sheet.Frame bg="$popover" gap={0} px="$4" pt="$2" pb={Math.max(insets.bottom, 16)} rounded={14}>
          <Paragraph color="$color9" fontWeight="800" fontSize="$2" mb="$2">
            {t('header.menuTitle')}
          </Paragraph>

          <MenuRow
            icon={themeMode === 'dark' ? <Moon size={18} color="$accent10" /> : <Sun size={18} color="$accent10" />}
            label={themeMode === 'dark' ? t('header.darkMode') : t('header.lightMode')}
            onPress={toggleThemeMode}
          />
          <MenuRow icon={<Globe2 size={18} color="$color10" />} label={i18n.language === 'en' ? 'English' : 'Español'} onPress={toggleLanguage} />
          <MenuRow icon={<Mail size={18} color="$primary" />} label={t('gmail.preferences')} onPress={() => { setIsMenuOpen(false); router.push('/settings') }} />

          <Separator my="$1" />

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
