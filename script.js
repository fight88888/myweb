// 文章数据配置
const articles = {
    cpp: [
        { title: 'C++ 面试知识点', file: 'cpp/c++.md' },
        { title: 'C++ 基础语法', file: 'cpp/cpp-basic.md' },
        { title: '面向对象编程', file: 'cpp/oop.md' },
        { title: 'STL 容器', file: 'cpp/stl.md' },
        { title: '智能指针', file: 'cpp/smart-pointer.md' }
    ],
    os: [
        { title: '进程与线程', file: 'os/process-thread.md' },
        { title: '内存管理', file: 'os/memory.md' },
        { title: '文件系统', file: 'os/filesystem.md' }
    ],
    network: [
        { title: 'TCP/IP 协议', file: 'network/tcp-ip.md' },
        { title: 'HTTP 协议', file: 'network/http.md' },
        { title: '网络安全', file: 'network/security.md' }
    ]
};

let currentCategory = 'cpp';
let currentArticle = null;
let isSearching = false;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSearch();
    loadArticleList('cpp');
    loadMarkdown('cpp/cpp-basic.md');
});

// 初始化导航
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const category = item.dataset.category;
            isSearching = false;
            document.getElementById('searchInput').value = '';
            
            // 更新导航状态
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // 加载文章列表
            loadArticleList(category);
            currentCategory = category;
        });
    });
}

// 初始化搜索
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        
        if (query === '') {
            isSearching = false;
            loadArticleList(currentCategory);
            return;
        }
        
        isSearching = true;
        searchArticles(query);
    });
    
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            searchInput.value = '';
            isSearching = false;
            loadArticleList(currentCategory);
            searchInput.blur();
        }
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });
}

// 搜索文章
function searchArticles(query) {
    const articleList = document.getElementById('articleList');
    const categoryTitle = document.querySelector('.category-title');
    const searchQuery = query.toLowerCase();
    
    categoryTitle.textContent = '搜索结果';
    
    // 收集所有文章
    let allArticles = [];
    Object.keys(articles).forEach(category => {
        articles[category].forEach(article => {
            allArticles.push({
                ...article,
                category: category
            });
        });
    });
    
    // 过滤文章
    const filteredArticles = allArticles.filter(article =>
        article.title.toLowerCase().includes(searchQuery)
    );
    
    if (filteredArticles.length === 0) {
        articleList.innerHTML = `
            <li style="padding: 1rem; text-align: center; color: #9ca3af;">
                未找到匹配的文章
            </li>
        `;
        return;
    }
    
    // 生成搜索结果
    articleList.innerHTML = filteredArticles.map(article => `
        <li>
            <a href="#" data-file="${article.file}" data-category="${article.category}">
                ${article.title}
                <span style="display: block; font-size: 0.8rem; color: #9ca3af; margin-top: 0.25rem;">
                    ${getCategoryName(article.category)}
                </span>
            </a>
        </li>
    `).join('');
    
    // 添加点击事件
    articleList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const file = link.dataset.file;
            const category = link.dataset.category;
            
            // 更新活动状态
            articleList.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            
            // 加载文章
            loadMarkdown(file);
            
            // 更新导航状态
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(nav => {
                nav.classList.remove('active');
                if (nav.dataset.category === category) {
                    nav.classList.add('active');
                }
            });
        });
    });
}

// 获取分类名称
function getCategoryName(category) {
    const nameMap = {
        cpp: 'C++',
        os: '操作系统',
        network: '计算机网络'
    };
    return nameMap[category] || category;
}

// 加载文章列表
function loadArticleList(category) {
    const articleList = document.getElementById('articleList');
    const categoryTitle = document.querySelector('.category-title');
    
    // 更新分类标题
    const titleMap = {
        cpp: 'C++',
        os: '操作系统',
        network: '计算机网络'
    };
    categoryTitle.textContent = titleMap[category];
    
    // 生成文章列表
    articleList.innerHTML = articles[category].map((article, index) => `
        <li>
            <a href="#" data-file="${article.file}" data-index="${index}">
                ${article.title}
            </a>
        </li>
    `).join('');
    
    // 添加点击事件
    articleList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const file = link.dataset.file;
            
            // 更新活动状态
            articleList.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            
            // 加载文章
            loadMarkdown(file);
        });
    });
    
    // 默认激活第一篇文章
    if (articles[category].length > 0) {
        const firstLink = articleList.querySelector('a');
        firstLink.classList.add('active');
    }
}

// 加载 Markdown 文件
async function loadMarkdown(filename) {
    const contentDiv = document.getElementById('markdownContent');
    
    try {
        const response = await fetch(`docs/${filename}`);
        if (!response.ok) {
            throw new Error('无法加载文件');
        }
        
        const markdown = await response.text();
        
        // 渲染 Markdown
        const html = marked.parse(markdown);
        contentDiv.innerHTML = html;
        
        // 生成目录
        generateTOC();
        
    } catch (error) {
        contentDiv.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <h2>文档加载失败</h2>
                <p style="color: #6b7280; margin-top: 1rem;">无法加载文件: ${filename}</p>
                <p style="color: #6b7280; margin-top: 0.5rem;">请确保文档文件存在于 docs 目录中</p>
            </div>
        `;
    }
}

// 生成目录
function generateTOC() {
    const toc = document.getElementById('tableOfContents');
    const headings = document.querySelectorAll('.markdown-body h2, .markdown-body h3');
    
    if (headings.length === 0) {
        toc.innerHTML = '<p style="color: #9ca3af; font-size: 0.9rem;">暂无目录</p>';
        return;
    }
    
    let tocHtml = '<ul>';
    let currentLevel = 2;
    
    headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent;
        const id = 'heading-' + index;
        
        heading.id = id;
        
        if (level > currentLevel) {
            tocHtml += '<ul>';
        } else if (level < currentLevel) {
            tocHtml += '</ul>';
        }
        
        const indent = (level - 2) * 1;
        tocHtml += `
            <li style="margin-left: ${indent}rem;">
                <a href="#${id}">${text}</a>
            </li>
        `;
        
        currentLevel = level;
    });
    
    tocHtml += '</ul>';
    toc.innerHTML = tocHtml;
    
    // 平滑滚动
    toc.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
