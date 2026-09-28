document.addEventListener('DOMContentLoaded', () => {
    const rawData = document.getElementById('raw-data').textContent;
    const categoryNav = document.getElementById('category-nav');
    const problemsContainer = document.getElementById('problems-container');
    const currentCategoryTitle = document.getElementById('current-category-title');

    function parseDSAData(text) {
        const lines = text.split('\n');
        const curriculum = {};
        let currentCategory = null;

        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed) return;

            if (trimmed.endsWith('-')) {
                currentCategory = trimmed.slice(0, -1).trim();
                curriculum[currentCategory] = [];
            } else if (currentCategory && /^\d+\./.test(trimmed)) {
                const problemName = trimmed.replace(/^\d+\.\s*/, '').trim();
                curriculum[currentCategory].push({
                    id: curriculum[currentCategory].length + 1,
                    name: problemName
                });
            }
        });

        return curriculum;
    }

    const curriculum = parseDSAData(rawData);
    const categories = Object.keys(curriculum);

    function init() {
        if (categories.length === 0) {
            problemsContainer.innerHTML = '<p class="text-zinc-500 text-lg">No data found.</p>';
            return;
        }

        renderNavigation();
        renderCategory(categories[0]);
    }

    function renderNavigation() {
        categoryNav.innerHTML = '';
        categories.forEach(category => {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = category;
            link.className = 'nav-link relative block py-2.5 px-4 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded-lg font-medium tracking-wide';
            link.dataset.category = category;
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                renderCategory(category);
            });
            
            categoryNav.appendChild(link);
        });
    }

    function renderCategory(category) {
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.dataset.category === category) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        currentCategoryTitle.textContent = category;
        const problems = curriculum[category];
        problemsContainer.innerHTML = '';

        if (!problems || problems.length === 0) {
            problemsContainer.innerHTML = '<p class="text-zinc-500 text-lg">No problems found for this category.</p>';
            return;
        }

        problems.forEach((problem) => {
            const problemEl = document.createElement('div');
            
            problemEl.setAttribute('tabindex', '0');
            problemEl.setAttribute('role', 'button');
            problemEl.setAttribute('aria-label', `Problem ${problem.id}: ${problem.name}`);
            
            // Clean, open list layout instead of clunky dark cards
            problemEl.className = 'problem-item group flex items-start sm:items-center gap-4 sm:gap-6 py-4 px-4 sm:px-6 -mx-4 sm:-mx-6 border-b border-zinc-800/60 hover:bg-zinc-900/40 rounded-xl sm:rounded-2xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:bg-zinc-900/40';
            
            problemEl.innerHTML = `
                <div class="flex-shrink-0 w-8 sm:w-10 text-right text-xl sm:text-2xl font-light text-zinc-600 group-hover:text-accent-500 transition-colors duration-200">
                    ${problem.id.toString().padStart(2, '0')}
                </div>
                <div class="pt-1 sm:pt-0 flex-1">
                    <h3 class="text-lg sm:text-xl font-medium text-zinc-200 group-hover:text-white transition-colors duration-200">${problem.name}</h3>
                </div>
                <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-4">
                    <svg class="w-6 h-6 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
                    </svg>
                </div>
            `;
            
            problemEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                }
            });

            problemsContainer.appendChild(problemEl);
        });
    }

    init();
});
