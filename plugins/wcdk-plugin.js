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
