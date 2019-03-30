/**
 * @file pixe.la API Client
 * @author Kota SAITO <noissefnoc@gmail.com>
 * @version v0.0.1
 */

/**
 * create pixe.la API client<br />
 * <p>
 * create pixe.la (https://pixe.la) API client instance.
 * </p>
 * <h3>Usage</h3>
 * <pre>
 * var pixela = Pixela.create(username, token, debug);
 * </pre>
 * @param {string} username pixe.la username
 * @param {string} token  pixe.la API token
 * @return {Pixela} pixe.la API client instance
 */
function create(username: string, token: string): Pixela_ {
  return new Pixela_(username, token);
}

/**
 * pixe.la API client class<br/>
 * <p>
 * pixe.la (https://pixe.la) API client class
 * </p>
 * <h3>Usage</h3>
 * <pre>
 * var pixela = Pixela.create(username, token, debug);
 * var pixel_value = pixela.getPixel(graphID, date);
 * Logger.log(pixel_valie);
 * </pre>
 */
class Pixela_ {
  private baseURL: string = "https://pixe.la";
  private apiVersion: string = "v1";
  private username: string;
  private token: string;
  private client: Client_;

  constructor(username: string, token: string) {
    this.username = username;
    this.token = token;
    this.client = new Client_(token);
  }

  // utilities
  /**
   * set instance token<br />
   * @param {string} token user token
   * @return {void}
   */
  public setToken(token: string): void {
    this.token = token;
    this.client = new Client_(token);
  }

  // user API methods
  /**
   * call post-user API<br/>
   * <p>
   * call pixe.la post-user API (https://docs.pixe.la/#/post-user).
   * </p>
   * @param {string} agreeTermsOfService agree terms of service or not (yes/no)
   * @param {string} notMinor usage is not minor or not (yes/no)
   * @return {BasicResponse} post-user API response value.
   */
  public createUser(
    agreeTermsOfService: string,
    notMinor: string
  ): BasicResponse {
    const requestURL: string = this.generateUserURL();

    const payload = {
      username: this.username,
      token: this.token,
      agreeTermsOfService: agreeTermsOfService,
      notMinor: notMinor
    };

    const responseBodyText = this.client.post(requestURL, payload);
    const response = JSON.parse(responseBodyText) as BasicResponse;

    return response;
  }

  /**
   * call put-user API<br/>
   * <p>
   * call pixe.la put-user API (https://docs.pixe.la/#/put-user).
   * </p>
   * @param {string} newToken new user token
   * @return {BasicResponse} put-user API response value.
   */
  public updateUser(newToken: string): BasicResponse {
    const requestURL: string = this.generateUserIDURL();

    const payload = {
      newToken: newToken
    };

    const responseBodyText = this.client.put(requestURL, payload);
    const response = JSON.parse(responseBodyText) as BasicResponse;

    return response;
  }

  /**
   * call delete-user API<br/>
   * <p>
   * call pixe.la delete-user API (https://docs.pixe.la/#/delete-user).
   * </p>
   * @return {BasicResponse} put-user API response value.
   */
  public deleteUser(): BasicResponse {
    const requestURL: string = this.generateUserIDURL();

    const responseBodyText = this.client.delete(requestURL);
    const response = JSON.parse(responseBodyText) as BasicResponse;

    return response;
  }

  // graph API methods
  /**
   * call post-graph API<br/>
   * <p>
   * call pixe.la post-graph API (https://docs.pixe.la/#/post-graph).
   * </p>
   * @param {string} graphID pixe.la graph ID
   * @param {string} graphName pixe.la graph name
   * @param {string} unit
   * @param {string} type
   * @param {string} color
   * @param {string} timezone
   * @param {string} selfSufficient
   * @return {BasicResponse} post-graph API response value.
   */
  public createGraph(
    graphID: string,
    graphName: string,
    unit: string,
    type: string,
    color: string,
    timezone?: string,
    selfSufficient?: string
  ): BasicResponse {
    const requestURL: string = this.generateGraphsURL();

    const payload = {
      id: graphID,
      name: graphName,
      unit: unit,
      type: type,
      color: color
    };

    if (timezone !== undefined) {
      payload["timezone"] = timezone;
    }

    if (selfSufficient !== undefined) {
      payload["selfSufficient"] = selfSufficient;
    }

    const responseBodyText = this.client.post(requestURL, payload);
    const response = JSON.parse(responseBodyText) as BasicResponse;

    return response;
  }

  /**
   * call get-graph API<br/>
   * <p>
   * call pixe.la get-graph API (https://docs.pixe.la/#/get-graph).
   * </p>
   * @return {object} get-graph API response value.
   */
  public getGraph(): object {
    const requestURL: string = this.generateGraphsURL();
    const responseBodyText = this.client.get(requestURL);
    const response = JSON.parse(responseBodyText);

    return response;
  }

  /**
   * call get-svg API<br/>
   * <p>
   * call pixe.la get-svg API (https://docs.pixe.la/#/get-svg).
   * </p>
   * @param {string} graphID pixe.la graph ID
   * @param {string} dateStr pixel date (yyyyMMdd)
   * @param {string} mode graph display mode
   * @return {string} get-svg API response value.
   */
  public getSvg(graphID: string, dateStr?: string, mode?: string): string {
    let requestURL: string = this.generateGraphIDURL(graphID);
    requestURL = this.buildQuery(requestURL, { date: dateStr, mode: mode });
    const responseBodyText = this.client.get(requestURL);

    return responseBodyText;
  }
  /**
   * call put-graph API<br/>
   * <p>
   * call pixe.la put-graph API (https://docs.pixe.la/#/put-graph).
   * </p>
   * @param {string} graphID pixe.la graph ID
   * @param {object} payload update graph elements
   * @return {BasicResponse} post-graph API response value.
   */
  public updateGraph(graphID: string, payload: object): BasicResponse {
    const requestURL: string = this.generateGraphIDURL(graphID);

    const updatePayload = {};
    const elements: string[] = [
      "graphName",
      "unit",
      "type",
      "color",
      "timezone",
      "selfSufficient"
    ];

    elements.forEach(elem => {
      if (payload[elem] !== undefined) {
        updatePayload[elem] = payload[elem];
      }
    });

    const responseBodyText = this.client.put(requestURL, payload);
    const response = JSON.parse(responseBodyText) as BasicResponse;

    return response;
  }

  /**
   * call delete-graph API<br/>
   * <p>
   * call pixe.la delete-graph API (https://docs.pixe.la/#/delete-graph).
   * </p>
   * @param {string} graphID pixe.la graph ID
   * @return {BasicResponse} delete-graph API response value.
   */
  public deleteGraph(graphID: string): BasicResponse {
    const requestURL: string = this.generateGraphIDURL(graphID);
    const responseBodyText = this.client.delete(requestURL);
    const response = JSON.parse(responseBodyText) as BasicResponse;

    return response;
  }

  /**
   * call get-graph-pixels API<br/>
   * <p>
   * call pixe.la get-graph-pixels API (https://docs.pixe.la/#/get-graph-pixels).
   * </p>
   * @param {string} graphID pixe.la graph ID
   * @param {string} fromDateStr from date (yyyMMdd)
   * @param {string} toDateStr from date (yyyMMdd)
   * @return {object} get-graph-pixels API response value.
   */
  public getGraphPixelsDate(
    graphID: string,
    fromDateStr?: string,
    toDateStr?: string
  ): object {
    let requestURL: string = this.generateDetailURL(graphID, "pixels");
    requestURL = this.buildQuery(requestURL, {
      from: fromDateStr,
      to: toDateStr
    });
    const responseBodyText = this.client.get(requestURL);
    const response = JSON.parse(responseBodyText);

    return response;
  }

  // pixel API methods
  /**
   * call post-pixel API<br/>
   * <p>
   * call pixe.la post-pixel API (https://docs.pixe.la/#/post-pixel).
   * </p>
   * @param {string} graphID pixe.la graph ID
   * @param {string} dateStr pixel date (yyyyMMdd)
   * @param {number} quantity pixel quantity (int/float)
   * @param {object} optionalData
   * @return {BasicResponse} post-pixel API response value.
   */
  public createPixel(
    graphID: string,
    dateStr: string,
    quantity: number,
    optionalData?: object
  ): BasicResponse {
    const requestURL: string = this.generateGraphIDURL(graphID);

    const payload = {
      date: dateStr,
      quantity: quantity.toString()
    };

    if (optionalData !== undefined) {
      payload["optionalData"] = JSON.stringify(optionalData);
    }

    const responseBodyText = this.client.post(requestURL, payload);
    const response = JSON.parse(responseBodyText) as BasicResponse;

    return response;
  }

  /**
   * call get-pixel API<br/>
   * <p>
   * call pixe.la get-pixel API (https://docs.pixe.la/#/get-pixel).
   * </p>
   * @param {string} graphID pixe.la graph ID
   * @param {string} dateStr pixel date (yyyyMMdd)
   * @return {PixelResponse} get-pixel API response value.
   */
  public getPixel(graphID: string, dateStr: string): PixelResponse {
    const requestURL: string = this.generateDetailURL(graphID, dateStr);
    const responseBodyText = this.client.get(requestURL);
    const response = JSON.parse(responseBodyText) as PixelResponse;

    return response;
  }

  /**
   * call put-pixel API<br/>
   * <p>
   * call pixe.la put-pixel API (https://docs.pixe.la/#/put-pixel).
   * </p>
   * @param {string} graphID pixe.la graph ID
   * @param {string} dateStr pixel date (yyyyMMdd)
   * @param {number} quantity pixel quantity (int/float)
   * @param {object} optionalData
   * @return {BasicResponse} put-pixel API response value.
   */
  public updatePixel(
    graphID: string,
    dateStr: string,
    quantity: number,
    optionalData?: object
  ): BasicResponse {
    const requestURL: string = this.generateDetailURL(graphID, dateStr);

    const payload = {
      quantity: quantity.toString()
    };

    if (optionalData !== undefined) {
      payload["optionalData"] = JSON.stringify(optionalData);
    }

    const responseBodyText = this.client.put(requestURL, payload);
    const response = JSON.parse(responseBodyText) as BasicResponse;

    return response;
  }

  /**
   * call increment-pixel API<br/>
   * <p>
   * call pixe.la increment-pixel API (https://docs.pixe.la/#/increment-pixel).
   * </p>
   * @param {string} graphID pixe.la graph ID
   * @return {BasicResponse} increment-pixel API response value.
   */
  public incPixel(graphID: string): BasicResponse {
    const requestURL: string = this.generateDetailURL(graphID, "increment");
    const responseBodyText = this.client.put(requestURL);
    const response = JSON.parse(responseBodyText) as BasicResponse;

    return response;
  }

  /**
   * call decrement-pixel API<br/>
   * <p>
   * call pixe.la decrement-pixel API (https://docs.pixe.la/#/decrement-pixel).
   * </p>
   * @param {string} graphID pixe.la graph ID
   * @return {BasicResponse} decrement-pixel API response value.
   */
  public decPixel(graphID: string): BasicResponse {
    const requestURL: string = this.generateDetailURL(graphID, "decrement");
    const responseBodyText = this.client.put(requestURL);
    const response = JSON.parse(responseBodyText) as BasicResponse;

    return response;
  }

  /**
   * call delete-pixel API<br/>
   * <p>
   * call pixe.la decrement-pixel API (https://docs.pixe.la/#/decrement-pixel).
   * </p>
   * @param {string} graphID pixe.la graph ID
   * @param {string} dateStr pixel date (yyyyMMdd)
   * @return {BasicResponse} decrement-pixel API response value.
   */
  public deletePixel(graphID: string, dateStr: string): BasicResponse {
    const requestURL: string = this.generateDetailURL(graphID, dateStr);
    const responseBodyText = this.client.delete(requestURL);
    const response = JSON.parse(responseBodyText) as BasicResponse;

    return response;
  }

  // webhook API methods
  /**
   * call post-webhook API<br/>
   * <p>
   * call pixe.la post-webhook API (https://docs.pixe.la/#/post-webhook).
   * </p>
   * @param {string} graphID pixe.la graph ID
   * @param {string} webhookType webhook type
   * @return {BasicResponse} post-webhook API response value.
   */
  public createWebhook(graphID: string, webhookType: string): BasicResponse {
    const requestURL: string = this.generateWebhookURL();

    const payload = {
      graphID: graphID,
      type: webhookType
    };

    const responseBodyText = this.client.post(requestURL, payload);
    const response = JSON.parse(responseBodyText) as BasicResponse;

    return response;
  }

  /**
   * call get-webhook API<br/>
   * <p>
   * call pixe.la get-webhook API (https://docs.pixe.la/#/get-webhook).
   * </p>
   * @return {object} get-webhook API response value.
   */
  public getWebhook(): object {
    const requestURL: string = this.generateWebhookURL();
    const responseBodyText = this.client.get(requestURL);
    const response = JSON.parse(responseBodyText);

    return response;
  }

  /**
   * call invoke-webhook API<br/>
   * <p>
   * call pixe.la invoke-webhook API (https://docs.pixe.la/#/invoke-webhook).
   * </p>
   * @param {string} webhookHash webhook hash id
   * @return {BasicResponse} invoke-webhook API response value.
   */
  public invokeWebhook(webhookHash: string): BasicResponse {
    const requestURL: string = this.generateWebhookDetailURL(webhookHash);
    const responseBodyText = this.client.post(requestURL, undefined);
    const response = JSON.parse(responseBodyText) as BasicResponse;

    return response;
  }

  /**
   * call delete-webhook API<br/>
   * <p>
   * call pixe.la delete-webhook API (https://docs.pixe.la/#/delete-webhook).
   * </p>
   * @param {string} webhookHash webhook hash id
   * @return {BasicResponse} invoke-webhook API response value.
   */
  public deleteWebhook(webhookHash: string): BasicResponse {
    const requestURL: string = this.generateWebhookDetailURL(webhookHash);
    const responseBodyText = this.client.delete(requestURL);
    const response = JSON.parse(responseBodyText) as BasicResponse;

    return response;
  }

  private generateUserURL(): string {
    return Utilities.formatString("%s/%s/users", this.baseURL, this.apiVersion);
  }

  private generateUserIDURL(): string {
    return Utilities.formatString(
      "%s/%s/users/%s",
      this.baseURL,
      this.apiVersion,
      this.username
    );
  }

  private generateGraphsURL(): string {
    return Utilities.formatString(
      "%s/%s/users/%s/graphs",
      this.baseURL,
      this.apiVersion,
      this.username
    );
  }

  private generateGraphIDURL(graphID: string): string {
    return Utilities.formatString(
      "%s/%s/users/%s/graphs/%s",
      this.baseURL,
      this.apiVersion,
      this.username,
      graphID
    );
  }

  private generateDetailURL(graphID: string, detailType: string): string {
    return Utilities.formatString(
      "%s/%s/users/%s/graphs/%s/%s",
      this.baseURL,
      this.apiVersion,
      this.username,
      graphID,
      detailType
    );
  }

  private generateWebhookURL(): string {
    return Utilities.formatString(
      "%s/%s/users/%s/webhooks",
      this.baseURL,
      this.apiVersion,
      this.username
    );
  }

  private generateWebhookDetailURL(webhookHash: string): string {
    return Utilities.formatString(
      "%s/%s/users/%s/webhooks/%s",
      this.baseURL,
      this.apiVersion,
      this.username,
      webhookHash
    );
  }

  private buildQuery(url: string, parameters: object): string {
    let params: Array<string> = [];

    for (let key in parameters) {
      if (parameters[key] != undefined) {
        params.push(key + "=" + parameters[key]);
      }
    }

    if (params.length == 0) {
      return url;
    }

    return url + "?" + params.join("&");
  }
}

// NOTE: following code is bad hack for GAS completion.
//       if you know appropreate handling, please let me know via GitHub issue.

// utilities
/**
 * set instance token<br />
 * @param {string} token user token
 * @return {void}
 */
function setToken(token: string) {
  throw new Error(
    "This method can't call directry. Please call via `create` method return value."
  );
}

// user API methods
/**
 * call post-user API<br/>
 * <p>
 * call pixe.la post-user API (https://docs.pixe.la/#/post-user).
 * </p>
 * <pre>
 * var pixela = Pixela.create(username, token, debug);
 * var response = pixela.createUser(agreeTermsOfService, notMinor);
 * Logger.log(response);
 * </pre>
 * @param {string} agreeTermsOfService agree terms of service or not
 * @param {string} notMinor usage is not minor or not
 * @return {object} post-user API response value.
 */
function createUser(agreeTermsOfService: string, notMinor: string) {
  throw new Error(
    "This method can't call directry. Please call via `create` method return value."
  );
}

/**
 * call put-user API<br/>
 * <p>
 * call pixe.la put-user API (https://docs.pixe.la/#/put-user).
 * </p>
 * <pre>
 * var pixela = Pixela.create(username, token, debug);
 * var response = pixela.updateUser(newToken);
 * Logger.log(response);
 * </pre>
 * @param {string} newToken new user token
 * @return {object} put-user API response value.
 */
function updateUser(newToken: string) {
  throw new Error(
    "This method can't call directry. Please call via `create` method return value."
  );
}

/**
 * call delete-user API<br/>
 * <p>
 * call pixe.la delete-user API (https://docs.pixe.la/#/delete-user).
 * <pre>
 * var pixela = Pixela.create(username, token, debug);
 * var response = pixela.deleteUser();
 * Logger.log(response);
 * </pre>
 * </p>
 * @return {object} delete-user API response value.
 */
function deleteUser() {
  throw new Error(
    "This method can't call directry. Please call via `create` method return value."
  );
}

// graph API methods
/**
 * call post-graph API<br/>
 * <p>
 * call pixe.la post-graph API (https://docs.pixe.la/#/post-graph).
 * </p>
 * <pre>
 * var pixela = Pixela.create(username, token, debug);
 * var response = pixela.createGraph(graphID, graphName, unit, type, color, timezone, selfSufficient);
 * Logger.log(response);
 * </pre>
 * @param {string} graphID pixe.la graph ID
 * @param {string} graphName pixe.la graph name
 * @param {string} unit graph unit
 * @param {string} type graph type (int/float)
 * @param {string} color graph color (shibafu/momiji/sora/ichou/ajisai/kuro)
 * @param {string} timezone timezone (default: UTC)
 * @param {string} selfSufficient (default: none)
 * @return {object} post-graph API response value.
 */
function createGraph(
  graphID: string,
  grpahName: string,
  unit: string,
  type: string,
  color: string,
  timezone?: string,
  selfSufficient?: string
) {
  throw new Error(
    "This method can't call directry. Please call via `create` method return value."
  );
}

/**
 * call get-graph API<br/>
 * <p>
 * call pixe.la get-graph API (https://docs.pixe.la/#/get-graph).
 * </p>
 * <pre>
 * var pixela = Pixela.create(username, token, debug);
 * var response = pixela.getGraph();
 * Logger.log(response);
 * </pre>
 * @return {object} get-graph API response value.
 */
function getGraph() {
  throw new Error(
    "This method can't call directry. Please call via `create` method return value."
  );
}

/**
 * call get-svg API<br/>
 * <p>
 * call pixe.la get-svg API (https://docs.pixe.la/#/get-svg).
 * </p>
 * <pre>
 * var pixela = Pixela.create(username, token, debug);
 * var response = pixela.getSvg();
 * Logger.log(response);
 * </pre>
 * @param {string} graphID pixe.la graph ID
 * @param {string} dateStr pixel date (yyyyMMdd)
 * @param {string} mode graph display mode
 * @return {string} get-svg API response value.
 */
function getSvg(graphID: string, dateStr?: string, mode?: string) {
  throw new Error(
    "This method can't call directry. Please call via `create` method return value."
  );
}

/**
 * call put-graph API<br/>
 * <p>
 * call pixe.la put-graph API (https://docs.pixe.la/#/put-graph).
 * </p>
 * <pre>
 * var pixela = Pixela.create(username, token, debug);
 * var response = pixela.updateGraph(graphID, graphName, unit, type, color, timezone, selfSufficient);
 * Logger.log(response);
 * </pre>
 * @param {string} graphID pixe.la graph ID
 * @param {object} payload update payload (graphName/unit/type/color/timezone/selfSufficient)
 * @return {object} put-graph API response value.
 */
function updateGraph(graphID: string, payload: object) {
  throw new Error(
    "This method can't call directry. Please call via `create` method return value."
  );
}

/**
 * call delete-graph API<br/>
 * <p>
 * call pixe.la delete-graph API (https://docs.pixe.la/#/delete-graph).
 * </p>
 * <pre>
 * var pixela = Pixela.create(username, token, debug);
 * var response = pixela.deleteGraph(graphID);
 * Logger.log(response);
 * </pre>
 * @param {string} graphID pixe.la graph ID
 * @return {object} delete-graph API response value.
 */
function deleteGraph(graphID: string) {
  throw new Error(
    "This method can't call directry. Please call via `create` method return value."
  );
}

/**
 * call get-graph-pixels API<br/>
 * <p>
 * call pixe.la get-graph-pixels API (https://docs.pixe.la/#/get-graph-pixels).
 * </p>
 * <pre>
 * var pixela = Pixela.create(username, token, debug);
 * var response = pixela.deleteGraph(graphID);
 * Logger.log(response);
 * </pre>
 * @param {string} graphID pixe.la graph ID
 * @param {string} fromDateStr from date (yyyMMdd)
 * @param {string} toDateStr from date (yyyMMdd)
 * @return {object} get-graph-pixels API response value.
 */
function getGraphPixelsDate(
  graphID: string,
  fromDateStr?: string,
  toDateStr?: string
) {
  throw new Error(
    "This method can't call directry. Please call via `create` method return value."
  );
}

// pixel API methods
/**
 * call post-pixel API<br/>
 * <p>
 * call pixe.la post-pixel API (https://docs.pixe.la/#/create-pixel).
 * </p>
 * <h3>Usage</h3>
 * <pre>
 * var pixela = Pixela.create(username, token, debug);
 * var response = pixela.createPixel(graphID, dateStr, quantity, optionalData);
 * Logger.log(response);
 * </pre>
 * @param {string} graphID pixe.la graph ID
 * @param {string} dateStr pixel date (yyyyMMdd)
 * @param {number} quantity pixel quantity (int/float)
 * @param {object} optionalData
 * @return {object} post-pixel API response value.
 */
function createPixel(
  graphID: string,
  dateStr: string,
  quantity: number,
  optionalData?: object
) {
  throw new Error(
    "This method can't call directry. Please call via `create` method return value."
  );
}

/**
 * call get-pixel API<br/>
 * <p>
 * call pixe.la get-pixel API (https://docs.pixe.la/#/get-pixel).
 * </p>
 * <h3>Usage</h3>
 * <pre>
 * var pixela = Pixela.create(username, token, debug);
 * var pixel_value = pixela.getPixel(graphID, dateStr);
 * Logger.log(pixel_value);
 * </pre>
 * @param {string} graphID pixe.la graph ID
 * @param {string} dateStr pixel date (yyyyMMdd)
 * @return {object} get-pixel API response value.
 */
function getPixel(graphID: string, dateStr: string) {
  throw new Error(
    "This method can't call directry. Please call via `create` method return value."
  );
}

/**
 * call put-pixel API<br/>
 * <p>
 * call pixe.la put-pixel API (https://docs.pixe.la/#/put-pixel).
 * </p>
 * <h3>Usage</h3>
 * <pre>
 * var pixela = Pixela.create(username, token, debug);
 * var response = pixela.updatePixel(graphID, dateStr, quantity, optionalData);
 * Logger.log(response);
 * </pre>
 * @param {string} graphID pixe.la graph ID
 * @param {string} dateStr pixel date (yyyyMMdd)
 * @param {number} quantity pixel quantity (int/float)
 * @param {object} optionalData
 * @return {onject} put-pixel API response value.
 */
function updatePixel(
  graphID: string,
  dateStr: string,
  quantity: number,
  optionalData?: object
) {
  throw new Error(
    "This method can't call directry. Please call via `create` method return value."
  );
}

/**
 * call increment-pixel API<br/>
 * <p>
 * call pixe.la increment-pixel API (https://docs.pixe.la/#/increment-pixel).
 * </p>
 * <h3>Usage</h3>
 * <pre>
 * var pixela = Pixela.create(username, token, debug);
 * var response = pixela.incPixel(graphID);
 * Logger.log(response);
 * </pre>
 * @param {string} graphID pixe.la graph ID
 * @return {object} increment-pixel API response value.
 */
function incPixel(graphID: string) {
  throw new Error(
    "This method can't call directry. Please call via `create` method return value."
  );
}

/**
 * call decrement-pixel API<br/>
 * <p>
 * call pixe.la decrement-pixel API (https://docs.pixe.la/#/decrement-pixel).
 * </p>
 * <h3>Usage</h3>
 * <pre>
 * var pixela = Pixela.create(username, token, debug);
 * var response = pixela.decPixel(graphID);
 * Logger.log(response);
 * </pre>
 * @param {string} graphID pixe.la graph ID
 * @return {object} decrement-pixel API response value.
 */
function decPixel(graphID: string) {
  throw new Error(
    "This method can't call directry. Please call via `create` method return value."
  );
}

/**
 * call delete-pixel API<br/>
 * <p>
 * call pixe.la delete-pixel API (https://docs.pixe.la/#/delete-pixel).
 * </p>
 * <h3>Usage</h3>
 * <pre>
 * var pixela = Pixela.create(username, token, debug);
 * var response = pixela.deletePixel(graphID);
 * Logger.log(response);
 * </pre>
 * @param {string} graphID pixe.la graph ID
 * @param {string} dateStr pixel date (yyyyMMdd)
 * @return {object} decrement-pixel API response value.
 */
function deletePixel(graphID: string, dateStr: string) {
  throw new Error(
    "This method can't call directry. Please call via `create` method return value."
  );
}

// webhook API methods
/**
 * call post-webhook API<br/>
 * <p>
 * call pixe.la post-webhook API (https://docs.pixe.la/#/post-webhook).
 * </p>
 * <pre>
 * var pixela = Pixela.create(username, token, debug);
 * var response = pixela.createWebhook(graphID, webhookType);
 * Logger.log(response);
 * </pre>
 * @param {string} graphID pixe.la graph ID
 * @param {string} webhookType webhook type
 * @return {object} post-webhook API response value.
 */
function createWebhook(graphID: string, webhookType: string) {
  throw new Error(
    "This method can't call directry. Please call via `create` method return value."
  );
}

/**
 * call get-webhook API<br/>
 * <p>
 * call pixe.la get-webhook API (https://docs.pixe.la/#/get-webhook).
 * </p>
 * <pre>
 * var pixela = Pixela.create(username, token, debug);
 * var response = pixela.getWebhook();
 * Logger.log(response);
 * </pre>
 * @return {object} get-webhook API response value.
 */
function getWebhook() {
  throw new Error(
    "This method can't call directry. Please call via `create` method return value."
  );
}

/**
 * call invoke-webhook API<br/>
 * <p>
 * call pixe.la invoke-webhook API (https://docs.pixe.la/#/invoke-webhook).
 * </p>
 * <pre>
 * var pixela = Pixela.create(username, token, debug);
 * var response = pixela.invokeWebhook(webhookHash);
 * Logger.log(response);
 * </pre>
 * @param {string} webhookHash webhook hash id
 * @return {object} invoke-webhook API response value.
 */
function invokeWebhook(webhookHash: string) {
  throw new Error(
    "This method can't call directry. Please call via `create` method return value."
  );
}

/**
 * call delete-webhook API<br/>
 * <p>
 * call pixe.la delete-webhook API (https://docs.pixe.la/#/delete-webhook).
 * </p>
 * <pre>
 * var pixela = Pixela.create(username, token, debug);
 * var response = pixela.deleteWebhook(webhookHash);
 * Logger.log(response);
 * </pre>
 * @param {string} webhookHash webhook hash id
 * @return {object} invoke-webhook API response value.
 */
function deleteWebhook(webhookHash: string) {
  throw new Error(
    "This method can't call directry. Please call via `create` method return value."
  );
}
