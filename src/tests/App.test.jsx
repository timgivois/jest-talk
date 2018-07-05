import App from '../App'
import React from 'react'
import { shallow } from 'enzyme'

describe('App', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(
      <App />
    )
  })

  test('should have the `th` "testems"', () => {
    expect(
      wrapper.contains(<th>testems</th>)
    ).toBe(true)
  })

  test('should have a `button` element', () => {
    expect(
      wrapper.containsMatchingElement(
        <button>Add testem</button>
      )
    ).toBe(true)
  })

  test('should have an `input` element', () => {
    expect(
      wrapper.containsMatchingElement(
        <input />
      )
    ).toBe(true)
  })

  test('`button` should be disabled', () => {
    const button = wrapper.find('button').first()
    expect(
      button.props().disabled
    ).toBe(true)
  })

  describe('the user populates the input', () => {
    const testem = 'Vancouver'

    beforeEach(() => {
      const input = wrapper.find('input').first()
      input.simulate('change', {
        target: { value: testem }
      })
    })

    test('should update the state property `testem`', () => {
      expect(
        wrapper.state().testem
      ).toEqual(testem)
    })

    test('should enable `button`', () => {
      const button = wrapper.find('button').first()
      expect(
        button.props().disabled
      ).toBe(false)
    })

    describe('and then clears the input', () => {
      beforeEach(() => {
        const input = wrapper.find('input').first()
        input.simulate('change', {
          target: { value: '' }
        })
      })

      test('should disable `button`', () => {
        const button = wrapper.find('button').first()
        expect(
          button.props().disabled
        ).toBe(true)
      })
    })

    describe('and then submtests the form', () => {
      beforeEach(() => {
        const form = wrapper.find('form').first()
        form.simulate('submtest', {
          preventDefault: () => {},
        })
      })

      test('should add the testem to state', () => {
        expect(
          wrapper.state().testems
        ).toContain(testem)
      })

      test('should render the testem in the table', () => {
        expect(
          wrapper.containsMatchingElement(
            <td>{testem}</td>
          )
        ).toBe(true)
      })

      test('should clear the input field', () => {
        const input = wrapper.find('input').first()
        expect(
          input.props().value
        ).toEqual('')
      })

      test('should disable `button`', () => {
        const button = wrapper.find('button').first()
        expect(
          button.props().disabled
        ).toBe(true)
      })
    })
  })
})
