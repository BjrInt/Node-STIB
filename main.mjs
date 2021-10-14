import { 
  httpQuery,
  splitInSubgroupOf,
} from './helpers.mjs'
import { 
  ENDPOINTS,
  LIMIT_QUERY_PARAM,  
} from './constants.mjs'
import { RATE_LIMITS } from './constants.mjs'

class Stib{
  constructor(token){
    this.token = token
  }

  getLinesDescription(lines){
    return new Promise((resolve, reject) => {
      if(lines.length > LIMIT_QUERY_PARAM.NETWORK_DESCRIPTION.LINES * RATE_LIMITS.NETWORK_DESCRIPTION)
        return reject({error: 'RATE_LIMIT_EXCEEDED'})
      
      const queries = splitInSubgroupOf(lines, LIMIT_QUERY_PARAM.NETWORK_DESCRIPTION.LINES)
                      .map(q => httpQuery(this.token, ENDPOINTS.NETWORK_DESCRIPTION.LINES, q))
      
      return Promise.all(queries)
             .then((data) => (
                resolve( data.map(d => d.lines).flat() ) 
              ))
              .catch(err => reject(err))
    })
  }

  getStopsDescription(stops){
    return new Promise((resolve, reject) => {
      if(stops.length > LIMIT_QUERY_PARAM.NETWORK_DESCRIPTION.STOPS * RATE_LIMITS.NETWORK_DESCRIPTION)
        return reject({error: 'RATE_LIMIT_EXCEEDED'})
      
      const queries = splitInSubgroupOf(stops, LIMIT_QUERY_PARAM.NETWORK_DESCRIPTION.STOPS)
                      .map(q => httpQuery(this.token, ENDPOINTS.NETWORK_DESCRIPTION.STOPS, q))

      return Promise.all(queries)
             .then((data) => (
                resolve( data.map(d => d.points).flat() ) 
              ))
              .catch(err => reject(err))
    })
  }
}

export default Stib