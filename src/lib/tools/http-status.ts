export interface HttpStatus {
  code: number;
  text: string;
  description: string;
  category: string;
}

export const HTTP_STATUSES: HttpStatus[] = [
  // 1xx Informational
  { code: 100, text: "Continue", description: "The server has received the request headers and the client should proceed to send the request body.", category: "1xx Informational" },
  { code: 101, text: "Switching Protocols", description: "The requester has asked the server to switch protocols and the server has agreed to do so.", category: "1xx Informational" },
  { code: 102, text: "Processing", description: "The server has received and is processing the request, but no response is available yet.", category: "1xx Informational" },
  { code: 103, text: "Early Hints", description: "Used to return some response headers before final HTTP message.", category: "1xx Informational" },

  // 2xx Success
  { code: 200, text: "OK", description: "The request has succeeded.", category: "2xx Success" },
  { code: 201, text: "Created", description: "The request has been fulfilled, resulting in the creation of a new resource.", category: "2xx Success" },
  { code: 202, text: "Accepted", description: "The request has been accepted for processing, but the processing has not been completed.", category: "2xx Success" },
  { code: 203, text: "Non-Authoritative Information", description: "The server is a transforming proxy that received a 200 OK from its origin, but is returning a modified version of the origin's response.", category: "2xx Success" },
  { code: 204, text: "No Content", description: "The server successfully processed the request, and is not returning any content.", category: "2xx Success" },
  { code: 205, text: "Reset Content", description: "The server successfully processed the request, asks that the requester reset its document view, and is not returning any content.", category: "2xx Success" },
  { code: 206, text: "Partial Content", description: "The server is delivering only part of the resource due to a range header sent by the client.", category: "2xx Success" },
  { code: 207, text: "Multi-Status", description: "The message body that follows is by default an XML message and can contain a number of separate response codes.", category: "2xx Success" },
  { code: 208, text: "Already Reported", description: "The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response.", category: "2xx Success" },
  { code: 226, text: "IM Used", description: "The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.", category: "2xx Success" },

  // 3xx Redirection
  { code: 300, text: "Multiple Choices", description: "Indicates multiple options for the resource from which the client may choose.", category: "3xx Redirection" },
  { code: 301, text: "Moved Permanently", description: "This and all future requests should be directed to the given URI.", category: "3xx Redirection" },
  { code: 302, text: "Found", description: "Tells the client to look at (browse to) another URL.", category: "3xx Redirection" },
  { code: 303, text: "See Other", description: "The response to the request can be found under another URI using the GET method.", category: "3xx Redirection" },
  { code: 304, text: "Not Modified", description: "Indicates that the resource has not been modified since the version specified by the request headers.", category: "3xx Redirection" },
  { code: 305, text: "Use Proxy", description: "The requested resource is available only through a proxy.", category: "3xx Redirection" },
  { code: 307, text: "Temporary Redirect", description: "The request should be repeated with another URI; however, future requests should still use the original URI.", category: "3xx Redirection" },
  { code: 308, text: "Permanent Redirect", description: "The request and all future requests should be repeated using another URI.", category: "3xx Redirection" },

  // 4xx Client Errors
  { code: 400, text: "Bad Request", description: "The server cannot or will not process the request due to an apparent client error.", category: "4xx Client Error" },
  { code: 401, text: "Unauthorized", description: "Authentication is required and has failed or has not yet been provided.", category: "4xx Client Error" },
  { code: 402, text: "Payment Required", description: "Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme.", category: "4xx Client Error" },
  { code: 403, text: "Forbidden", description: "The request was valid, but the server is refusing action. The user might not have the necessary permissions.", category: "4xx Client Error" },
  { code: 404, text: "Not Found", description: "The requested resource could not be found but may be available in the future.", category: "4xx Client Error" },
  { code: 405, text: "Method Not Allowed", description: "A request method is not supported for the requested resource.", category: "4xx Client Error" },
  { code: 406, text: "Not Acceptable", description: "The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.", category: "4xx Client Error" },
  { code: 407, text: "Proxy Authentication Required", description: "The client must first authenticate itself with the proxy.", category: "4xx Client Error" },
  { code: 408, text: "Request Timeout", description: "The server timed out waiting for the request.", category: "4xx Client Error" },
  { code: 409, text: "Conflict", description: "Indicates that the request could not be processed because of conflict in the current state of the resource.", category: "4xx Client Error" },
  { code: 410, text: "Gone", description: "Indicates that the resource requested is no longer available and will not be available again.", category: "4xx Client Error" },
  { code: 411, text: "Length Required", description: "The request did not specify the length of its content, which is required by the requested resource.", category: "4xx Client Error" },
  { code: 412, text: "Precondition Failed", description: "The server does not meet one of the preconditions that the requester put on the request header fields.", category: "4xx Client Error" },
  { code: 413, text: "Payload Too Large", description: "The request is larger than the server is willing or able to process.", category: "4xx Client Error" },
  { code: 414, text: "URI Too Long", description: "The URI provided was too long for the server to process.", category: "4xx Client Error" },
  { code: 415, text: "Unsupported Media Type", description: "The request entity has a media type which the server or resource does not support.", category: "4xx Client Error" },
  { code: 416, text: "Range Not Satisfiable", description: "The client has asked for a portion of the file (byte serving), but the server cannot supply that portion.", category: "4xx Client Error" },
  { code: 417, text: "Expectation Failed", description: "The server cannot meet the requirements of the Expect request-header field.", category: "4xx Client Error" },
  { code: 418, text: "I'm a Teapot", description: "This code was defined in 1998 as one of the traditional IETF April Fools' jokes, in RFC 2324, Hyper Text Coffee Pot Control Protocol.", category: "4xx Client Error" },
  { code: 421, text: "Misdirected Request", description: "The request was directed at a server that is not able to produce a response.", category: "4xx Client Error" },
  { code: 422, text: "Unprocessable Entity", description: "The request was well-formed but was unable to be followed due to semantic errors.", category: "4xx Client Error" },
  { code: 423, text: "Locked", description: "The resource that is being accessed is locked.", category: "4xx Client Error" },
  { code: 424, text: "Failed Dependency", description: "The request failed because it depended on another request and that request failed.", category: "4xx Client Error" },
  { code: 425, text: "Too Early", description: "Indicates that the server is unwilling to risk processing a request that might be replayed.", category: "4xx Client Error" },
  { code: 426, text: "Upgrade Required", description: "The client should switch to a different protocol such as TLS/1.3.", category: "4xx Client Error" },
  { code: 428, text: "Precondition Required", description: "The origin server requires the request to be conditional.", category: "4xx Client Error" },
  { code: 429, text: "Too Many Requests", description: "The user has sent too many requests in a given amount of time ('rate limiting').", category: "4xx Client Error" },
  { code: 431, text: "Request Header Fields Too Large", description: "The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large.", category: "4xx Client Error" },
  { code: 451, text: "Unavailable For Legal Reasons", description: "A server operator has received a legal demand to deny access to a resource or to a set of resources.", category: "4xx Client Error" },

  // 5xx Server Errors
  { code: 500, text: "Internal Server Error", description: "A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.", category: "5xx Server Error" },
  { code: 501, text: "Not Implemented", description: "The server either does not recognize the request method, or it lacks the ability to fulfil the request.", category: "5xx Server Error" },
  { code: 502, text: "Bad Gateway", description: "The server was acting as a gateway or proxy and received an invalid response from the upstream server.", category: "5xx Server Error" },
  { code: 503, text: "Service Unavailable", description: "The server cannot handle the request (because it is overloaded or down for maintenance).", category: "5xx Server Error" },
  { code: 504, text: "Gateway Timeout", description: "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.", category: "5xx Server Error" },
  { code: 505, text: "HTTP Version Not Supported", description: "The server does not support the HTTP protocol version used in the request.", category: "5xx Server Error" },
  { code: 506, text: "Variant Also Negotiates", description: "Transparent content negotiation for the request results in a circular reference.", category: "5xx Server Error" },
  { code: 507, text: "Insufficient Storage", description: "The server is unable to store the representation needed to complete the request.", category: "5xx Server Error" },
  { code: 508, text: "Loop Detected", description: "The server detected an infinite loop while processing the request.", category: "5xx Server Error" },
  { code: 510, text: "Not Extended", description: "Further extensions to the request are required for the server to fulfil it.", category: "5xx Server Error" },
  { code: 511, text: "Network Authentication Required", description: "The client needs to authenticate to gain network access.", category: "5xx Server Error" },
];

const STATUS_MAP = new Map<number, HttpStatus>(
  HTTP_STATUSES.map((s) => [s.code, s])
);

export function getStatusByCode(code: number): HttpStatus | undefined {
  return STATUS_MAP.get(code);
}
