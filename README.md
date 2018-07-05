# Jest + Enzyme

# Agenda
- Introduction
- Why Jest
- Jest Matchers
- Mocks
- Why Enzyme
- Snapshot Testing

# Introduction

```WE MUST TEST!```

# Why Jest (unit testing alternatives)

### About Jest

- Jest is a testing framework created by Facebook. They use it to test JavaScript and React code.
- It was created under the premise of Performance, Features and Adoptability.
- Jest provides an integrated "zero-configuration" experience. This is a differentiator with other popular testing frameworks like Mocha.

### Some Killer Features

- **Instant Feedback:** Immersive Watch mode runs only test files related to changed files.
- **Fast and sandboxed:**  It parallelizes test runs across workers and console messages are buffered and print together.
- **Snapshot Testing:** Capture snapshots of React trees or other serializable values to simplify testing and to analyze how state changes over time.
- **Built-in code coverage reports:** Supports --coverage for bringing out of the box coverage reports.
- **Zero configuration**

# Jest Matchers

### Common Matchers

- `toBe`: It uses `Object.is` to test exact equality.
- `toEqual`: It recursively checks every field of an object or array.
-  `not`: Tests for the opposite of a matcher

```
test('object assignment', () => {
  const data = {one: 1};
  data['two'] = 2;
  expect(data).toEqual({one: 1, two: 2});
});

test('increasing  a positive number is not zero', () => {
	let a = 1;
	expect(a + 1).not.toBe(0);
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

# Mocks

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


# Why Enzyme

- Enzyme is a testing utility from Airbnb which is a perfect match to test React Applications.
- Test the state of a React render tree can include a lot of boilerplate code. This is not good for testing purposes and clean code.
- Enzyme uses several of the utilities provided by React to build its API. The API reduces boilerplate code and the reduces the coupling between your tests.

### Enzyme Modes
- `Shallow`: Shallow rendering is useful to constrain yourself to testing a component as a unit, and to ensure that your tests aren't indirectly asserting on behavior of child components.
- `Mount`: Full DOM rendering is ideal for use cases where you have components that may interact with DOM APIs.  Full rendering actually mounts the component in the DOM. This is the only way to test  componentDidMount and componentDidUpdate.
- `Render`: Full rendering and it doesn't need an environment like a "browser". This is useful when you want to test the children with less overhead than `mount`.

### More useful API methods: find, simulate and filter.

#### .find(selector) => ShallowWrapper

Finds every node in the render tree of the current wrapper that matches the provided selector.
#### .filter(selector) => ShallowWrapper

Returns a new wrapper with only the nodes of the current wrapper that match the provided selector.
#### .simulate(event[, ...args]) => Self

Simulate events

### Example

```
import React from 'react';

class ToDoItem extends React.Component {
  render() {
    const { item, onCompleteChange } = this.props;
    return (
      <div className="item">
        <span className="item-mark">{item.complete ? '✓' : '•'}</span>
        <span className="item-title">{item.title}</span>
        <a className="item-button" onClick={() => onCompleteChange(item, !item.complete)}>
          Mark as {item.complete ? 'Pending' : 'Complete'}
        </a>
      </div>
    );
  }
}
```

```
import React from 'react';

class ToDoList extends React.Component {
  render() {
    const { items, onChange } = this.props;
    return (
      <div className="todo-list">
        {items.map(item => <ToDoItem key={item.id} item={item} onCompleteChange={onChange} />)}
      </div>
    );
  }
}
```

```
import React from 'react';
import {shallow} from 'enzyme';
import ToDoItem from './components/ToDoItem';
import ToDoList from './components/ToDoList';

function mockItem() {
	// return mocked object
}
describe('Test ToDoItem Component', () => {
	it('renders the title', () => {
      const defaultItem = mockItem();
      const wrapper = shallow(<ToDoItem item={item} />);
      expect(wrapper.text()).toBe(item.title);
  });

  it('renders a check mark when complete', () => {
    const item = mockItem({ complete: true });
    const wrapper = shallow(<ToDoItem item={item} />);
    expect(wrapper.find('.item-mark').text()).to.equal('✓');
  });
});

```

```
import React from 'react';
import { shallow } from 'enzyme';
import ToDoList from '../components/ToDoList';
import ToDoItem from '../components/ToDoItem';

describe('<ToDoList />', () => {
  it('renders the entire list of items', () => {
    const items = [mockItem(), mockItem()];
    const wrapper = shallow(<ToDoList items={items} />);
    expect(wrapper.find(ToDoList)).toHaveLength(items.length);
  });
});
```

### Recommendations

- Start always with `shallow`
- Use just `mount` when you want to test something related to the lifecycle.
- Use `render` when you want to test the children.

# Snapshots

### What is a snapshot?

- According to the official docs: Snapshot tests are a very useful tool whenever you want to make sure your UI does not change unexpectedly.
- This is a kind of new approach to test UIs or any serializable code.
- You can use a test renderer to quickly generate a serializable value for your React tree. The first time this test is run, Jest creates a snapshot file that looks like this (Jest uses pretty-format to make snapshots human-readable during code review):

```
exports[`renders correctly 1`] = `
  <rendered_html>
`;
```

### Basic Example

```
import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Image from '../components/Image';

describe('Image', () => {
  it('should render correctly', () => {
    const output = shallow(
      <Image title="mockTitle" url="mockUrl" />
    );
    expect(shallowToJson(output)).toMatchSnapshot();
  });
});
```

# CLI
// TODO Finish this


# Final Excersice: Test Styled Components
- **TODO** Create the exercise

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
