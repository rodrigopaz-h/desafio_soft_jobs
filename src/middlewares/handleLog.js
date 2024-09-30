const handleLog = async (req, res, next) => {
  const timestamp = new Date().toISOString();
  const userToken = req.header('Authorization');

  console.log(`
    [${timestamp}] - Nueva solicitud de autenticación/autorización:
    - Ruta: ${req.url}
    - Método: ${req.method}
    - Usuario autenticado: ${userToken ? 'Token proporcionado' : 'Sin token'}
    - Parámetros de consulta: ${JSON.stringify(req.query, null, 2)}
    - Dirección IP: ${req.ip}
  `);

  next();
};

module.exports = handleLog;
