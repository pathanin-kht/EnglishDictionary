const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        const wordDetails = document.getElementById('wordDetails');
        const errorMessage = document.getElementById('errorMessage');
        const loading = document.getElementById('loading');

        searchInput.addEventListener('focus', function() {
        });

        async function searchWord() {
            const word = searchInput.value.trim();
            if (!word) return;

            wordDetails.style.display = 'none';
            errorMessage.style.display = 'none';
            loading.style.display = 'block';
            searchButton.disabled = true;

            try {
                const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
                if (!response.ok) {
                    throw new Error('Word not found');
                }
                const data = await response.json();
                displayResults(data[0]);
            } catch (error) {
                errorMessage.textContent = 'Sorry, we couldn\'t find that word. Please try another one.';
                errorMessage.style.display = 'block';
                wordDetails.style.display = 'none';
            } finally {
                loading.style.display = 'none';
                searchButton.disabled = false;
            }
        }

        function displayResults(data) {
            wordDetails.innerHTML = `
                <div class="word-title">
                    ${data.word}
                    ${data.phonetic ? `
                        <i class="fas fa-volume-up speaker-icon" onclick="playAudio('${data.phonetics[0].audio}')"></i>
                    ` : ''}
                </div>

                ${data.meanings.map(meaning => `
                    <div class="meaning-section">
                        <div class="part-of-speech">${meaning.partOfSpeech}</div>
                        ${meaning.definitions.map(def => `
                            <div class="definition">
                                <p>${def.definition}</p>
                                ${def.example ? `<p class="example">Example: ${def.example}</p>` : ''}
                                ${def.synonyms.length > 0 ? `
                                    <p class="synonyms">Synonyms: ${def.synonyms.join(', ')}</p>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                `).join('')}

                ${data.origin ? `
                    <div class="meaning-section">
                        <div class="part-of-speech">Origin</div>
                        <div class="definition">
                            <p>${data.origin}</p>
                        </div>
                    </div>
                ` : ''}
            `;

            wordDetails.style.display = 'block';
        }

        function playAudio(audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play();
        }