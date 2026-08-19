(() => {
  if (document.querySelector('.homeflow-main-tabs')) return;
  const shell = document.querySelector('.app-shell');
  if (!shell) return;
  const nav = document.createElement('nav');
  nav.className = 'homeflow-main-tabs';
  nav.setAttribute('aria-label', 'Main views');
  nav.innerHTML = '<a class="homeflow-main-tab active" href="./index.html" aria-current="page">🏠 Home</a><a class="homeflow-main-tab" href="./school.html">🎒 School</a>';
  const style = document.createElement('style');
  style.textContent = `
    .homeflow-main-tabs{display:flex;gap:8px;align-items:center;margin:0 auto 12px;padding:7px;width:max-content;max-width:100%;background:rgba(255,255,255,.9);border:1px solid rgba(120,145,160,.24);border-radius:18px;box-shadow:0 10px 28px rgba(47,70,82,.08);position:relative;z-index:20}
    .homeflow-main-tab{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:10px 16px;border-radius:13px;text-decoration:none;color:#43535e;font-weight:800;line-height:1}
    .homeflow-main-tab.active{background:#273944;color:#fff}
    body.dark-mode .homeflow-main-tabs,.dark-mode .homeflow-main-tabs{background:rgba(30,39,46,.92);border-color:rgba(255,255,255,.12)}
    body.dark-mode .homeflow-main-tab,.dark-mode .homeflow-main-tab{color:#dfe8ed}
    body.dark-mode .homeflow-main-tab.active,.dark-mode .homeflow-main-tab.active{background:#eef4f8;color:#273944}
    @media(max-width:760px){.homeflow-main-tabs{width:calc(100% - 16px);margin:8px auto 10px;position:sticky;top:6px}.homeflow-main-tab{flex:1}}
  `;
  document.head.appendChild(style);
  shell.insertBefore(nav, shell.firstChild);
})();