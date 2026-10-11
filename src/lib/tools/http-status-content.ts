export interface StatusDetail {
  what: string;
  causes: string[];
  fix: string;
  related: number[];
  rfc?: string;
  example?: string;
}

const DETAILS: Record<number, StatusDetail> = {
  200: {
    what: "The request succeeded. The meaning of 'success' depends on the HTTP method: GET returns the resource, POST returns the result of an action, PUT/PATCH returns the updated resource.",
    causes: ["Normal successful response", "API returning data", "Static file served correctly"],
    fix: "No action needed — this is the expected success response.",
    related: [201, 204, 206],
    rfc: "RFC 9110",
    example: 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"status": "ok"}',
  },
  201: {
    what: "The request succeeded and a new resource was created as a result. This is typically the response sent after POST requests that create something new on the server.",
    causes: ["Successful record creation via POST", "File upload completed", "User registration succeeded"],
    fix: "No action needed. The Location header typically contains the URL of the new resource.",
    related: [200, 202, 204],
    rfc: "RFC 9110",
    example: 'HTTP/1.1 201 Created\nLocation: /users/42\nContent-Type: application/json',
  },
  204: {
    what: "The request succeeded but there is no content to return. Common for DELETE requests and PUT updates where the response body would be empty.",
    causes: ["Successful DELETE operation", "PUT/PATCH with no body to return", "Preflight CORS requests"],
    fix: "No action needed. Do not expect a response body — it will be empty.",
    related: [200, 201, 205],
    rfc: "RFC 9110",
  },
  301: {
    what: "The requested resource has permanently moved to a new URL. Browsers and search engines update their records to use the new URL. Link equity (PageRank) passes to the new URL.",
    causes: ["Site migration or domain change", "URL restructuring", "HTTP → HTTPS upgrade", "Removing www prefix"],
    fix: "Update all links pointing to the old URL. If you control the server, ensure the Location header points to the correct permanent destination.",
    related: [302, 307, 308],
    rfc: "RFC 9110",
    example: "HTTP/1.1 301 Moved Permanently\nLocation: https://example.com/new-path",
  },
  302: {
    what: "The requested resource is temporarily located at a different URL. Unlike 301, search engines keep indexing the original URL. The method may change to GET on redirect.",
    causes: ["Temporary maintenance redirect", "A/B testing", "Login redirect before accessing a protected page"],
    fix: "If the move is permanent, use 301 instead. If temporary, ensure the redirect will be removed once the original URL is restored.",
    related: [301, 303, 307, 308],
    rfc: "RFC 9110",
    example: "HTTP/1.1 302 Found\nLocation: https://example.com/temporary",
  },
  304: {
    what: "The resource has not been modified since the version specified by the If-Modified-Since or If-None-Match request headers. The client can use its cached version.",
    causes: ["Browser or CDN cache is still valid", "ETag matches the current version", "Last-Modified date has not changed"],
    fix: "No action needed — the browser will serve the cached version. If you expect fresh content, clear the cache or append a cache-busting query parameter.",
    related: [200, 301, 307],
    rfc: "RFC 9110",
  },
  307: {
    what: "The resource is temporarily at a different URL, and the original HTTP method must be preserved. Unlike 302, a POST request stays a POST after redirect.",
    causes: ["Temporary redirect that must preserve HTTP method", "Load balancer routing", "Form resubmission scenarios"],
    fix: "If the redirect is permanent, use 308. If temporary, ensure your client preserves the original method when following the redirect.",
    related: [302, 308, 301],
    rfc: "RFC 9110",
  },
  308: {
    what: "The resource has permanently moved and the original HTTP method must be preserved. This is the method-safe equivalent of 301 — a POST stays a POST.",
    causes: ["Permanent API endpoint restructuring", "REST API versioning migration"],
    fix: "Update all client code and documentation to use the new URL. Unlike 301, the HTTP method is preserved.",
    related: [301, 307, 302],
    rfc: "RFC 9110",
  },
  400: {
    what: "The server cannot process the request because of a client error — malformed syntax, invalid request message framing, or deceptive request routing.",
    causes: ["Malformed JSON or XML body", "Missing required parameters", "Invalid query string format", "Incorrect Content-Type header", "Request body too large"],
    fix: "Check the request syntax, headers, and body. Validate JSON/XML before sending. Ensure required fields are present and correctly typed.",
    related: [401, 403, 422, 429],
    rfc: "RFC 9110",
  },
  401: {
    what: "The client request lacks valid authentication credentials. The response must include a WWW-Authenticate header specifying the authentication scheme.",
    causes: ["Missing Authorization header", "Expired token or session", "Wrong API key", "Token revoked"],
    fix: "Include valid credentials in the Authorization header. Re-authenticate to get a fresh token. Check that the API key or token hasn't expired.",
    related: [403, 407, 511],
    rfc: "RFC 9110",
    example: 'HTTP/1.1 401 Unauthorized\nWWW-Authenticate: Bearer realm="api"',
  },
  403: {
    what: "The server understood the request but refuses to authorize it. Unlike 401, re-authenticating won't help — the client doesn't have permission regardless of credentials.",
    causes: ["Insufficient role or permissions", "IP address blocked", "CORS policy rejection", "API scope missing", "Resource is private"],
    fix: "Check that the authenticated user has the required role or permission. If you're the server owner, review access control rules and CORS configuration.",
    related: [401, 404, 429],
    rfc: "RFC 9110",
  },
  404: {
    what: "The server cannot find the requested resource. The URL may be wrong, the resource may have been deleted, or it may never have existed. This does not indicate whether the absence is permanent.",
    causes: ["Mistyped URL", "Resource was deleted", "URL structure changed without a redirect", "Dead link from another site", "Case-sensitive path mismatch"],
    fix: "Verify the URL is correct. Add a 301 redirect if the resource moved. Set up a custom 404 page to guide users back to valid content.",
    related: [410, 301, 403],
    rfc: "RFC 9110",
  },
  405: {
    what: "The HTTP method used is not allowed for this endpoint. The response must include an Allow header listing the permitted methods.",
    causes: ["Sending POST to a GET-only endpoint", "Sending DELETE to a read-only resource", "Wrong method for the API route"],
    fix: "Check the API documentation for the correct HTTP method. Look at the Allow header in the response to see what methods are permitted.",
    related: [400, 501],
    rfc: "RFC 9110",
    example: "HTTP/1.1 405 Method Not Allowed\nAllow: GET, HEAD, OPTIONS",
  },
  408: {
    what: "The server timed out waiting for the request. The client did not send a complete request within the time the server was prepared to wait.",
    causes: ["Slow network connection", "Large file upload taking too long", "Client disconnected before completing the request"],
    fix: "Check network connectivity. For large uploads, consider chunked transfer encoding or increasing the server's timeout. Retry the request.",
    related: [504, 503],
    rfc: "RFC 9110",
  },
  409: {
    what: "The request conflicts with the current state of the server. Common when trying to create a resource that already exists or when concurrent modifications clash.",
    causes: ["Duplicate resource creation (unique constraint violation)", "Optimistic locking conflict", "Concurrent edits to the same record"],
    fix: "Fetch the current state of the resource first, then resubmit. Check for duplicate detection and implement retry logic with exponential backoff.",
    related: [400, 412, 422],
    rfc: "RFC 9110",
  },
  410: {
    what: "The resource has been permanently deleted and will not return. Unlike 404, this tells clients and search engines to remove the URL from their records.",
    causes: ["Content permanently removed", "User account deleted", "Product discontinued"],
    fix: "Remove all internal links to the deleted resource. Search engines will de-index the URL faster with 410 than 404. Consider a 301 to a relevant replacement if one exists.",
    related: [404, 301],
    rfc: "RFC 9110",
  },
  422: {
    what: "The request was well-formed but contains semantic errors — the server understands the content type but cannot process the contained instructions.",
    causes: ["Validation errors (missing required fields, wrong value type)", "Business logic violations", "Invalid enum value", "Date out of valid range"],
    fix: "Read the response body — it typically contains detailed validation error messages listing which fields failed and why.",
    related: [400, 409],
    rfc: "RFC 9110",
  },
  429: {
    what: "The client has sent too many requests in a given time window. The server is rate-limiting the client. The Retry-After header indicates when to retry.",
    causes: ["API rate limit exceeded", "Too many login attempts", "DDoS protection triggered", "Automated scraping detected"],
    fix: "Slow down requests. Check the Retry-After header for the wait time. Implement exponential backoff and request queuing in your client.",
    related: [503, 503],
    rfc: "RFC 6585",
    example: "HTTP/1.1 429 Too Many Requests\nRetry-After: 60\nX-RateLimit-Limit: 100",
  },
  451: {
    what: "The resource is unavailable for legal reasons — typically a government-mandated block, DMCA takedown, or court order. Named after Ray Bradbury's 'Fahrenheit 451'.",
    causes: ["DMCA copyright takedown", "Government content restriction", "Court-ordered removal", "Geo-blocked content due to licensing"],
    fix: "The content cannot be served in its current jurisdiction. If you believe it's incorrect, contact the server operator or relevant legal authority.",
    related: [403, 404],
    rfc: "RFC 7725",
  },
  500: {
    what: "The server encountered an unexpected condition that prevented it from fulfilling the request. This is a catch-all for server-side errors with no more specific message.",
    causes: ["Unhandled exception in application code", "Database connection failure", "Memory overflow", "Misconfigured server", "Bug in backend code"],
    fix: "Check server logs immediately. The client cannot resolve this — it's a server-side problem. Implement proper error handling and monitoring.",
    related: [502, 503, 504],
    rfc: "RFC 9110",
  },
  501: {
    what: "The server does not support the functionality required to fulfill the request. Common when the HTTP method is not recognized or not implemented.",
    causes: ["Unsupported HTTP method (e.g., PATCH on old servers)", "Unimplemented API feature", "Missing server module"],
    fix: "Check the API documentation. The server does not support this operation — contact the server operator or use a different method.",
    related: [405, 500],
    rfc: "RFC 9110",
  },
  502: {
    what: "The server acting as a gateway or proxy received an invalid response from an upstream server. The problem is between your server and an upstream dependency.",
    causes: ["Upstream server is down", "Reverse proxy misconfiguration", "Upstream server returned an invalid response", "CDN edge node issue"],
    fix: "Check the health of upstream services. Review proxy/load balancer logs. Usually resolves when the upstream server recovers.",
    related: [503, 504, 500],
    rfc: "RFC 9110",
  },
  503: {
    what: "The server is temporarily unable to handle the request — either overloaded or down for maintenance. The Retry-After header may indicate when the service will be available.",
    causes: ["Server overloaded with traffic", "Planned maintenance window", "Deployment in progress", "Database connection pool exhausted"],
    fix: "Wait and retry. Check Retry-After header. Set up proper health checks and auto-scaling to prevent recurrence. Show a maintenance page instead of a raw 503.",
    related: [502, 504, 429],
    rfc: "RFC 9110",
    example: "HTTP/1.1 503 Service Unavailable\nRetry-After: 120",
  },
  504: {
    what: "The server acting as a gateway or proxy did not receive a timely response from the upstream server. The upstream server is too slow or unresponsive.",
    causes: ["Slow database query", "Upstream API timeout", "Network congestion between servers", "Overloaded upstream service"],
    fix: "Increase timeout values if the operation legitimately takes long. Optimize slow queries. Add caching. Monitor upstream service response times.",
    related: [502, 503, 408],
    rfc: "RFC 9110",
  },
};

export function getStatusDetail(code: number): StatusDetail | null {
  return DETAILS[code] ?? null;
}
