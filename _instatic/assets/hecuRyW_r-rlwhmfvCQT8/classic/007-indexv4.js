/**
 * DITExpo Index Script
 * @version 4.1.0
 * @date 2025-12-15
 */

// 简单的锚点跳转处理 - 只处理移动端菜单关闭
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // 移动端菜单处理
        const nav = document.querySelector('.nav');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        
        if (nav && nav.classList.contains('active')) {
            // 移动端菜单打开时，关闭菜单
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        // 让浏览器自然处理锚点跳转，不阻止默认行为
        // 确保不会因为事件冒泡导致意外跳转
        e.stopPropagation();
    });
});


// 会议列表展开/收起功能
function initConferenceList() {
    const conferenceList = document.getElementById('conferenceList');
    const viewMoreBtn = document.getElementById('viewMoreBtn');

    if (!conferenceList || !viewMoreBtn) return;

    // 获取所有标题和内容项
    const titles = conferenceList.querySelectorAll('.conference-title');
    const allContentItems = conferenceList.querySelectorAll('.conference-content');
    
    // 计算总的内容行数
    const totalItems = allContentItems.length;

    // 如果内容不超过6条，隐藏"查看全部"按钮
    if (totalItems <= 6) {
        viewMoreBtn.classList.add('hidden');
        return;
    }

    // 找到"同期活动"标题
    let concurrentEventsTitle = null;
    titles.forEach(title => {
        if (title.textContent.trim() === '同期活动') {
            concurrentEventsTitle = title;
        }
    });

    if (!concurrentEventsTitle) {
        viewMoreBtn.classList.add('hidden');
        return;
    }

    // 获取"同期活动"标题下的所有内容项
    const concurrentEventsItems = [];
    let foundConcurrentEvents = false;
    
    allContentItems.forEach(item => {
        if (foundConcurrentEvents) {
            // 如果遇到下一个标题，停止收集
            if (item.previousElementSibling && item.previousElementSibling.classList.contains('conference-title')) {
                return;
            }
            concurrentEventsItems.push(item);
        } else {
            // 检查这个内容项是否在"同期活动"标题下
            let currentItem = item;
            while (currentItem.previousElementSibling) {
                currentItem = currentItem.previousElementSibling;
                if (currentItem.classList.contains('conference-title') && currentItem.textContent.trim() === '同期活动') {
                    foundConcurrentEvents = true;
                    concurrentEventsItems.push(item);
                    break;
                }
            }
        }
    });

    // 如果"同期活动"下的内容不超过6条，隐藏按钮
    if (concurrentEventsItems.length <= 6) {
        viewMoreBtn.classList.add('hidden');
        return;
    }

    // 默认只显示"同期活动"下的前6条内容行
    concurrentEventsItems.forEach((item, index) => {
        if (index >= 6) {
            item.style.display = 'none';
        } else {
            item.style.display = 'block';
        }
    });

    let isExpanded = false;

    viewMoreBtn.addEventListener('click', function() {
        isExpanded = !isExpanded;

        if (isExpanded) {
            // 展开"同期活动"下的全部内容行
            concurrentEventsItems.forEach((item, index) => {
                if (index >= 6) {
                    item.style.display = 'block';
                }
            });
            viewMoreBtn.textContent = '收起《';
        } else {
            // 收起"同期活动"下的多余内容行
            concurrentEventsItems.forEach((item, index) => {
                if (index >= 6) {
                    item.style.display = 'none';
                }
            });
            viewMoreBtn.textContent = '查看全部》';
        }
    });
}

// 初始化新闻中心轮播
document.addEventListener('DOMContentLoaded', function() {
    // 初始化会议列表
    initConferenceList();
    
    // 检查是否存在新闻轮播容器
    const newsSwiperContainer = document.querySelector('.news-swiper');
    if (newsSwiperContainer) {
        const newsSwiper = new Swiper('.news-swiper', {
            // 基本配置
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            speed: 800,
            
            // 分页器配置
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
            },
            
            // 效果配置
            effect: 'slide',
            
            // 禁用pointer事件以避免错误
            allowTouchMove: true,
            touchRatio: 1,
            touchAngle: 45,
            grabCursor: true,
            
            // 响应式配置
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 1,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 1,
                    spaceBetween: 30,
                }
            },
            
            // 事件回调
            on: {
                init: function() {
                    console.log('新闻中心轮播初始化完成');
                },
                slideChange: function() {
                    console.log('轮播切换到第', this.activeIndex + 1, '页');
                }
            }
        });
    }
});

// 倒计时功能
function initCountdown() {
    const targetDate = new Date('2026-12-10T09:00:00');
    
    function updateCountdown() {
        const now = new Date();
        const timeDiff = targetDate - now;
        
        if (timeDiff <= 0) {
            // 倒计时结束
            const mobileCountdownTimer = document.querySelector('.mobile-countdown-timer');
            const desktopCountdownTimer = document.querySelector('.desktop-countdown-timer');
            
            if (mobileCountdownTimer) {
                mobileCountdownTimer.innerHTML = '<div style="text-align: center; font-size: 18px; color: #fff;">展会已结束</div>';
            }
            if (desktopCountdownTimer) {
                desktopCountdownTimer.innerHTML = '<div style="text-align: center; font-size: 20px; color: #000;">展会已结束</div>';
            }
            return;
        }
        
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        // 格式化数字（补零）
        const daysStr = days.toString().padStart(3, '0');
        const hoursStr = hours.toString().padStart(2, '0');
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');
        
        // 更新PC端轮播内倒计时天数
        const desktopDaysDigits = document.querySelectorAll('.desktop-days-digit');
        desktopDaysDigits.forEach((digit, index) => {
            const newValue = daysStr[index];
            if (digit.textContent !== newValue) {
                digit.classList.add('flip');
                setTimeout(() => {
                    digit.textContent = newValue;
                    digit.classList.remove('flip');
                }, 300);
            }
        });
        
        // 时分秒数组（PC端和移动端共用）
        const timeValues = [hoursStr[0], hoursStr[1], minutesStr[0], minutesStr[1], secondsStr[0], secondsStr[1]];
        
        // 更新PC端轮播内倒计时时分秒
        const desktopTimeDigits = document.querySelectorAll('.desktop-time-digit');
        desktopTimeDigits.forEach((digit, index) => {
            const newValue = timeValues[index];
            if (digit.textContent !== newValue) {
                digit.classList.add('flip');
                setTimeout(() => {
                    digit.textContent = newValue;
                    digit.classList.remove('flip');
                }, 300);
            }
        });
        
        // 更新移动端天数
        const mobileDaysDigits = document.querySelectorAll('.mobile-days-digit');
        mobileDaysDigits.forEach((digit, index) => {
            const newValue = daysStr[index];
            if (digit.textContent !== newValue) {
                digit.classList.add('flip');
                setTimeout(() => {
                    digit.textContent = newValue;
                    digit.classList.remove('flip');
                }, 300);
            }
        });
        
        // 更新移动端时分秒
        const mobileTimeDigits = document.querySelectorAll('.mobile-time-digit');
        mobileTimeDigits.forEach((digit, index) => {
            const newValue = timeValues[index];
            if (digit.textContent !== newValue) {
                digit.classList.add('flip');
                setTimeout(() => {
                    digit.textContent = newValue;
                    digit.classList.remove('flip');
                }, 300);
            }
        });
    }
    
    // 立即更新一次
    updateCountdown();
    
    // 每秒更新
    setInterval(updateCountdown, 1000);
}

// 页面加载完成后初始化倒计时
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    initMapModal();
    initMobileMenu();
    
    // 防止空白区域点击导致页面跳转
    document.addEventListener('click', function(e) {
        // 如果点击的是空白区域（没有具体元素），阻止默认行为
        if (e.target === document.body || e.target === document.documentElement) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
});

// 地图弹窗功能
function initMapModal() {
    const modal = document.getElementById('mapModal');
    const modalImage = document.getElementById('modalMapImage');
    const closeBtn = document.querySelector('.map-modal-close');
    const mapImages = document.querySelectorAll('.map-image');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const resetBtn = document.getElementById('resetZoom');
    
    let currentScale = 1;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let translateX = 0;
    let translateY = 0;
    let savedScrollPosition = 0;
    
    // 点击地图图片打开弹窗
    mapImages.forEach(img => {
        img.addEventListener('click', function() {
            // 保存当前滚动位置
            savedScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            
            modalImage.src = this.src;
            modalImage.alt = this.alt;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // 重置缩放和位置
            resetMapView();
        });
    });
    
    // 关闭弹窗
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC键关闭弹窗
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    // 缩放按钮
    zoomInBtn.addEventListener('click', () => zoomMap(1.2));
    zoomOutBtn.addEventListener('click', () => zoomMap(0.8));
    resetBtn.addEventListener('click', resetMapView);
    
    // 鼠标滚轮缩放
    modalImage.addEventListener('wheel', function(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        zoomMap(delta);
    });
    
    // 拖拽功能
    modalImage.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    
    // 触摸设备支持
    modalImage.addEventListener('touchstart', handleTouchStart);
    modalImage.addEventListener('touchmove', handleTouchMove);
    modalImage.addEventListener('touchend', handleTouchEnd);
    
    function closeModal() {
        modal.style.display = 'none';
        
        // 恢复保存的滚动位置
        window.scrollTo(0, savedScrollPosition);
        
        // 延迟恢复滚动状态，确保位置恢复完成
        setTimeout(() => {
            document.body.style.overflow = 'auto';
        }, 50);
    }
    
    function zoomMap(factor) {
        currentScale *= factor;
        currentScale = Math.max(0.5, Math.min(currentScale, 5)); // 限制缩放范围
        updateTransform();
    }
    
    function resetMapView() {
        currentScale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    }
    
    function updateTransform() {
        modalImage.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
    }
    
    function startDrag(e) {
        if (currentScale > 1) {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            modalImage.style.cursor = 'grabbing';
        }
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateTransform();
        }
    }
    
    function endDrag() {
        isDragging = false;
        modalImage.style.cursor = currentScale > 1 ? 'grab' : 'default';
    }
    
    // 触摸事件处理
    let lastTouchDistance = 0;
    let initialTouchDistance = 0;
    
    function handleTouchStart(e) {
        if (e.touches.length === 2) {
            // 双指缩放
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            initialTouchDistance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );
            lastTouchDistance = initialTouchDistance;
        } else if (e.touches.length === 1 && currentScale > 1) {
            // 单指拖拽
            isDragging = true;
            startX = e.touches[0].clientX - translateX;
            startY = e.touches[0].clientY - translateY;
        }
    }
    
    function handleTouchMove(e) {
        e.preventDefault();
        
        if (e.touches.length === 2) {
            // 双指缩放
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDistance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );
            
            if (lastTouchDistance > 0) {
                const scale = currentDistance / lastTouchDistance;
                currentScale *= scale;
                currentScale = Math.max(0.5, Math.min(currentScale, 5));
                updateTransform();
            }
            
            lastTouchDistance = currentDistance;
        } else if (e.touches.length === 1 && isDragging) {
            // 单指拖拽
            translateX = e.touches[0].clientX - startX;
            translateY = e.touches[0].clientY - startY;
            updateTransform();
        }
    }
    
    function handleTouchEnd(e) {
        isDragging = false;
        lastTouchDistance = 0;
    }
}

// 移动端菜单功能
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            // 切换菜单显示状态
            nav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            
            // 防止背景滚动
            if (nav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
        
        // 移除导航链接的菜单关闭处理，避免与锚点跳转冲突
        // 锚点跳转会在主事件处理器中统一处理菜单关闭
        
        // 点击菜单外部区域关闭菜单
        document.addEventListener('click', function(e) {
            // 检查点击是否在导航菜单外部，且菜单处于打开状态
            if (!nav.contains(e.target) && 
                !mobileMenuToggle.contains(e.target) &&
                nav.classList.contains('active') &&
                // 确保不是点击在固定菜单上
                !document.querySelector('.fixedewm').contains(e.target)) {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // 窗口大小改变时重置菜单状态
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

