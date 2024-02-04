'use client'

import { log } from '@logtail/next'

import { css } from '../../styled-system/css'

export const Button = () => {
  function onSendLog () {
    console.log('CLICKED: ', process.env.TEPACHE_TOKEN)
    console.log('CLICKED: ', process.env.NEXT_PUBLIC_TEPACHE_TOKEN)
    log.info('Click event')
    log.error('Error event')
  }

  return (
    <div className={ css({ fontSize: '2xl', fontWeight: 'bold' }) }>
      <button onClick={ onSendLog }>Send log</button>
    </div>
  )
}
