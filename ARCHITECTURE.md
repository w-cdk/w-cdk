# w-cdk Architecture

## Overview

The `w-cdk` framework aims to provide a streamlined and intuitive way to build web components, inspired by the visual design capabilities of tools like Figma and the reactive programming model of modern frontend frameworks. 

The architecture consists of two main parts:

1. **The `.wcdk` File Format and Syntax:** A declarative way to define web components, encompassing their structure, style, behavior, and interactions.

2. **The `w-cdk-runtime`:** The engine that powers the framework, responsible for parsing `.wcdk` files, instantiating components, rendering them into the DOM, and managing their lifecycle and reactivity.

## `.wcdk` File Format

Each `.wcdk` file represents a single web component and is divided into clearly defined sections:

* **Template:** Defines the component's structure using an HTML-like syntax with support for dynamic content interpolation, conditionals, and loops.
* **Style:**  Specifies the component's styling, either inline or by referencing an external CSS file.
* **Script:** Contains the component's JavaScript logic, including:
    * **Props:**  Properties (inputs) that the component accepts.
    * **State:**  The component's internal state.
    * **Lifecycle Hooks:**  Functions executed at specific points in the component's lifecycle.
    * **Actions:**  Functions that modify the component's state.
    * **Methods:**  Event handlers and other helper functions.
    * **Events:**  Custom events that the component can emit.
    * **Controllers:**  Functions for handling more complex logic like data fetching.

## `w-cdk-runtime`

The `w-cdk-runtime` is responsible for bringing `.wcdk` components to life. Its core functionalities include:

* **Parsing:**  Reading and interpreting `.wcdk` files, extracting the necessary information to create component instances.
* **Component Instantiation:**  Creating component instances, initializing their properties, state, and methods.
* **Template Rendering:**  Processing the component's template, rendering it into the DOM, and handling dynamic content updates.
* **Reactivity:**  Implementing a reactivity system to automatically update the DOM when the component's state or props change.
* **Event Handling:**  Managing event listeners and executing the appropriate handler functions when events are triggered.
* **Lifecycle Management:**  Calling lifecycle hooks at the appropriate stages of a component's lifecycle.
* **Global Store Integration:**  Providing a mechanism for components to access and interact with a global store (if applicable).

## Design Principles

The `w-cdk` architecture is guided by the following principles:

* **Declarative Syntax:**  The `.wcdk` file format promotes a declarative approach to component definition, making the code more readable and maintainable.
* **Single Responsibility Principle:**  Encourages the creation of components with a single, well-defined responsibility, leading to more modular and reusable code.
* **One-Way Data Binding:**  Emphasizes a clear and predictable data flow from parent to child components through props and from child to parent components through events.
* **Performance:**  The `w-cdk-runtime` is designed to be efficient and optimized for fast rendering and updates.
* **Developer Experience:**  The framework aims to provide a smooth and intuitive development experience with clear error messages and helpful debugging tools.

## Future Enhancements

Potential future enhancements to the `w-cdk` architecture include:

* **Two-Way Data Binding (Optional):**  Providing a mechanism for two-way data binding for specific use cases.
* **Advanced Templating Features:**  Supporting more advanced templating features like custom directives and conditional rendering.
* **Server-Side Rendering (SSR):**  Enabling server-side rendering for improved performance and SEO.
* **TypeScript Support:**  Integrating with TypeScript for enhanced type safety and developer productivity.

## Conclusion

The `w-cdk` architecture provides a solid foundation for building modern, reusable, and performant web components. By combining a declarative syntax with a powerful runtime, it empowers developers to create complex and interactive user interfaces with ease.
