(() => {
  // <stdin>
  var TOCManager = class {
    constructor() {
      this.elements = {};
      this.gumshoe = null;
      this.isVisible = false;
      this.init();
    }
    // 初始化
    init() {
      this.cacheElements();
      if (!this.elements.card) return;
      this.bindEvents();
      this.initGumshoe();
      this.exposeAPI();
    }
    // 缓存 DOM 元素
    cacheElements() {
      this.elements = {
        card: document.getElementById("toc-card"),
        overlay: document.getElementById("toc-overlay"),
        closeBtn: document.getElementById("toc-close"),
        content: document.getElementById("toc-content")
      };
    }
    // 绑定事件
    bindEvents() {
      const { closeBtn, overlay, content } = this.elements;
      closeBtn?.addEventListener("click", () => this.hide());
      overlay?.addEventListener("click", () => this.hide());
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isVisible) {
          this.hide();
        }
      });
      content?.addEventListener("click", (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        e.preventDefault();
        this.scrollToTarget(link.hash);
      });
    }
    // 滚动到目标位置
    scrollToTarget(hash) {
      const targetId = this.decodeHash(hash);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
        setTimeout(() => this.hide(), 300);
      }
    }
    // 解码 hash
    decodeHash(hash) {
      try {
        return decodeURIComponent(hash.substring(1));
      } catch (e) {
        console.warn("Hash \u89E3\u7801\u5931\u8D25:", hash);
        return hash.substring(1);
      }
    }
    // 初始化 Gumshoe
    initGumshoe() {
      if (typeof Gumshoe === "undefined") {
        console.warn("Gumshoe \u5E93\u672A\u52A0\u8F7D");
        return;
      }
      const tocLinks = document.querySelectorAll("#toc-content a");
      if (tocLinks.length === 0) return;
      this.gumshoe = new Gumshoe("#toc-content a", {
        offset: () => window.innerHeight * 0.2,
        reflow: true,
        nested: true,
        nestedClass: "active-parent",
        navClass: "active",
        contentClass: "active",
        events: true
      });
    }
    // 显示目录
    show() {
      if (!this.elements.card || this.isVisible) return;
      this.isVisible = true;
      this.toggleElements(true);
      document.body.style.overflow = "hidden";
    }
    // 隐藏目录
    hide() {
      if (!this.elements.card || !this.isVisible) return;
      this.isVisible = false;
      this.toggleElements(false);
      document.body.style.overflow = "";
    }
    // 切换目录显示
    toggle() {
      this.isVisible ? this.hide() : this.show();
    }
    // 切换元素显示状态
    toggleElements(show) {
      const { card, overlay } = this.elements;
      if (show) {
        overlay.classList.remove("opacity-0", "pointer-events-none");
        overlay.classList.add("opacity-100");
        card.classList.remove("opacity-0", "scale-95", "pointer-events-none");
        card.classList.add("opacity-100", "scale-100");
      } else {
        overlay.classList.add("opacity-0", "pointer-events-none");
        overlay.classList.remove("opacity-100");
        card.classList.add("opacity-0", "scale-95", "pointer-events-none");
        card.classList.remove("opacity-100", "scale-100");
      }
    }
    // 暴露 API
    exposeAPI() {
      window.TOC = {
        show: () => this.show(),
        hide: () => this.hide(),
        toggle: () => this.toggle(),
        isVisible: () => this.isVisible,
        initialized: true
      };
    }
    // 清理资源
    destroy() {
      this.gumshoe?.destroy();
      document.body.style.overflow = "";
    }
  };
  function initTOC() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => new TOCManager());
    } else {
      setTimeout(() => new TOCManager(), 50);
    }
  }
  window.addEventListener("beforeunload", () => {
    window.tocManager?.destroy();
  });
  initTOC();
})();
