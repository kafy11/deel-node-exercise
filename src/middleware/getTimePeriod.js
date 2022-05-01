
export const getTimePeriod = async (req, res, next) => {
    const { query } = req
    if(!query.start || !query.end)
        return res.status(400).json({
            error: 'No time period informed'
        })

    const period = {
        start: new Date(query.start),
        end: new Date(query.end)
    }

    if(isNaN(period.start.getTime()) || isNaN(period.end.getTime()))
        return res.status(400).json({
            error: 'Invalid date'
        })

    if(period.start >= period.end)
        return res.status(400).json({
            error: 'Invalid time period'
        })

    req.period = period
    next()
}