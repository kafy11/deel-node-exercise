import request from 'supertest'
import app from '../../app'

describe('/admin/best-profession', () => {
    it('cannot fetch if not authenticated', async () => {
        await request(app)
            .get('/admin/best-profession')
            .send()
            .expect(401)
    })

    it('cannot fetch if no time period', async () => {
        await request(app)
            .get('/admin/best-profession')
            .set('profile_id',1)
            .send()
            .expect(400)
    })

    it('should return the most paid profession', async () => {
        const response = await request(app)
            .get('/admin/best-profession?start=2020-08-15&end=2020-08-23')
            .set('profile_id',1)
            .send()
            .expect(200)
        expect(response.body).toBe('Programmer')
    })
})

describe('/admin/best-clients', () => {
    it('cannot fetch if not authenticated', async () => {
        await request(app)
            .get('/admin/best-clients')
            .send()
            .expect(401)
    })

    it('cannot fetch if no time period', async () => {
        await request(app)
            .get('/admin/best-clients')
            .set('profile_id',1)
            .send()
            .expect(400)
    })

    it('should limit the result by 2 as default', async () => {
        const response = await request(app)
            .get('/admin/best-clients?start=2020-08-15&end=2020-08-23')
            .set('profile_id',1)
            .send()
            .expect(200)
        expect(response.body.length).toBe(2)
    })

    it('should limit the result by the limit parameter', async () => {
        const response = await request(app)
            .get('/admin/best-clients?start=2020-08-15&end=2020-08-23&limit=1')
            .set('profile_id',1)
            .send()
            .expect(200)
        expect(response.body.length).toBe(1)
    })
})

