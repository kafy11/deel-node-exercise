import { getTimePeriod } from "../getTimePeriod";

describe('getTimePeriod', () => {
    it('should return error if no time period informed in query params', () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        getTimePeriod({ query: {}}, res)

        expect(res.status).toHaveBeenCalledWith(400)
    })

    it('should return error if any date is invalid', () => {
        const resStart = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        getTimePeriod({ query: {
            start: 'a',
            end: `${(new Date())}`
        }}, resStart)

        expect(resStart.status).toHaveBeenCalledWith(400)

        const resEnd = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        getTimePeriod({ query: {
            start: `${(new Date())}`,
            end: 'a'
        }}, resEnd)

        expect(resEnd.status).toHaveBeenCalledWith(400)
    })

    it('should return error if invalid time period', () => {
        const resStart = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        getTimePeriod({ query: {
            start: `${new Date(2022,4,2)}`,
            end: `${new Date(2022,4,1)}`
        }}, resStart)

        expect(resStart.status).toHaveBeenCalledWith(400)

        const resEnd = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        getTimePeriod({ query: {
            start: `${(new Date())}`,
            end: 'a'
        }}, resEnd)

        expect(resEnd.status).toHaveBeenCalledWith(400)
    })

    it('should add the period to the red and pass', () => {
        const period = {
            start: new Date(2022,4,1),
            end: new Date(2022,4,2)
        }
        let req = { 
            query: {
                start: `${period.start}`,
                end: `${period.end}`
            }
        }
        const next = jest.fn()
        getTimePeriod(req, undefined, next)

        expect(req).toEqual({
            ...req,
            period
        })
        expect(next).toHaveBeenCalled()
    })
})