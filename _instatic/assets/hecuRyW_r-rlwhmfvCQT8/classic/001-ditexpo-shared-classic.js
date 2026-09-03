/* ditexpo-shared-classic — 倒计时 + 汉堡菜单 + 侧栏菜单 + 同期活动 */
(function () {
  /** HTML 导入会去掉 button 内空 <span>；这里补回三条汉堡图标线。 */
  function ensureHamburgerBars(btn) {
    if (!btn) return;
    if (btn.querySelectorAll('span').length >= 3) return;
    btn.textContent = '';
    for (var i = 0; i < 3; i++) btn.appendChild(document.createElement('span'));
  }

  function initCountdown() {
    var targetDate = new Date('2026-12-10T09:00:00');

    function updateCountdown() {
      var now = new Date();
      var timeDiff = targetDate - now;

      if (timeDiff <= 0) {
        var mobileCountdownTimer = document.querySelector('.mobile-countdown-timer');
        var desktopCountdownTimer = document.querySelector('.desktop-countdown-timer');
        if (mobileCountdownTimer) {
          mobileCountdownTimer.innerHTML =
            '<div style="text-align: center; font-size: 18px; color: #fff;">展会已结束</div>';
        }
        if (desktopCountdownTimer) {
          desktopCountdownTimer.innerHTML =
            '<div style="text-align: center; font-size: 20px; color: #000;">展会已结束</div>';
        }
        return;
      }

      var days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      var daysStr = days.toString().padStart(3, '0');
      var hoursStr = hours.toString().padStart(2, '0');
      var minutesStr = minutes.toString().padStart(2, '0');
      var secondsStr = seconds.toString().padStart(2, '0');
      var timeValues = [
        hoursStr[0], hoursStr[1],
        minutesStr[0], minutesStr[1],
        secondsStr[0], secondsStr[1],
      ];

      function flipDigits(nodes, values) {
        nodes.forEach(function (digit, index) {
          var newValue = values[index];
          if (newValue == null || digit.textContent === newValue) return;
          digit.classList.add('flip');
          setTimeout(function () {
            digit.textContent = newValue;
            digit.classList.remove('flip');
          }, 300);
        });
      }

      flipDigits(document.querySelectorAll('.desktop-days-digit'), daysStr);
      flipDigits(document.querySelectorAll('.desktop-time-digit'), timeValues);
      flipDigits(document.querySelectorAll('.mobile-days-digit'), daysStr);
      flipDigits(document.querySelectorAll('.mobile-time-digit'), timeValues);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  function initMobileMenu() {
    var mobileMenuToggle = document.getElementById('mobileMenuToggle');
    var nav = document.querySelector('.nav');
    if (!mobileMenuToggle || !nav) return;

    ensureHamburgerBars(mobileMenuToggle);

    mobileMenuToggle.addEventListener('click', function () {
      nav.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : 'auto';
    });

    document.addEventListener('click', function (e) {
      var fixed = document.querySelector('.fixedewm');
      if (
        !nav.contains(e.target) &&
        !mobileMenuToggle.contains(e.target) &&
        nav.classList.contains('active') &&
        !(fixed && fixed.contains(e.target))
      ) {
        nav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        nav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function () {
        if (nav.classList.contains('active')) {
          nav.classList.remove('active');
          mobileMenuToggle.classList.remove('active');
          document.body.style.overflow = 'auto';
        }
      });
    });
  }

  function initMobileFixedMenu() {
    var fixedMenu = document.querySelector('.fixedewm');
    if (!fixedMenu) return;

    var isInitialized = false;
    var outsideClickHandler = null;

    function isMobile() {
      return window.innerWidth <= 768;
    }
    function collapseMenu() {
      fixedMenu.classList.remove('mobile-expanded');
      fixedMenu.classList.add('mobile-collapsed');
    }
    function expandMenu() {
      fixedMenu.classList.remove('mobile-collapsed');
      fixedMenu.classList.add('mobile-expanded');
    }

    function setup() {
      if (outsideClickHandler) {
        document.removeEventListener('click', outsideClickHandler);
        outsideClickHandler = null;
      }

      if (isMobile()) {
        collapseMenu();
        if (!isInitialized) {
          fixedMenu.addEventListener('click', function (e) {
            if (e.target.tagName === 'A' || e.target.closest('a')) return;
            e.preventDefault();
            e.stopPropagation();
            if (fixedMenu.classList.contains('mobile-collapsed')) expandMenu();
            else collapseMenu();
          });
          fixedMenu.querySelectorAll('.menu-item a').forEach(function (item) {
            item.addEventListener('click', function () {
              setTimeout(collapseMenu, 200);
            });
          });
          isInitialized = true;
        }
        outsideClickHandler = function (e) {
          var nav = document.querySelector('.nav');
          var toggle = document.getElementById('mobileMenuToggle');
          if (
            !fixedMenu.contains(e.target) &&
            fixedMenu.classList.contains('mobile-expanded') &&
            !(nav && nav.contains(e.target)) &&
            !(toggle && toggle.contains(e.target))
          ) {
            collapseMenu();
          }
        };
        document.addEventListener('click', outsideClickHandler);
      } else {
        fixedMenu.classList.remove('mobile-collapsed', 'mobile-expanded');
        isInitialized = false;
      }
    }

    setup();
    window.addEventListener('resize', setup);
  }

  function initConferenceList() {
    var conferenceList = document.getElementById('conferenceList');
    var viewMoreBtn = document.getElementById('viewMoreBtn');
    if (!conferenceList || !viewMoreBtn) return;

    var titles = conferenceList.querySelectorAll('.conference-title');
    var allContentItems = conferenceList.querySelectorAll('.conference-content');
    if (allContentItems.length <= 6) {
      viewMoreBtn.classList.add('hidden');
      return;
    }

    var concurrentEventsTitle = null;
    titles.forEach(function (title) {
      if (title.textContent.trim() === '同期活动') concurrentEventsTitle = title;
    });
    if (!concurrentEventsTitle) {
      viewMoreBtn.classList.add('hidden');
      return;
    }

    var concurrentEventsItems = [];
    var foundConcurrentEvents = false;
    allContentItems.forEach(function (item) {
      if (foundConcurrentEvents) {
        if (
          item.previousElementSibling &&
          item.previousElementSibling.classList.contains('conference-title')
        ) {
          return;
        }
        concurrentEventsItems.push(item);
      } else {
        var currentItem = item;
        while (currentItem.previousElementSibling) {
          currentItem = currentItem.previousElementSibling;
          if (
            currentItem.classList.contains('conference-title') &&
            currentItem.textContent.trim() === '同期活动'
          ) {
            foundConcurrentEvents = true;
            concurrentEventsItems.push(item);
            break;
          }
        }
      }
    });

    if (concurrentEventsItems.length <= 6) {
      viewMoreBtn.classList.add('hidden');
      return;
    }

    concurrentEventsItems.forEach(function (item, index) {
      item.style.display = index >= 6 ? 'none' : 'block';
    });

    var isExpanded = false;
    viewMoreBtn.addEventListener('click', function () {
      isExpanded = !isExpanded;
      concurrentEventsItems.forEach(function (item, index) {
        if (index >= 6) item.style.display = isExpanded ? 'block' : 'none';
      });
      viewMoreBtn.textContent = isExpanded ? '收起《' : '查看全部》';
    });
  }

  initCountdown();
  initMobileMenu();
  initMobileFixedMenu();
  initConferenceList();
})();
