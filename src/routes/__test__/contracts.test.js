import request from 'supertest'
import app from '../../app'
import { contracts } from '../../../scripts/seedData/contracts'

describe('/contracts', () => {
    it('cannot fetch all contracts if not authenticated', async () => {
        await request(app)
             .get('/contracts')
             .send()
             .expect(401)
    })
     
    it('should only fetch contracts from same profile', async () => {
        const profile = 1
        const response = await request(app)
             .get('/contracts')
             .set('profile_id', profile)
             .send()
             .expect(200)

        expect(response.body.find(({ ClientId, ContractorId }) => {
            return ClientId !== profile && ContractorId !== profile
        })).toBe(undefined)
    })

    it('should only fetch non terminated contracts', async () => {
        const profile = 1
        const response = await request(app)
             .get('/contracts')
             .set('profile_id', profile)
             .send()
             .expect(200)

        expect(response.body.find(({ status }) => {
            return status === 'terminated'
        })).toBe(undefined)
    })
})

describe('/contracts/:id', () => {
    it('cannot fetch a contract by id if not authenticated', async () => {
        await request(app)
            .get('/contracts/1')
            .send()
            .expect(401)
    })
    
    it('can fetch a contract by id if it is from the same profile', async () => {
        await request(app)
            .get('/contracts/1')
            .set('profile_id', contracts[0].ClientId)
            .send()
            .expect(200)
    
        await request(app)
            .get('/contracts/1')
            .set('profile_id', contracts[0].ContractorId)
            .send()
            .expect(200)
    })
    
    it('cannot fetch a contract by id if it is not from the same profile', async () => {
        await request(app)
            .get('/contracts/1')
            .set('profile_id', 2)
            .send()
            .expect(401)
    })
})
