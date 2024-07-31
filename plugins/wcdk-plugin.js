import { parseWCDK } from '../src/parser';

export default function wcdkPlugin() {
    return {
        name: 'wcdk-plugin', // You can give it a name if you'd like
        transform(code, id) {
            if (!id.endsWith('.wcdk')) return;

            const componentDefinition = parseWCDK(code);
            componentDefinition.name = id.split('/').pop().replace('.wcdk', '');
            console.log("Parsed Template:", componentDefinition); // Check the template
            // Generate JavaScript code for the Lit component
            let generatedCode = `
import { LitElement, html } from 'lit';

class ${componentDefinition.name} extends LitElement {
  static properties = ${JSON.stringify(componentDefinition.props)};

  constructor() {
    super();
    this.state = ${JSON.stringify(componentDefinition.state)};
    Object.keys(this.constructor.properties).forEach(prop => {
      if (prop in this.state) {
        this.state[prop] = this[prop];
      }
    });
  }

  update() {
    this.requestUpdate();
  }

  render() {
    const templateFn = new Function('state', 'props', 'html', \`return html\\\`${componentDefinition.template}\\\`;\`);
    return templateFn(this.state, this.properties, html);
  }

  ${Object.entries(componentDefinition.methods)
                    .map(([name, fn]) => `${name}() { ${fn.toString()} }`)
                    .join('\n')}
}

customElements.define('w-${componentDefinition.name.toLowerCase()}', ${componentDefinition.name
                });
`;

            return {
                code: generatedCode,
                map: null,
            };
        },
    };
}
