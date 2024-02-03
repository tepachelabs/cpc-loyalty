import { log } from '@logtail/next'

import { Button } from '~/components/button.component'

export default function Home () {
  log.info('Page visited: Home')

  return (
    <main>
      <h1>Loyalty</h1>
      <Button/>
    </main>
  )
}
