document.addEventListener('DOMContentLoaded', () => {
    function loadCustomCDNs() {
        chrome.storage.local.get('customCDNs', (data) => {
            const customCDNs = data.customCDNs || [];
            const cdnList = document.getElementById('cdnList');
            cdnList.innerHTML = '';
            customCDNs.forEach((cdn, index) => {
                const cdnContainer = document.createElement('div');
                const cdnInput = document.createElement('input');
                cdnInput.value = cdn;
                cdnInput.readOnly = true;
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.addEventListener('click', () => {
                    customCDNs.splice(index, 1);
                    chrome.storage.local.set({ customCDNs }, loadCustomCDNs);
                });
                cdnContainer.appendChild(cdnInput);
                cdnContainer.appendChild(deleteButton);
                cdnList.appendChild(cdnContainer);
            });
        });
    }

    document.getElementById('addCustomCdnButton').addEventListener('click', () => {
        const customCdnTemplate = document.getElementById('customCdnTemplate').value;
        if (!customCdnTemplate.includes('{user}') || !customCdnTemplate.includes('{repo}') || !customCdnTemplate.includes('{branch}') || !customCdnTemplate.includes('{path}')) {
            alert('Invalid template format');
            return;
        }

        chrome.storage.local.get('customCDNs', (data) => {
            const customCDNs = data.customCDNs || [];
            customCDNs.push(customCdnTemplate);
            chrome.storage.local.set({ customCDNs }, () => {
                alert('Custom CDN added');
                document.getElementById('customCdnTemplate').value = '';
                loadCustomCDNs();
            });
        });
    });

    loadCustomCDNs();
});
