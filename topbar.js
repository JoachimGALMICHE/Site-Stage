// topbar.js - Module topbar burger partagé
export function initTopbar(auth, db, signOut, getDoc, doc) {
  const RL = {
    'super-admin':'Super-administrateur',
    'moderateur-redaction':'Modérateur de rédaction',
    'redacteur':'Rédacteur',
    'moderateur-comments':'Modérateur de commentaires',
    'lecteur-commentateur':'Lecteur-commentateur',
    'lecteur':'Lecteur'
  };

  // Date
  const dt = document.getElementById('topbar-date');
  if (dt) dt.textContent = new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).replace(/^./,c=>c.toUpperCase());

  // Burger toggle
  window._toggleBurger = function() {
    const b = document.getElementById('burger-btn');
    const m = document.getElementById('burger-menu');
    if (b && m) { b.classList.toggle('open'); m.classList.toggle('show'); }
  };
  document.addEventListener('click', function(e) {
    const m = document.getElementById('burger-menu');
    const b = document.getElementById('burger-btn');
    if (m && b && !m.contains(e.target) && !b.contains(e.target)) {
      m.classList.remove('show'); b.classList.remove('open');
    }
  });

  // Auth state
  auth.onAuthStateChanged(async function(user) {
    const el = document.getElementById('topbar-right');
    if (!el) return;
    if (!user) {
      el.innerHTML = '<a href="connexion.html" style="color:#EDE0CC;font-size:11px;">Connexion</a>';
      return;
    }
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (!snap.exists()) return;
      const p = snap.data();
      window._currentUser = { ...p, uid: user.uid };
      buildBurger(el, p, auth, signOut, RL);
    } catch(e) { console.error(e); }
  });
}

function buildBurger(el, p, auth, signOut, RL) {
  const isSA = p.role === 'super-admin';
  const isMod = p.role === 'super-admin' || p.role === 'moderateur-redaction';
  const isWriter = isMod || p.role === 'redacteur';

  function sep() { return '<div style="height:1px;background:rgba(255,255,255,.08);margin:6px 0;"></div>'; }
  function lnk(href, txt) { return '<a href="' + href + '" style="display:block;padding:10px 20px;color:rgba(255,255,255,.8);text-decoration:none;font-size:13px;transition:background .15s;" onmouseover="this.style.background=\'rgba(255,255,255,.07)\'" onmouseout="this.style.background=\'\'">' + txt + '</a>'; }

  let mi = '';
  mi += '<div style="padding:10px 20px 4px;font-size:10px;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.1em;font-weight:500;">' + p.prenom + ' ' + p.nom + '</div>';
  mi += '<div style="padding:2px 20px 8px;font-size:11px;color:rgba(255,255,255,.4);">' + (RL[p.role] || p.role) + '</div>';
  mi += sep();
  mi += lnk('profil.html', '👤 Mon profil');
  if (isWriter) mi += lnk('creer-article.html', '✏️ Créer un article');
  if (isMod) {
    mi += sep();
    mi += lnk('moderation.html', '📋 Modération');
    mi += lnk('disposition.html', '🗂 Disposition');
  }
  if (isSA) {
    mi += sep();
    mi += lnk('gestion-comptes.html', '👥 Gestion des comptes');
    mi += lnk('auteurs.html', '✍️ Base auteurs');
    mi += lnk('permissions.html', '⚙️ Permissions');
  }
  mi += sep();
  mi += '<button id="_deco_btn" style="display:block;width:100%;text-align:left;padding:10px 20px;font-size:13px;color:rgba(255,255,255,.8);background:none;border:none;cursor:pointer;font-family:inherit;" onmouseover="this.style.background=\'rgba(255,255,255,.07)\'" onmouseout="this.style.background=\'\'"> Déconnexion</button>';

  el.innerHTML = '<span style="color:rgba(255,255,255,.6);font-size:11px;margin-right:10px;">' + p.prenom + ' ' + p.nom + '</span>'
    + '<button id="burger-btn" onclick="window._toggleBurger()" style="background:none;border:none;cursor:pointer;padding:4px 6px;display:inline-flex;flex-direction:column;gap:4px;vertical-align:middle;">'
    + '<span style="display:block;width:18px;height:1.5px;background:#EDE0CC;border-radius:1px;"></span>'
    + '<span style="display:block;width:18px;height:1.5px;background:#EDE0CC;border-radius:1px;"></span>'
    + '<span style="display:block;width:18px;height:1.5px;background:#EDE0CC;border-radius:1px;"></span>'
    + '</button>'
    + '<div id="burger-menu" style="display:none;position:absolute;top:100%;right:0;min-width:220px;background:#2A2A3E;border:1px solid rgba(255,255,255,.08);border-radius:0 0 6px 6px;box-shadow:0 8px 32px rgba(0,0,0,.35);z-index:300;padding:8px 0;">' + mi + '</div>';

  document.getElementById('_deco_btn').onclick = async () => {
    await signOut(auth);
    window.location.href = 'connexion.html';
  };
}
