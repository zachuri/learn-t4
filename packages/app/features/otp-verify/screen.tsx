import { Input, YStack } from '@t4/ui'
import React from 'react'

export function OtpVerifyScreen() {
  return (
    <YStack flex={1} justifyContent='center' alignItems='center' space>
      <Input
        autoCapitalize='none'
        placeholder='Code'
      />
    </YStack>
  )
}
