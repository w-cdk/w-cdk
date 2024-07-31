### Scenario: E-commerce Product Listing with Filtering and Sorting

Imagine you're building an e-commerce product listing page. You want to display a list of products with the ability for users to:

- Filter products by category, price range, and other attributes.
- Sort products by price, popularity, or other criteria.

#### Component Breakdown (Using Single Responsibility Principle)

1. `product-list` (Parent Component):

- Fetches product data from an API.
- Manages the overall state of the listing (filtered products, sorting criteria).
- Renders the product-filter, product-sort, and product-grid components.
- Handles events from the filter and sort components to update the displayed products.
2. `product-filter`:
- Provides UI controls for filtering products (dropdowns, checkboxes, etc.).
- Emits events when filter criteria change.
3. `product-sort`:

- Provides UI controls for selecting sorting criteria (dropdown or buttons).
- Emits events when sorting criteria change.
4. `product-grid`:

- Receives a list of products as a prop.
- Renders individual product-card components for each product.
5. `product-card`:

- Receives a single product object as a prop.
- Displays product details (image, name, price, etc.).
- Handles events like "add to cart" or "view details."
#### Data Flow and Event Handling

1. `product-list` fetches product data and initializes its state.
2. `product-list` passes the initial list of products (or a filtered subset) as a prop to `product-grid`.
3. `product-grid` renders `product-card` components for each product.
4. When a user interacts with `product-filter`, it emits an event with the updated filter criteria.
5. `product-list` listens for this event, updates its filtered `product list`, and passes the new list to `product-grid`.
6. Similarly, when a user interacts with `product-sort`, it emits an event with the new sorting criteria, and `product-list` updates the displayed products accordingly.
#### Key Points

- One-Way Data Binding: Data flows downwards from parent to child components through props. Events flow upwards from child to parent components.
- Single Responsibility: Each component has a clear and focused responsibility, making the system more modular and maintainable.
- Reusability: Components like product-card can be reused in other parts of the application.
#### Benefits

This approach allows you to build a complex and interactive e-commerce product listing page with a well-structured and scalable architecture. The use of one-way data binding and single-responsibility components promotes code clarity, maintainability, and testability.

1. **product-list.wcdk**
```
---
template: product-list
style: product-list.css
---
<template id="product-list">
    <div>
        <product-filter @filterChanged="handleFilterChange" />
        <product-sort @sortChanged="handleSortChange" />
        <product-grid *products="filteredProducts" />
    </div>
</template>
---

// ... (imports, state, lifecycle, actions, methods, etc.) 

state: {
    allProducts: [], // Fetched from API
    filteredProducts: [], // Initially same as allProducts
    activeFilters: {},
    activeSort: 'default'
}

methods: {
    async fetchProducts() {
        // ... fetch data from API and update allProducts state
        this.filteredProducts = this.allProducts; // Initialize filteredProducts
    },
    handleFilterChange(newFilters) {
        this.activeFilters = newFilters;
        this.updateFilteredProducts();
    },
    handleSortChange(newSort) {
        this.activeSort = newSort;
        this.updateFilteredProducts();
    },
    updateFilteredProducts() {
        // Apply filtering and sorting logic based on activeFilters and activeSort
        // Update filteredProducts state
        this.update(); // Trigger re-render
    }
}
```
2. **product-filter.wcdk**
```
---
template: product-filter
style: product-filter.css
---
<template id="product-filter">
    <div>
        <select @change="handleCategoryChange">
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            </select>
        </div>
</template>
---

// ... (imports, state, actions, methods, etc.)

methods: {
    handleCategoryChange(event) {
        const selectedCategory = event.target.value;
        this.emit('filterChanged', { category: selectedCategory });
    }
    // ... handlers for other filter controls
}

```

3. **product-sort.wcdk**
```
---
template: product-sort
style: product-sort.css
---
<template id="product-sort">
    <div>
        <select @change="handleSortChange">
            <option value="default">Default</option>
            <option value="priceAsc">Price: Low to High</option>
            </select>
    </div>
</template>
---

// ... (imports, methods, etc.)

methods: {
    handleSortChange(event) {
        const selectedSort = event.target.value;
        this.emit('sortChanged', selectedSort);
    }
}

```
4. **product-grid.wcdk**
```
---
template: product-grid
style: product-grid.css
---
<template id="product-grid">
    <div class="grid">
        { for (const product of props.products) { }
            <product-card *product="product" />
        { } }
    </div>
</template>
---

// ... (imports, props, etc.)

props: {
    *products: { type: Array, default: [] }
}

```
5. **product-card.wcdk**

```
---
template: product-card
style: product-card.css
---
<template id="product-card">
    <div class="card">
        <img src="{{props.product.image}}" alt="{{props.product.name}}">
        <h3>{{props.product.name}}</h3>
        <p>{{props.product.price}}</p>
        <button @click="addToCart">Add to Cart</button>
    </div>
</template>
---

// ... (imports, props, methods, etc.)

props: {
    *product: { type: Object }
}

methods: {
    addToCart() {
        // ... handle adding product to cart
    }
}

```

#### Key Points

- Component Composition: The `product-list` component acts as the parent, orchestrating the interaction between the filter, sort, and grid components.
- Props and Events: Data flows down through props (e.g., `*products` in `product-grid`),