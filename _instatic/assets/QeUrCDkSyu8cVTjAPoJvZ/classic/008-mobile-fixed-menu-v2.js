// 移动端固定侧边栏收起/展开功能
document.addEventListener('DOMContentLoaded', function() {
    const fixedMenu = document.querySelector('.fixedewm');
    
    if (!fixedMenu) return;
    
    let isInitialized = false;
    let outsideClickHandler = null;
    
    // 检测是否为移动端
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // 收起菜单
    function collapseMenu() {
        fixedMenu.classList.remove('mobile-expanded');
        fixedMenu.classList.add('mobile-collapsed');
    }
    
    // 展开菜单
    function expandMenu() {
        fixedMenu.classList.remove('mobile-collapsed');
        fixedMenu.classList.add('mobile-expanded');
    }
    
    // 初始化移动端固定菜单
    function initMobileFixedMenu() {
        // 移除之前的事件监听器
        if (outsideClickHandler) {
            document.removeEventListener('click', outsideClickHandler);
        }
        
        if (isMobile()) {
            // 移动端默认收起状态
            collapseMenu();
            
            if (!isInitialized) {
                // 只在首次初始化时添加点击事件
                fixedMenu.addEventListener('click', function(e) {
                    // 如果点击的是菜单项链接，不处理展开/收起逻辑
                    if (e.target.tagName === 'A' || e.target.closest('a')) {
                        return;
                    }
                    
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (fixedMenu.classList.contains('mobile-collapsed')) {
                        expandMenu();
                    } else {
                        collapseMenu();
                    }
                });
                
                // 点击菜单项后自动收起
                const menuItems = fixedMenu.querySelectorAll('.menu-item a');
                menuItems.forEach(item => {
                    item.addEventListener('click', function() {
                        // 允许链接正常跳转，不阻止默认行为
                        setTimeout(() => {
                            collapseMenu();
                        }, 200); // 延迟收起，让用户看到点击效果
                    });
                });
                
                isInitialized = true;
            }
            
            // 点击页面其他区域自动收起菜单
            outsideClickHandler = function(e) {
                // 检查点击是否在固定菜单外部，且菜单处于展开状态
                if (!fixedMenu.contains(e.target) && 
                    fixedMenu.classList.contains('mobile-expanded') &&
                    // 确保不是点击在导航菜单上
                    !document.querySelector('.nav').contains(e.target) &&
                    !document.getElementById('mobileMenuToggle').contains(e.target)) {
                    collapseMenu();
                }
            };
            document.addEventListener('click', outsideClickHandler);
            
        } else {
            // 桌面端移除移动端样式和事件
            fixedMenu.classList.remove('mobile-collapsed', 'mobile-expanded');
            if (outsideClickHandler) {
                document.removeEventListener('click', outsideClickHandler);
                outsideClickHandler = null;
            }
            isInitialized = false;
        }
    }
    
    // 初始化
    initMobileFixedMenu();
    
    // 监听窗口大小变化
    window.addEventListener('resize', function() {
        initMobileFixedMenu();
    });
});
