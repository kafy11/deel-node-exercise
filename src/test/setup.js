import 'regenerator-runtime/runtime'
import { seed } from '../../scripts/seedDb'

beforeEach(async () => {
    await seed()
})