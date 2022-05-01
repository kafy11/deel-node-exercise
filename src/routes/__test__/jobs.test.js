import request from 'supertest'
import { Op } from 'sequelize'
import app from '../../app'
import { profiles } from '../../../scripts/seedData/profiles'
import { Profile, Job } from '../../model'
import { expectJobsFromProfile, expectUnpaidJobs } from '../../test/expects'

describe('/jobs/unpaid', () => {
    it('cannot fetch if not authenticated', async () => {
        await request(app)
             .get('/jobs/unpaid')
             .send()
             .expect(401)
    })

    it('should fetch only jobs from the profile', async () => {
        const profile = 1
        const response = await request(app)
             .get('/jobs/unpaid')
             .set('profile_id', profile)
             .send()
             .expect(200)

        expectJobsFromProfile(response.body, profile)
    })

    it('should fetch only unpaid jobs', async () => {
        const profile = 1
        const response = await request(app)
             .get('/jobs/unpaid')
             .set('profile_id', profile)
             .send()
             .expect(200)

        expectUnpaidJobs(response.body)
    })
})

describe('/jobs/:job_id/pay', () => {
    it('cannot pay if not authenticated', async () => {
        await request(app)
             .post('/jobs/1/pay')
             .send()
             .expect(401)
    })

    it('should return 404 if no job is found', async () => {
        await request(app)
             .post('/jobs/0/pay')
             .set('profile_id', 1)
             .send()
             .expect(404)
    })

    it('should return 400 and error message if not enough balance', async () => {
        const response = await request(app)
             .post('/jobs/3/pay')
             .set('profile_id', 2)
             .send()
             .expect(400)

        expect(response.body.error).not.toBe(undefined)
    })

    it('should move the balance from the client to the contractor', async () => {
        await request(app)
             .post('/jobs/1/pay')
             .set('profile_id', 1)
             .send()
             .expect(200)

        const client = profiles[0]
        const contractor = profiles[4]
        
        const newClient = await Profile.findOne({ where: { id: 1 }})
        const newContractor = await Profile.findOne({ where: { id: 5 }})

        expect(newClient.balance).toBe(client.balance - 200)
        expect(newContractor.balance).toBe(contractor.balance + 200)
    })

    it('should all the jobs of the contract as paid', async () => {
        const contract = 1
        await request(app)
             .post(`/jobs/${contract}/pay`)
             .set('profile_id', 1)
             .send()
             .expect(200)
            
        const jobs = await Job.findAll({
            where: { 
                ContractId: contract,
                paid: { [Op.not]: true }
            }
        })

        expect(jobs.length).toBe(0)
    })
})