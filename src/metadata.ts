/* eslint-disable */
export default async () => {
    const t = {};
    return { "@nestjs/swagger": { "models": [], "controllers": [[import("./interface/controllers/healthcheck/healthcheck.controller"), { "HealthCheckController": { "checkLiveness": { type: Object }, "checkReadiness": { type: Object } } }]] } };
};