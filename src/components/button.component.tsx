'use client'

import { log } from '@logtail/next'

import { css } from '../../styled-system/css'

export const Button = () => {
  function onSendLog () {
    log.info('Click event')
    log.error('Error event')
  }

  return (
    <div className={ css({ fontSize: '2xl', fontWeight: 'bold' }) }>
      <button onClick={ onSendLog }>Send log</button>
    </div>
  )
}
