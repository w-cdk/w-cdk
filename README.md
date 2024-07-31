# w-cdk: A Framework for Building Web Components

**Important Note:** This is a concept project under active R&D and is not yet ready for development or production use.

---

**w-cdk** is a cutting-edge framework designed to streamline the creation of web components, drawing inspiration from visual design tools like Figma and the reactive programming paradigms of modern frontend frameworks. 

## Key Features

* **Intuitive `.wcdk` Syntax:** Define your components declaratively with a clear and concise syntax encompassing template, style, and script sections.
* **Powerful Runtime:** The `w-cdk-runtime` handles parsing, component instantiation, rendering, reactivity, event handling, and lifecycle management, bringing your components to life.
* **Single Responsibility Principle:** Encourages the development of focused, reusable components, promoting modularity and maintainability.
* **One-Way Data Binding:**  Ensures a predictable and efficient data flow through props (parent to child) and events (child to parent).
* **Performance Optimization:** The runtime is designed for optimal performance, ensuring fast rendering and updates.
* **Developer-Friendly:**  Clear error messages and helpful debugging tools enhance the development experience.

## Getting Started

1. **Install w-cdk:**
```
bash npm install w-cdk
```
2. **Create a `.wcdk` file:**
```
---
template: w-counter
style: counter.css 
---
<template id="w-counter">
    <div>
        <h2>Count: {{state.count}}</h2>
        <button @click="increment">Increment</button>
        <button @click="decrement">Decrement</button>
    </div>
</template>
---

imports: [
    'dispatch from w-cdk'
]

props: {
    *initialCount: { type: Number, default: 0 }
}

state: {
    count: { type: Number, default: props.initialCount }, // Use prop if provided, otherwise default to 0
    isLoading: { type: Boolean, default: false },
    userData: { type: Object, default: {} }
}

lifecycle: {
    onmount() {
        console.log('Component mounted');
        this.state.count = this.props.initialCount; // Initialize from prop
    },
    onupdate() {
        console.log('Component updated');
    },
    ondestroy() {
        console.log('Component destroyed');
    }
}

actions: {
    increment() {
        this.state.count++;
        this.update(); 
        this.emit('countChanged', this.state.count); // Emit the event with the new count value
    },
    decrement() {
        this.state.count--;
        this.update();
    }
}

methods: {
    handleClick() {
        // Handle other events here
    }
}

events: [
    'countChanged' // Example custom event
]

controllers: {
    async fetchData() {
        console.log('Fetching data...');
    }
}
```
3. **Use the component in your HTML:**
```
  <w-counter></w-counter>
```

## Architecture

The `w-cdk` architecture consists of two main parts:

* **`.wcdk` File Format:** A declarative syntax for defining web components, including their structure, style, and behavior.
* **`w-cdk-runtime`:** The engine that parses `.wcdk` files, instantiates components, renders them into the DOM, and manages their lifecycle and reactivity.

For a detailed overview of the architecture, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Future Plans

* **Two-Way Data Binding (Optional):**  Provide a mechanism for two-way data binding for specific use cases.
* **Advanced Templating Features:**  Support more advanced templating features like custom directives and conditional rendering.
* **Server-Side Rendering (SSR):**  Enable server-side rendering for improved performance and SEO.
* **TypeScript Support:**  Integrate with TypeScript for enhanced type safety and developer productivity.

## Contributing

We welcome contributions from the community! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) guide for details on how to get involved.

## License

This project is licensed under the [MIT License](LICENSE).

---


**Stay tuned for updates on the development of w-cdk!**
