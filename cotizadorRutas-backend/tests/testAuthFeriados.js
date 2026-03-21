/**
 * Test integral de los 4 bloques implementados.
 * Crea usuario fake, prueba todo, y elimina al final.
 */
import dotenv from 'dotenv';
dotenv.config();

const BASE = 'http://localhost:5010/api';
const TEST_USER = {
  nombre: 'Test Thesis User',
  email: 'test.thesis.cleanup@test.com',
  password: 'TestPass123'
};

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) { passed++; console.log(`  ✅ ${label}`); }
  else { failed++; console.log(`  ❌ FALLO: ${label}`); }
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return { status: res.status, data: await res.json() };
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  return { status: res.status, data: await res.json() };
}

async function runTests() {
  console.log('\n📋 TEST 1: Registro — campos vacíos');
  {
    const r = await post('/auth/registro', { nombre: '', email: '', password: '' });
    assert(r.status === 400, `Status 400 para campos vacíos (got ${r.status})`);
    assert(r.data.msg.includes('obligatorios'), `Mensaje: "${r.data.msg}"`);
  }

  console.log('\n📋 TEST 2: Registro — contraseña débil');
  {
    const r = await post('/auth/registro', { nombre: 'Test', email: 'a@b.com', password: '123' });
    assert(r.status === 400, `Status 400 para password débil (got ${r.status})`);
    assert(r.data.msg.includes('8 caracteres'), `Mensaje de política: "${r.data.msg}"`);
  }

  console.log('\n📋 TEST 3: Registro exitoso');
  {
    const r = await post('/auth/registro', TEST_USER);
    assert(r.status === 201, `Status 201 para registro OK (got ${r.status})`);
    assert(r.data.msg.includes('creada'), `Mensaje: "${r.data.msg}"`);
  }

  console.log('\n📋 TEST 4: Registro — email duplicado');
  {
    const r = await post('/auth/registro', TEST_USER);
    assert(r.status === 409, `Status 409 para email duplicado (got ${r.status})`);
    assert(r.data.msg.includes('registrado'), `Mensaje: "${r.data.msg}"`);
  }

  console.log('\n📋 TEST 5: Login — usuario no verificado');
  {
    const r = await post('/auth/login', { email: TEST_USER.email, password: TEST_USER.password });
    assert(r.status === 403, `Status 403 para no verificado (got ${r.status})`);
    assert(r.data.noVerificado === true, `Flag noVerificado: ${r.data.noVerificado}`);
  }

  console.log('\n📋 TEST 6: Login — credenciales incorrectas (mensaje genérico)');
  {
    const r = await post('/auth/login', { email: 'noexiste@test.com', password: 'abc' });
    assert(r.status === 401, `Status 401 (got ${r.status})`);
    assert(r.data.msg === 'Email o contraseña incorrectos', `Mensaje genérico: "${r.data.msg}"`);
  }

  console.log('\n📋 TEST 7: Verificar token inválido');
  {
    const r = await get('/auth/verificar/tokeninvalidofake123');
    assert(r.status === 400, `Status 400 para token inválido (got ${r.status})`);
    assert(r.data.expirado === true, `Flag expirado: ${r.data.expirado}`);
  }

  console.log('\n📋 TEST 8: Verificar token válido (verificamos manualmente en DB)');
  {
    // Obtenemos el token directamente de MongoDB
    const mongoose = (await import('mongoose')).default;
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/cotizadorRutas-db');
    const User = (await import('../models/User.js')).default;

    const user = await User.findOne({ email: TEST_USER.email });
    assert(user !== null, `Usuario encontrado en DB`);
    assert(user.verificado === false, `No verificado antes del test`);

    const token = user.tokenVerificacion;
    const r = await get(`/auth/verificar/${token}`);
    assert(r.status === 200, `Status 200 para verificación OK (got ${r.status})`);
    assert(r.data.msg.includes('verificada'), `Mensaje: "${r.data.msg}"`);

    // Verificar que se actualizó en DB
    const userActualizado = await User.findOne({ email: TEST_USER.email });
    assert(userActualizado.verificado === true, `verificado = true en DB`);
  }

  console.log('\n📋 TEST 9: Login exitoso (después de verificar)');
  {
    const r = await post('/auth/login', { email: TEST_USER.email, password: TEST_USER.password });
    assert(r.status === 200, `Status 200 login OK (got ${r.status})`);
    assert(r.data.token !== undefined, `Token JWT recibido`);
    assert(r.data.nombre === TEST_USER.nombre, `Nombre: ${r.data.nombre}`);
  }

  console.log('\n📋 TEST 10: Bloqueo por intentos');
  {
    // Hacer 5 intentos fallidos
    for (let i = 1; i <= 5; i++) {
      const r = await post('/auth/login', { email: TEST_USER.email, password: 'wrongpass' });
      if (i < 5) assert(r.status === 401, `Intento ${i}: status 401`);
      else assert(r.status === 423, `Intento 5: status 423 bloqueado (got ${r.status})`);
    }
    // 6to intento debe seguir bloqueado
    const r = await post('/auth/login', { email: TEST_USER.email, password: TEST_USER.password });
    assert(r.status === 423, `Intento 6 (password correcto, pero bloqueado): status 423 (got ${r.status})`);
    assert(r.data.msg.includes('bloqueada'), `Mensaje bloqueo: "${r.data.msg}"`);
  }

  console.log('\n📋 TEST 11: Feriados API (Nager.Date)');
  {
    const { calcularFeriadosPorMes } = await import('../services/feriadosService.js');
    const resultado = await calcularFeriadosPorMes(['lunes', 'martes', 'miércoles', 'jueves', 'viernes']);
    assert(typeof resultado === 'number', `Retorna número: ${resultado}`);
    assert(resultado > 0, `Feriados calculados > 0: ${resultado}`);
    assert(resultado < 5, `Feriados < 5/mes (razonable): ${resultado}`);
    console.log(`     → Promedio feriados/mes en días laborales: ${resultado}`);
  }

  console.log('\n📋 TEST 12: Reenviar verificación');
  {
    const r = await post('/auth/reenviar-verificacion', { email: 'noexiste@fake.com' });
    assert(r.status === 200, `No revela si email existe: status 200 (got ${r.status})`);
  }

  // LIMPIEZA: Eliminar usuario de prueba
  console.log('\n🧹 Limpiando datos de prueba...');
  {
    const mongoose = (await import('mongoose')).default;
    const User = (await import('../models/User.js')).default;
    await User.deleteOne({ email: TEST_USER.email });
    const check = await User.findOne({ email: TEST_USER.email });
    assert(check === null, `Usuario de prueba eliminado de DB`);
    await mongoose.connection.close();
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`  RESULTADOS: ${passed} pasaron ✅, ${failed} fallaron ❌`);
  console.log(`${'='.repeat(50)}\n`);
}

runTests().catch(e => { console.error('Error fatal:', e); process.exit(1); });
