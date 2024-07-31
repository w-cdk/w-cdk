function parseWCDK(fileContent) {
  const sections = fileContent.split('---');
  const template = sections[1].trim();
  const script = sections[3].trim();

  const props = {};
  const state = {};
  const methods = {};

  // Parsing props
  const propsMatch = script.match(/props:\s*{([\s\S]*?)}/);
  if (propsMatch) {
    propsMatch[1].trim().split('\n').forEach(line => {
      const [propName, propConfigStr] = line.split(':').map(s => s.trim());
      if (propName && propConfigStr) {
        const propConfig = propConfigStr.slice(1, -1).split(',').map(s => s.trim());
        props[propName] = {
          type: propConfig[0],
          default: propConfig[1] ? propConfig[1].split(' ')[1] : undefined,
        };
      }
    });
  }

  // Parsing state
  const stateMatch = script.match(/state:\s*{([\s\S]*?)}/);
  if (stateMatch) {
    stateMatch[1].trim().split('\n').forEach(line => {
      const [stateName, stateValue] = line.split(':').map(s => s.trim());
      if (stateName) {
        state[stateName] = stateValue ? eval(stateValue) : undefined; // Evaluate state values
      }
    });
  }

  // Parsing methods
  const methodsMatch = script.match(/methods:\s*{([\s\S]*?)}/);
  if (methodsMatch) {
    methodsMatch[1].trim().split('\n').forEach(line => {
      const [methodName, methodBody] = line.split('{').map(s => s.trim());
      if (methodName && methodBody) {
        methods[methodName.slice(0, -2)] = methodBody.slice(0, -1).trim(); // Remove trailing '() {' and '}'
      }
    });
  }

  return { template, script, props, state, methods };
}

module.exports = { parseWCDK };
