import { queryString } from 'object-query-string'
import fetch from 'node-fetch'

export type SMSParams = {
  recipient : string|number,
  message : string,
  sender ?: string,
  delayed ?: number|Date
}

export type SMSListParams = {
  from : Date,
  to : Date,
  direction ?: 'in'|'out',
  line ?: number|string
}

export type SMSList = [{
  id: number,
  date: Date,
  direction: 'in'|'out',
  source_number: string,
  destination_number: string,
  type: 'sms',
  roaming_zone ?: string,
  status: string,
  price: number,
  balance_after: number,
  line: number
}]

export type CallsParams = {
  from ?: Date,
  to ?: Date,
  since_id ?: number,
  direction ?: 'in'|'out'|'redirected',
  line ?: number,
  include_sms ?: boolean,
  sip_ids ?: boolean,
  phone_number_filter ?: string
  status ?: 'answered'|'missed'
  min_price ?: number,
  max_price ?: number,
  min_length ?: number,
  max_length ?: number,
  page ?: number,
  page_size ?: number,
}

export type CallsList = [{
  id : number,
  redirection_parent_id ?: string,
  date : Date,
  direction : 'in'|'out'|'redirected',
  source_number : string,
  destination_number : string,
  destination_name ?: string,
  length : string,
  ringing_length : string,
  status : 'answered'|'missed',
  price : number,
  price_per_minute : number,
  balance_after : number,
  line : number,
  recording ?: any,
  active_call_id ?: number,
  sip_in_call_id ?: number,
  sip_out_call_id ?: number
}]

export type ActiveCallsList = [{
  id : number,
  source_number : string,
  destination_number : string,
  destination_name ?: string,
  start_date : Date,
  answer_date ?: Date,
  price_per_minute: number,
  line : number,
}]

export type StatsParams = {
  from ?: Date,
  to ?: Date,
  direction ?: 'in'|'out'|'redirected',
  line ?: number,
  min_price ?: number,
  max_price ?: number,
  min_length ?: number,
  max_length ?: number
}

export type Stats = {
  incoming: { count: number, length: number, price: number }
  outgoing: { count: number, length: number, price: number }
  redirected: { count: number, length: number, price: number }
}

export type StatsDestinations = [{
  destination: string,
  count: number, length: number, price: number,
  price_per_minute: number,
  direction: 'in'|'out'|'redirected'
}]

export type LinesList = [{
  id: number,
  name: string,
  caller_id ?: string
  public_number ?: string,
  [index: string] : any
}]

export type PublicNumbersList = [{
  public_number: string,
  type: string
}]

export type PublicRoutesList = [{
  id: number,
  public_number: string,
  source_number: string,
  ringing_number: string,
}]

export default class Odorik {
  protected user: string
  protected password: string
  protected auth: { user : string, password : string }
  public API: string = 'https://www.odorik.cz/api/v1'

  constructor(
      user : string|number|undefined = process?.env?.ODORIK_USER,
      password: string|undefined = process?.env?.ODORIK_PASSWORD,
  ) {
    if (typeof user === 'number')
      user = user.toString()
    if (typeof user !== 'string' || !user.length)
      throw new Error('Invalid odorik username')
    else
      this.user = user

    if (typeof password !== 'string' || !password.length)
      throw new Error('Invalid odorik password')
    else
      this.password = password
    
    this.auth = { user, password }
  }

  async getBalance() : Promise<number> {
    return fetch (this.API + '/balance?' + queryString(this.auth))
        .then(parseText)
        .then(resp => parseFloat(resp))
  }

  async getSMSAllowedSenders() : Promise<Array<String>> {
    return fetch (this.API + '/sms/allowed_sender?' + queryString(this.auth))
        .then(parseText)
        .then(resp => resp.split(','))
  }

  async sendSMS(params : SMSParams) : Promise<boolean> {
    const body = new URLSearchParams(queryString({
      ...this.auth,
      recipient: params.recipient,
      message: params.message || undefined,
      sender: params.sender,
      delayed: (params.delayed instanceof Date)
          ? params.delayed.toISOString()
          : params.delayed?.toString()
    }))

    return fetch(this.API + '/sms', {method: 'POST', body })
        .then(parseText)
        .then(() => true)
  }

  async getSMSHistory(params: SMSListParams) : Promise<SMSList> {
    const body = {
      ...this.auth,
      from: params.from.toISOString(),
      to: params.to.toISOString(),
      line: params.line,
      direction: params.direction
    }

    return fetch (this.API + '/sms.json?' + queryString(body))
        .then(parseJSON)
  }

  async getLines() : Promise<Array<LinesList>> {
    return fetch (this.API + '/lines.json?' + queryString(this.auth))
        .then(parseJSON)
  }

  async getPublicNumbers() : Promise<Array<PublicNumbersList>> {
    return fetch (this.API + '/public_numbers.json?' + queryString(this.auth))
        .then(parseJSON)
  }

  async getPublicRoutes(publicNumber: string|number) : Promise<Array<PublicRoutesList>> {
    return fetch (this.API + '/public_numbers/' + publicNumber + '/routes.json?' + queryString(this.auth))
        .then(parseJSON)
  }

  async getCalls(params : CallsParams) : Promise<Array<CallsList>> {
    const body = {
      ...this.auth,
      from: params.from?.toISOString(),
      to: params.to?.toISOString(),
      since_id: params.since_id,
      direction: params.direction,
      line: params.line,
      include_sms: params.include_sms,
      sip_ids: params.sip_ids,
      phone_number_filter: params.phone_number_filter,
      status: params.status,
      min_price: params.min_price,
      max_price: params.max_price,
      min_length: params.min_length,
      max_length: params.max_length,
      page: params.page,
      page_size: params.page_size,
    }

    return fetch (this.API + '/calls.json?' + queryString(body))
        .then(parseJSON)
  }

  async getMissedCalls(params : CallsParams) : Promise<Array<CallsList>> {
    return this.getCalls({ ...params, status: 'missed' })
  }

  async getActiveCalls() : Promise<Array<ActiveCallsList>> {
    return fetch (this.API + '/active_calls.json?' + queryString(this.auth))
        .then(parseJSON)
  }

  async hangUp(activeCallId: number) : Promise<boolean> {
    return fetch (this.API + '/active_calls/' + activeCallId + '.json?' + queryString(this.auth), { method: 'DELETE' })
        .then(parseJSON)
        .then(() => true)
        .catch(() => { throw new Error(`call [${activeCallId}] not found`) })
  }

  async callback(caller: number|string, recipient: number|string, options ?: {
    delayed ?: number|Date,
    line ?: number,
    simple ?: boolean
  }) : Promise<boolean> {
    const body = new URLSearchParams(queryString({
      ...this.auth,
      caller, recipient,
      line: options?.line,
      simple: options?.simple,
      delayed: (options?.delayed instanceof Date)
          ? options?.delayed.toISOString()
          : options?.delayed?.toString(),
    }))

    return fetch (this.API + '/callback', { method: 'POST', body })
        .then(parseText)
        .then(() => true)
  }

  async getStats(params : StatsParams) : Promise<Array<Stats>> {
    const body = {
      ...this.auth,
      from: params.from?.toISOString(),
      to: params.to?.toISOString(),
      direction: params.direction,
      line: params.line,
      min_price: params.min_price,
      max_price: params.max_price,
      min_length: params.min_length,
      max_length: params.max_length,
    }

    return fetch (this.API + '/call_statistics.json?' + queryString(body))
        .then(parseJSON)
  }

  async getStatsByDestination(params : StatsParams) : Promise<Array<StatsDestinations>> {
    const body = {
      ...this.auth,
      from: params.from?.toISOString(),
      to: params.to?.toISOString(),
      direction: params.direction,
      line: params.line,
      min_price: params.min_price,
      max_price: params.max_price,
      min_length: params.min_length,
      max_length: params.max_length,
    }

    return fetch (this.API + '/call_statistics/by_destination.json?' + queryString(body))
        .then(parseJSON)
  }
}

const parseJSON = async (resp: any) : Promise<any> => {
  if (!resp.ok)
    throw new Error(`${resp.status} ${resp.statusText}`)

  const json = await resp.json()
  if (json.errors)
    throw new Error(json.errors[0])
  return json
}

const parseText = async (resp: any) : Promise<any> => {
  if (!resp.ok)
    throw new Error(`${resp.status} ${resp.statusText}`)

  const text = await resp.text()
  if (text.substr(0, 5) === 'error')
    throw new Error(text.substr(6))
  return text
}
