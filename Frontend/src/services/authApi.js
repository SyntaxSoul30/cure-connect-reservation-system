import { httpClient } from './httpClient'

const authPath = '/api/v1/auth'

export async function registerPatient(payload) {
  const body = {
    firstName: payload.firstName ?? '',
    lastName: payload.lastName ?? '',
    mobileNumber: payload.mobileNumber ?? payload.phone ?? '',
    email: payload.email ?? '',
    password: payload.password ?? '',
    preferredLocation: payload.preferredLocation ?? '',
    creditCardNumber: payload.creditCardNumber ?? '',
    cardholderName: payload.cardholderName ?? '',
    expirationDate: payload.expirationDate ?? '',
    billingZip: payload.billingZip ?? '',
    cvv: payload.cvv ?? '',
  }

  const { data } = await httpClient.post(`${authPath}/register`, body)
  return data
}


export async function loginUser(payload) {
  const body = {
    email: payload.email ?? '',
    password: payload.password ?? '',
  }

  const { data } = await httpClient.post(`${authPath}/login`, body)
  return data
}

export async function logoutUser() {
  const { data } = await httpClient.get(`${authPath}/logout`)
  return data
}

export default httpClient
