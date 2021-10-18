import { 
  httpQuery,
  groupedQueries
} from './helpers.mjs'
import { 
  ENDPOINTS,
} from './constants.mjs'

class Stib{
  constructor(token){
    this.token = token
  }

  async refreshToken(cKey, cSecret){
    const response = await httpQuery([cKey, cSecret], ENDPOINTS.TOKEN, [])
    this.token = response.access_token

    return response
  }

  getLineDescription(lines){
    return groupedQueries(
      lines, 
      this.token,
      'NETWORK_DESCRIPTION',
      'LINES',
      data => data.map(d => d.lines).flat()
    )
  }

  getStopDescription(stops){
    return groupedQueries(
      stops, 
      this.token,
      'NETWORK_DESCRIPTION',
      'STOPS',
      data => data.map(d => d.points).flat()
    )
  }

  getVehiclePosition(lines){
    return groupedQueries(
      lines, 
      this.token,
      'OPERATION_MONITORING',
      'VEHICLE_POSITION',
      data => data.map(d => d.lines).flat()
    )
  }

  getMessageByLine(lines){
    return groupedQueries(
      lines, 
      this.token,
      'OPERATION_MONITORING',
      'MESSAGE_BY_LINE',
      data => data.map(d => d.messages)
    )
  }

  getWaitingTime(stops){
    return groupedQueries(
      stops, 
      this.token,
      'OPERATION_MONITORING',
      'WAITING_TIME',
      data => data.map(d => d.points).flat()
    )
  }
}

export default Stib