/* Shared scroll-spy + smooth-scroll for the guide pages' .ag-jump sub-nav. */
(function () {
  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }
  onReady(function () {
    var nav = document.querySelector('.ag-guide .ag-jump');
    if (!nav) return;
    var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
    if (!links.length) return;
    var ids = links.map(function (a) { return (a.getAttribute('href') || '').replace('#', ''); });
    var targets = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var OFFSET = 90;

    function setActive(id) {
      links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + id); });
    }

    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = (this.getAttribute('href') || '').replace('#', '');
        var el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        var y = el.getBoundingClientRect().top + window.pageYOffset - OFFSET;
        window.scrollTo({ top: y, behavior: 'smooth' });
        history.replaceState(null, '', '#' + id);
      });
    });

    if (targets.length) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
      }, { rootMargin: '-100px 0px -65% 0px', threshold: 0 });
      targets.forEach(function (t) { obs.observe(t); });
      setActive(ids[0]);
    }
  });
})();
