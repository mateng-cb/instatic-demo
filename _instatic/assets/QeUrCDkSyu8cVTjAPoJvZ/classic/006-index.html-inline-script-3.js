let currentSlide = 0;
            const slides = document.querySelectorAll('.carousel-slide');
            const totalSlides = slides.length;
            const prevButton = document.getElementById('prev');
            const nextButton = document.getElementById('next');
            const indicatorsContainer = document.querySelector('.carousel-indicators');

            let startX = 0;
            let endX = 0;

            function generateIndicators() {
                if (indicatorsContainer) {
                    indicatorsContainer.innerHTML = ''; // 清空指示器容器
                    let visibleSlideIndex = 0;
                    for (let i = 0; i < totalSlides; i++) {
                        const indicator = document.createElement('span');
                        indicator.classList.add('carousel-indicator');
                        if (visibleSlideIndex === currentSlide) {
                            indicator.classList.add('active');
                        }
                        indicator.dataset.slideTo = i;
                        indicatorsContainer.appendChild(indicator);
                        visibleSlideIndex++;
                    }
                }
            }

            function showSlide(index) {
                slides[currentSlide].classList.remove('active');
                const activeIndicator = document.querySelector('.carousel-indicator.active');
                if (activeIndicator) {
                    activeIndicator.classList.remove('active');
                }
                currentSlide = (index + totalSlides) % totalSlides;
                slides[currentSlide].classList.add('active');
                if (indicatorsContainer) {
                    const newActiveIndicator = indicatorsContainer.querySelector('[data-slide-to="' + currentSlide + '"]');
                    if (newActiveIndicator) {
                        newActiveIndicator.classList.add('active');
                    }
                }
            }

            // 只有当按钮存在时才添加事件监听器
            if (prevButton) {
                prevButton.addEventListener('click', () => {
                    showSlide(currentSlide - 1);
                });
            }

            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    showSlide(currentSlide + 1);
                });
            }

            window.addEventListener('resize', () => {
                generateIndicators();
                showSlide(currentSlide);
            });

            generateIndicators();

            if (indicatorsContainer) {
                indicatorsContainer.addEventListener('click', (e) => {
                    if (e.target.classList.contains('carousel-indicator')) {
                        const index = parseInt(e.target.dataset.slideTo);
                        showSlide(index);
                    }
                });
            }

            setInterval(() => {
                showSlide(currentSlide + 1);
            }, 5000);

            // 添加触摸事件监听器
            const carousel = document.querySelector('.carousel');

            if (carousel) {
                carousel.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                });

                carousel.addEventListener('touchmove', (e) => {
                    endX = e.touches[0].clientX;
                });

                carousel.addEventListener('touchend', () => {
                    if (startX > endX + 50) {
                        // 向左滑动
                        showSlide(currentSlide + 1);
                    } else if (startX < endX - 50) {
                        // 向右滑动
                        showSlide(currentSlide - 1);
                    }
                });
            }