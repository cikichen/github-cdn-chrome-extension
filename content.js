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
        alert('Invalid GitHub link');
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

function createFloatingButton() {
    const button = document.createElement('button');
    button.innerText = 'CDN';
    button.style.position = 'fixed';
    button.style.top = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.borderRadius = '50%';
    button.style.padding = '10px';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    button.addEventListener('click', displayCDNLinks);
    document.body.appendChild(button);
}

function createOverlay(links) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '10000';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';

    const container = document.createElement('div');
    container.style.backgroundColor = 'white';
    container.style.padding = '20px';
    container.style.borderRadius = '10px';
    container.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    container.style.width = '50%'; // 调整宽度
    container.style.overflowY = 'auto';
    container.style.maxHeight = '80%';
    container.style.position = 'relative'; // 使关闭按钮相对定位

    links.forEach(link => {
        const linkContainer = document.createElement('div');
        linkContainer.style.marginBottom = '15px';
        linkContainer.style.display = 'flex';
        linkContainer.style.alignItems = 'center';

        const linkElement = document.createElement('input'); // 使用input代替textarea
        linkElement.value = link;
        linkElement.readOnly = true;
        linkElement.style.width = 'calc(100% - 80px)'; // 调整宽度
        linkElement.style.padding = '10px';
        linkElement.style.marginRight = '10px';
        linkElement.style.border = '1px solid #ddd';
        linkElement.style.borderRadius = '5px';
        linkElement.style.boxSizing = 'border-box';
        linkElement.style.overflow = 'hidden';
        linkElement.style.textOverflow = 'ellipsis'; // 超出部分显示省略号
        linkElement.style.whiteSpace = 'nowrap'; // 不换行
        linkElement.style.fontSize = '14px';
        linkElement.style.fontFamily = 'Arial, sans-serif';

        const copyButton = document.createElement('button');
        copyButton.innerText = 'Copy';
        copyButton.style.padding = '10px 15px';
        copyButton.style.backgroundColor = '#007bff';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '5px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.fontSize = '14px';
        copyButton.style.fontFamily = 'Arial, sans-serif';
        copyButton.addEventListener('click', () => {
            linkElement.select();
            document.execCommand('copy');
            showNotification('Copied to clipboard');
        });

        linkContainer.appendChild(linkElement);
        linkContainer.appendChild(copyButton);
        container.appendChild(linkContainer);
    });

    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.style.padding = '10px 20px';
    closeButton.style.backgroundColor = '#dc3545';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '14px';
    closeButton.style.fontFamily = 'Arial, sans-serif';
    closeButton.style.marginTop = '20px';
    closeButton.style.display = 'block';
    closeButton.style.marginLeft = 'auto';
    closeButton.style.marginRight = 'auto'; // 居中显示
    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });

    container.appendChild(closeButton);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.innerText = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px'; // 显示在上方
    notification.style.left = '50%'; // 居中显示
    notification.style.transform = 'translateX(-50%)'; // 居中显示
    notification.style.backgroundColor = '#28a745';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    notification.style.zIndex = '10001';
    document.body.appendChild(notification);

    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

function displayCDNLinks() {
    const url = window.location.href;
    chrome.storage.local.get('customCDNs', (data) => {
        const customCDNs = data.customCDNs || [];
        const links = generateCDNLinks(url, customCDNs);
        if (links.length > 0) {
            createOverlay(links);
        }
    });
}

if (validateGithubLink(window.location.href)) {
    createFloatingButton();
}