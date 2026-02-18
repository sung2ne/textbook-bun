// src/api/docs.ts - API 문서 서빙
const OPENAPI_SPEC = await Bun.file("./docs/openapi.yaml").text();

export const docsRoutes = {
  // GET /docs/openapi.yaml - OpenAPI 스펙 제공
  spec() {
    return new Response(OPENAPI_SPEC, {
      headers: { "Content-Type": "application/yaml" },
    });
  },

  // GET /docs - Swagger UI
  ui() {
    const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BunDo API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: '/docs/openapi.yaml',
      dom_id: '#swagger-ui',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
      layout: "StandaloneLayout",
      deepLinking: true,
      persistAuthorization: true,
    });
  </script>
</body>
</html>
    `;

    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  },
};
