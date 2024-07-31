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