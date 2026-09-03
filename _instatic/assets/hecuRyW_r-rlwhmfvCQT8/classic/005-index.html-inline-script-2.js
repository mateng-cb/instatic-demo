// 全局错误处理，屏蔽Swiper相关错误
        window.addEventListener('error', function (e) {
            if (e.message && (e.message.includes('pointer is not defined') || e.message.includes('pointer'))) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });

        window.onerror = function (message, source, lineno, colno, error) {
            if (message && (message.includes('pointer is not defined') || message.includes('pointer'))) {
                return true; // 阻止错误显示
            }
        };

        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());

        gtag('config', 'G-TQCKMEVJTF');