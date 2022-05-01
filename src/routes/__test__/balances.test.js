import request from 'supertest'
import app from '../../app'
import { Profile } from '../../model'
import { profiles } from '../../../scripts/seedData/profiles'

describe('/balances/deposit/:userId', () => {
    it('cannot deposit money if not authenticated', async () => {
        await request(app)
            .post('/balances/deposit/1')
            .send()
            .expect(401)
    })

    it('cannot deposit money if user not exists', async () => {
        await request(app)
            .post('/balances/deposit/0')
            .set('profile_id', 1)
            .send()
            .expect(404)
    })
    
    it('cannot deposit more than 25% his total of jobs to pay', async () => {
        await request(app)
            .post('/balances/deposit/1')
            .set('profile_id', 1)
            .send({
                amount: 110
            })
            .expect(400)
    })
    
    it('should add the amount to the balance of the client', async () => {
        await request(app)
            .post('/balances/deposit/1')
            .set('profile_id', 1)
            .send({
                amount: 100
            })
            .expect(200)

        const client = await Profile.findOne({ where: { id: 1 }})
        expect(client.balance).toBe(profiles[0].balance + 100)
    })
})
