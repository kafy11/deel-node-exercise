export const expectJobsFromProfile = (jobs, profileId) => {
    expect(jobs.find(({ Contract }) => {
        return Contract && 
               Contract.ClientId !== profileId && 
               Contract.ContractorId !== profileId
    })).toBe(undefined)
}

export const expectUnpaidJobs = (jobs) => {
    expect(jobs.find(({ paid }) => paid)).toBe(undefined)
}