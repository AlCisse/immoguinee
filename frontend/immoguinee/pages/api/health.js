/**
 * Health Check API pour Docker
 * Utilisé par les health checks Docker et le monitoring
 */
export default function handler(req, res) {
  // Vérifier que l'application est bien démarrée
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    status: 'healthy'
  };

  try {
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = error.message;
    healthcheck.status = 'unhealthy';
    res.status(503).json(healthcheck);
  }
}
