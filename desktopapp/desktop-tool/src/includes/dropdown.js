class DropdownList {



    constructor(inputPlaceholder, gridItemsData, parentElement) {
        // Create input field
        this.inputField = document.createElement('input');
        this.inputField.classList.add('dropdown-input');
        this.inputField.setAttribute('type', 'text');
        this.inputField.setAttribute('placeholder', inputPlaceholder);

        // Create dropdown content
        this.dropdownContent = document.createElement('div');
        this.dropdownContent.classList.add('dropdown-content');
        
        // Create grid container
        const gridContainer = document.createElement('div');
        gridContainer.classList.add('grid-container');
        
        // Create grid items
        gridItemsData.forEach(item => {
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');
            gridItem.textContent = item.name;
            gridItem.dataset.index = item.id
            gridContainer.appendChild(gridItem);
        });

        // Append grid container to dropdown content
        this.dropdownContent.appendChild(gridContainer);

        // Initialize other properties
        this.gridItems = gridContainer.querySelectorAll('.grid-item');
        this.debounceTimeout = null;

        // Append input field and dropdown content to the container
        const container = parentElement;
        container.appendChild(this.inputField);
        container.appendChild(this.dropdownContent);

        this.setupListeners();
    }

    get value(){
        return this.inputField.value
    }
    set value(val){
        this.inputField.value = val
    }
    get index(){
        return this.inputField.dataset.index
    }
    set index(id){
        this.inputField.dataset.index = id
    }

    setupListeners() {
        this.inputField.addEventListener('input', () => this.search());
        this.inputField.addEventListener('focus', () => this.showDropdown());
        this.inputField.addEventListener('focusout', () => this.hideDropdown());
        
        this.dropdownContent.addEventListener('mousedown', (event) => this.preventFocusOut(event));
        
        this.gridItems.forEach(gridItem => {
            gridItem.addEventListener('click', () => this.selectGridItem(gridItem));
        });
    }

    showDropdown() {
        this.dropdownContent.style.display = 'grid';
        
        // Set top position based on input field height
        const inputHeight = this.inputField.offsetHeight;
        const extraSpace = 5; // Additional space (adjust as needed)
        this.dropdownContent.style.top = inputHeight + extraSpace + 'px';
    }

    hideDropdown() {
        this.dropdownContent.style.display = 'none';
    }

    preventFocusOut(event) {
        event.preventDefault();
    }

    search() {
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
            const query = this.inputField.value.toLowerCase().trim();
            this.gridItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(query) ? 'block' : 'none';
            });
            this.showDropdown()
        }, 300); // Adjust delay as needed (e.g., 300ms)
    }

   

    selectGridItem(gridItem) {
        const index = gridItem.dataset.index;
        const value = gridItem.textContent
        this.inputField.value = value;
        this.inputField.dataset.index = index;
        this.hideDropdown();
    }

    remove() {
        this.inputField.remove()
        this.dropdownContent.remove()
    }

}