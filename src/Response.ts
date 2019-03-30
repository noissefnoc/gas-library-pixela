interface BasicResponse {
  message: string;
  isSuccess: boolean;
}

interface PixelResponse {
  quantity: string;
  optionalData: string;
}

interface GraphResponse {
  graphs: GraphsItem[];
}

interface GraphsItem {
  id: string;
  name: string;
  unit: string;
  type: string;
  color: string;
  timezone: string;
  purgeCacheURLs: string[];
  selfSufficient: string;
}

interface GraphPixelsResponse {
  pixels: string[];
}

interface WebhookResponse {
  webhooks: WebhooksItem[];
}

interface WebhooksItem {
  webhookHash: string;
  graphID: string;
  type: string;
}