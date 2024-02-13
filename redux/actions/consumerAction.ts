import { API } from "@/app.config"
import axios from "axios"

// export async function updatePlaceInformation(data: any) {
//   // Get Token & Set Headers
//   const headers = { headers: { Authorization: `Bearer ${ 'MjYyMzpHOVkzWFlGNjZG' }` } }
//   return axios.post(`${ API.UPDATE_PLACE }`, data, headers)
//   .then((res) => {
//     if (res.status === 200) {
//       return res
//     }
//     throw new Error('Error on Fetching Data')
//   })
//   .catch((err) => err)
// }

export async function updatePlaceInformation(data: any) {
  const headers = { headers: { Authorization: `Bearer ${ 'MjYyMzpHOVkzWFlGNjZG' }` } }
  const response = await axios.post(`${ API.UPDATE_PLACE }`, data, headers)
  return response
}