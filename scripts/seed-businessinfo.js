/**
 * seed-businessinfo.js — Semeia o documento businessInfo da Academia Olimpus no Firestore.
 *
 * Uso:
 *   node scripts/seed-businessinfo.js
 *
 * Usa firebase-admin do pacote marieta/node_modules (evita reinstalar aqui).
 * Credenciais: serviceAccountProd.json do cardapio-admin.
 */

var path = require('path');
var fs = require('fs');

// Reaproveita firebase-admin já instalado no projeto marieta
var adminModulePath = path.join(__dirname, '..', '..', 'marieta', 'node_modules', 'firebase-admin');
if (!fs.existsSync(adminModulePath)) {
  console.error('ERRO: firebase-admin não encontrado em ' + adminModulePath);
  console.error('Rode "npm install firebase-admin" em C:\\dev\\clientes\\marieta ou instale localmente.');
  process.exit(1);
}
var admin = require(adminModulePath);

var SERVICE_ACCOUNT_PATH = path.join('C:', 'dev', 'cardapio-admin', 'serviceAccountProd.json');
if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error('ERRO: serviceAccountProd.json não encontrado em ' + SERVICE_ACCOUNT_PATH);
  process.exit(1);
}

var SLUG = 'academia-olimpus';
var serviceAccount = require(SERVICE_ACCOUNT_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'cardapio-admin-prod'
});
var db = admin.firestore();

var businessInfo = {
  name: 'Academia Olimpus',
  city: 'Taquaritinga - SP',
  slogan: 'A melhor experiência de treino de Taquaritinga',
  tagline: 'Estrutura premium · Ambiente 100% climatizado',
  whatsapp: '(16) 3253-3000',
  whatsappNumber: '551632533000',
  phone: '(16) 3253-3000',
  address: 'Av. Saverio Salvagni, 150',
  neighborhood: 'Jardim Bela Vista',
  cityState: 'Taquaritinga — SP',
  cep: '15905-028',
  instagram: 'https://www.instagram.com/academiaolimpustq',
  facebook: '',
  googleMapsLink: 'https://www.google.com/maps/search/?api=1&query=Av.%20Saverio%20Salvagni%2C%20150%20-%20Jardim%20Bela%20Vista%2C%20Taquaritinga%20-%20SP%2C%2015905-028',
  googleMapsEmbed: 'https://www.google.com/maps?q=Av.%20Saverio%20Salvagni,%20150%20-%20Jardim%20Bela%20Vista,%20Taquaritinga%20-%20SP,%2015905-028&output=embed',
  hours: {
    funcionamento: 'Seg a Sex 05h30–22h · Sáb 08h–12h · Dom fechado',
    almoco: '',
    jantar: '',
    completo: 'Seg a Sex 05h30–22h · Sáb 08h–12h · Domingos e feriados: fechado'
  }
};

async function run() {
  console.log('Semeando businessInfo para ' + SLUG + ' em cardapio-admin-prod...');
  var ref = db.collection('restaurants').doc(SLUG).collection('data').doc('businessInfo');
  await ref.set({
    content: businessInfo,
    updatedAt: new Date().toISOString()
  });
  console.log('OK — businessInfo salvo.');

  // Garante que o doc-raiz do restaurant exista (para aparecer na listagem do admin)
  var rootRef = db.collection('restaurants').doc(SLUG);
  var rootSnap = await rootRef.get();
  if (!rootSnap.exists) {
    await rootRef.set({
      name: businessInfo.name,
      slug: SLUG,
      type: 'academia',
      active: true,
      createdAt: new Date().toISOString()
    });
    console.log('OK — doc-raiz restaurants/' + SLUG + ' criado.');
  } else {
    console.log('Doc-raiz já existia, preservado.');
  }

  process.exit(0);
}

run().catch(function(err) {
  console.error('Erro:', err && err.stack ? err.stack : err);
  process.exit(1);
});
