import { 
  httpQuery,
  splitInSubgroupOf,
  Throttler 
} from './helpers.mjs'
import { 
  DEFAULT_OPTIONS,
  ENDPOINTS,
  LIMIT_QUERY_PARAM,
} from './constants.mjs'

class Stib{
  constructor(token, options={}){
    this.token = token
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    }
    this.throttler = Throttler()
  }

  queryLines(lines){
    return new Promise((resolve, reject) => {
      const queries = splitInSubgroupOf(lines, LIMIT_QUERY_PARAM.NETWORK_DESCRIPTION.LINES)
                      .map(q => httpQuery(this.token, ENDPOINTS.NETWORK_DESCRIPTION.LINES, q))
      
      Promise.all(queries)
             .then((data) => (
                resolve( data.map(d => d.lines).flat() ) 
              ))
              .catch(err => reject(err))
    })
  }

  queryStops(){

  }
}

export default Stib