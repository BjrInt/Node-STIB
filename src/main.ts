import { 
  tokenQuery,
  groupedQueries
} from './helpers'
import type { CredentialsResponse } from './types'

export class Stib{
  token: string

  constructor(token?:string){
    this.token = token
  }

  async refreshToken(cKey: string, cSecret:string) : Promise<CredentialsResponse>{
    try{
      const response = await tokenQuery(cKey, cSecret)
      this.token = response.access_token

      return response
    }
    catch(err){
      return err
    }
  }

  getLineDescription(lines: string[] | number[]){
    return groupedQueries(
      lines, 
      this.token,
      'NETWORK_DESCRIPTION',
      'LINES',
      (data: any[]) => data.map(d => d.lines).flat()
    )
  }

  getStopDescription(stops: string[] | number[]){
    return groupedQueries(
      stops, 
      this.token,
      'NETWORK_DESCRIPTION',
      'STOPS',
      (data: any[]) => data.map(d => d.points).flat()
    )
  }

  getVehiclePosition(lines: string[] | number[]){
    return groupedQueries(
      lines, 
      this.token,
      'OPERATION_MONITORING',
      'VEHICLE_POSITION',
      (data: any[]) => data.map(d => d.lines).flat()
    )
  }

  getMessageByLine(lines: string[] | number[]){
    return groupedQueries(
      lines, 
      this.token,
      'OPERATION_MONITORING',
      'MESSAGE_BY_LINE',
      (data: any[]) => data.map(d => d.messages).flat()
    )
  }

  getWaitingTime(stops: string[] | number[]){
    return groupedQueries(
      stops, 
      this.token,
      'OPERATION_MONITORING',
      'WAITING_TIME',
      (data: any[]) => data.map(d => d.points).flat()
    )
  }
}

// export default Stib