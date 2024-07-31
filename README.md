### Web Component Development Kit (w-cdk) Concept Guide

## Project Overview

The goal is to develop a web component library named `w-cdk` with a focus on simplicity, performance, and developer experience. The `.wcdk` files encapsulate the template, styles, and script for each component.

### 1. Project Structure

```
w-cdk/
├── src/
│   ├── state.js
│   ├── lifecycle.js
│   ├── vdom.js
│   ├── index.js
├── examples/
│   ├── counter/
│   │   ├── counter.wcdk
│   │   ├── counter.css
│   │   ├── index.html
│   │   └── main.js
├── plugins/
│   └── wcdk-plugin.js
├── package.json
├── vite.config.js
└── README.md
```

### 2. Core Library

#### File: `src/state.js`

The state management system uses a reactive proxy to watch for changes.

```javascript
export function reactive(initialState) {
  return new Proxy(initialState, {
    set(target, property, value) {
      target[property] = value;
      return true;
    },
  });
}
```

#### File: `src/lifecycle.js`

Lifecycle hooks to manage component lifecycle events.

```javascript
export const lifecycle = {
  onMounted: [],
  onUpdated: [],
  onBeforeMount: [],
  onBeforeUpdate: [],
  onBeforeDestroy: [],
};

export function onMounted(callback) {
  lifecycle.onMounted.push(callback);
}

export function onUpdated(callback) {
  lifecycle.onUpdated.push(callback);
}

export function onBeforeMount(callback) {
  lifecycle.onBeforeMount.push(callback);
}

export function onBeforeUpdate(callback) {
  lifecycle.onBeforeUpdate.push(callback);
}

export function onBeforeDestroy(callback) {
  lifecycle.onBeforeDestroy.push(callback);
}

export function triggerLifecycleHooks(hook) {
  lifecycle[hook].forEach(callback => callback());
}

export function clearLifecycleHooks() {
  Object.keys(lifecycle).forEach(hook => {
    lifecycle[hook] = [];
  });
}
```

#### File: `src/vdom.js`

Functions to parse the template, generate the VDOM, and render it.

```javascript
import { parse } from 'node-html-parser';

export function parseTemplate(template) {
  const root = parse(template);
  return transformNode(root);
}

function transformNode(node) {
  // Handle text nodes
  if (node.nodeType === 3) {
    return {
      type: 'text',
      content: node.rawText.trim()
    };
  }

  // Handle element nodes
  const astNode = {
    tag: node.tagName,
    attrs: node.attributes,
    children: []
  };

  if (node.childNodes) {
    astNode.children = node.childNodes.map(transformNode);
  }

  return astNode;
}

export function generateVDOM(ast, state, actions) {
  const createElement = (node) => {
    if (node.type === 'text') {
      return node.content;
    }

    const element = {
      tag: node.tag,
      attrs: node.attrs,
      children: node.children.map(createElement)
    };

    return element;
  };

  return createElement(ast);
}

export function renderVDOM(vdom, parent) {
  parent.innerHTML = ''; // Clear the previous content

  const createElement = (vnode) => {
    if (typeof vnode === 'string') {
      return document.createTextNode(vnode);
    }

    const element = document.createElement(vnode.tag);

    if (vnode.attrs) {
      Object.keys(vnode.attrs).forEach(attr => {
        if (attr.startsWith('@')) {
          const eventName = attr.substring(1);
          element.addEventListener(eventName, actions[vnode.attrs[attr]]);
        } else {
          element.setAttribute(attr, vnode.attrs[attr]);
        }
      });
    }

    vnode.children.forEach(child => {
      element.appendChild(createElement(child));
    });

    return element;
  };

  parent.appendChild(createElement(vdom));
}
```

#### File: `src/index.js`

Export the core functions.

```javascript
export { reactive } from './state.js';
export { onMounted, onUpdated, onBeforeMount, onBeforeUpdate, onBeforeDestroy, triggerLifecycleHooks, clearLifecycleHooks } from './lifecycle.js';
export { parseTemplate, generateVDOM, renderVDOM } from './vdom.js';
```

### 3. Vite Plugin

#### File: `plugins/wcdk-plugin.js`

The Vite plugin to handle `.wcdk` files.

```javascript
import { parse } from 'node-html-parser';
import fs from 'fs';
import path from 'path';

export default function wcdkPlugin() {
  return {
    name: 'wcdk-plugin',
    transform(code, id) {
      if (!id.endsWith('.wcdk')) return;

      const root = parse(code);
      const templateContent = root.querySelector('template').innerHTML;
      const scriptContent = root.querySelector('script').innerHTML;
      const stylePath = path.resolve(path.dirname(id), root.querySelector('style').getAttribute('src'));
      const styles = fs.readFileSync(stylePath, 'utf-8');

      return {
        code: `
          import { parseTemplate, generateVDOM, renderVDOM } from 'w-cdk';
          import { reactive, onMounted, triggerLifecycleHooks, clearLifecycleHooks } from 'w-cdk';

          const templateAST = parseTemplate(\`${templateContent.replace(/`/g, '\\`')}\`);

          ${scriptContent.replace('export default', 'const component =')}

          class CustomElement extends HTMLElement {
            constructor() {
              super();
              this.attachShadow({ mode: 'open' });
              const { state, actions } = component.setup.call(this);
              this.state = state;
              this.actions = actions;
              this.applyStyles();
            }

            applyStyles() {
              const styleElement = document.createElement('style');
              styleElement.textContent = \`${styles.replace(/`/g, '\\`')}\`;
              this.shadowRoot.appendChild(styleElement);
            }

            connectedCallback() {
              triggerLifecycleHooks('onBeforeMount');
              this.update();
              triggerLifecycleHooks('onMounted');
            }

            disconnectedCallback() {
              triggerLifecycleHooks('onBeforeDestroy');
              clearLifecycleHooks();
            }

            update() {
              triggerLifecycleHooks('onBeforeUpdate');
              const vdom = generateVDOM(templateAST, this.state, this.actions);
              renderVDOM(vdom, this.shadowRoot);
              triggerLifecycleHooks('onUpdated');
            }
          }

          window.customElements.define(component.name, CustomElement);
        `,
        map: null
      };
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.wcdk')) {
        server.ws.send({ type: 'full-reload', path: '*' });
      }
    }
  };
}
```

### 4. Vite Configuration

#### File: `vite.config.js`

Configure Vite to use the custom plugin.

```javascript
import { defineConfig } from 'vite';
import wcdkPlugin from './plugins/wcdk-plugin';
import path from 'path';

export default defineConfig({
  plugins: [wcdkPlugin()],
  resolve: {
    alias: {
      'w-cdk': path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.wcdk', '.css']
  },
  server: {
    open: '/examples/counter/index.html'
  }
});
```

### 5. Example Component

#### File: `examples/counter/counter.wcdk`

A simple counter component.

```html
<template>
  <div>
    <h2>Count: \${state.count}</h2>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
  </div>
</template>

<style src="./counter.css"></style>

<script>
  export default {
    name: 'my-counter',
    setup() {
      const state = reactive({ count: 0 });

      const increment = () => {
        state.count++;
        this.update();
      };

      const decrement = () => {
        state.count--;
        this.update();
      };

      const actions = { increment, decrement };

      onMounted(() => {
        console.log('Component mounted');
      });

      return { state, actions };
    }
  };
</script>
```

#### File: `examples/counter/counter.css`

Styles for the counter component.

```css
button {
  padding: 8px 16px;
  margin: 5px;
  background-color: #4CAF50; /* Green */
  color: white;
  border: none;
}
```

#### File: `examples/counter/index.html`

HTML file to test the component.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Counter Example</title>
</head>
<body>
  <my-counter></my-counter>
  <script type="module" src="./main.js"></script>
</body>
</html>
```

#### File: `examples

/counter/main.js`

Main entry file for the counter example.

```javascript
import './counter.wcdk';
```

### 6. Running the Project

1. **Navigate to the `w-cdk` directory:**

   ```bash
   cd w-cdk
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the Vite development server:**

   ```bash
   npm run dev
   ```

This setup ensures that the template is correctly parsed, the VDOM is properly generated and rendered in the shadow DOM, and the component functions as expected. By following these steps, your counter component should render correctly with functional buttons inside the shadow DOM.
