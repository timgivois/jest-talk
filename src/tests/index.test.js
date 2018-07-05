describe('Common Matchers', () => {
  test('object assignment', () => {
    const data = {one: 1}
    data['two'] = 2

    expect(data).toEqual({one: 1, two: 2})
  })

  test('increasing a positive number is not zero', () => {
    const a = 1

    expect(a+1).not.toBe(0)
  })
})

describe('Truthiness Matchers', () => {
  test('zero', () => {
    const z = 0

    expect(z).not.toBeNull()
    expect(z).toBeDefined()
    expect(z).not.toBeUndefined()
    expect(z).not.toBeTruthy()
    expect(z).toBeFalsy()
  })
})

describe('Numbers Matchers', () => {
  test('adding a floating point', () => {
    const value = 0.1 + 0.2

    // this will not be True as 0.1 + 0.2 = 0.30000000000000004
    // expect(value).toBe(0.3)
    expect(value).toBeCloseTo(0.3, 5)
  })
})

describe('Mocks', () => {
  test('computeList calls callback in array', () => {
    function computeList(items, callback) {
      for (let index = 0; index < items.length; index++) {
        callback(items[index])
      }
    }

    const mockCallback = jest.fn()
                          .mockReturnValue(32)

    computeList([0, 1], mockCallback)

    // The mock function is called twice
    expect(mockCallback.mock.calls.length).toBe(2)

    // The first argument of the first call to the function was 0
    expect(mockCallback.mock.calls[0][0]).toBe(0)
  })
})

describe('Snapshots', () => {
  const users = [{name: 'tuna'}, {name: 'bread'}, {name: 'pasta'}, {name: 'beans'}, {name: 'tomato'}]
  const filterUsers = name => users.filter(user => user.name.includes(name))


  test('filters items', () => {
    expect(filterUsers('b')).toMatchSnapshot()
  })
})
