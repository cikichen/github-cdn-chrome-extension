const CDN_TEMPLATES = [
    'https://cdn.jsdelivr.net/gh/{user}/{repo}@{branch}/{path}',
    'https://rawcdn.githack.com/{user}/{repo}/{commit}/{path}',
    'https://cdn.statically.io/gh/{user}/{repo}/{branch}/{path}',
    'https://mirror.ghproxy.com/raw.githubusercontent.com/{user}/{repo}/{branch}/{path}',
    'https://ghproxy.net/https://raw.githubusercontent.com/{user}/{repo}/{branch}/{path}',
    'https://fastly.jsdelivr.net/gh/{user}/{repo}@{branch}/{path}'
];

const GITHUB_REGEX = /https:\/\/(raw\.githubusercontent|github)\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+)/;

function validateGithubLink(link) {
    return GITHUB_REGEX.test(link);
}

function generateCDNLinks(githubLink, customCDNs = []) {
    if (!validateGithubLink(githubLink)) {
        showNotification('Invalid GitHub link');
        return [];
    }

    const match = githubLink.match(GITHUB_REGEX);
    const user = match[2];
    const repo = match[3];
    const branch = match[4];
    const path = match[5];

    const cdnTemplates = [...CDN_TEMPLATES, ...customCDNs];
    return cdnTemplates.map(template =>
        template.replace('{user}', user)
            .replace('{repo}', repo)
            .replace('{branch}', branch)
            .replace('{path}', path)
            .replace('{commit}', branch)
    );
}

function handleInput() {
    const githubUrl = document.getElementById('githubUrl').value;
    const cdnLinksContainer = document.getElementById('cdnLinks');
    if (validateGithubLink(githubUrl)) {
        chrome.storage.local.get('customCDNs', (data) => {
            const customCDNs = data.customCDNs || [];
            const cdnLinks = generateCDNLinks(githubUrl, customCDNs);
            displayCDNLinks(cdnLinks);
            cdnLinksContainer.style.display = 'block';
        });
    } else {
        clearCDNLinks();
        cdnLinksContainer.style.display = 'none';
    }
}

function displayCDNLinks(links) {
    const cdnLinksContainer = document.getElementById('cdnLinks');
    cdnLinksContainer.innerHTML = '';
    links.forEach(link => {
        const linkDiv = document.createElement('div');
        const linkInput = document.createElement('input');
        linkInput.type = 'text';
        linkInput.value = link;
        linkInput.readOnly = true;
        const copyButton = document.createElement('button');
        copyButton.innerText = 'Copy';
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(link).then(() => {
                showNotification('Link copied to clipboard');
            });
        });
        linkDiv.appendChild(linkInput);
        linkDiv.appendChild(copyButton);
        cdnLinksContainer.appendChild(linkDiv);
    });
}

function clearCDNLinks() {
    const cdnLinksContainer = document.getElementById('cdnLinks');
    cdnLinksContainer.innerHTML = '';
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

function loadCustomCDNs() {
    chrome.storage.local.get('customCDNs', (data) => {
        const customCDNs = data.customCDNs || [];
        const customCdnList = document.getElementById('customCdnList');
        customCdnList.innerHTML = '';
        customCDNs.forEach((cdn, index) => {
            const cdnItem = document.createElement('div');
            cdnItem.classList.add('custom-cdn-item');
            const cdnInput = document.createElement('input');
            cdnInput.type = 'text';
            cdnInput.value = cdn;
            cdnInput.readOnly = true;
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.addEventListener('click', () => {
                customCDNs.splice(index, 1);
                chrome.storage.local.set({ customCDNs: customCDNs }, () => {
                    showNotification('Custom CDN removed');
                    loadCustomCDNs();
                    handleInput();
                });
            });
            cdnItem.appendChild(cdnInput);
            cdnItem.appendChild(deleteButton);
            customCdnList.appendChild(cdnItem);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('githubUrl').addEventListener('input', handleInput);

    const settingsButton = document.getElementById('settingsButton');
    const customCdnContainer = document.getElementById('customCdnContainer');

    settingsButton.addEventListener('click', () => {
        if (customCdnContainer.style.display === 'none' || customCdnContainer.style.display === '') {
            customCdnContainer.style.display = 'block';
            loadCustomCDNs();
        } else {
            customCdnContainer.style.display = 'none';
        }
    });

    document.getElementById('addCustomCdn').addEventListener('click', () => {
        const customCdn = document.getElementById('customCdn').value;
        if (customCdn && customCdn.includes('{user}') && customCdn.includes('{repo}') && customCdn.includes('{branch}') && customCdn.includes('{path}')) {
            chrome.storage.local.get('customCDNs', (data) => {
                const customCDNs = data.customCDNs || [];
                customCDNs.push(customCdn);
                chrome.storage.local.set({ customCDNs: customCDNs }, () => {
                    showNotification('Custom CDN added');
                    document.getElementById('customCdn').value = '';
                    loadCustomCDNs();
                    handleInput();
                });
            });
        } else {
            showNotification('Invalid CDN template');
        }
    });

    chrome.storage.local.get('customCDNs', (data) => {
        handleInput();
    });
});
