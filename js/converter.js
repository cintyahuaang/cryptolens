
(function(){
  const key = "cryptoapp-theme";
  const switchEl = document.getElementById("themeSwitch");
  let theme = localStorage.getItem(key) || "dark";
  document.body.classList.toggle("dark", theme==="dark");
  if(switchEl){
    switchEl.checked = theme==="dark";
    switchEl.addEventListener("change", () => {
      theme = switchEl.checked ? "dark" : "light";
      document.body.classList.toggle("dark", theme==="dark");
      localStorage.setItem(key, theme);
      location.reload();
    });
  }
})();
