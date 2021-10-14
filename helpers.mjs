import { request } from 'https'
import { BASE_URL } from './constants.mjs'

export const splitInSubgroupOf = (a, size) => {
  const subgroups = a.length / size 
  const returnValue = []

  for(let i=0; i< subgroups; i++){
    returnValue.push(
      [...a.slice(i * size, (i+1)*size)]
    )
  }

  return returnValue
}

export const httpQuery = (token, endpoint, queryParams) => new Promise((resolve, reject) => {
  const options = {
    method: 'GET',
    hostname: BASE_URL,
    path: `${endpoint}${queryParams.join('%2C')}`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  
  const req = request(options, response => {
    const chunks = []
  
    response.on('data', c => { chunks.push(c) })
  
    response.on('end', () => {
      const ret = Buffer.concat(chunks).toString()
      try{
        const json = JSON.parse(ret)
        return resolve(json)
      }
      catch(err){
        if(ret.match('Missing Credentials'))
          return reject({error: 'MISSING_CREDENTIALS'})
        else if(ret.match('Invalid Credentials'))
          return reject({error: 'INVALID_CREDENTIALS'})
        
        return reject(err)
      }
    })

    response.on('error', err => reject(err))
  })
  
  req.end()
})

export const Throttler = () => ({
  NETWORK_DESCRIPTION: {
    init: Date.now(),
    queries: 0,
  },
  OPERATION_MONITORING: {
    init: Date.now(),
    queries: 0,
  },
})