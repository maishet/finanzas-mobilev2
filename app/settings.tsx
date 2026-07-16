import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Mail, Plus, RefreshCw, Save, Trash2 } from '@tamagui/lucide-icons-2'
import * as WebBrowser from 'expo-web-browser'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Paragraph, Spinner, XStack, YStack } from 'tamagui'
import { financeApi } from '../src/api/finance'
import type { GmailSource } from '../src/api/types'
import { DataStateCard } from '../src/components/DataStateCard'
import { Screen } from '../src/components/Screen'
import { FintButton, FintCard, FintInput } from '../src/ui'

export default function SettingsScreen() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const sourcesQuery = useQuery({ queryKey: ['gmail-sources'], queryFn: financeApi.listGmailSources, retry: false })
  const connectMutation = useMutation({
    mutationFn: async () => {
      const { authUrl } = await financeApi.startGmailOAuth()
      return WebBrowser.openAuthSessionAsync(authUrl, 'finanzasmobilev2://gmail-connected')
    },
    onSuccess: async () => {
      await Promise.all([queryClient.invalidateQueries({ queryKey: ['gmail-sources'] }), queryClient.invalidateQueries({ queryKey: ['me'] })])
    },
  })

  return (
    <Screen isRefreshing={sourcesQuery.isRefetching} onRefresh={() => sourcesQuery.refetch()}>
      <FintCard bg="#0F5D73" borderColor="#28788C" gap="$3">
        <XStack items="center" gap="$3"><YStack width={48} height={48} rounded="$10" bg="rgba(93,214,229,0.14)" items="center" justify="center"><Mail size={24} color="#5DD6E5" /></YStack><YStack flex={1}><Paragraph color="#F4FBFD" fontFamily="$heading" fontSize="$6" fontWeight="800">{t('gmail.title')}</Paragraph><Paragraph color="#B9D7E1">{t('gmail.description')}</Paragraph></YStack></XStack>
        <FintButton bg="#5DD6E5" color="#062536" disabled={connectMutation.isPending || (sourcesQuery.data?.filter((source) => source.status === 'active').length ?? 0) >= 3} icon={connectMutation.isPending ? <Spinner /> : <Plus size={18} />} onPress={() => connectMutation.mutate()}>{t('gmail.connect')}</FintButton>
      </FintCard>
      {sourcesQuery.isLoading ? <DataStateCard message={t('states.loading')} /> : null}
      {sourcesQuery.error ? <DataStateCard message={sourcesQuery.error instanceof Error ? sourcesQuery.error.message : t('states.error')} /> : null}
      {(sourcesQuery.data ?? []).filter((source) => source.status === 'active').map((source) => <GmailSourceCard key={source.id} source={source} />)}
      {!sourcesQuery.isLoading && (sourcesQuery.data ?? []).filter((source) => source.status === 'active').length === 0 ? <DataStateCard message={t('gmail.empty')} /> : null}
    </Screen>
  )
}

function GmailSourceCard({ source }: { source: GmailSource }) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [senders, setSenders] = useState(source.senderFilters.join(', '))
  const syncMutation = useMutation({ mutationFn: () => financeApi.syncGmailSource(source.id), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['pending-movements'] }); queryClient.invalidateQueries({ queryKey: ['gmail-sources'] }) } })
  const saveMutation = useMutation({ mutationFn: () => financeApi.updateGmailSource(source.id, { labelIds: ['INBOX'], senderFilters: senders.split(/[\n,;]+/).map((value) => value.trim().toLowerCase()).filter(Boolean) }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gmail-sources'] }) })
  const deleteMutation = useMutation({ mutationFn: () => financeApi.disconnectGmailSource(source.id), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['gmail-sources'] }); queryClient.invalidateQueries({ queryKey: ['me'] }) } })
  const pending = syncMutation.isPending || saveMutation.isPending || deleteMutation.isPending
  return (
    <FintCard gap="$4">
      <XStack items="center" gap="$3"><Mail size={21} color="$primary" /><YStack flex={1}><Paragraph color="$color12" fontWeight="800">{source.emailAddress}</Paragraph><Paragraph color="$color10" fontSize="$1">{source.lastSyncAt ? t('gmail.lastSync', { date: new Date(source.lastSyncAt).toLocaleString() }) : t('gmail.notSynced')}</Paragraph></YStack></XStack>
      <YStack gap="$2"><Paragraph color="$color10" fontWeight="700">{t('gmail.senders')}</Paragraph><Paragraph color="$color10" fontSize="$1">{t('gmail.sendersHelp')}</Paragraph><FintInput multiline minH={88} textAlignVertical="top" placeholder="alertas@banco.com, pagos@tienda.com" value={senders} onChangeText={setSenders} /></YStack>
      <XStack gap="$2"><FintButton flex={1} variant="outlined" disabled={pending} icon={<RefreshCw size={16} />} onPress={() => syncMutation.mutate()}>{t('gmail.sync')}</FintButton><FintButton flex={1} disabled={pending} icon={<Save size={16} />} onPress={() => saveMutation.mutate()}>{t('actions.save')}</FintButton></XStack>
      <FintButton variant="outlined" color="$red10" borderColor="$red6" disabled={pending} icon={<Trash2 size={16} />} onPress={() => deleteMutation.mutate()}>{t('gmail.disconnect')}</FintButton>
    </FintCard>
  )
}
