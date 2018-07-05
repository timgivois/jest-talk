// users.js
import axios from 'axios'

class Items {
  static all() {
    return axios.get('/users').then(resp => resp.data)
  }
}

export default Items
