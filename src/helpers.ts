import { request } from 'https'
import { Buffer } from 'buffer'

import { 
  BASE_URL,
  ENDPOINTS,
  LIMIT_QUERY_PARAM,
  RATE_LIMITS
} from './constants'
import type { CredentialsResponse } from './types'

export const base64Encode = (str: string) : string => Buffer.from(str).toString('base64')

export const _uniq = (ar: any[]) : any[] => [...new Set(ar)]

export const splitInSubgroupOf = (a: any[], size: number) : any[] => {
  const subgroups = a.length / size 
  const returnValue = []

  for(let i=0; i< subgroups; i++){
    returnValue.push(
      [...a.slice(i * size, (i+1)*size)]
    )
  }

  return returnValue
}

export const httpQuery = (token: string, endpoint: string, queryParams: number[] | string[]) : Promise<any[]> => new Promise((resolve, reject) => {
  const options = {
    method: 'GET',
    hostname: BASE_URL,
    path: `${endpoint}${queryParams.join('%2C')}`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  
  const req = request(options, response => {
    const chunks: any[] = []
  
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
        else if(ret.match('Message throttled out'))
          return reject({error: 'RATE_LIMIT_EXCEEDED'})
        
        return reject({error: 'INVALID_RESPONSE'})
      }
    })

    response.on('error', err => reject(err))
  })
  
  req.end()
})

export const tokenQuery = (cKey: string, cSecret: string) : Promise<CredentialsResponse> => new Promise((resolve, reject) => {
  const options = {
    method: 'POST',
    hostname: BASE_URL,
    path: ENDPOINTS.TOKEN,
    headers: {
      Authorization: `Basic ${base64Encode(cKey+':'+cSecret)}`
    }
  }
  
  const req = request(options, response => {
    const chunks: any[] = []
  
    response.on('data', c => { chunks.push(c) })
  
    response.on('end', () => {
      const ret = Buffer.concat(chunks).toString()
      try{
        const json = JSON.parse(ret)
        return resolve(json)
      }
      catch(err){        
        return reject(err)
      }
    })

    response.on('error', err => reject(err))
  })
  
  req.end()
})

export const groupedQueries = (arg: number[] | string[], token: string, endpoint: string, resource: string, responseCallback: (ar: any[]) => any[]) => {
  return new Promise<any[]>((resolve, reject) => {
    if(!token)
      return reject({error: 'MISSING_CREDENTIALS'})
    
    if(arg.length > LIMIT_QUERY_PARAM[endpoint][resource] * RATE_LIMITS[endpoint])
      return reject({error: 'RATE_LIMIT_EXCEEDED'})
    
    const queries = splitInSubgroupOf(_uniq(arg), LIMIT_QUERY_PARAM[endpoint][resource])
                    .map(q => httpQuery(token, ENDPOINTS[endpoint][resource], q))

    return Promise.all(queries)
            .then(data => resolve( responseCallback(data) ))
            .catch(err => reject(err))
  })
}