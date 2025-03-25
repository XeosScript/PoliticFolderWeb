document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
    const container = document.getElementById('channel-container');
    const modal = document.getElementById('channel-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalPhoto = document.getElementById('modal-photo');
    const modalFullDescription = document.getElementById('modal-full-description');
    const modalLink = document.getElementById('modal-link');
    const closeBtn = document.querySelector('.close');

    let channels = []; 
    function loadChannels() {
        fetch('channels.json')             .then(response => response.json())
            .then(data => {
                channels = data;                 renderChannels(channels);             })
            .catch(error => console.error('Ошибка загрузки JSON:', error));
    }

    function renderChannels(channelsToRender) {
        container.innerHTML = '';         channelsToRender.forEach(channel => {
            const card = document.createElement('div');
            card.classList.add('channel-card');

            const img = document.createElement('img');
            img.src = channel.photo;
            img.alt = channel.name;
            card.appendChild(img);

            const title = document.createElement('h2');
            title.textContent = channel.name;

                        if (channel.verification > 0) {
                const verificationBadge = document.createElement('img');
                verificationBadge.classList.add('verification-badge');
                verificationBadge.src = 'assets/' + channel.verification + '.png';                 verificationBadge.alt = "Уровень верификации: " + channel.verification;                 title.appendChild(verificationBadge);
            }

            card.appendChild(title);

            const description = document.createElement('p');
            description.textContent = channel.short_description;
            card.appendChild(description);

            const link = document.createElement('a');
            link.href = channel.link;
            link.textContent = 'Перейти в Telegram';
            link.target = '_blank';
            card.appendChild(link);

                        card.addEventListener('click', () => {
                openModal(channel);
            });

            container.appendChild(card);
        });
    }

    function filterChannels() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedFilters = Array.from(filterCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.dataset.filter);

        let filteredChannels = channels;

                if (searchTerm) {
            filteredChannels = filteredChannels.filter(channel =>
                channel.name.toLowerCase().includes(searchTerm)
            );
        }

                if (selectedFilters.length > 0) {
            filteredChannels = filteredChannels.filter(channel => {
                let matchesFilter = false;
                selectedFilters.forEach(filter => {
                    if (filter === String(channel.verification)) {                          matchesFilter = true;
                    } else if (channel.tags && channel.tags.includes(filter)) {                         matchesFilter = true;
                    }
                });
                return matchesFilter;
            });
        }

        renderChannels(filteredChannels);
    }

    function openModal(channel) {
        modalTitle.textContent = channel.name;
        modalPhoto.src = channel.photo;
        modalPhoto.alt = channel.name;
        modalFullDescription.textContent = channel.full_description;
        modalLink.href = channel.link;
        modal.style.display = "block";     }

    function closeModal() {
        modal.style.display = "none";     }

        searchInput.addEventListener('input', filterChannels);     filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterChannels);     });

        closeBtn.addEventListener('click', closeModal);

        window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

        loadChannels();
});