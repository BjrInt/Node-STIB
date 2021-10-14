import { request } from 'https'
import { 
  BASE_URL,
  ENDPOINTS,
  LIMIT_QUERY_PARAM
} from './constants.mjs'


Array.prototype.splitInSubgroupOf = function(size){  
  const subgroups = this.length / size 
  const newThis = []

  for(let i=0; i< subgroups; i++){
    newThis.push(
      [...this.slice(i * size, (i+1)*size)]
    )
  }

  return newThis
}

const httpQuery = (token, endpoint, queryParams) => new Promise((resolve, reject) => {
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

export const queryLines = (token, lines=[]) => new Promise((resolve, reject) => {
  const queries = lines.splitInSubgroupOf(LIMIT_QUERY_PARAM.NETWORK_DESCRIPTION.LINES)
                  .map(q => httpQuery(token, ENDPOINTS.NETWORK_DESCRIPTION.LINES, q))
  
  Promise.all(queries)
         .then((data) => (
            resolve( data.map(d => d.lines).flat() ) 
          ))
          .catch(err => reject(err))
})