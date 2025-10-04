document.addEventListener('DOMContentLoaded', () => {
    const promptsContainer = document.getElementById('prompts-container');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const searchBar = document.getElementById('search-bar');
    let prompts = [];

    // Fetch prompts from the JSON file
    fetch('prompts.json')
        .then(response => response.json())
        .then(data => {
            prompts = data.prompts;
            displayPrompts(prompts);
            displayCategoryFilters(prompts);
        });

    // Display prompts in the container
    function displayPrompts(promptsToDisplay) {
        promptsContainer.innerHTML = '';
        promptsToDisplay.forEach(prompt => {
            const card = document.createElement('div');
            card.className = 'prompt-card';
            card.innerHTML = `
                <h3>${prompt.title}</h3>
                <div class="prompt">${prompt.prompt}</div>
                <button class="copy-button">Copy Prompt</button>
            `;
            promptsContainer.appendChild(card);
        });
    }

    // Display category filter buttons
    function displayCategoryFilters(prompts) {
        const categories = ['All', ...new Set(prompts.map(p => p.category))];
        categoryFiltersContainer.innerHTML = '';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.innerText = category;
            button.addEventListener('click', () => filterByCategory(category));
            categoryFiltersContainer.appendChild(button);
        });
    }

    // Filter prompts by category
    function filterByCategory(category) {
        if (category === 'All') {
            displayPrompts(prompts);
        } else {
            const filteredPrompts = prompts.filter(p => p.category === category);
            displayPrompts(filteredPrompts);
        }
    }

    // Search functionality
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredPrompts = prompts.filter(p =>
            p.title.toLowerCase().includes(searchTerm) ||
            p.prompt.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
        displayPrompts(filteredPrompts);
    });

    // Copy to clipboard functionality (using event delegation)
    promptsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('copy-button')) {
            const promptText = e.target.previousElementSibling.innerText;
            navigator.clipboard.writeText(promptText).then(() => {
                e.target.innerText = 'Copied!';
                setTimeout(() => {
                    e.target.innerText = 'Copy Prompt';
                }, 1000);
            });
        }
    });
});