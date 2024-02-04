import { log } from '@logtail/next'

import { Button } from '~/components/button.component'

console.log('IMPORT: ', process.env.TEPACHE_TOKEN)

export default function Home () {
  console.log('RENDER: ', process.env.TEPACHE_TOKEN)
  log.info('Page visited: Home')

  return (
    <main>
      <h1>Loyalty</h1>
      <Button/>
    </main>
  )
}
