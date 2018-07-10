# Jest + Enzyme
Testing your code is probably one of the most important things to do in software engineering. With testing we ensure quality of what we are building. There are many ways to test code, from end to end testing (manual testing) to unit testing (component testing in React). In this doc, we’ll cover some of the most common and effective ways to test React code using Jest, Enzyme and other great tools.


## Testing pyramid
In Agile frameworks, automated testing can be grouped into a testing pyramid. With this we can know when and where should we use one testing method or another. As seen in the pyramid, many unit-snapshot tests can be used to validate one integration test, and many integration tests can be used to validate one manual test. At the peak of the pyramid, we have the end-to-end test: manual testing of the whole application. The idea of choosing what type of tests should be used is important, as we may be testing the same thing in three different levels.

Manual testing is very slow and unmaintainable. As a starting point, we may want this type of testing in our frontend applications because they mimic how the user will see and act to our application. The problem with this is that it has a high cost of maintenance (every UI minor change may break the tests, as this tests are normally done with Selenium) and the speed to develop one of this tests may be high. It’s important to note that we don’t usually use this type of testing in frontend applications for his high costs.

Integration testing may be good to test connections between components and finding bugs in these liaisons. For example, let’s imagine we want to test that a parent component passes specific props to a child whenever a user clicks a button. The cost of maintaining and doing this tests are not very high and will test parts that we don’t tend to test with unit tests.

Unit/Snapshot testing is probably the most easy way to test components. We only care in one isolated item and its logic. If we follow the presentation-functional components division, it will even be easier to tests this. For presentational components, we’ll give the props to the component and expect a specific render (could be a good use case for snapshot). For functional testing, the tests can be more tricky, we’ll need mock a redux store to create user actions and expect redux actions to be called while we simulate events.

As rule of thumb, start with unit/snapshot testing. Pass to integration test only if necessary. Try to avoid Manual/UI Testing. For the first two steps of the pyramid, we can use Jest as our main testing tool.

# Why Jest ?

### About Jest

Jest is a testing framework created by Facebook. They use it to test JavaScript and React code. It was created under the premise of performance, features and adoptability. Jest provides an integrated “zero-configuration” experience. This is a differentiator with other popular testing frameworks like Mocha. Some of his killer features are:

Killer features:

- **Instant Feedback:** Immersive Watch mode runs only test files related to changed files.
- **Fast and sandboxed:**  It parallelizes test runs across workers and console messages are buffered and print together.
- **Snapshot Testing:** Capture snapshots of React trees or other serializable values to simplify testing and to analyze how state changes over time.
- **Built-in code coverage reports:** Supports --coverage for bringing out of the box coverage reports.
- **Zero configuration**

## Jest Matchers

### Common Matchers

Matchers are the most basic unit for testing in Jest. They are used to assert that an expected object is equal, close to, greater/less than, contains or any other logical connection to another output object. We can create different constructions with these logical connections. For more reference, check Jest documentation.

- `toBe`: It uses `Object.is` to test exact equality.
- `toEqual`: It recursively checks every field of an object or array.
-  `not`: Tests for the opposite of a matcher

```
test(‘object assignment’, () => {
 const data = {one: 1};
 data[‘two’] = 2;
 expect(data).toEqual({one: 1, two: 2});
});
```

-  **Truthiness**
	- `toBeNull` matches only null
	- `toBeUndefined` matches only undefined (We have also have `toBeDefined`)
	- `toBeTruthy` matches anything that an if statement treats as true
	- `toBeFalsy` matches anything that an if statement treats as false

```
test('zero', () => {
  const z = 0;
  expect(z).not.toBeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});
```

- **Numbers**
	- `toBe` / `toEqual`
	- `toBeGreaterThan` / `toBeLessThan`
	- `toBeGreaterThanOrEqual` / `toBeLessThanOrEqual`
	- `toBeCloseTo`- This is for floating point.

```
test('adding floating point numbers', () => {
  const value = 0.1 + 0.2;
  // It fails because in JavaScript 0.2 + 0.1 = 0.30000000000000004 jejeje.
  // expect(value).toBe(0.3);
  // This works with a precision of 5.
  expect(value).toBeCloseTo(0.3, 5);
});
```

- **Strings**
	- `toMatch` - It check strings against regular expressions

```
test('there are some coders there', () => {
	expect('Here are some coders at Wizeline').toMatch(/coders/);
});
```

- **Arrays**
	- `toContain`: It checks if the array has any particular item

```
const coders = [
	'BDragon',
       'CharlieBox',
       'FerRubio',
       'Rene',
        'Abraham'
];

test('the coders list has Rene on it', () => {
   expect(coders).toContain('Rene');
});

```

- **Exceptions**
	- `toThrow`: It tests if your function throws an error when it's called.

```
function compileAndroidCode() {
  throw new ConfigError('you are using the wrong JDK');
}

test('compiling android goes as expected', () => {
  expect(compileAndroidCode).toThrow();
  expect(compileAndroidCode).toThrow(ConfigError);

  // You can also use the exact error message or a regexp
  expect(compileAndroidCode).toThrow('you are using the wrong JDK');
  expect(compileAndroidCode).toThrow(/JDK/);
});
```

## Mocks

There are two ways to mock functions: Either by creating a mock function to use in test code, or writing a manual mock to override a module dependency.

### Example

```
function computeList(items, callback) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
}

const mockCallback = jest.fn();
computeList([0, 1, 3], mockCallback);

expect(mockCallback.mock.calls.length).toBe(3);

expect(mockCallback.mock.calls[0][0]).toBe(0);
```

## Setup and teardown

A good practice in Jest is organizing data in blocks. For this, we can use `describe` function that receives two arguments: the block name a function that will either have more organized blocks or test functions. To make it more modularized, Jest provides a set of functions that will control code execution before and after the set of tests are run.

```
describe('City Database', () => {
    beforeAll(() => {
        initEnvironment()
    })

    beforeEach(() => {
        initCityDB()
    })

    afterEach(() => {
        clearCityDB()
    })

    test('has Vienna', () => {
        expect(isCity('Vienna').toBeTruthy())
    })

    test('has San Juan', () => {
        expect(isCity('San Juan').toBeTruthy())
    })
})
```

# Snapshots

The most complex part of writing unit tests in long-term projects are their maintenance. As project evolves, code evolves and naturally, tests evolve. Certain function or component may change its output deliberately and tests may need to adapt the assertions they have.A lot of time of this adaptation has repetitive tasks as we illustrate in image . 2. Snapshot testing is a way automate this process and create unit test that could be easily overwritten and managed through time. The main benefit of snapshot testing is that we can quickly create tests for black boxes without much configuration or pain and adapt them easily to changes.

Imagine that we have a function that filters a list of objects given a certain keyword. One of the tests could be wrote as follows:

```
test('function filters users', () => {
    expect(filterUsers('b').toEqual([
        { name: 'Becky' },
        { name: 'Bob' },
        { name: 'Bryan' },
        { name: 'Bryce' }
    ]))    
})
```

But, what happens if we add users or change schema? We have to change the test, copying and pasting the assertion to make the test pass, the logic didn’t changed, only the expected output. This could happen again and again in a project. Snapshots are the solution to make this repetitive process automatic and autogenerated.

```
test('filters items', () => {
    expect(filterUsers('b')).toMatchSnapshot()
})
```

Jest has a built-in module that manages the creation and update of snapshots. It will save the snapshot in a directory `__snapshots__`. Whenever we run Jest, if that directory exists, it will compare the output with the saved output. If it’s different we can easily overwrite the saved snapshot or check in the code for a possible bug. The following is an autogenerated snapshot:

```
// Jest Snapshot v1, https://goo.gl/fbAQLP
exports[`Snapshots filters users 1`] = `
Array [
  Object {
    "name": "Becky",
  },
  Object {
    "name": "Bob",
  },
]
`;
```
# Enzyme

Everything we talked until now doesn’t have a direct connection with React. All the previous tools may be used to test the logic of our frontend application, but as we know, in frontend applications not everything is logic, we have a presentational part that should be tested. But, how can we test this? The rule of thumb is that we should test everything that isn’t static. In other words, we should test two things:

Given a set of inputs (state & props), assert what a component should output (render).
Given a user action, assert how the component behaves. The component might make a state update or call a prop-function passed to it by a parent.

That is great, but if you think it twice, what will be the output of the presentational component that we’ll be testing or snapshoting. Yes, you are right, it will be the React Tree generated. Enzyme is the tool that we’ll use to easily without problems React Trees that could even be isolated (not rendering child components).

Enzyme is a testing tool developed and managed by Airbnb. Enzyme uses several of the utilities provided by React to build its API. The API reduces boilerplate code.


```
import App from '../App'
describe('App component', () => {
  test('should shallow correctly', () => {
      shallow(
        <App />
      ).toMatchSnapshot()
  })
  test('should mount correctly', () => {
      render(
        <App />
      ).toMatchSnapshot()
  })
  test('should render correctly', () => {
      mount(
        <App />
      ).toMatchSnapshot()
  })
})
`;
```


Enzyme has three methods for rendering React components. These methods give different results and we may use them in different cases. As a recommendation, it’s better to always start with Shallow. Use mount only when you need to test something related to the lifecycle. Render should be used when we want to test the children.

Shallow: Shallow rendering is useful to constrain yourself to testing a component as a unit, and to ensure that your tests aren’t indirectly asserting on behavior of child components.
Mount: Full rendering and it doesn’t need an environment like a “browser”. This is useful when you want to test the children with less overhead than mount.
Render: Full DOM rendering is ideal for use cases where you have components that may interact with DOM APIs. Full rendering actually mounts the component in the DOM. This is the only way to test componentDidMount and componentDidUpdate.
We have API methods for the three methods that may help us in our assertions. Two of the most important are simulate and find. The first one can simulate user events like click, hover, etc. The second method can find a children with a selector.

```
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
})
```
# Resources

### Talks
- Build High Quality JS Tools: https://www.youtube.com/watch?v=PvabBs_utr8
- Snapshots Testing: https://www.youtube.com/watch?v=sCbGfi40IWk&t=96s
- Programming Music with JS: https://www.youtube.com/watch?v=y-IMHGhiSa4

### Interesting Links
- API differences between render and mount/shallow: https://github.com/airbnb/enzyme/issues/465
- Enzyme: JavaScript Testing utilities for React: https://medium.com/airbnb-engineering/enzyme-javascript-testing-utilities-for-react-a417e5e5090f
- Test Jest: https://repl.it/repls/CraftyImpishAbstraction
- Snapshot Testing at Egghead: https://egghead.io/lessons/javascript-use-jest-s-snapshot-testing-feature?pl=testing-javascript-with-jest-a36c4074
