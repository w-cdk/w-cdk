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
