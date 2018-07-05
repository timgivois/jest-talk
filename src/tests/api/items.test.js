// users.test.js
import axios from 'axios'
import Items from '../../api/items'

jest.mock('axios')

describe('Users api', () => {
  test('should fetch users', () => {
    const resp = {data: [{name: 'Tuna'}]}
    axios.get.mockImplementation(() => Promise.resolve(resp))

    return Items.all().then(users => expect(users).toEqual(resp.data))
  })
})
