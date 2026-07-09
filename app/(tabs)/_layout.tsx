import { Tabs } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'tamagui'
import { Banknote, ChartNoAxesCombined, CreditCard, ListChecks } from '@tamagui/lucide-icons-2'
import { AppHeader } from '../../src/components/AppHeader'

export default function TabLayout() {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent10.val,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: theme.background.val,
          borderTopColor: theme.borderColor.val,
        },
        headerStyle: {
          backgroundColor: theme.background.val,
          borderBottomColor: theme.borderColor.val,
        },
        headerTintColor: theme.color.val,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: t('tabs.dashboard'),
          header: () => <AppHeader title={t('tabs.dashboard')} />,
          tabBarIcon: ({ color }) => <ChartNoAxesCombined color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: t('tabs.accounts'),
          header: () => <AppHeader title={t('tabs.accounts')} />,
          tabBarIcon: ({ color }) => <CreditCard color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="movements"
        options={{
          title: t('tabs.movements'),
          header: () => <AppHeader title={t('tabs.movements')} />,
          tabBarIcon: ({ color }) => <Banknote color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="debts"
        options={{
          title: t('tabs.debts'),
          header: () => <AppHeader title={t('tabs.debts')} />,
          tabBarIcon: ({ color }) => <ListChecks color={color as any} />,
        }}
      />
    </Tabs>
  )
}
